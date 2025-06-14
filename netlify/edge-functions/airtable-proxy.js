export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  
  const AIRTABLE_BASE_ID = context.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = context.env.AIRTABLE_API_KEY;
  const AIRTABLE_TABLE_NAME = context.env.AIRTABLE_TABLE_NAME;

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}${path}${url.search}`;
  
  console.log('Proxying to:', airtableUrl);
  
  const response = await fetch(airtableUrl, {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: request.method !== 'GET' ? await request.text() : undefined
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}; 