import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  studentId: { type: String, unique: true, trim: true },
  enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  attendanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
  homeworkSubmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Homework' }],
  parentName: { type: String, trim: true },
  parentPhone: { type: String, trim: true },
  address: { type: String, trim: true },
  grade: { type: String, trim: true },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;

