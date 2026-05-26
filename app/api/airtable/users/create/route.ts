import { NextRequest, NextResponse } from 'next/server';
import { createRecord, getRecordsByFormula } from '@/lib/airtable-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, email, pseudo } = body;

    if (!clerkId || !email || !pseudo) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Vérifier que le pseudo est unique
    const existingUsers = await getRecordsByFormula('Users', `{pseudo} = '${pseudo}'`);
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Ce pseudo est déjà pris' },
        { status: 409 }
      );
    }

    // Vérifier que le clerkId n'existe pas déjà
    const existingClerkUsers = await getRecordsByFormula('Users', `{clerkId} = '${clerkId}'`);
    if (existingClerkUsers.length > 0) {
      return NextResponse.json(
        { error: 'Cet utilisateur existe déjà' },
        { status: 409 }
      );
    }

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
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}
