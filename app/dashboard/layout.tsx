'use client';

import { useUser } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <main style={{ minHeight: 'calc(100vh - 70px)' }}>
      {children}
    </main>
  );
}
