import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  teacherId: { type: String, unique: true, trim: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  subjects: [{ type: String, trim: true }],
  qualification: { type: String, trim: true },
  experience: { type: Number, default: 0 },
  bio: { type: String, trim: true },
  department: { type: String, trim: true },
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;

