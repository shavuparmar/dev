import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  projectLink: { type: String, required: true },
  techStack: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);