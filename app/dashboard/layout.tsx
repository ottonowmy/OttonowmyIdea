'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [eclairs, setEclairs] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      // TODO: Récupérer les éclairs depuis Airtable
      // Endpoint: GET /api/airtable/users/{userId}/eclairs
      setEclairs(2500); // Valeur par défaut
      setLoading(false);
    }
  }, [user?.id]);

  if (!isLoaded) return <div>Chargement...</div>;
  if (!isSignedIn) redirect('/auth/sign-in');

  return (
    <div className={styles.dashboard}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <Link href="/dashboard" className={styles.logo}>
            Ottonowmy Idea
          </Link>
          <ul className={styles.navLinks}>
            <li><Link href="/dashboard">Accueil</Link></li>
            <li><Link href="/dashboard/ideas">Explorer</Link></li>
            <li><Link href="/dashboard/my-projects">Mes projets</Link></li>
            <li><Link href="/dashboard/create">Créer</Link></li>
          </ul>
          <div className={styles.navRight}>
            <div className={styles.eclairs}>
              <svg className={styles.eclairsIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span className={styles.eclairsValue}>{loading ? '...' : eclairs}</span>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: { width: '36px', height: '36px' },
                },
              }}
              afterSignOutUrl="/"
            />
          </div>
        </div>
      </nav>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
