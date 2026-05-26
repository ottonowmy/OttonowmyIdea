'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardHome() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: '3rem 2rem' }}>
      <div className="container">
        <h1>Bienvenue, {user?.firstName}! 👋</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          Vous avez <strong>2500 éclairs</strong> pour commencer
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          <div style={{
            padding: '2rem',
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}>
            <h3>📚 Explorer les Idées</h3>
            <p>Découvrez les idées d'apps créées par la communauté</p>
            <Link href="/dashboard/ideas" className="btn btn-secondary">
              Voir les idées
            </Link>
          </div>

          <div style={{
            padding: '2rem',
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}>
            <h3>💡 Créer une Idée</h3>
            <p>Partagez votre idée d'app (coût: 700 éclairs)</p>
            <Link href="/dashboard/create" className="btn btn-accent">
              Créer une idée
            </Link>
          </div>

          <div style={{
            padding: '2rem',
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}>
            <h3>👤 Mes Idées</h3>
            <p>Gérez vos idées et consultez les commentaires</p>
            <Link href="/dashboard/my-ideas" className="btn btn-secondary">
              Mes idées
            </Link>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          textAlign: 'center',
        }}>
          <h2>💬 Gagnez des Éclairs</h2>
          <p>Commentez les idées et gagnez +15 éclairs par commentaire!</p>
          <Link href="/dashboard/ideas" style={{ color: 'white', fontWeight: '700' }}>
            Commencer à explorer →
          </Link>
        </div>
      </div>
    </div>
  );
}
