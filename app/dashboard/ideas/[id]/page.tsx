'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import styles from './page.module.css';

interface Comment {
  id: string;
  pseudo: string;
  content: string;
  createdAt: string;
}

interface IdeaDetail {
  id: string;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
  visibility: 'Public' | 'Privé';
  createdBy: string;
  comments: Comment[];
}

export default function IdeaDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const ideaId = params.id as string;
  
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`/api/airtable/ideas/${ideaId}?userId=${user?.id}`);
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Cette idée est privée et vous n\'y avez pas accès');
          }
          throw new Error('Erreur de chargement');
        }
        
        const data = await response.json();
        setIdea(data);
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(err.message || 'Erreur de connexion à Airtable');
      } finally {
        setLoading(false);
      }
    };

    if (ideaId && user?.id) {
      fetchIdea();
    }
  }, [ideaId, user?.id]);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (!idea) return;

    try {
      const response = await fetch('/api/airtable/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          userId: user?.id,
          voteType: type,
        }),
      });

      if (!response.ok) throw new Error('Erreur du vote');

      const data = await response.json();
      setIdea({
        ...idea,
        likes: data.idea.likes,
        dislikes: data.idea.dislikes,
      });
      
      setUserVote(type);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du vote');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !idea) return;

    try {
      const response = await fetch('/api/airtable/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          userId: user?.id,
          pseudo: user?.username || 'Anonyme',
          content: comment,
        }),
      });

      if (!response.ok) throw new Error('Erreur du commentaire');

      const newComment = await response.json();
      setIdea({
        ...idea,
        comments: [newComment, ...idea.comments],
      });
      setComment('');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la création du commentaire');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Chargement...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;
  if (!idea) return <div style={{ padding: '40px' }}>Idée non trouvée</div>;

  const percentageLikes = Math.round((idea.likes / Math.max(idea.likes + idea.dislikes, 1)) * 100);
  const isCreator = idea.createdBy === user?.id;

  return (
    <div className={styles.container}>
      <Link href="/dashboard/ideas" className={styles.backLink}>
        ← Retour aux idées
      </Link>

      <div className={styles.ideaHeader}>
        <h1>{idea.title}</h1>
        <p>{idea.description}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <section className={styles.voteSection}>
            <h2>Donnez votre avis</h2>
            <div className={styles.voteButtons}>
              <button 
                className={`${styles.voteBtn} ${styles.likeBtn} ${userVote === 'like' ? styles.active : ''}`}
                onClick={() => handleVote('like')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                J'aime ({idea.likes})
              </button>
              {(idea.visibility === 'Privé' || isCreator) && (
                <button 
                  className={`${styles.voteBtn} ${styles.dislikeBtn} ${userVote === 'dislike' ? styles.active : ''}`}
                  onClick={() => handleVote('dislike')}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343m0 0L11.657 4.686a4 4 0 015.656 5.656l-10 10M10 6.343l6 6"/>
                  </svg>
                  Pas bien ({idea.dislikes})
                </button>
              )}
            </div>

            {idea.visibility === 'Public' && !isCreator && (
              <div className={styles.publicStats}>
                <p>Avis positifs: <strong>{percentageLikes}%</strong></p>
              </div>
            )}
          </section>

          <section className={styles.commentsSection}>
            <h2>Commentaires ({idea.comments.length})</h2>

            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajoutez un commentaire constructif..."
                rows={3}
              />
              <button type="submit" className={styles.submitBtn} disabled={!comment.trim()}>
                Envoyer
              </button>
            </form>

            <div className={styles.commentsList}>
              {idea.comments.map(c => (
                <div key={c.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <strong>{c.pseudo}</strong>
                    <span className={styles.date}>{c.createdAt}</span>
                  </div>
                  <p>{c.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {(idea.visibility === 'Privé' || isCreator) && (
          <aside className={styles.sidebar}>
            <div className={styles.statsBox}>
              <h3>Statistiques</h3>
              <div className={styles.statItem}>
                <span>Likes: {idea.likes}</span>
                <div className={styles.bar}>
                  <div 
                    className={styles.fill} 
                    style={{ width: `${percentageLikes}%`, background: '#28a745' }}
                  />
                </div>
              </div>
              <div className={styles.statItem}>
                <span>Dislikes: {idea.dislikes}</span>
                <div className={styles.bar}>
                  <div 
                    className={styles.fill} 
                    style={{ width: `${100 - percentageLikes}%`, background: '#dc3545' }}
                  />
                </div>
              </div>
              <p className={styles.percentage}>{percentageLikes}% positifs</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
