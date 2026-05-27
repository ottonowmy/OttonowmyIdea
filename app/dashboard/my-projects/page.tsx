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
  status: string;
}

export default function MyProjectsPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'All' | 'Public' | 'Privé'>('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Récupérer toutes les idées de l'utilisateur
        const response = await fetch(`/api/airtable/ideas?userId=${user?.id}`);
        if (!response.ok) throw new Error('Erreur de chargement');
        
        const ideas = await response.json();
        // Filtrer seulement les idées de cet utilisateur
        const userProjects = ideas.filter((idea: any) => idea.createdBy === user?.id);
        setProjects(userProjects);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  const filtered = projects.filter(p => 
    filterVisibility === 'All' ? true : p.visibility === filterVisibility
  );

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mes projets</h1>
        <Link href="/dashboard/create" className={styles.createBtn}>
          + Créer un projet
        </Link>
      </div>

      <div className={styles.filters}>
        {(['All', 'Public', 'Privé'] as const).map(vis => (
          <button
            key={vis}
            className={`${styles.filterBtn} ${filterVisibility === vis ? styles.active : ''}`}
            onClick={() => setFilterVisibility(vis)}
          >
            {vis === 'All' ? 'Tous' : vis}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className={styles.projectsGrid}>
        {filtered.map(project => (
          <Link key={project.id} href={`/dashboard/ideas/${project.id}`} className={styles.projectCard}>
            <div className={styles.cardHeader}>
              <h3>{project.title}</h3>
              <div className={styles.badges}>
                <span className={`${styles.badge} ${styles[project.visibility.toLowerCase()]}`}>
                  {project.visibility}
                </span>
                <span className={`${styles.badge} ${styles[project.status]}`}>
                  {project.status}
                </span>
              </div>
            </div>
            <p className={styles.desc}>{project.description}</p>
            <div className={styles.stats}>
              <span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {project.likes}
              </span>
              {project.visibility === 'Privé' && (
                <span>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343m0 0L11.657 4.686a4 4 0 015.656 5.656l-10 10M10 6.343l6 6"/>
                  </svg>
                  {project.dislikes}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>Aucun projet trouvé</p>
          <Link href="/dashboard/create" className={styles.emptyBtn}>
            Créer votre premier projet
          </Link>
        </div>
      )}
    </div>
  );
}
