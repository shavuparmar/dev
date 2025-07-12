import express from 'express'; // ES module
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoClient, ObjectId } from 'mongodb';
import User from './models/User.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Project from './models/Projects.js';
import Profile from './models/Profile.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'testDB';
const COLLECTION_NAME = 'participation';

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'https://dev-hubs-iq0k0m3xi-shavuparmars-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// MongoClient connection for participation collection
let db;
let collection;

async function connectMongoClient() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);
  console.log(`🗂️  Connected to MongoDB via MongoClient: DB ${DB_NAME}`);
}

connectMongoClient().catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Mongoose connection for User auth
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Mongoose connected'))
  .catch((err) => {
    console.error('❌ Mongoose connection error:', err);
    process.exit(1);
  });

// -------- PARTICIPATION ROUTES --------
app.post('/entries', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newEntry = { name, email, message, createdAt: new Date() };
    const result = await collection.insertOne(newEntry);
    res.status(201).json({ result: 'success', id: result.insertedId });
  } catch (error) {
    console.error('POST /entries error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/entries', async (req, res) => {
  try {
    const entries = await collection.find().sort({ createdAt: -1 }).toArray();
    res.json(entries);
  } catch (error) {
    console.error('GET /entries error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/entries/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, message } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }

    const updateDoc = {};
    if (name) updateDoc.name = name;
    if (email) updateDoc.email = email;
    if (message) updateDoc.message = message;

    if (Object.keys(updateDoc).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ result: 'success' });
  } catch (error) {
    console.error('PUT /entries/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/entries/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ result: 'success' });
  } catch (error) {
    console.error('DELETE /entries/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -------- AUTH ROUTES --------

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists by email OR username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({ error: 'Email or username and password are required' });
    }

    // Build query to match either email or username
    const query = {};
    if (email) query.email = email;
    if (username) query.username = username;

    // Find user by email OR username and include password for comparison
    const user = await User.findOne({
      $or: [
        email ? { email } : null,
        username ? { username } : null,
      ].filter(Boolean)
    }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(500).json({ error: 'User password not found. Contact support.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Profile routes
app.post('/api/profile', async (req, res) => {
  try {
    const { userId, avatar, bio, posts, followers, following } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { avatar, bio, posts, followers, following },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    console.error('Profile create/update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get profile by user ID
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const profile = await Profile.findOne({ user: userId }).populate('user', 'username email');

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Submit a project 
app.post('/api/project-submissions', async (req, res) => {
  try {
    const { projectName, description, projectLink, techStack } = req.body;

    if (!projectName || !description || !projectLink) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProject = new Project({
      projectName,
      description,
      projectLink,
      techStack,
   
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error('POST /api/project-submissions error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/project-submissions', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('GET /api/project-submissions error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all users (sorted by newest)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (err) {
    console.error(`DELETE /api/users/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});