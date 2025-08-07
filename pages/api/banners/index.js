import { createRouter } from 'next-connect';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '../../../lib/db';
import Banner from '../../../models/Banner';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
})
.post(async (req, res) => {
  // Add authentication for POST operations
  const { userId } = auth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - Please sign in' });
  }
  
  await dbConnect();
  try {
    console.log("Banner creation request body:", req.body);
    const banner = await Banner.create(req.body);
    console.log("Banner created successfully:", banner);
    res.status(201).json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: 'Failed to create banner', details: error.message });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});
