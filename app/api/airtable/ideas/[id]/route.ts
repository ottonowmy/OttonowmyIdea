import { NextRequest, NextResponse } from 'next/server';
import { getRecordById, getRecordsByFormula } from '@/lib/airtable-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ideaId = params.id;
    const userId = request.nextUrl.searchParams.get('userId');

    // Récupérer l'idée
    const idea = await getRecordById('Ideas', ideaId);

    // Vérifier les permissions
    if (idea.fields.visibility === 'Privé') {
      // Pour les idées privées, vérifier que c'est le créateur
      if (idea.fields.createdBy !== userId) {
        return NextResponse.json(
          { error: 'Accès refusé' },
          { status: 403 }
        );
      }
    }

    // Récupérer les commentaires
    const commentFormula = `{ideaId} = "${ideaId}"`;
    const comments = await getRecordsByFormula('Comments', commentFormula);

    return NextResponse.json(
      {
        id: idea.id,
        ...idea.fields,
        comments: comments.map((c: any) => ({
          id: c.id,
          ...c.fields,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur GET idea:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
