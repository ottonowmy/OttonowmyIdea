import { NextRequest, NextResponse } from 'next/server';
import { createRecord, getRecordsByFormula, updateRecord } from '@/lib/airtable-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, visibility, userId } = body;

    if (!title || !description || !visibility || !userId) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur par clerkId
    const userFormula = `{clerkId} = "${userId}"`;
    const users = await getRecordsByFormula('Users', userFormula);
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const user = users[0];
    const currentEclairs = user.fields.eclairs || 0;
    const CREATION_COST = 700;

    if (currentEclairs < CREATION_COST) {
      return NextResponse.json(
        { error: `Pas assez d'éclairs (besoin: ${CREATION_COST}, vous avez: ${currentEclairs})` },
        { status: 400 }
      );
    }

    // Créer l'idée - créatedBy doit être l'ID du record Airtable
    const newIdea = await createRecord('Ideas', {
      title,
      description,
      visibility,
      createdBy: user.id, // ID du record Airtable, pas array
      likes: 0,
      dislikes: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
    });

    // Déduire les éclairs
    await updateRecord('Users', user.id, {
      eclairs: currentEclairs - CREATION_COST,
    });

    return NextResponse.json(
      {
        id: newIdea.id,
        ...newIdea.fields,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur création idea:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
