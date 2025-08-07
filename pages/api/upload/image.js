const nextConnect = require('next-connect').default;
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../../lib/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shop2_banners', // Optional: specify a folder in your Cloudinary account
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error("Upload error:", error);
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('image')); // 'image' is the name of the form field

apiRoute.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  res.status(200).json({ imageUrl: req.file.path });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, as `multer` handles it
  },
};

export default apiRoute;
