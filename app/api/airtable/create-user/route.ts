import { NextRequest, NextResponse } from 'next/server';
import { createUser, checkPseudoExists } from '@/lib/airtable-config';

export async function POST(request: NextRequest) {
  try {
    const { clerkId, email, pseudo } = await request.json();

    if (!clerkId || !email || !pseudo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (pseudo.length < 3 || pseudo.length > 30) {
      return NextResponse.json(
        { error: 'Pseudo must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    const exists = await checkPseudoExists(pseudo);
    if (exists) {
      return NextResponse.json(
        { error: 'Pseudo already taken' },
        { status: 409 }
      );
    }

    const result = await createUser({
      clerkId,
      email,
      pseudo,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.id,
          ...result.fields,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : '' },
      { status: 500 }
    );
  }
}
