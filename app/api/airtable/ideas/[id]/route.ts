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
    if (idea.fields.visibility === 'Privé' && idea.fields.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas accès à cette idée' },
        { status: 403 }
      );
    }

    // Récupérer les commentaires
    const comments = await getRecordsByFormula('Comments', `{ideaId} = '${ideaId}'`);

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
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'idée' },
      { status: 500 }
    );
  }
}
