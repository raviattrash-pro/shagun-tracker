import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-amber-50 to-background dark:from-rose-950/20 dark:via-amber-950/20">
      {children}
    </div>
  );
}
