import { NextRequest, NextResponse } from 'next/server';
import { checkPseudoExists } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    const pseudo = request.nextUrl.searchParams.get('pseudo');

    if (!pseudo) {
      return NextResponse.json({ error: 'Pseudo required' }, { status: 400 });
    }

    const exists = await checkPseudoExists(pseudo);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('❌ Error checking pseudo:', error);
    return NextResponse.json(
      { error: 'Failed to check pseudo', details: error instanceof Error ? error.message : '' },
      { status: 500 }
    );
  }
}
