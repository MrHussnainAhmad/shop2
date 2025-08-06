
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Banner from '../../../models/Banner';

const router = createRouter();

router
  .get(async (req, res) => {
    await dbConnect();
    try {
      const banner = await Banner.findById(req.query.id);
      if (!banner) {
        return res.status(404).json({ error: 'Banner not found' });
      }
      res.status(200).json(banner);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch banner' });
    }
  })
  .put(async (req, res) => {
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
      const banner = await Banner.findByIdAndUpdate(req.query.id, req.body, { new: true });
      if (!banner) {
        return res.status(404).json({ error: 'Banner not found' });
      }
      res.status(200).json(banner);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update banner' });
    }
  })
  .delete(async (req, res) => {
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
      const banner = await Banner.findByIdAndDelete(req.query.id);
      if (!banner) {
        return res.status(404).json({ error: 'Banner not found' });
      }
      res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete banner' });
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
