'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
      console.error('Error checking pseudo:', e);
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
      setError('Le pseudo doit avoir au moins 3 caractères');
      return;
    }

    if (pseudo.length > 30) {
      setError('Le pseudo ne doit pas dépasser 30 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if pseudo exists
      const checkRes = await fetch(`/api/airtable/check-pseudo?pseudo=${encodeURIComponent(pseudo)}`);
      const checkData = await checkRes.json();

      if (checkData.exists) {
        setError('Ce pseudo est déjà pris');
        setLoading(false);
        return;
      }

      // Create user in Airtable
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
        throw new Error(data.error || 'Failed to create user');
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
      padding: '1rem',
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
      }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', textAlign: 'center' }}>Bienvenue! 👋</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--secondary)' }}>
          Choisissez un pseudo pour votre profil
        </p>

        {error && (
          <div style={{
            padding: '1rem',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: 'var(--radius)',
            color: '#c33',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <label htmlFor="pseudo" style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              letterSpacing: '0.3px',
            }}>
              Votre pseudo *
            </label>
            <input
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={(e) => handlePseudoChange(e.target.value)}
              placeholder="Ex: DevMaster2024"
              maxLength={30}
              required
              disabled={loading}
              style={{
                paddingRight: '3rem',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '1rem',
              top: '2.5rem',
              fontSize: '0.85rem',
              color: 'var(--secondary)',
            }}>
              {pseudo.length}/30
            </span>
            {checking && (
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginTop: '0.25rem' }}>
                ⏳ Vérification...
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || checking}
            style={{ padding: '0.75rem', width: '100%' }}
          >
            {loading ? '⏳ Création...' : '✓ Continuer'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--secondary)',
          marginTop: '1.5rem',
        }}>
          Vous pourrez modifier votre pseudo dans les paramètres
        </p>
      </div>
    </div>
  );
}
