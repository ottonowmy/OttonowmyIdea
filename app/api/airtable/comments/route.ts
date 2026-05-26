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
      ideaId, // ID du record idea
      userId, // clerkId de l'user
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        id: comment.id,
        ...comment.fields,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur création comment:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
