export default async function handler(req, res) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
  return res.status(200).end();
}
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { image_url, caption } = req.body;

    if (!image_url || !caption) {
      return res.status(400).json({
        error: "Missing required fields: image_url, caption"
      });
    }

    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const IG_BUSINESS_ID = process.env.IG_BUSINESS_ID;

    if (!META_ACCESS_TOKEN || !IG_BUSINESS_ID) {
      return res.status(500).json({
        error: "Instagram credentials missing from environment variables"
      });
    }

    // STEP 1: Create IG Media object
    const createMediaUrl = `https://graph.facebook.com/v20.0/${IG_BUSINESS_ID}/media`;

    const mediaResponse = await fetch(createMediaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url,
        caption,
        access_token: META_ACCESS_TOKEN
      })
    });

    const mediaData = await mediaResponse.json();

    if (!mediaResponse.ok) {
      return res.status(mediaResponse.status).json({
        error: "Instagram media creation failed",
        details: mediaData
      });
    }

    const creationId = mediaData.id;

    // STEP 2: Wait 2 seconds for IG to finish downloading the media
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // STEP 3: Publish IG Media object
    const publishUrl = `https://graph.facebook.com/v20.0/${IG_BUSINESS_ID}/media_publish`;

    const publishResponse = await fetch(publishUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: META_ACCESS_TOKEN
      })
    });

    const publishData = await publishResponse.json();

    if (!publishResponse.ok) {
      return res.status(publishResponse.status).json({
        error: "Instagram publish failed",
        details: publishData
      });
    }

    return res.status(200).json({
      success: true,
      platform: "instagram",
      response: publishData
    });

  } catch (error) {
    console.error("IG Publish Error:", error);
    return res.status(500).json({
      error: "Server Error",
      details: error.message
    });
  }
}
