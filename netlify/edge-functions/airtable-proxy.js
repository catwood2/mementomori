export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname.replace('/.netlify/edge-functions/airtable-proxy/', '');
  
  const AIRTABLE_BASE_ID = context.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = context.env.AIRTABLE_API_KEY;
  const AIRTABLE_TABLE_NAME = context.env.AIRTABLE_TABLE_NAME;

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}${path}`;
  
  const response = await fetch(airtableUrl, {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: request.method !== 'GET' ? await request.text() : undefined
  });

  return response;
}; 