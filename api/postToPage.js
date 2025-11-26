export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, image_url } = req.body;

    if (!image_url || !message) {
      return res.status(400).json({
        error: "Missing required fields: image_url, message"
      });
    }

    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
    const FB_PAGE_ID = process.env.FB_PAGE_ID;

    if (!PAGE_ACCESS_TOKEN || !FB_PAGE_ID) {
      return res.status(500).json({
        error: "Facebook credentials missing from environment variables"
      });
    }

    // Facebook endpoint for publishing a PHOTO post
    const url = `https://graph.facebook.com/v20.0/${FB_PAGE_ID}/photos`;

    const fbResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: image_url,           // publicly accessible image URL
        caption: message,         // message appears as caption on FB photo
        access_token: PAGE_ACCESS_TOKEN
      })
    });

    const data = await fbResponse.json();

    if (!fbResponse.ok) {
      return res.status(fbResponse.status).json({
        error: "Facebook API error",
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      platform: "facebook",
      response: data
    });

  } catch (error) {
    console.error("FB Publish Error:", error);
    return res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
}
