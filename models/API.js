import mongoose from 'mongoose';

const apiSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['weather', 'location', 'news', 'media', 'finance', 'social', 'developer', 'text', 'ai', 'communication', 'ecommerce', 'analytics', 'entertainment', 'utility'],
    required: true 
  },
  method: { 
    type: String, 
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    default: 'GET' 
  },
  authRequired: { type: Boolean, default: false },
  free: { type: Boolean, default: true },
  rating: { type: Number, min: 1, max: 5 },
  documentation: { type: String, trim: true },
  exampleCode: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, { timestamps: true });

const API = mongoose.model('API', apiSchema);
export default API;

