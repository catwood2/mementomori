console.log('airtable-videos function loaded');

exports.handler = async function(event, context) {
  console.log('airtable-videos function invoked');
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_VIDEOS_TABLE || 'Featured Videos';

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Airtable credentials' })
    };
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?view=Grid%20view`;
  const headers = { Authorization: `Bearer ${AIRTABLE_API_KEY}` };
  console.log('Airtable request URL:', url);
  console.log('Airtable request headers:', headers);

  try {
    const response = await fetch(url, {
      headers,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch from Airtable');
    }
    const data = await response.json();
    console.log('Airtable raw records:', JSON.stringify(data.records, null, 2));
    // Map records to a simple array
    const videos = data.records
      .filter(r => r.fields.Active)
      .sort((a, b) => (a.fields.Order || 0) - (b.fields.Order || 0))
      .map(r => ({
        id: r.fields['YouTube ID'],
        title: r.fields['Title'],
        description: r.fields['Description'] || '',
        order: r.fields['Order'] || 0,
      }));
    console.log('Filtered videos:', JSON.stringify(videos, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify({ videos })
    };
  } catch (err) {
    console.error('Airtable fetch error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}; 