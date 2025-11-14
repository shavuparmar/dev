import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['programming', 'web-development', 'mobile-development', 'data-science', 'ai-ml', 'devops', 'design', 'other'],
    required: true 
  },
  lessons: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    duration: { type: String },
    order: { type: Number, default: 0 }
  }],
  isActive: { type: Boolean, default: true },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;

