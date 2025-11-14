import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['development', 'design', 'data-science', 'ai-ml', 'devops', 'mobile', 'web', 'other'],
    required: true 
  },
  steps: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    resources: [{ type: String }],
    order: { type: Number, default: 0 }
  }],
  estimatedDuration: { type: String },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isActive: { type: Boolean, default: true },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, { timestamps: true });

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;

