
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  imageUrl: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
