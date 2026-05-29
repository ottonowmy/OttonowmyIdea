import { NextRequest, NextResponse } from 'next/server';
import { createRecord } from '@/lib/airtable-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ideaId, userId, pseudo, content } = body;

    if (!ideaId || !userId || !pseudo || !content) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Créer le commentaire
    const comment = await createRecord('Comments', {
      content,
      pseudo,
      ideaId: [ideaId], // Lien Airtable
      userId,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        id: comment.id,
        ...comment.fields,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du commentaire' },
      { status: 500 }
    );
  }
}
