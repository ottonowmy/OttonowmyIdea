'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import styles from './page.module.css';

interface Idea {
  id: string;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
  visibility: 'Public' | 'Privé';
  createdBy: string;
}

export default function IdeasPage() {
  const { user } = useUser();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(`/api/airtable/ideas?userId=${user?.id}`);
        if (!response.ok) throw new Error('Erreur de chargement');
        
        const ideas = await response.json();
        setIdeas(ideas);
      } catch (err) {
        console.error('Erreur lors du chargement des idées:', err);
        setError('Erreur de connexion à Airtable');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchIdeas();
    }
  }, [user?.id]);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    setError('');

    try {
      const response = await fetch('/api/openai/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: ideas,
          query: searchTerm,
        }),
      });

      if (!response.ok) throw new Error('Erreur de recherche');

      const filtered = await response.json();
      setIdeas(filtered);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la recherche IA');
    } finally {
      setSearching(false);
    }
  };

  const handleResetSearch = async () => {
    setSearchTerm('');
    try {
      const response = await fetch(`/api/airtable/ideas?userId=${user?.id}`);
      if (!response.ok) throw new Error('Erreur de chargement');
      const ideas = await response.json();
      setIdeas(ideas);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>;
  if (error && !searching) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Explorer les idées d'apps</h1>
        <p>Découvrez l'inspiration et donnez vos avis</p>
      </div>

      <form onSubmit={handleAISearch} className={styles.searchBox}>
        <input
          type="text"
          placeholder="Décrivez ce que vous cherchez... (IA va filtrer pour vous)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.searchButtons}>
          <button type="submit" className={styles.searchBtn} disabled={searching}>
            {searching ? 'Recherche...' : 'Rechercher'}
          </button>
          {searchTerm && (
            <button type="button" className={styles.resetBtn} onClick={handleResetSearch}>
              Réinitialiser
            </button>
          )}
        </div>
      </form>

      {error && searching && (
        <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className={styles.ideasGrid}>
        {ideas.map(idea => (
          <Link key={idea.id} href={`/dashboard/ideas/${idea.id}`} className={styles.ideaCard}>
            <div className={styles.cardHeader}>
              <h3>{idea.title}</h3>
              {idea.visibility === 'Privé' && <span className={styles.privateBadge}>Privé</span>}
            </div>
            <p className={styles.desc}>{idea.description}</p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>{idea.likes}</span>
              </div>
              {idea.visibility === 'Public' && (
                <div className={styles.percentage}>
                  {Math.round((idea.likes / Math.max(idea.likes + idea.dislikes, 1)) * 100)}%
                </div>
              )}
            </div>
            <div className={styles.viewBtn}>Voir et voter</div>
          </Link>
        ))}
      </div>

      {ideas.length === 0 && (
        <div className={styles.empty}>Aucune idée trouvée</div>
      )}
    </div>
  );
}
