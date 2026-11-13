# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:20-slim AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"
ENV NEXTAUTH_SECRET="build-docker-secret-placeholder-minimum-32"
ENV NEXTAUTH_URL="http://localhost:3000"

RUN npx prisma generate
RUN npm run build

# ============================================
# Stage 3: Production runner
# ============================================
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copy static assets and standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
