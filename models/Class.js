import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  className: { type: String, required: true, trim: true },
  classCode: { type: String, unique: true, required: true, trim: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  subject: { type: String, required: true, trim: true },
  schedule: {
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: { type: String },
    endTime: { type: String },
  },
  roomNumber: { type: String, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);
export default Class;

