
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Brand from '../../../models/Brand';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const brand = await Brand.findOne({ slug });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
})
.put(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const brand = await Brand.findOneAndUpdate({ slug }, req.body, { new: true });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update brand' });
  }
})
.delete(async (req, res) => {
  await dbConnect();
  try {
    const { slug } = req.query;
    const brand = await Brand.findOneAndDelete({ slug });
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
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
