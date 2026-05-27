'use client';

import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';
import { Icons } from '@/components/Icons';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1>Partagez vos idées d'apps</h1>
            <p>Une plateforme communautaire pour explorer, créer et discuter les meilleures idées d'applications.</p>
            <div className={styles.ctaButtons}>
              <SignedOut>
                <Link href="/auth/sign-up" className="btn btn-primary btn-lg">
                  {Icons.arrow_right}
                  Commencer gratuitement
                </Link>
              </SignedOut>
              <Link href="/dashboard/ideas" className="btn btn-secondary btn-lg">
                {Icons.search}
                Explorer les idées
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.card1}>
              <div className={styles.cardIcon}>{Icons.lightbulb}</div>
              <p>E-commerce</p>
            </div>
            <div className={styles.card2}>
              <div className={styles.cardIcon}>{Icons.users}</div>
              <p>Social Network</p>
            </div>
            <div className={styles.card3}>
              <div className={styles.cardIcon}>{Icons.zap}</div>
              <p>AI Tool</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <h2>Comment ça fonctionne</h2>
          <div className={styles.featuresGrid}>
            <div className="card">
              <div className={styles.featureNumber}>01</div>
              <h3>S'inscrire</h3>
              <p>Créez votre compte avec votre pseudo et recevez 2500 éclairs pour démarrer.</p>
            </div>
            <div className="card">
              <div className={styles.featureNumber}>02</div>
              <h3>Explorer</h3>
              <p>Découvrez les idées publiques de la communauté et commentez vos favoris.</p>
            </div>
            <div className="card">
              <div className={styles.featureNumber}>03</div>
              <h3>Créer</h3>
              <p>Proposez vos idées (coût: 700 éclairs) publiquement ou en privé.</p>
            </div>
            <div className="card">
              <div className={styles.featureNumber}>04</div>
              <h3>Discuter</h3>
              <p>Recevez des retours et gagnez 15 éclairs par commentaire utile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div>
              <div className={styles.statNumber}>500+</div>
              <p>Idées créées</p>
            </div>
            <div>
              <div className={styles.statNumber}>1.2K</div>
              <p>Utilisateurs actifs</p>
            </div>
            <div>
              <div className={styles.statNumber}>5K+</div>
              <p>Commentaires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>© 2024 Ottonowmy Idea. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
