'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardHome() {
  const { user } = useUser();

  return (
    <div className={styles.dashboard}>
      <h1>Bienvenue, {user?.firstName}</h1>
      
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>0</h3>
          <p>Apps créées</p>
        </div>
        <div className={styles.statCard}>
          <h3>2500</h3>
          <p>Éclairs</p>
        </div>
        <div className={styles.statCard}>
          <h3>0</h3>
          <p>Avis donnés</p>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <Link href="/dashboard/ideas" className={styles.quickCard}>
          <h3>Explorer les idées</h3>
          <p>Découvrez les meilleures idées d'apps de la communauté</p>
        </Link>
        
        <Link href="/dashboard/create" className={styles.quickCard}>
          <h3>Créer une idée</h3>
          <p>Partagez votre concept d'application (700 éclairs)</p>
        </Link>
      </div>
    </div>
  );
}
