'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { Icons } from '@/components/Icons';
import styles from './navbar.module.css';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, isLoaded } = useUser();
  const [eclairs, setEclairs] = useState<number>(2500);

  useEffect(() => {
    if (isLoaded && user) {
      // Charger le vrai nombre d'éclairs depuis Airtable
      fetch(`/api/airtable/users/${user.id}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('User not found');
        })
        .then((data) => {
          if (data && typeof data.eclairs === 'number') {
            setEclairs(data.eclairs);
          }
        })
        .catch((err) => console.error('Error fetching user eclairs:', err));
    }
  }, [isLoaded, user]);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span>Ottonowmy</span>
        </Link>

        {/* Nav Links */}
        <div className={styles.navLinks}>
          <SignedIn>
            <Link href="/dashboard" className={styles.navLink}>
              {Icons.home}
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/ideas" className={styles.navLink}>
              {Icons.lightbulb}
              <span>Explorer</span>
            </Link>
            <Link href="/dashboard/my-projects" className={styles.navLink}>
              {Icons.users}
              <span>Mes Projets</span>
            </Link>
          </SignedIn>
        </div>

        {/* Right Section */}
        <div className={styles.navRight}>
          <SignedIn>
            <div className={styles.eclairs} title={`${eclairs} éclairs en réserve`}>
              {Icons.zap}
              <span id="eclairs-count">{eclairs}</span>
            </div>
            
            <Link href="/dashboard/my-projects" className={styles.settingsBtn} title="Mes Projets">
              {Icons.settings}
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: '38px',
                    height: '38px',
                    border: '2px solid var(--primary)',
                    borderRadius: '8px',
                    boxShadow: '2px 2px 0px var(--primary)',
                  },
                  userButtonBox: {
                    flexDirection: 'row-reverse',
                  },
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link href="/auth/sign-in" className="btn btn-ghost btn-sm">
              Connexion
            </Link>
            <Link href="/auth/sign-up" className="btn btn-primary btn-sm">
              S'inscrire
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
