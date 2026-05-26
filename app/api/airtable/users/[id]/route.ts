import { NextRequest, NextResponse } from 'next/server';
import { getRecordsByFormula } from '@/lib/airtable-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Récupérer l'utilisateur par clerkId
    const formula = `{clerkId} = "${userId}"`;
    const users = await getRecordsByFormula('Users', formula);

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: users[0].id,
        ...users[0].fields,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur GET user:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
