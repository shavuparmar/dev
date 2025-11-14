import mongoose from 'mongoose';

const topicProgressSchema = new mongoose.Schema({
  track: { type: String, required: true }, // react/html/css/javascript
  completedTopicIds: { type: [String], default: [] },
}, { _id: false });

const learningProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tracks: { type: [topicProgressSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('LearningProgress', learningProgressSchema);


