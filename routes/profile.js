import express from 'express'
import Profile from '../models/Profile.js'

const router = express.Router()

// GET /api/profile/:userId
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'username email')

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.json(profile)
  } catch (err) {
    console.error('Error fetching profile:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
