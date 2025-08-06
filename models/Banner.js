
import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
