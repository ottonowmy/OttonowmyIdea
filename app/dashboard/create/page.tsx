'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import styles from './page.module.css';

const COST = 700;

export default function CreateIdeaPage() {
  const router = useRouter();
  const { user } = useUser();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'Public',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Vous devez être connecté');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/airtable/ideas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          visibility: formData.visibility,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erreur lors de la création');
      }

      const createdIdea = await response.json();
      console.log('Idée créée:', createdIdea);

      // Rediriger vers Mes projets
      router.push('/dashboard/my-projects');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Créer une nouvelle idée d'app</h1>
          <p>Partagez votre concept avec la communauté</p>
        </div>

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titre de votre app *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: App de productivité IA"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre idée, comment elle fonctionne, qui l'utiliserait..."
              required
              rows={8}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="visibility">Visibilité *</label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="Public">Public (votes visibles)</option>
              <option value="Privé">Privé (statistiques cachées)</option>
            </select>
          </div>

          <div className={styles.info}>
            <div className={styles.costBox}>
              <div className={styles.costLabel}>Coût de création</div>
              <div className={styles.costValue}>{COST}</div>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <p className={styles.note}>
              Les utilisateurs pourront liker ou disliker votre idée et laisser des commentaires.
            </p>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer mon idée d\'app'}
          </button>
        </form>
      </div>
    </div>
  );
}
