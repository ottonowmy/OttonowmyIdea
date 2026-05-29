import { NextRequest, NextResponse } from 'next/server';
import { getRecordsByFormula } from '@/lib/airtable-config';

export async function GET(request: NextRequest) {
  try {
    const pseudo = request.nextUrl.searchParams.get('pseudo');

    if (!pseudo) {
      return NextResponse.json(
        { error: 'Pseudo manquant' },
        { status: 400 }
      );
    }

    // Vérifier l'existence du pseudo
    const users = await getRecordsByFormula('Users', `{pseudo} = '${pseudo}'`);

    return NextResponse.json(
      {
        available: users.length === 0,
        pseudo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error checking pseudo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}