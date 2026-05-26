'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>💡 Ottonowmy</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SignedOut>
            <Link href="/auth/sign-in" className="btn btn-secondary">Connexion</Link>
            <Link href="/auth/sign-up" className="btn btn-primary">S'inscrire</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)' }}>
        <div className="container">
          <h1>Partagez vos idées d'apps</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Une plateforme pour explorer et créer ensemble
          </p>
          <SignedOut>
            <Link href="/auth/sign-up" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Commencer →
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Aller au Dashboard →
            </Link>
          </SignedIn>
        </div>
      </section>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--secondary)' }}>
        <p>&copy; 2024 Ottonowmy Idea</p>
      </footer>
    </div>
  );
}
