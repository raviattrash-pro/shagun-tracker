import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { loginSchema } from './validators';

export const authConfig: NextAuthConfig = {
  providers: [
    // 1. Google OAuth Provider for all guests & users
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'google-client-id-placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret-placeholder',
      allowDangerousEmailAccountLinking: true,
    }),

    // 2. Admin & Credentials Provider (Admin Login ID & Password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email / Admin ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
        isGoogleGuestDemo: { label: 'Google Demo Flag', type: 'text' },
        guestName: { label: 'Guest Name', type: 'text' },
      },
      async authorize(credentials) {
        // Fast Google Verified Guest simulation (for testing or demo without external GCP setup)
        if (credentials?.isGoogleGuestDemo === 'true') {
          const email = (credentials.email as string)?.trim().toLowerCase() || 'guest.google@gmail.com';
          const name = (credentials.guestName as string)?.trim() || 'Verified Google Guest';

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name,
                email,
                image: 'https://lh3.googleusercontent.com/a/default-user',
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }

        // Standard Admin / Credentials Login
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!passwordsMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                name: user.name || 'Google User',
                email: user.email,
                image: user.image || null,
              },
            });
          }
          user.id = existingUser.id;
          return true;
        } catch (e) {
          console.error('Google user creation error:', e);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'super-secret-shagun-development-key-12345678',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Helper to get the authenticated user or null
 */
export async function getAuthUser() {
  const session = await auth();
  return session?.user ?? null;
}
