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
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/sign-in');
    }
  }, [isLoaded, user, router]);

  const checkPseudoAvailability = async (value: string) => {
    if (!value.trim() || value.length < 3) return;
    
    setChecking(true);
    try {
      const response = await fetch(`/api/airtable/users/check-pseudo?pseudo=${encodeURIComponent(value)}`);
      const data = await response.json();
      
      if (!data.available) {
        setError('Ce pseudo est déjà pris');
      } else {
        setError('');
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setChecking(false);
    }
  };

  const handlePseudoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPseudo(value);
    if (value.length > 2) {
      checkPseudoAvailability(value);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) {
      setError('Le pseudo est requis');
      return;
    }

    if (pseudo.length < 3) {
      setError('Le pseudo doit faire au moins 3 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Création user avec clerkId:', user?.id);
      
      const response = await fetch('/api/airtable/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          pseudo: pseudo.trim(),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erreur de création');
      }

      console.log('User créé avec succès');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du pseudo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Bienvenue!</h1>
        <p>Choisissez un pseudo unique pour votre profil</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="pseudo">Votre pseudo *</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="pseudo"
                value={pseudo}
                onChange={handlePseudoChange}
                placeholder="Ex: DevMaster2024"
                maxLength={30}
                required
                disabled={loading}
              />
              {checking && <span className={styles.checking}>Vérification...</span>}
              {!checking && pseudo.length > 2 && !error && (
                <span className={styles.available}>✓</span>
              )}
            </div>
            <span className={styles.charCount}>{pseudo.length}/30</span>
            <span className={styles.hint}>Min. 3 caractères, unique</span>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || checking || !!error}>
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
