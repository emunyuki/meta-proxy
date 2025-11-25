export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const IG_BUSINESS_ID = process.env.IG_BUSINESS_ID;
  const TOKEN = process.env.PAGE_ACCESS_TOKEN;

  if (!IG_BUSINESS_ID || !TOKEN) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${IG_BUSINESS_ID}/media?fields=id,media_url,caption,media_type,timestamp&access_token=${TOKEN}`
    );

    const result = await response.json();
    res.status(response.ok ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
