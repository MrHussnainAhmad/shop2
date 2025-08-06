
import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  slug: { type: String },
  badge: { type: String },
  discountAmount: { type: Number },
  image: { type: String, required: true },
  imageUrl: { type: String },
  link: { type: String },
  isMiniBanner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
