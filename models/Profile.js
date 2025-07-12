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
}, { timestamps: true })

const Profile = mongoose.model('Profile', profileSchema)

export default Profile
