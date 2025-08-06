
import { auth } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../../lib/db';
import Address from '../../../../models/Address';
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
      const userProfile = await UserProfile.findOne({ clerkId: userId });
      const address = await Address.findOne({ _id: req.query.id, user: userProfile._id });
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch address' });
    }
  })
  .put(async (req, res) => {
    const { userId } = auth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    try {
      const userProfile = await UserProfile.findOne({ clerkId: userId });
      const address = await Address.findOneAndUpdate({ _id: req.query.id, user: userProfile._id }, req.body, { new: true });
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update address' });
    }
  })
  .delete(async (req, res) => {
    const { userId } = auth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    try {
      const userProfile = await UserProfile.findOne({ clerkId: userId });
      const address = await Address.findOneAndDelete({ _id: req.query.id, user: userProfile._id });
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      userProfile.addresses.pull(address._id);
      await userProfile.save();
      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete address' });
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
