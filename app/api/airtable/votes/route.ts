import { NextRequest, NextResponse } from 'next/server';
import { createRecord, updateRecord, getRecordById } from '@/lib/airtable-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ideaId, userId, voteType } = body;

    if (!ideaId || !userId || !voteType) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Récupérer l'idée
    const idea = await getRecordById('Ideas', ideaId);

    // Incrémenter les votes
    const currentLikes = idea.fields.likes || 0;
    const currentDislikes = idea.fields.dislikes || 0;

    let newLikes = currentLikes;
    let newDislikes = currentDislikes;

    if (voteType === 'like') {
      newLikes = currentLikes + 1;
    } else if (voteType === 'dislike') {
      newDislikes = currentDislikes + 1;
    }

    // Mettre à jour l'idée
    await updateRecord('Ideas', ideaId, {
      likes: newLikes,
      dislikes: newDislikes,
    });

    // Créer le vote
    const vote = await createRecord('Votes', {
      ideaId, // ID du record idea
      userId, // clerkId
      voteType,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        id: vote.id,
        ...vote.fields,
        idea: {
          likes: newLikes,
          dislikes: newDislikes,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur vote:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
