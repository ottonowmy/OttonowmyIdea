'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // Pas connecté → Clerk middleware redirigera, mais on gère quand même
    if (!user) {
      router.replace('/auth/sign-in');
      return;
    }

    // Vérifier si l'utilisateur a un pseudo dans Airtable
    fetch(`/api/airtable/users/${user.id}`)
      .then((res) => {
        if (res.status === 404) {
          // Pas de pseudo → forcer vers la page de setup
          router.replace('/auth/setup');
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        // En cas d'erreur réseau, laisser passer (éviter boucle)
        setChecking(false);
      });
  }, [isLoaded, user, router]);

  if (!isLoaded || checking) {
    return (
      <main
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.1rem',
          color: 'var(--primary)',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '1.5rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚡</span>
        Vérification en cours...
      </main>
    );
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)' }}>
      {children}
    </main>
  );
}
