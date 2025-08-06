import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Brand from '../../../models/Brand';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
})
.post(async (req, res) => {
  await dbConnect();
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create brand' });
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