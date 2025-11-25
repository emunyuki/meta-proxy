export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const PAGE_ID = process.env.FB_PAGE_ID;
  const TOKEN = process.env.PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !TOKEN) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          access_token: TOKEN
        })
      }
    );

    const result = await response.json();
    res.status(response.ok ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
