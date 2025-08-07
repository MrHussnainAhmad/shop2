
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  price: { type: Number, required: true },
  sku: { type: String, required: true },
  images: [{ type: String, required: true }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  stock: { type: Number, required: true, default: 0 },
  status: { type: String, default: 'New' },
  variant: { type: String },
  isFeatured: { type: Boolean, default: false },
  customAttributes: [{
    name: { type: String, required: true },
    value: { type: String, required: true },
  }],
  couponCode: {
    code: { type: String },
    discount: { type: Number },
  },
  isOnDeal: { type: Boolean, default: false },
  dealPercentage: { type: Number },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
