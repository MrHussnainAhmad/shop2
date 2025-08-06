
import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
