import { NextRequest, NextResponse } from 'next/server';
import { getRecordsByFormula } from '@/lib/airtable-config';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    // Récupérer toutes les idées publiques
    const publicIdeas = await getRecordsByFormula('Ideas', "{visibility} = 'Public'");

    // Si userId fourni, ajouter ses idées privées
    let allIdeas = publicIdeas;
    if (userId) {
      const userIdeas = await getRecordsByFormula('Ideas', `{createdBy} = '${userId}'`);
      allIdeas = [...publicIdeas, ...userIdeas.filter((idea: any) => idea.fields.visibility === 'Privé')];
    }

    return NextResponse.json(
      allIdeas.map((record: any) => ({
        id: record.id,
        ...record.fields,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des idées' },
      { status: 500 }
    );
  }
}
