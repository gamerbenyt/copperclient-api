import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { method } = req;

  // 1. BROWSE CAPES (Matches your Rust CapesBrowseResponse)
  if (method === 'GET') {
    return res.status(200).json({
      capes: [
        {
          _id: "copper_og_hash",
          accepted: true,
          uses: 1,
          firstSeen: "0696a67a-714e-4ed2-9b93-c87d071cfa78",
          moderatorMessage: "Official Copper Cape",
          creationDate: Date.now(),
          elytra: true
        }
      ],
      pagination: {
        currentPage: 0,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1
      }
    });
  }

  // 2. UPLOAD CAPE (Matches your Rust upload_cape function)
  if (method === 'POST') {
    try {
      const playerUuid = req.query.uuid;
      const blob = await put(`capes/${playerUuid}-${uuidv4()}.png`, req.body, {
        access: 'public',
        contentType: 'image/png'
      });

      // Your Rust code expects the hash/URL back as a plain string or JSON
      // We return the URL so the client knows where to find it
      return res.status(200).send(blob.url);
    } catch (error) {
      return res.status(500).json({ error: "Upload failed" });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
