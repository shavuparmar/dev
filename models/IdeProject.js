import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, default: '' },
  language: { type: String, default: 'plaintext' },
}, { _id: false });

const ideProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  files: { type: [fileSchema], default: [] },
  activeFile: { type: String, default: '' },
  collaborators: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
}, { timestamps: true });

export default mongoose.model('IdeProject', ideProjectSchema);


