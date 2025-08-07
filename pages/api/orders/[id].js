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
      const order = await Order.findById(req.query.id).populate('user products.product');

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (!user.privateMetadata.isAdmin) {
        const userProfile = await UserProfile.findOne({ clerkId: userId });
        if (order.user.toString() !== userProfile._id.toString()) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
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
      const order = await Order.findByIdAndUpdate(req.query.id, req.body, { new: true });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
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
      const order = await Order.findByIdAndDelete(req.query.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order' });
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