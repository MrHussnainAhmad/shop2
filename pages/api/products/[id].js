
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';

const router = createRouter();

router
  .get(async (req, res) => {
    await dbConnect();
    try {
      const product = await Product.findById(req.query.id).populate('category brand');
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
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
      const product = await Product.findByIdAndUpdate(req.query.id, req.body, { new: true });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
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
      const product = await Product.findByIdAndDelete(req.query.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
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
