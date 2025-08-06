
import { auth } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Address from '../../../models/Address';
import UserProfile from '../../../models/UserProfile';

const router = createRouter();

router
  .get(async (req, res) => {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await dbConnect();
    try {
      const userProfile = await UserProfile.findOne({ email });
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
      }
      const addresses = await Address.find({ user: userProfile._id });
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  })
  .post(async (req, res) => {
    const { userId } = auth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    try {
      const userProfile = await UserProfile.findOne({ clerkId: userId });
      const address = await Address.create({ ...req.body, user: userProfile._id });
      userProfile.addresses.push(address._id);
      await userProfile.save();
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create address' });
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
