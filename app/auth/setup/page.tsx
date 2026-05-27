'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './setup.module.css';

export default function SetupPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [pseudo, setPseudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in');
    }
  }, [isLoaded, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) {
      setError('Le pseudo est requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Sauvegarder le pseudo et créer l'utilisateur dans Airtable
      // POST /api/airtable/users
      // Données: { clerkId: user.id, email: user.primaryEmailAddress?.emailAddress, pseudo, eclairs: 0 }
      
      console.log('Pseudo créé:', pseudo);
      router.push('/dashboard');
    } catch (err) {
      setError('Erreur lors de la création du pseudo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Bienvenue!</h1>
        <p>Choisissez un pseudo pour votre profil</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="pseudo">Votre pseudo *</label>
            <input
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex: DevMaster2024"
              maxLength={30}
              required
              disabled={loading}
            />
            <span className={styles.charCount}>{pseudo.length}/30</span>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Création...' : 'Continuer'}
          </button>
        </form>

        <p className={styles.note}>
          Vous pourrez modifier votre pseudo plus tard dans les paramètres
        </p>
      </div>
    </div>
  );
}
