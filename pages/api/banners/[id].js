import dbConnect from '../../../lib/db';
import Banner from '../../../models/Banner';

export default async function handler(req, res) {
  const { query: { id }, method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const banner = await Banner.findById(id);
        if (!banner) {
          return res.status(404).json({ error: 'Banner not found' });
        }
        res.status(200).json(banner);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banner' });
      }
      break;
    case 'PUT':
      try {
        const banner = await Banner.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!banner) {
          return res.status(404).json({ error: 'Banner not found' });
        }
        res.status(200).json(banner);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update banner' });
      }
      break;
    case 'DELETE':
      try {
        const deletedBanner = await Banner.deleteOne({ _id: id });
        if (!deletedBanner.deletedCount) {
          return res.status(404).json({ error: 'Banner not found' });
        }
        res.status(200).json({ message: 'Banner deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete banner' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}