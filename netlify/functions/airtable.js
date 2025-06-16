const fetch = require('node-fetch');
const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY, AIRTABLE_TABLE_NAME } = process.env;

// Validate environment variables
if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY || !AIRTABLE_TABLE_NAME) {
  console.error('Missing required environment variables');
  console.error('AIRTABLE_BASE_ID:', !!AIRTABLE_BASE_ID);
  console.error('AIRTABLE_API_KEY:', !!AIRTABLE_API_KEY);
  console.error('AIRTABLE_TABLE_NAME:', !!AIRTABLE_TABLE_NAME);
}

// Helper function to validate and clean fields
function validateAndCleanFields(fields) {
  console.log('Validating fields:', JSON.stringify(fields, null, 2));
  
  const cleaned = {
    Quote: fields.Quote?.trim(),
    Category: fields.Category,
    SourceLink: fields.SourceLink?.trim() || '',
    Author: fields.Author?.trim() || 'Anonymous',
    Content: fields.Content?.trim() || fields.Quote?.trim(),
    Likes: fields.Likes || 0,
    Replies: fields.Replies || 0,
    Retweets: fields.Retweets || 0
  };

  console.log('Cleaned fields:', JSON.stringify(cleaned, null, 2));

  // Validate required fields
  if (!cleaned.Quote) {
    throw new Error('Quote is required');
  }
  if (!cleaned.Category) {
    throw new Error('Category is required');
  }

  return cleaned;
}

exports.handler = async function(event, context) {
  console.log('Received request:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers
  });

  // Only allow GET, POST, and PATCH
  if (!['GET', 'POST', 'PATCH'].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check for required environment variables
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY || !AIRTABLE_TABLE_NAME) {
    console.error('Missing environment variables:', {
      AIRTABLE_BASE_ID: !!AIRTABLE_BASE_ID,
      AIRTABLE_API_KEY: !!AIRTABLE_API_KEY,
      AIRTABLE_TABLE_NAME: !!AIRTABLE_TABLE_NAME
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error',
        details: 'Missing required environment variables'
      })
    };
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    console.log('Airtable URL:', url);
    
    if (event.httpMethod === 'GET') {
      const res = await fetch(`${url}?sort[0][field]=CreatedAt&sort[0][direction]=desc`, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('GET request failed:', {
          status: res.status,
          statusText: res.statusText,
          error: errorData
        });
        throw new Error(`Airtable API error: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await res.json();
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }
    
    if (event.httpMethod === 'POST') {
      console.log('POST request body:', event.body);
      
      let payload;
      try {
        payload = JSON.parse(event.body);
        console.log('Parsed payload:', JSON.stringify(payload, null, 2));
      } catch (e) {
        console.error('JSON parse error:', e);
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            error: 'Invalid JSON payload',
            details: e.message
          })
        };
      }

      try {
        const cleanedFields = validateAndCleanFields(payload.fields || {});
        payload.fields = cleanedFields;
        console.log('Final payload to Airtable:', JSON.stringify(payload, null, 2));
      } catch (e) {
        console.error('Field validation error:', e);
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            error: 'Invalid fields',
            details: e.message
          })
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('POST request failed:', {
          status: res.status,
          statusText: res.statusText,
          error: errorData
        });
        throw new Error(`Airtable API error: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await res.json();
      console.log('POST request successful:', JSON.stringify(data, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'PATCH') {
      let payload;
      try {
        payload = JSON.parse(event.body);
        console.log('PATCH payload:', JSON.stringify(payload, null, 2));
      } catch (e) {
        console.error('JSON parse error:', e);
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            error: 'Invalid JSON payload',
            details: e.message
          })
        };
      }

      const { recordId, likes } = payload;
      
      if (!recordId || typeof likes !== 'number') {
        console.error('Invalid PATCH payload:', payload);
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            error: 'Invalid payload',
            details: 'recordId and likes are required fields'
          })
        };
      }

      const res = await fetch(`${url}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: { Likes: likes }
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('PATCH request failed:', {
          status: res.status,
          statusText: res.statusText,
          error: errorData
        });
        throw new Error(`Airtable API error: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await res.json();
      console.log('PATCH request successful:', JSON.stringify(data, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }
  } catch (error) {
    console.error('Airtable function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Airtable API error',
        details: error.message
      })
    };
  }
}; 