const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY, AIRTABLE_TABLE_NAME } = process.env;

exports.handler = async function(event, context) {
  // Only allow GET and POST
  if (!['GET', 'POST'].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    if (event.httpMethod === 'GET') {
      const res = await fetch(`${url}?sort[0][field]=CreatedAt&sort[0][direction]=desc`, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
      });
      
      if (!res.ok) {
        throw new Error('Airtable API error');
      }
      
      const data = await res.json();
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }
    
    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        throw new Error('Airtable API error');
      }
      
      const data = await res.json();
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 