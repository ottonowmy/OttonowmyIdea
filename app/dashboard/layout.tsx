'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <div>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        sticky: 'top',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            💡 Ottonowmy
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              Accueil
            </Link>
            <Link href="/dashboard/ideas" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              Explorer
            </Link>
            <Link href="/dashboard/create" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Créer une Idée
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>⚡ {user?.unsafeMetadata?.eclairs || 2500} éclairs</span>
        </div>
      </nav>
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        {children}
      </main>
    </div>
  );
}
