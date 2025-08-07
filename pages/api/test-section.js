import { createRouter } from 'next-connect';
import dbConnect from '../../lib/db';
import WebData from '../../models/WebData';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    let webData = await WebData.findOne({});
    
    if (!webData) {
      webData = await WebData.create({
        sectionSettings: {
          shopByBrandsVisible: true,
        },
      });
    }
    
    res.status(200).json({
      sectionSettings: webData.sectionSettings || { shopByBrandsVisible: true }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get section settings' });
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
