import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'absent',
  },
  notes: { type: String, trim: true },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
}, { timestamps: true });

// Compound index to prevent duplicate attendance records
attendanceSchema.index({ class: 1, student: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;

