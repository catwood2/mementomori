exports.handler = async function(event) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_PHOTOS_TABLE || 'Calendars';

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
      console.log('[AirtableGallery] GET url:', url);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
      });
      const data = await res.json();
      console.log('[AirtableGallery] GET response:', JSON.stringify(data, null, 2));
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
      console.error('[AirtableGallery] GET error:', err);
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
      console.log('[AirtableGallery] POST payload:', payload);
    } catch (e) {
      console.error('[AirtableGallery] POST invalid JSON:', event.body);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON payload' })
      };
    }
    const { url, caption, username } = payload;
    if (!url) {
      console.error('[AirtableGallery] POST missing image URL');
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
      console.log('[AirtableGallery] POST apiUrl:', apiUrl);
      console.log('[AirtableGallery] POST fields:', fields);
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('[AirtableGallery] POST Airtable error:', data);
        return {
          statusCode: res.status,
          body: JSON.stringify({ error: 'Airtable API error', details: data })
        };
      }
      console.log('[AirtableGallery] POST success:', data);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, record: data })
      };
    } catch (err) {
      console.error('[AirtableGallery] POST error:', err);
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