import { NextRequest, NextResponse } from 'next/server';
import { getRecordsByFormula } from '@/lib/airtable-config';

export async function GET(request: NextRequest) {
  try {
    const pseudo = request.nextUrl.searchParams.get('pseudo');

    if (!pseudo || pseudo.length < 3) {
      return NextResponse.json(
        { available: false, error: 'Pseudo trop court' },
        { status: 400 }
      );
    }

    // Vérifier l'existence du pseudo
    const formula = `{pseudo} = "${pseudo}"`;
    const users = await getRecordsByFormula('Users', formula);

    return NextResponse.json({
      available: users.length === 0,
      pseudo,
    });
  } catch (error: any) {
    console.error('Erreur check pseudo:', error);
    return NextResponse.json(
      { available: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
