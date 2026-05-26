// Configuration Airtable - Version simplifiée
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const BASE_URL = 'https://api.airtable.com/v0';

export interface AirtableRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  body?: any;
}

export async function airtableRequest({
  method,
  endpoint,
  body,
}: AirtableRequest) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable API key or Base ID not configured');
  }

  const url = `${BASE_URL}/${AIRTABLE_BASE_ID}/${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Airtable error: ${error.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Airtable request error:', error);
    throw error;
  }
}

// Utilitaires

export async function getRecordsByFormula(table: string, formula: string) {
  const response = await airtableRequest({
    method: 'GET',
    endpoint: `${encodeURIComponent(table)}?filterByFormula=${encodeURIComponent(formula)}`,
  });
  return response.records || [];
}

export async function getRecordById(table: string, recordId: string) {
  const response = await airtableRequest({
    method: 'GET',
    endpoint: `${encodeURIComponent(table)}/${recordId}`,
  });
  return response;
}

export async function createRecord(table: string, fields: any) {
  const response = await airtableRequest({
    method: 'POST',
    endpoint: encodeURIComponent(table),
    body: { fields },
  });
  return response;
}

export async function updateRecord(table: string, recordId: string, fields: any) {
  const response = await airtableRequest({
    method: 'PATCH',
    endpoint: `${encodeURIComponent(table)}/${recordId}`,
    body: { fields },
  });
  return response;
}

export async function deleteRecord(table: string, recordId: string) {
  await airtableRequest({
    method: 'DELETE',
    endpoint: `${encodeURIComponent(table)}/${recordId}`,
  });
}
