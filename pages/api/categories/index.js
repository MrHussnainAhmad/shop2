import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Category from '../../../models/Category';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
})
.post(async (req, res) => {
  await dbConnect();
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
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