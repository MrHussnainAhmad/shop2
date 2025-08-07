
import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String },
  logoUrl: { type: String },
  description: { type: String },
  website: { type: String },
  featured: { type: Boolean, default: false },
  voucher: {
    name: { type: String },
    value: { type: Number }, // Percentage discount
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
