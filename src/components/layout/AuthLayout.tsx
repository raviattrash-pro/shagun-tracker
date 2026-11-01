import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-pattern-indian px-4 py-12">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-60 w-60 -translate-x-1/2 rounded-full bg-primary/3 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-5xl" role="img" aria-label="ring">
            💍
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-gradient-shagun">
            Shagun Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            शगुन का हिसाब, अब डिजिटल
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
