const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateProjectSuggestions(userPrompt: string) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `Tu es un expert en idées d'applications innovantes. 
L'utilisateur te donne un prompt ou une description.
Tu dois analyser sa demande et lui suggérer 3-5 idées de projets d'app créatives et pertinentes.

Pour chaque idée, fournis au format JSON:
{
  "id": "app-xxx",
  "title": "Titre de l'idée",
  "description": "Description brève (max 2 lignes)",
  "category": "Développement"
}

Retourne SEULEMENT un array JSON valide, sans texte supplémentaire.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parser la réponse JSON
    const suggestions = JSON.parse(content);
    return Array.isArray(suggestions) ? suggestions : [suggestions];
  } catch (error) {
    console.error('OpenAI request error:', error);
    throw error;
  }
}

export async function filterProjectsByAI(
  projects: any[],
  userQuery: string
) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `Tu es un expert en filtrage de projets d'applications.
L'utilisateur te donne une liste de projets et une requête de recherche.
Tu dois filtrer et trier les projets les plus pertinents en fonction de la requête.

Retourne SEULEMENT un array d'IDs de projets, du plus pertinent au moins pertinent.
Format: ["id1", "id2", "id3"]`;

  const projectList = projects
    .map((p) => `ID: ${p.id}, Titre: ${p.title}, Description: ${p.description}`)
    .join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Projets disponibles:\n${projectList}\n\nRequête utilisateur: ${userQuery}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const ids = JSON.parse(content);
    return ids;
  } catch (error) {
    console.error('OpenAI filter error:', error);
    // Retourner tous les IDs en cas d'erreur
    return projects.map((p) => p.id);
  }
}
