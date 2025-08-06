
import { auth } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../../lib/db';
import UserProfile from '../../../../models/UserProfile';

const router = createRouter();

router
  .get(async (req, res) => {
    const { userId } = auth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    try {
      const userProfile = await UserProfile.findOne({ clerkId: userId }).populate('addresses');
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  })
  .put(async (req, res) => {
    const { userId } = auth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    try {
      const userProfile = await UserProfile.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
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
