
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const product = await Product.findOne({ slug }).populate('category').populate('brand');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
})
.put(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const product = await Product.findOneAndUpdate({ slug }, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
})
.delete(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const product = await Product.findOneAndDelete({ slug });
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
