const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY, AIRTABLE_TABLE_NAME } = process.env;

exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/airtable-proxy/', '');
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;
  
  console.log('Proxying to:', airtableUrl);
  
  try {
    const response = await fetch(airtableUrl, {
      method: event.httpMethod,
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: event.httpMethod !== 'GET' ? event.body : undefined
    });

    const data = await response.json();
    
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 