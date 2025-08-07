import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Banner from '../../../models/Banner';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const banners = await Banner.find({});
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
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