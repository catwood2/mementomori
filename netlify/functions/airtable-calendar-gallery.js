exports.handler = async function(event) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_CALENDAR_TABLE || 'Calendars';

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Airtable credentials' })
    };
  }

  if (event.httpMethod === 'GET') {
    // Fetch all images
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
      });
      const data = await res.json();
      const images = (data.records || []).map(rec => ({
        id: rec.id,
        url: rec.fields['Image'] && rec.fields['Image'][0]?.url,
        caption: rec.fields['Caption'] || '',
        username: rec.fields['Username'] || ''
      })).filter(img => img.url);
      return {
        statusCode: 200,
        body: JSON.stringify({ images })
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try {
      payload = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON payload' })
      };
    }
    const { url, caption, username } = payload;
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Image URL required' })
      };
    }
    const fields = {
      'Image': [{ url }],
      'Caption': caption || '',
      'Username': username || ''
    };
    const apiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          statusCode: res.status,
          body: JSON.stringify({ error: 'Airtable API error', details: errorData })
        };
      }
      const data = await res.json();
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, record: data })
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}; 