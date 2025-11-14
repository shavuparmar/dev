import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  avatar: String,
  bio: String,
  posts: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  skills: [{ type: String, trim: true }],
  projectLinks: [{
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    technologies: [{ type: String, trim: true }]
  }],
}, { timestamps: true })

const Profile = mongoose.model('Profile', profileSchema)

export default Profile
