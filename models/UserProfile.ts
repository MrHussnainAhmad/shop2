import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true, sparse: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, sparse: true },
  phone: { type: String },
  addresses: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);