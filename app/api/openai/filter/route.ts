import { NextRequest, NextResponse } from 'next/server';
import { filterProjectsByAI } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { projects, query } = await request.json();

    if (!projects || !query) {
      return NextResponse.json(
        { error: 'Projects and query are required' },
        { status: 400 }
      );
    }

    const filteredIds = await filterProjectsByAI(projects, query);

    // Retourner les projets triés
    const sorted = filteredIds
      .map((id: string) => projects.find((p: any) => p.id === id))
      .filter(Boolean);

    return NextResponse.json(sorted, { status: 200 });
  } catch (error: any) {
    console.error('Error filtering projects:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du filtrage' },
      { status: 500 }
    );
  }
}
