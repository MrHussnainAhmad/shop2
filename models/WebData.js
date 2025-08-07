import mongoose from 'mongoose';

const WebDataSchema = new mongoose.Schema({
  aboutUs: { type: String, default: '' },
  terms: { type: String, default: '' },
  privacy: { type: String, default: '' },
  faqs: { type: String, default: '' },
  help: { type: String, default: '' },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  contactInfo: {
    visitUs: { type: String, default: '' },
    callUs: { type: String, default: '' },
    emailUs: { type: String, default: '' },
    workingHours: { type: String, default: '' },
  },
  logo: { type: String, default: '' },
  storeName: { type: String, default: '' },
}, { timestamps: true });

const WebData = mongoose.models.WebData || mongoose.model('WebData', WebDataSchema);

export default WebData;
