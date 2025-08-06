
import { auth } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Address from '../../../models/Address';
import UserProfile from '../../../models/UserProfile';

const router = createRouter();

router.patch(async (req, res) => {
  const { userId } = auth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();
  try {
    const userProfile = await UserProfile.findOne({ clerkId: userId });
    await Address.updateMany({ user: userProfile._id }, { isDefault: false });
    const address = await Address.findOneAndUpdate({ _id: req.body.addressId, user: userProfile._id }, { isDefault: true }, { new: true });
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: 'Failed to set default address' });
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
