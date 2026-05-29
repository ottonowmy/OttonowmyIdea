'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Icons } from '@/components/Icons';
import styles from './dashboard.module.css';
import { useState, useEffect } from 'react';

export default function DashboardHome() {
  const { user, isLoaded } = useUser();
  const [eclairs, setEclairs] = useState<number>(2500);

  useEffect(() => {
    if (isLoaded && user) {
      // Charger le vrai nombre d'éclairs
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

  if (!isLoaded) {
    return <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Chargement...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <div className="container">
          <h1>Bienvenue, {user?.firstName || 'Explorateur'} !</h1>
          <p>
            Vous avez 
            <span className={styles.eclairsBadge}>
              {Icons.zap}
              {eclairs} éclairs
            </span> 
            en réserve
          </p>
        </div>
      </section>

      <section className={styles.cards}>
        <div className="container">
          <div className={styles.cardsGrid}>
            <div className="card">
              <div className={styles.cardIcon}>{Icons.search}</div>
              <h3>Explorer les Idées</h3>
              <p>Découvrez les idées d'applications créées par les membres de la communauté et proposez vos retours.</p>
              <Link href="/dashboard/ideas" className="btn btn-ghost" style={{ marginTop: 'auto' }}>
                {Icons.arrow_right}
                Voir les idées
              </Link>
            </div>

            <div className="card">
              <div className={styles.cardIcon}>{Icons.lightbulb}</div>
              <h3>Créer une Idée</h3>
              <p>Partagez votre propre idée de projet (coût : 700 éclairs) publiquement ou conservez-la en privé.</p>
              <Link href="/dashboard/create" className="btn btn-primary" style={{ marginTop: 'auto' }}>
                {Icons.arrow_right}
                Créer une idée
              </Link>
            </div>

            <div className="card">
              <div className={styles.cardIcon}>{Icons.users}</div>
              <h3>Mes Projets</h3>
              <p>Gérez vos propres idées partagées, suivez leur évolution et consultez les précieux retours reçus.</p>
              <Link href="/dashboard/my-projects" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                {Icons.arrow_right}
                Mes projets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaIcon}>{Icons.zap}</div>
            <h2>Gagnez plus d'Éclairs</h2>
            <p>Donnez votre avis constructif et argumenté sur les idées des autres membres et gagnez +15 éclairs par commentaire utile !</p>
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
