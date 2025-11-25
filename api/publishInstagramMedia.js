export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_url, caption } = req.body;
  const IG_BUSINESS_ID = process.env.IG_BUSINESS_ID;
  const TOKEN = process.env.PAGE_ACCESS_TOKEN;

  if (!IG_BUSINESS_ID || !TOKEN) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  if (!image_url) {
    return res.status(400).json({ error: 'Missing image_url in request body' });
  }

  try {
    // Step 1: Create media container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v20.0/${IG_BUSINESS_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: image_url,
          caption: caption || '',
          access_token: TOKEN
        })
      }
    );

    const containerResult = await containerResponse.json();

    if (!containerResponse.ok || !containerResult.id) {
      return res.status(400).json({ 
        error: 'Failed to create media container', 
        details: containerResult 
      });
    }

    const containerId = containerResult.id;

    // Step 2: Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v20.0/${IG_BUSINESS_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: TOKEN
        })
      }
    );

    const publishResult = await publishResponse.json();
    res.status(publishResponse.ok ? 200 : 400).json(publishResult);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
