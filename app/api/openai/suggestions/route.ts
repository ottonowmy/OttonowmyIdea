import { NextRequest, NextResponse } from 'next/server';
import { generateProjectSuggestions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const suggestions = await generateProjectSuggestions(prompt);

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error: any) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération des suggestions' },
      { status: 500 }
    );
  }
}
