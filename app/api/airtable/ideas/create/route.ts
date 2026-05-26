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

    // Vérifier que l'utilisateur existe et a assez d'éclairs
    const users = await getRecordsByFormula('Users', `{clerkId} = '${userId}'`);
    
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
        { error: `Vous n'avez pas assez d'éclairs (besoin: ${CREATION_COST}, vous avez: ${currentEclairs})` },
        { status: 400 }
      );
    }

    // Créer l'idée en liant l'utilisateur par son ID Airtable
    const newIdea = await createRecord('Ideas', {
      title,
      description,
      visibility,
      createdBy: [user.id], // Lien Airtable vers Users
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
        message: `Idée créée! Vous avez dépensé ${CREATION_COST} éclairs.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating idea:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de l\'idée' },
      { status: 500 }
    );
  }
}
