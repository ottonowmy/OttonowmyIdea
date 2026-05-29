import { NextRequest, NextResponse } from 'next/server';
import { getRecordsByFormula, createRecord } from '@/lib/airtable-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Récupérer l'utilisateur par clerkId
    const users = await getRecordsByFormula('Users', `{clerkId} = '${userId}'`);

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
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, email, pseudo } = body;

    // Créer l'utilisateur
    const newUser = await createRecord('Users', {
      clerkId,
      email,
      pseudo,
      eclairs: 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        id: newUser.id,
        ...newUser.fields,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}
