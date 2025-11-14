import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  category: {
    type: String,
    enum: ['notes', 'assignment', 'resource', 'announcement', 'other'],
    default: 'other',
  },
  isPublic: { type: Boolean, default: false },
  downloadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;

