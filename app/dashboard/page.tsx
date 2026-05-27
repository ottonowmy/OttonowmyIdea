'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Icons } from '@/components/Icons';
import styles from './dashboard.module.css';

export default function DashboardHome() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <div className="container">
          <h1>Bienvenue, {user?.firstName}!</h1>
          <p>Vous avez <strong>2500 éclairs</strong> pour commencer</p>
        </div>
      </section>

      <section className={styles.cards}>
        <div className="container">
          <div className={styles.cardsGrid}>
            <div className="card">
              <div className={styles.cardIcon}>{Icons.search}</div>
              <h3>Explorer les Idées</h3>
              <p>Découvrez les idées d'apps créées par la communauté</p>
              <Link href="/dashboard/ideas" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                {Icons.arrow_right}
                Voir les idées
              </Link>
            </div>

            <div className="card">
              <div className={styles.cardIcon}>{Icons.lightbulb}</div>
              <h3>Créer une Idée</h3>
              <p>Partagez votre idée d'app (coût: 700 éclairs)</p>
              <Link href="/dashboard/create" className="btn btn-primary" style={{ marginTop: 'auto' }}>
                {Icons.arrow_right}
                Créer une idée
              </Link>
            </div>

            <div className="card">
              <div className={styles.cardIcon}>{Icons.users}</div>
              <h3>Mes Idées</h3>
              <p>Gérez vos idées et consultez les commentaires</p>
              <Link href="/dashboard/my-ideas" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                {Icons.arrow_right}
                Mes idées
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaIcon}>{Icons.zap}</div>
            <h2>Gagnez des Éclairs</h2>
            <p>Commentez les idées et gagnez +15 éclairs par commentaire utile!</p>
            <Link href="/dashboard/ideas" className="btn btn-primary">
              {Icons.arrow_right}
              Commencer à explorer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
