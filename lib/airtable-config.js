const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Missing Airtable credentials in .env.local');
}

const BASE_URL = 'https://api.airtable.com/v0';

function escapeFormula(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

async function airtableFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${BASE_URL}/${AIRTABLE_BASE_ID}/${endpoint}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText || 'Unknown error';
      throw new Error(`Airtable ${response.status}: ${errorMsg}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Airtable Error:', error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  const formula = `{clerkId}="${escapeFormula(clerkId)}"`;
  const result = await airtableFetch(
    `Users?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
  );
  return result.records?.[0] || null;
}

export async function checkPseudoExists(pseudo: string) {
  const formula = `{pseudo}="${escapeFormula(pseudo)}"`;
  const result = await airtableFetch(
    `Users?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
  );
  return result.records?.length > 0;
}

export async function createUser(data: {
  clerkId: string;
  email: string;
  pseudo: string;
}) {
  const response = await airtableFetch('Users', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        clerkId: data.clerkId,
        email: data.email,
        pseudo: data.pseudo,
        eclairs: 2500,
        createdAt: new Date().toISOString(),
      },
    }),
  });
  return response;
}

export async function getUserEclairs(userId: string) {
  const user = await airtableFetch(`Users/${userId}`);
  return user.fields?.eclairs || 0;
}

export async function updateUserEclairs(userId: string, eclairs: number) {
  const response = await airtableFetch(`Users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { eclairs } }),
  });
  return response;
}

export async function getAllPublicIdeas() {
  const formula = `{visibility}="Public"`;
  const result = await airtableFetch(
    `Ideas?filterByFormula=${encodeURIComponent(formula)}&sort[0][field]=createdAt&sort[0][direction]=desc`
  );
  return result.records || [];
}

export async function getUserIdeas(userRecordId: string) {
  const formula = `FIND("${escapeFormula(userRecordId)}",CONCATENATE({createdBy}))>0`;
  const result = await airtableFetch(
    `Ideas?filterByFormula=${encodeURIComponent(formula)}&sort[0][field]=createdAt&sort[0][direction]=desc`
  );
  return result.records || [];
}

export async function getIdeaById(ideaId: string) {
  const response = await airtableFetch(`Ideas/${ideaId}`);
  return response;
}

export async function createIdea(data: {
  title: string;
  description: string;
  visibility: 'Public' | 'Privé';
  createdBy: string;
}) {
  const response = await airtableFetch('Ideas', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        title: data.title,
        description: data.description,
        visibility: data.visibility,
        createdBy: [data.createdBy],
        likes: 0,
        dislikes: 0,
        status: 'draft',
        createdAt: new Date().toISOString(),
      },
    }),
  });
  return response;
}

export async function updateIdeaVotes(
  ideaId: string,
  likes: number,
  dislikes: number
) {
  const response = await airtableFetch(`Ideas/${ideaId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { likes, dislikes } }),
  });
  return response;
}

export async function getIdeaComments(ideaRecordId: string) {
  const formula = `FIND("${escapeFormula(ideaRecordId)}",CONCATENATE({ideaId}))>0`;
  const result = await airtableFetch(
    `Comments?filterByFormula=${encodeURIComponent(formula)}&sort[0][field]=createdAt&sort[0][direction]=asc`
  );
  return result.records || [];
}

export async function createComment(data: {
  content: string;
  pseudo: string;
  ideaId: string;
  userId: string;
}) {
  const response = await airtableFetch('Comments', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        content: data.content,
        pseudo: data.pseudo,
        ideaId: [data.ideaId],
        userId: [data.userId],
        createdAt: new Date().toISOString(),
      },
    }),
  });
  return response;
}

export async function getUserVote(ideaRecordId: string, userRecordId: string) {
  const formula = `AND({ideaId}="${escapeFormula(ideaRecordId)}",{userId}="${escapeFormula(userRecordId)}")`;
  const result = await airtableFetch(
    `Votes?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
  );
  return result.records?.[0] || null;
}

export async function createVote(data: {
  ideaId: string;
  userId: string;
  voteType: 'like' | 'dislike';
}) {
  const response = await airtableFetch('Votes', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        ideaId: [data.ideaId],
        userId: [data.userId],
        voteType: data.voteType,
        createdAt: new Date().toISOString(),
      },
    }),
  });
  return response;
}
