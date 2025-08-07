
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Category from '../../../models/Category';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
})
.put(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const category = await Category.findOneAndUpdate({ slug }, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
})
.delete(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const category = await Category.findOneAndDelete({ slug });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
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
