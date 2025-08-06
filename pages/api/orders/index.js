
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import UserProfile from '../../../models/UserProfile';

const router = createRouter();

router
  .get(async (req, res) => {
    const { userId } = auth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();
    try {
      const user = await clerkClient.users.getUser(userId);
      if (user.privateMetadata.isAdmin) {
        const orders = await Order.find({}).populate('user products.product');
        return res.status(200).json(orders);
      }
      const userProfile = await UserProfile.findOne({ clerkId: userId });
      const orders = await Order.find({ user: userProfile._id }).populate('products.product');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
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
      const order = await Order.create({ ...req.body, user: userProfile._id });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
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
