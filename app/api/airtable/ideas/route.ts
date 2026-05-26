import { NextRequest, NextResponse } from 'next/server';
import { getRecordsByFormula } from '@/lib/airtable-config';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    // Récupérer toutes les idées publiques
    const publicFormula = `{visibility} = "Public"`;
    const publicIdeas = await getRecordsByFormula('Ideas', publicFormula);

    // Si userId fourni, ajouter ses idées privées
    let allIdeas = publicIdeas;
    if (userId) {
      // Récupérer les idées privées de l'user
      const privateFormula = `AND({visibility} = "Privé", {createdBy} = "${userId}")`;
      const privateIdeas = await getRecordsByFormula('Ideas', privateFormula);
      allIdeas = [...publicIdeas, ...privateIdeas];
    }

    return NextResponse.json(
      allIdeas.map((record: any) => ({
        id: record.id,
        ...record.fields,
      })),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur GET ideas:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
