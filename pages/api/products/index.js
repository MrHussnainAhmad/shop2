import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const { searchTerm, isFeatured, isOnDeal, debug } = req.query;
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
      };
    }

    if (isFeatured === 'true') {
      query = { ...query, isFeatured: true };
    }

    if (isOnDeal === 'true') {
      query = { ...query, isOnDeal: true };
    }

    const products = await Product.find(query).populate('category').populate('brand');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
})
.post(async (req, res) => {
  await dbConnect();
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
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