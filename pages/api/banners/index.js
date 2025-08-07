import dbConnect from '../../../lib/db';
import Banner from '../../../models/Banner';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const banners = await Banner.find({});
        res.status(200).json(banners);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banners' });
      }
      break;
    case 'POST':
      try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
      } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({ error: 'Failed to create banner', details: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
