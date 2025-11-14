import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, default: 100 },
  attachments: [{
    filename: { type: String },
    fileUrl: { type: String },
    fileType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  }],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'completed', 'late'],
      default: 'pending',
    },
    attachments: [{
      filename: { type: String },
      fileUrl: { type: String },
      fileType: { type: String },
    }],
    marksObtained: { type: Number },
    feedback: { type: String, trim: true },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    gradedAt: { type: Date },
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Homework = mongoose.model('Homework', homeworkSchema);
export default Homework;

