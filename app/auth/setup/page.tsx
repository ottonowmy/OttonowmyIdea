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
  const [checking, setChecking] = useState(false);
  const [pseudoAvailable, setPseudoAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [initialCheck, setInitialCheck] = useState(true);

  // Vérifier si l'utilisateur a déjà un pseudo → rediriger vers dashboard
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace('/auth/sign-up');
      return;
    }

    fetch(`/api/airtable/users/${user.id}`)
      .then((res) => {
        if (res.ok) {
          // L'utilisateur a déjà un pseudo → aller au dashboard
          router.replace('/dashboard');
        } else {
          setInitialCheck(false);
        }
      })
      .catch(() => setInitialCheck(false));
  }, [isLoaded, user, router]);

  const handlePseudoChange = async (value: string) => {
    setPseudo(value);
    setPseudoAvailable(null);
    setError('');

    if (value.length < 3) return;

    setChecking(true);
    try {
      const res = await fetch(`/api/airtable/check-pseudo?pseudo=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.exists) {
        setPseudoAvailable(false);
        setError('Ce pseudo est déjà pris');
      } else {
        setPseudoAvailable(true);
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
      setError('Minimum 3 caractères');
      return;
    }
    if (pseudo.length > 30) {
      setError('Maximum 30 caractères');
      return;
    }
    if (pseudoAvailable === false) {
      setError('Ce pseudo est déjà pris');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Vérification finale anti-doublon
      const checkRes = await fetch(`/api/airtable/check-pseudo?pseudo=${encodeURIComponent(pseudo)}`);
      const checkData = await checkRes.json();

      if (checkData.exists) {
        setError('Ce pseudo est déjà pris');
        setPseudoAvailable(false);
        setLoading(false);
        return;
      }

      // Créer l'utilisateur dans Airtable
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
        throw new Error(data.error || 'Erreur lors de la création');
      }

      // Succès → aller au dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Loading states
  if (!isLoaded || initialCheck) {
    return (
      <div className={styles.loading}>
        <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚡</span>
        Chargement...
      </div>
    );
  }

  return (
    <div className={styles.setupPage}>
      <div className={styles.setupContainer}>
        <div className={styles.setupBox}>
          <div className={styles.header}>
            <div className={styles.badge}>Bienvenue ! ⚡</div>
            <h1>Choisissez votre pseudo</h1>
            <p>Votre identifiant public sur la plateforme. Il ne peut pas être changé.</p>
          </div>

          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>{Icons.error}</span>
              <span>{error}</span>
            </div>
          )}

          {pseudoAvailable === true && pseudo.length >= 3 && (
            <div className={styles.success}>
              <span>✓ Ce pseudo est disponible !</span>
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
                  className={`${styles.input} ${pseudoAvailable === false ? styles.inputError : ''} ${pseudoAvailable === true ? styles.inputSuccess : ''}`}
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
              disabled={loading || checking || pseudoAvailable === false}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? 'Création en cours...' : '⚡ Choisir ce pseudo'}
            </button>
          </form>

          <div className={styles.info}>
            <p>Vous recevrez <strong>2 500 éclairs</strong> pour démarrer votre aventure !</p>
          </div>
        </div>
      </div>
    </div>
  );
}
