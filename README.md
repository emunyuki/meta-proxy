# Meta Graph API Proxy

Simple Vercel serverless proxy for Meta (Facebook & Instagram) Graph API.

## Endpoints

- `GET /api/test` - Health check
- `POST /api/postToPage` - Post to Facebook Page
- `GET /api/getInstagramMedia` - Get Instagram media list
- `POST /api/publishInstagramMedia` - Publish image to Instagram

## Environment Variables (set in Vercel)

- `PAGE_ACCESS_TOKEN` - Your Meta Page Access Token
- `FB_PAGE_ID` - Your Facebook Page ID
- `IG_BUSINESS_ID` - Your Instagram Business Account ID
