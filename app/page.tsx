'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  if (isLoaded && isSignedIn) {
    router.push('/dashboard');
    return null;
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Ottonowmy Idea</h1>
          <Link href="/auth/sign-in" className={styles.signInLink}>
            Se connecter
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <h2>Trouve l'inspiration, partage tes idées d'app</h2>
        <p>Une plateforme pour explorer, créer et développer les meilleures idées d'applications</p>
        <Link href="/auth/sign-up" className={styles.ctaButton}>
          Commencer à découvrir
        </Link>
      </section>

      <section className={styles.how}>
        <div className={styles.sectionContainer}>
          <h2>Découvre. Inspire. Lance.</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.num}>1</div>
              <h3>Explore les idées</h3>
              <p>Parcourez les projets d'applications en développement et trouvez l'inspiration.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.num}>2</div>
              <h3>Donnez des avis</h3>
              <p>Partagez vos retours avec notes et témoignages pour aider les créateurs.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.num}>3</div>
              <h3>Gagnez des éclairs</h3>
              <p>Chaque avis utile vous rapporte des éclairs à utiliser pour vos projets.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.num}>4</div>
              <h3>Créez votre app</h3>
              <p>Utilisez 700 éclairs pour publier votre propre idée d'application.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionContainer}>
          <h2>Pourquoi Ottonowmy Idea</h2>
          <div className={styles.featuresList}>
            <div className={styles.feature}>
              <h3>Pour les développeurs</h3>
              <p>Partagez vos idées d'apps et obtenez des retours constructifs de la communauté</p>
            </div>
            <div className={styles.feature}>
              <h3>Monnaie virtuelle</h3>
              <p>Gagnez des éclairs en donnant des avis, dépensez-les pour lancer vos projets</p>
            </div>
            <div className={styles.feature}>
              <h3>Communauté active</h3>
              <p>Connectez-vous avec d'autres développeurs passionnés par les nouvelles idées</p>
            </div>
            <div className={styles.feature}>
              <h3>Transparence totale</h3>
              <p>Visibilité publique ou privée pour chaque projet selon vos préférences</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Prêt à partager votre idée d'app?</h2>
        <p>Rejoignez une communauté de développeurs où chaque idée compte</p>
        <Link href="/auth/sign-up" className={styles.ctaButtonLarge}>
          Commencer maintenant
        </Link>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 Ottonowmy Idea. Tous droits réservés.</p>
      </footer>
    </main>
  );
}
