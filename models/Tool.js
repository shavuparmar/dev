import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['editor', 'version-control', 'api', 'database', 'design', 'testing', 'deployment', 'package-manager', 'documentation', 'performance', 'code-quality'],
    required: true 
  },
  free: { type: Boolean, default: true },
  rating: { type: Number, min: 1, max: 5 },
  popular: { type: Boolean, default: false },
  documentation: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, { timestamps: true });

const Tool = mongoose.model('Tool', toolSchema);
export default Tool;

