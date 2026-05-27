'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Icons } from '@/components/Icons';
import styles from './navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>▪</span>
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
          </SignedIn>
        </div>

        {/* Right Section */}
        <div className={styles.navRight}>
          <SignedIn>
            <div className={styles.eclairs}>
              {Icons.zap}
              <span id="eclairs-count">2500</span>
            </div>
            
            <button className={styles.settingsBtn} title="Gérer le compte">
              {Icons.settings}
            </button>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: '32px',
                    height: '32px',
                  },
                  userButtonBox: {
                    flexDirection: 'row-reverse',
                  },
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link href="/auth/sign-in" className="btn btn-secondary btn-sm">
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
