// Configuration Airtable - Sans dépendances externes
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const BASE_URL = 'https://api.airtable.com/v0';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function airtableFetch(endpoint: string, options: FetchOptions = {}) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable API key ou Base ID non configuré');
  }

  const url = `${BASE_URL}/${AIRTABLE_BASE_ID}/${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Airtable error: ${error.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Airtable fetch error:', error);
    throw error;
  }
}

// Récupérer les records avec une formule
export async function getRecordsByFormula(table: string, formula: string) {
  const encodedFormula = encodeURIComponent(formula);
  const response = await airtableFetch(
    `${encodeURIComponent(table)}?filterByFormula=${encodedFormula}`
  );
  return response.records || [];
}

// Récupérer un record par ID
export async function getRecordById(table: string, recordId: string) {
  const response = await airtableFetch(`${encodeURIComponent(table)}/${recordId}`);
  return response;
}

// Créer un record
export async function createRecord(table: string, fields: any) {
  const response = await airtableFetch(
    encodeURIComponent(table),
    {
      method: 'POST',
      body: JSON.stringify({ fields }),
    }
  );
  return response;
}

// Mettre à jour un record
export async function updateRecord(table: string, recordId: string, fields: any) {
  const response = await airtableFetch(
    `${encodeURIComponent(table)}/${recordId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }
  );
  return response;
}

// Supprimer un record
export async function deleteRecord(table: string, recordId: string) {
  await airtableFetch(
    `${encodeURIComponent(table)}/${recordId}`,
    {
      method: 'DELETE',
    }
  );
}
