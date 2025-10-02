import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    res.status(200).json({ apiKey });
  } else {
    res.status(500).json({ error: 'API key is not configured on the server.' });
  }
}
