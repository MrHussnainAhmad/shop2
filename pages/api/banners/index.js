
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Banner from '../../../models/Banner';

const router = createRouter();

router
  .get(async (req, res) => {
    await dbConnect();
    try {
      const banners = await Banner.find({});
      res.status(200).json(banners);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch banners' });
    }
  })
  .post(async (req, res) => {
    const { userId } = auth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await clerkClient.users.getUser(userId);
    if (!user.privateMetadata.isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    await dbConnect();
    try {
      const banner = await Banner.create(req.body);
      res.status(201).json(banner);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create banner' });
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
