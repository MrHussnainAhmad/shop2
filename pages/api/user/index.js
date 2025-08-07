
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import UserProfile from '../../../models/UserProfile';

const router = createRouter();

router.get(async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = await clerkClient.users.getUser(userId);
  if (!user.privateMetadata.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await dbConnect();
  try {
    const users = await UserProfile.find({}).populate('addresses');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
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
