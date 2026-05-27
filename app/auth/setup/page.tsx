'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Icons } from '@/components/Icons';
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
      router.push('/auth/sign-up');
    }
  }, [isLoaded, user, router]);

  const handlePseudoChange = async (value: string) => {
    setPseudo(value);
    if (value.length < 3) return;

    setChecking(true);
    try {
      const res = await fetch(`/api/airtable/check-pseudo?pseudo=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.exists) {
        setError('Ce pseudo est déjà pris');
      } else {
        setError('');
      }
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pseudo.trim()) {
      setError('Le pseudo est requis');
      return;
    }

    if (pseudo.length < 3) {
      setError('Au minimum 3 caractères');
      return;
    }

    if (pseudo.length > 30) {
      setError('Maximum 30 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkRes = await fetch(`/api/airtable/check-pseudo?pseudo=${encodeURIComponent(pseudo)}`);
      const checkData = await checkRes.json();

      if (checkData.exists) {
        setError('Ce pseudo est déjà pris');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/airtable/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          pseudo,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.setupPage}>
      <div className={styles.setupContainer}>
        <div className={styles.setupBox}>
          <div className={styles.header}>
            <div className={styles.badge}>Étape 1 / 1</div>
            <h1>Choisissez votre pseudo</h1>
            <p>C'est comme votre nom d'utilisateur sur la plateforme</p>
          </div>

          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>{Icons.error}</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="pseudo">Votre pseudo</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="pseudo"
                  value={pseudo}
                  onChange={(e) => handlePseudoChange(e.target.value)}
                  placeholder="DevMaster2024"
                  maxLength={30}
                  required
                  disabled={loading}
                  className={styles.input}
                />
                {checking && (
                  <span className={styles.checking}>
                    <span className={styles.loader} />
                  </span>
                )}
              </div>
              <div className={styles.charCount}>
                {pseudo.length}/30 caractères
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || checking}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {Icons.check}
              {loading ? 'Création en cours...' : 'Continuer'}
            </button>
          </form>

          <div className={styles.info}>
            <p>Vous recevrez <strong>2500 éclairs</strong> pour démarrer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
