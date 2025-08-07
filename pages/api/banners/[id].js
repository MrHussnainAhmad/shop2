import { createRouter } from 'next-connect';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '../../../lib/db';
import Banner from '../../../models/Banner';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const { id } = req.query;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
})
.put(async (req, res) => {
  // Add authentication for PUT operations
  const { userId } = auth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - Please sign in' });
  }
  
  await dbConnect();
  try {
    const { id } = req.query;
    const banner = await Banner.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
})
.delete(async (req, res) => {
  // Add authentication for DELETE operations
  const { userId } = auth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - Please sign in' });
  }
  
  await dbConnect();
  try {
    const { id } = req.query;
    const deletedBanner = await Banner.deleteOne({ _id: id });
    if (!deletedBanner.deletedCount) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ error: 'Failed to delete banner' });
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
