
import { auth } from '@clerk/nextjs/server';
import { createRouter } from 'next-connect';
import multer from 'multer';
import cloudinary from '@/lib/cloudinary';

const upload = multer({ dest: '/tmp' });

const router = createRouter();

router.use(upload.single('file')).post(async (req, res) => {
  const { userId } = auth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'next-ecommerce',
    });
    res.status(200).json({ secure_url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
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

export const config = {
  api: {
    bodyParser: false,
  },
};
