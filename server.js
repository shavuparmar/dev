import express from 'express'; // ES module
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoClient, ObjectId } from 'mongodb';
import User from './models/User.js';
// Student/Teacher models - commented out as not used in main DevHubs platform
// import Student from './models/Student.js';
// import Teacher from './models/Teacher.js';
// import Class from './models/Class.js';
// import Attendance from './models/Attendance.js';
// import Homework from './models/Homework.js';
// import Document from './models/Document.js';
import API from './models/API.js';
import Tool from './models/Tool.js';
import Feedback from './models/Feedback.js';
import Topic from './models/Topic.js';
import Roadmap from './models/Roadmap.js';






import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Project from './models/Projects.js';
import Profile from './models/Profile.js';
import IdeProject from './models/IdeProject.js';
import LearningProgress from './models/LearningProgress.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET','POST']
  }
});
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'testDB';
const COLLECTION_NAME = 'participation';




const allowedOrigins = ['http://localhost:5173', 'https://dev-hubs.vercel.app'];
// Middleware
app.use(cors());
app.use(express.json());


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// --- Socket.IO for realtime collaboration ---
io.on('connection', (socket) => {
  socket.on('join-room', ({ projectId }) => {
    if (projectId) socket.join('proj_' + projectId);
  });
  socket.on('code-change', ({ projectId, fileName, content }) => {
    if (!projectId || !fileName) return;
    socket.to('proj_' + projectId).emit('remote-code-change', { fileName, content });
  });
});

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
mongoose
  .connect(MONGO_URI)
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

    const { role = 'user', firstName, lastName, phone, dateOfBirth, address, bio } = req.body;

    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      role: role || 'user',
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      bio,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
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
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({ 
      token, 
      user: { 
        id: user._id,
        _id: user._id,
        email: user.email, 
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        bio: user.bio,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change Password
app.post('/api/change-password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    if (!userId || !oldPassword || !newPassword) return res.status(400).json({ error: 'userId, oldPassword, newPassword required' });
    const user = await User.findById(userId).select('+password');
    if (!user || !user.password) return res.status(400).json({ error: 'Invalid user' });
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ error: 'Old password incorrect' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    await user.save();
    res.json({ success: true });
  } catch (e) {
    console.error('change-password error', e);
    res.status(500).json({ error: 'Server error' });
  }
});



// Profile routes
app.post('/api/profile', async (req, res) => {
  try {
    const { userId, avatar = '', bio = '', posts = [], followers = [], following = [], skills = [], projectLinks = [] } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { avatar, bio, posts, followers, following, skills, projectLinks },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    console.error('Profile create/update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update profile by user ID
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { avatar, bio, skills, projectLinks } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const updateData = {};
    if (avatar !== undefined) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (projectLinks !== undefined) updateData.projectLinks = projectLinks;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('user', 'username email firstName lastName');

    res.status(200).json(profile);
  } catch (err) {
    console.error('Update profile error:', err);
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

    const profile = await Profile.findOne({ user: userId }).populate('user', 'username email firstName lastName');

    if (!profile) {
      // Return empty profile structure if not found
      return res.json({
        user: userId,
        avatar: '',
        bio: '',
        posts: 0,
        followers: 0,
        following: 0,
        skills: [],
        projectLinks: []
      });
    }

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

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('GET /api/users/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }
    const updates = req.body;
    // Don't allow password updates through this endpoint
    delete updates.password;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('PUT /api/users/:id error:', err);
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

// ========== API MANAGEMENT ROUTES ==========

// GET all APIs with pagination
app.get('/api/apis', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const showAll = req.query.all === 'true'; // For admin to see all APIs
    
    const query = showAll ? {} : { isActive: true };
    
    const apis = await API.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await API.countDocuments(query);
    
    res.json({
      apis,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error('GET /api/apis error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET API by ID
app.get('/api/apis/:id', async (req, res) => {
  try {
    const apiId = req.params.id;
    if (!ObjectId.isValid(apiId)) {
      return res.status(400).json({ error: 'Invalid API ID' });
    }
    const api = await API.findById(apiId);
    if (!api) {
      return res.status(404).json({ error: 'API not found' });
    }
    res.json(api);
  } catch (err) {
    console.error('GET /api/apis/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create new API
app.post('/api/apis', async (req, res) => {
  try {
    const apiData = req.body;
    const newAPI = await API.create(apiData);
    res.status(201).json(newAPI);
  } catch (err) {
    console.error('POST /api/apis error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update API by ID
app.put('/api/apis/:id', async (req, res) => {
  try {
    const apiId = req.params.id;
    if (!ObjectId.isValid(apiId)) {
      return res.status(400).json({ error: 'Invalid API ID' });
    }
    const updates = req.body;
    const api = await API.findByIdAndUpdate(apiId, updates, { new: true, runValidators: true });
    if (!api) {
      return res.status(404).json({ error: 'API not found' });
    }
    res.json(api);
  } catch (err) {
    console.error('PUT /api/apis/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE API by ID
app.delete('/api/apis/:id', async (req, res) => {
  try {
    const apiId = req.params.id;
    if (!ObjectId.isValid(apiId)) {
      return res.status(400).json({ error: 'Invalid API ID' });
    }
    const deletedAPI = await API.findByIdAndDelete(apiId);
    if (!deletedAPI) {
      return res.status(404).json({ error: 'API not found' });
    }
    res.json({ message: 'API deleted successfully', api: deletedAPI });
  } catch (err) {
    console.error('DELETE /api/apis/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========== TOOL MANAGEMENT ROUTES ==========

// GET all Tools with pagination
app.get('/api/tools', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const showAll = req.query.all === 'true'; // For admin to see all tools
    
    const query = showAll ? {} : { isActive: true };
    
    const tools = await Tool.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Tool.countDocuments(query);
    
    res.json({
      tools,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error('GET /api/tools error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET Tool by ID
app.get('/api/tools/:id', async (req, res) => {
  try {
    const toolId = req.params.id;
    if (!ObjectId.isValid(toolId)) {
      return res.status(400).json({ error: 'Invalid Tool ID' });
    }
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (err) {
    console.error('GET /api/tools/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create new Tool
app.post('/api/tools', async (req, res) => {
  try {
    const toolData = req.body;
    const newTool = await Tool.create(toolData);
    res.status(201).json(newTool);
  } catch (err) {
    console.error('POST /api/tools error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update Tool by ID
app.put('/api/tools/:id', async (req, res) => {
  try {
    const toolId = req.params.id;
    if (!ObjectId.isValid(toolId)) {
      return res.status(400).json({ error: 'Invalid Tool ID' });
    }
    const updates = req.body;
    const tool = await Tool.findByIdAndUpdate(toolId, updates, { new: true, runValidators: true });
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (err) {
    console.error('PUT /api/tools/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE Tool by ID
app.delete('/api/tools/:id', async (req, res) => {
  try {
    const toolId = req.params.id;
    if (!ObjectId.isValid(toolId)) {
      return res.status(400).json({ error: 'Invalid Tool ID' });
    }
    const deletedTool = await Tool.findByIdAndDelete(toolId);
    if (!deletedTool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json({ message: 'Tool deleted successfully', tool: deletedTool });
  } catch (err) {
    console.error('DELETE /api/tools/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check for creator question
    const messageLower = message.toLowerCase();
    if (messageLower.includes('who made you') || messageLower.includes('who created you') || 
        messageLower.includes('who built you') || messageLower.includes('who developed you') ||
        messageLower.includes('who are you made by') || messageLower.includes('your creator')) {
      return res.json({
        reply: "I was made by Shavuparmar. He is the creator and developer of this DevHubs platform. I'm here to help you with coding questions and development tasks!",
        history: [...(history || []), { role: "user", content: message }, { role: "model", content: "I was made by Shavuparmar. He is the creator and developer of this DevHubs platform. I'm here to help you with coding questions and development tasks!" }],
      });
    }

    const STREAM_API_KEY = process.env.STREAM_API_KEY;
    if (!STREAM_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // System instruction for better responses
    const systemInstruction = {
      role: "user",
      parts: [{ text: "You are a helpful coding assistant for DevHubs platform. Provide clear, concise, and accurate answers about programming, web development, and software engineering. Always be friendly and professional." }]
    };

    // Build conversation with history
    const contents = [
      systemInstruction,
      ...(history || []).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || m.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${STREAM_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return res
        .status(500)
        .json({ error: data.error?.message || "Failed to get response" });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";

    res.json({
      reply,
      history: [...(history || []), { role: "user", content: message }, { role: "model", content: reply }],
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ========== FEEDBACK MANAGEMENT ROUTES ==========

// POST create feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const feedbackData = req.body;
    const newFeedback = await Feedback.create(feedbackData);
    res.status(201).json(newFeedback);
  } catch (err) {
    console.error('POST /api/feedback error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all feedback (admin only)
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'username email firstName lastName')
      .populate('resolvedBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error('GET /api/feedback error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET feedback by ID
app.get('/api/feedback/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    if (!ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid Feedback ID' });
    }
    const feedback = await Feedback.findById(feedbackId)
      .populate('user', 'username email firstName lastName')
      .populate('resolvedBy', 'username email');
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (err) {
    console.error('GET /api/feedback/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update feedback (admin only)
app.put('/api/feedback/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    if (!ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid Feedback ID' });
    }
    const updates = req.body;
    const feedback = await Feedback.findByIdAndUpdate(feedbackId, updates, { new: true, runValidators: true })
      .populate('user', 'username email firstName lastName')
      .populate('resolvedBy', 'username email');
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (err) {
    console.error('PUT /api/feedback/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    if (!ObjectId.isValid(feedbackId)) {
      return res.status(400).json({ error: 'Invalid Feedback ID' });
    }
    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
  } catch (err) {
    console.error('DELETE /api/feedback/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========== TOPIC MANAGEMENT ROUTES ==========

// GET all Topics with pagination
app.get('/api/topics', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const showAll = req.query.all === 'true'; // For admin to see all topics
    
    const query = showAll ? {} : { isActive: true };
    
    const topics = await Topic.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Topic.countDocuments(query);
    
    res.json({
      topics,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error('GET /api/topics error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET Topic by ID
app.get('/api/topics/:id', async (req, res) => {
  try {
    const topicId = req.params.id;
    if (!ObjectId.isValid(topicId)) {
      return res.status(400).json({ error: 'Invalid Topic ID' });
    }
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (err) {
    console.error('GET /api/topics/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create new Topic
app.post('/api/topics', async (req, res) => {
  try {
    const topicData = req.body;
    const newTopic = await Topic.create(topicData);
    res.status(201).json(newTopic);
  } catch (err) {
    console.error('POST /api/topics error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update Topic by ID
app.put('/api/topics/:id', async (req, res) => {
  try {
    const topicId = req.params.id;
    if (!ObjectId.isValid(topicId)) {
      return res.status(400).json({ error: 'Invalid Topic ID' });
    }
    const updates = req.body;
    const topic = await Topic.findByIdAndUpdate(topicId, updates, { new: true, runValidators: true });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (err) {
    console.error('PUT /api/topics/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE Topic by ID
app.delete('/api/topics/:id', async (req, res) => {
  try {
    const topicId = req.params.id;
    if (!ObjectId.isValid(topicId)) {
      return res.status(400).json({ error: 'Invalid Topic ID' });
    }
    const deletedTopic = await Topic.findByIdAndDelete(topicId);
    if (!deletedTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json({ message: 'Topic deleted successfully', topic: deletedTopic });
  } catch (err) {
    console.error('DELETE /api/topics/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========== ROADMAP MANAGEMENT ROUTES ==========

// GET all Roadmaps with pagination
app.get('/api/roadmaps', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const showAll = req.query.all === 'true'; // For admin to see all roadmaps
    
    const query = showAll ? {} : { isActive: true };
    
    const roadmaps = await Roadmap.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Roadmap.countDocuments(query);
    
    res.json({
      roadmaps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error('GET /api/roadmaps error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET Roadmap by ID
app.get('/api/roadmaps/:id', async (req, res) => {
  try {
    const roadmapId = req.params.id;
    if (!ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid Roadmap ID' });
    }
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    res.json(roadmap);
  } catch (err) {
    console.error('GET /api/roadmaps/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create new Roadmap
app.post('/api/roadmaps', async (req, res) => {
  try {
    const roadmapData = req.body;
    const newRoadmap = await Roadmap.create(roadmapData);
    res.status(201).json(newRoadmap);
  } catch (err) {
    console.error('POST /api/roadmaps error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update Roadmap by ID
app.put('/api/roadmaps/:id', async (req, res) => {
  try {
    const roadmapId = req.params.id;
    if (!ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid Roadmap ID' });
    }
    const updates = req.body;
    const roadmap = await Roadmap.findByIdAndUpdate(roadmapId, updates, { new: true, runValidators: true });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    res.json(roadmap);
  } catch (err) {
    console.error('PUT /api/roadmaps/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE Roadmap by ID
app.delete('/api/roadmaps/:id', async (req, res) => {
  try {
    const roadmapId = req.params.id;
    if (!ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid Roadmap ID' });
    }
    const deletedRoadmap = await Roadmap.findByIdAndDelete(roadmapId);
    if (!deletedRoadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    res.json({ message: 'Roadmap deleted successfully', roadmap: deletedRoadmap });
  } catch (err) {
    console.error('DELETE /api/roadmaps/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Assuming you have a User model with a delete method, e.g., Mongoose or any DB
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- IDE Project CRUD (save/share/load) ---
app.post('/api/ide/projects', async (req, res) => {
  try {
    const { ownerId, name, files, activeFile, collaborators = [] } = req.body;
    if (!ownerId || !name) return res.status(400).json({ error: 'ownerId and name are required' });
    const doc = await IdeProject.create({ owner: ownerId, name, files, activeFile, collaborators });
    res.status(201).json(doc);
  } catch (e) {
    console.error('Create IDE project error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/ide/projects/:id', async (req, res) => {
  try {
    const doc = await IdeProject.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/ide/projects/:id', async (req, res) => {
  try {
    const { name, files, activeFile, collaborators } = req.body;
    const doc = await IdeProject.findByIdAndUpdate(
      req.params.id,
      { $set: { name, files, activeFile, collaborators } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Learning Progress ---
app.get('/api/learning/progress/:userId', async (req, res) => {
  try {
    const doc = await LearningProgress.findOne({ user: req.params.userId });
    res.json(doc || { user: req.params.userId, tracks: [] });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/learning/progress', async (req, res) => {
  try {
    const { userId, track, topicId } = req.body;
    if (!userId || !track || !topicId) return res.status(400).json({ error: 'userId, track, topicId required' });
    let doc = await LearningProgress.findOne({ user: userId });
    if (!doc) doc = await LearningProgress.create({ user: userId, tracks: [] });
    const t = doc.tracks.find(x => x.track === track);
    if (t) {
      if (!t.completedTopicIds.includes(topicId)) t.completedTopicIds.push(topicId);
    } else {
      doc.tracks.push({ track, completedTopicIds: [topicId] });
    }
    await doc.save();
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== STUDENT/TEACHER PROFILE ROUTES ====================
// NOTE: These routes are commented out as they're not part of the main DevHubs platform
// Uncomment if you need student/teacher functionality

/*
// Get student profile
app.get('/api/student/:userId', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.userId })
      .populate('user', 'username email firstName lastName phone dateOfBirth')
      .populate('enrolledClasses')
      .populate('attendanceRecords')
      .populate('homeworkSubmissions');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get teacher profile
app.get('/api/teacher/:userId', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.params.userId })
      .populate('user', 'username email firstName lastName phone')
      .populate('classes');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update student profile
app.put('/api/student/:userId', async (req, res) => {
  try {
    const { parentName, parentPhone, address, grade } = req.body;
    const student = await Student.findOneAndUpdate(
      { user: req.params.userId },
      { $set: { parentName, parentPhone, address, grade } },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update teacher profile
app.put('/api/teacher/:userId', async (req, res) => {
  try {
    const { subjects, qualification, experience, bio, department } = req.body;
    const teacher = await Teacher.findOneAndUpdate(
      { user: req.params.userId },
      { $set: { subjects, qualification, experience, bio, department } },
      { new: true }
    );
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CLASS ROUTES ====================

// Create class (teacher only)
app.post('/api/classes', async (req, res) => {
  try {
    const { teacherId, className, subject, schedule, roomNumber, description } = req.body;
    if (!teacherId || !className || !subject) {
      return res.status(400).json({ error: 'teacherId, className, and subject are required' });
    }

    const teacher = await Teacher.findOne({ user: teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const classCode = 'CLS' + Date.now().toString().slice(-8);
    const newClass = await Class.create({
      className,
      classCode,
      teacher: teacher._id,
      subject,
      schedule,
      roomNumber,
      description,
    });

    await Teacher.findByIdAndUpdate(teacher._id, { $push: { classes: newClass._id } });

    res.status(201).json(newClass);
  } catch (e) {
    console.error('Create class error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all classes for a teacher
app.get('/api/classes/teacher/:teacherId', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.params.teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const classes = await Class.find({ teacher: teacher._id })
      .populate('students', 'studentId')
      .populate('teacher')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all classes for a student
app.get('/api/classes/student/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const classes = await Class.find({ _id: { $in: student.enrolledClasses } })
      .populate('teacher')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get class by ID
app.get('/api/classes/:classId', async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId)
      .populate('teacher')
      .populate('students');
    if (!classData) return res.status(404).json({ error: 'Class not found' });
    res.json(classData);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Enroll student in class
app.post('/api/classes/:classId/enroll', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findOne({ user: studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const classData = await Class.findById(req.params.classId);
    if (!classData) return res.status(404).json({ error: 'Class not found' });

    if (!classData.students.includes(student._id)) {
      classData.students.push(student._id);
      await classData.save();
    }

    if (!student.enrolledClasses.includes(classData._id)) {
      student.enrolledClasses.push(classData._id);
      await student.save();
    }

    res.json({ message: 'Student enrolled successfully', class: classData });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove student from class
app.delete('/api/classes/:classId/students/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const classData = await Class.findById(req.params.classId);
    if (!classData) return res.status(404).json({ error: 'Class not found' });

    classData.students = classData.students.filter(s => !s.equals(student._id));
    await classData.save();

    student.enrolledClasses = student.enrolledClasses.filter(c => !c.equals(classData._id));
    await student.save();

    res.json({ message: 'Student removed from class' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update class
app.put('/api/classes/:classId', async (req, res) => {
  try {
    const { className, subject, schedule, roomNumber, description, isActive } = req.body;
    const classData = await Class.findByIdAndUpdate(
      req.params.classId,
      { $set: { className, subject, schedule, roomNumber, description, isActive } },
      { new: true }
    );
    if (!classData) return res.status(404).json({ error: 'Class not found' });
    res.json(classData);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete class
app.delete('/api/classes/:classId', async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.classId);
    res.json({ message: 'Class deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ATTENDANCE ROUTES ====================

// Mark attendance (teacher only)
app.post('/api/attendance', async (req, res) => {
  try {
    const { classId, studentId, date, status, notes, teacherId } = req.body;
    if (!classId || !studentId || !date || !status) {
      return res.status(400).json({ error: 'classId, studentId, date, and status are required' });
    }

    const student = await Student.findOne({ user: studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const teacher = await Teacher.findOne({ user: teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      class: classId,
      student: student._id,
      date: attendanceDate,
    });

    if (attendance) {
      attendance.status = status;
      attendance.notes = notes;
      attendance.markedBy = teacher._id;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        class: classId,
        student: student._id,
        date: attendanceDate,
        status,
        notes,
        markedBy: teacher._id,
      });

      if (!student.attendanceRecords.includes(attendance._id)) {
        student.attendanceRecords.push(attendance._id);
        await student.save();
      }
    }

    res.status(201).json(attendance);
  } catch (e) {
    console.error('Mark attendance error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark multiple attendance (bulk)
app.post('/api/attendance/bulk', async (req, res) => {
  try {
    const { classId, attendances, teacherId } = req.body;
    if (!classId || !attendances || !Array.isArray(attendances) || !teacherId) {
      return res.status(400).json({ error: 'classId, attendances array, and teacherId are required' });
    }

    const teacher = await Teacher.findOne({ user: teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const attendanceDate = new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];

    for (const att of attendances) {
      const student = await Student.findOne({ user: att.studentId });
      if (!student) continue;

      let attendance = await Attendance.findOne({
        class: classId,
        student: student._id,
        date: attendanceDate,
      });

      if (attendance) {
        attendance.status = att.status;
        attendance.notes = att.notes;
        attendance.markedBy = teacher._id;
        await attendance.save();
        results.push(attendance);
      } else {
        attendance = await Attendance.create({
          class: classId,
          student: student._id,
          date: attendanceDate,
          status: att.status,
          notes: att.notes,
          markedBy: teacher._id,
        });

        if (!student.attendanceRecords.includes(attendance._id)) {
          student.attendanceRecords.push(attendance._id);
          await student.save();
        }

        results.push(attendance);
      }
    }

    res.status(201).json({ message: 'Attendance marked successfully', attendances: results });
  } catch (e) {
    console.error('Bulk attendance error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get attendance for a class
app.get('/api/attendance/class/:classId', async (req, res) => {
  try {
    const { date } = req.query;
    const query = { class: req.params.classId };
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      query.date = attendanceDate;
    }

    const attendances = await Attendance.find(query)
      .populate('student')
      .populate('markedBy')
      .sort({ date: -1, createdAt: -1 });
    res.json(attendances);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get attendance for a student
app.get('/api/attendance/student/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const attendances = await Attendance.find({ student: student._id })
      .populate('class')
      .sort({ date: -1 });
    res.json(attendances);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== HOMEWORK ROUTES ====================

// Create homework (teacher only)
app.post('/api/homework', async (req, res) => {
  try {
    const { teacherId, classId, title, description, dueDate, maxMarks, attachments } = req.body;
    if (!teacherId || !classId || !title || !dueDate) {
      return res.status(400).json({ error: 'teacherId, classId, title, and dueDate are required' });
    }

    const teacher = await Teacher.findOne({ user: teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const homework = await Homework.create({
      title,
      description,
      class: classId,
      teacher: teacher._id,
      dueDate: new Date(dueDate),
      maxMarks: maxMarks || 100,
      attachments: attachments || [],
    });

    res.status(201).json(homework);
  } catch (e) {
    console.error('Create homework error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all homework for a class
app.get('/api/homework/class/:classId', async (req, res) => {
  try {
    const homeworks = await Homework.find({ class: req.params.classId })
      .populate('teacher')
      .populate('submissions.student')
      .sort({ dueDate: -1 });
    res.json(homeworks);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all homework for a student
app.get('/api/homework/student/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const homeworks = await Homework.find({
      class: { $in: student.enrolledClasses },
    })
      .populate('class')
      .populate('teacher')
      .sort({ dueDate: -1 });

    // Add submission status for each homework
    const homeworksWithStatus = homeworks.map(hw => {
      const submission = hw.submissions.find(s => s.student.equals(student._id));
      return {
        ...hw.toObject(),
        submissionStatus: submission ? submission.status : 'pending',
        submission: submission || null,
      };
    });

    res.json(homeworksWithStatus);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get homework by ID
app.get('/api/homework/:homeworkId', async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.homeworkId)
      .populate('teacher')
      .populate('class')
      .populate('submissions.student')
      .populate('submissions.gradedBy');
    if (!homework) return res.status(404).json({ error: 'Homework not found' });
    res.json(homework);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit homework (student)
app.post('/api/homework/:homeworkId/submit', async (req, res) => {
  try {
    const { studentId, attachments } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const student = await Student.findOne({ user: studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const homework = await Homework.findById(req.params.homeworkId);
    if (!homework) return res.status(404).json({ error: 'Homework not found' });

    const now = new Date();
    const dueDate = new Date(homework.dueDate);
    const status = now > dueDate ? 'late' : 'submitted';

    const existingSubmission = homework.submissions.find(s => s.student.equals(student._id));

    if (existingSubmission) {
      existingSubmission.attachments = attachments || [];
      existingSubmission.submittedAt = now;
      existingSubmission.status = status;
      await homework.save();
      res.json({ message: 'Homework updated successfully', submission: existingSubmission });
    } else {
      const newSubmission = {
        student: student._id,
        submittedAt: now,
        status,
        attachments: attachments || [],
      };
      homework.submissions.push(newSubmission);
      await homework.save();

      if (!student.homeworkSubmissions.includes(homework._id)) {
        student.homeworkSubmissions.push(homework._id);
        await student.save();
      }

      res.status(201).json({ message: 'Homework submitted successfully', submission: newSubmission });
    }
  } catch (e) {
    console.error('Submit homework error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Grade homework (teacher)
app.put('/api/homework/:homeworkId/grade/:studentId', async (req, res) => {
  try {
    const { teacherId, marksObtained, feedback } = req.body;
    if (!teacherId || marksObtained === undefined) {
      return res.status(400).json({ error: 'teacherId and marksObtained are required' });
    }

    const teacher = await Teacher.findOne({ user: teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const student = await Student.findOne({ user: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const homework = await Homework.findById(req.params.homeworkId);
    if (!homework) return res.status(404).json({ error: 'Homework not found' });

    const submission = homework.submissions.find(s => s.student.equals(student._id));
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    submission.marksObtained = marksObtained;
    submission.feedback = feedback;
    submission.status = 'completed';
    submission.gradedBy = teacher._id;
    submission.gradedAt = new Date();

    await homework.save();
    res.json({ message: 'Homework graded successfully', submission });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update homework
app.put('/api/homework/:homeworkId', async (req, res) => {
  try {
    const { title, description, dueDate, maxMarks, attachments, isActive } = req.body;
    const homework = await Homework.findByIdAndUpdate(
      req.params.homeworkId,
      { $set: { title, description, dueDate, maxMarks, attachments, isActive } },
      { new: true }
    );
    if (!homework) return res.status(404).json({ error: 'Homework not found' });
    res.json(homework);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete homework
app.delete('/api/homework/:homeworkId', async (req, res) => {
  try {
    await Homework.findByIdAndDelete(req.params.homeworkId);
    res.json({ message: 'Homework deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== DOCUMENT ROUTES ====================

// Upload document (teacher only) - Note: For file uploads, you'll need multer
// For now, we'll accept fileUrl as a string
app.post('/api/documents', async (req, res) => {
  try {
    const { teacherId, classId, title, description, filename, fileUrl, fileType, fileSize, category } = req.body;
    if (!teacherId || !classId || !title || !filename || !fileUrl) {
      return res.status(400).json({ error: 'teacherId, classId, title, filename, and fileUrl are required' });
    }

    const teacher = await Teacher.findOne({ user: teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const document = await Document.create({
      title,
      description,
      filename,
      fileUrl,
      fileType: fileType || 'application/octet-stream',
      fileSize,
      uploadedBy: teacher._id,
      class: classId,
      category: category || 'other',
    });

    res.status(201).json(document);
  } catch (e) {
    console.error('Upload document error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all documents for a class
app.get('/api/documents/class/:classId', async (req, res) => {
  try {
    const documents = await Document.find({ class: req.params.classId })
      .populate('uploadedBy')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all documents for a student (from their enrolled classes)
app.get('/api/documents/student/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const documents = await Document.find({
      class: { $in: student.enrolledClasses },
    })
      .populate('uploadedBy')
      .populate('class')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get document by ID
app.get('/api/documents/:documentId', async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId)
      .populate('uploadedBy')
      .populate('class');
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(document);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete document
app.delete('/api/documents/:documentId', async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.documentId);
    res.json({ message: 'Document deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Track document download
app.post('/api/documents/:documentId/download', async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const student = await Student.findOne({ user: studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const document = await Document.findById(req.params.documentId);
    if (!document) return res.status(404).json({ error: 'Document not found' });

    if (!document.downloadedBy.includes(student._id)) {
      document.downloadedBy.push(student._id);
      await document.save();
    }

    res.json({ message: 'Download tracked', document });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
*/

// ==================== DEMO APIs ====================
// In-memory data storage for demo APIs
let demoUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-01-16' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: '2024-01-17' }
];

let demoProducts = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 50, description: 'High-performance laptop' },
  { id: 2, name: 'Phone', price: 699.99, category: 'Electronics', stock: 100, description: 'Latest smartphone' },
  { id: 3, name: 'Headphones', price: 199.99, category: 'Electronics', stock: 75, description: 'Wireless headphones' }
];

let demoCart = [];

let demoImages = [
  { id: 1, url: 'https://picsum.photos/400/300?random=1', title: 'Sunset', size: '2.5MB', uploadedAt: '2024-01-15' },
  { id: 2, url: 'https://picsum.photos/400/300?random=2', title: 'Mountain', size: '3.1MB', uploadedAt: '2024-01-16' }
];

let demoMessages = [
  { id: 1, sender: 'User1', text: 'Hello!', timestamp: '2024-01-15T10:00:00Z' },
  { id: 2, sender: 'User2', text: 'Hi there!', timestamp: '2024-01-15T10:01:00Z' }
];

let demoLocations = [
  { id: 1, name: 'New York', lat: 40.7128, lng: -74.0060, type: 'city' },
  { id: 2, name: 'Los Angeles', lat: 34.0522, lng: -118.2437, type: 'city' },
  { id: 3, name: 'Chicago', lat: 41.8781, lng: -87.6298, type: 'city' }
];

let demoAnalytics = {
  totalUsers: 1250,
  activeUsers: 850,
  pageViews: 15000,
  revenue: 45000,
  lastUpdated: new Date().toISOString()
};

// User Management API
app.get('/api/demo/users', (req, res) => {
  res.json({ users: demoUsers, count: demoUsers.length });
});

app.get('/api/demo/users/:id', (req, res) => {
  const user = demoUsers.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/demo/users', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = {
    id: demoUsers.length + 1,
    name,
    email,
    role: role || 'user',
    createdAt: new Date().toISOString().split('T')[0]
  };
  demoUsers.push(newUser);
  res.status(201).json({ ...newUser, message: 'User created successfully' });
});

app.put('/api/demo/users/:id', (req, res) => {
  const userIndex = demoUsers.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  demoUsers[userIndex] = { ...demoUsers[userIndex], ...req.body };
  res.json({ ...demoUsers[userIndex], message: 'User updated successfully' });
});

app.delete('/api/demo/users/:id', (req, res) => {
  const userIndex = demoUsers.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  demoUsers.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// E-Commerce API
app.get('/api/demo/products', (req, res) => {
  res.json({ products: demoProducts, count: demoProducts.length });
});

app.get('/api/demo/products/:id', (req, res) => {
  const product = demoProducts.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/demo/products', (req, res) => {
  const { name, price, category, stock, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  const newProduct = {
    id: demoProducts.length + 1,
    name,
    price: parseFloat(price),
    category: category || 'General',
    stock: stock || 0,
    description: description || ''
  };
  demoProducts.push(newProduct);
  res.status(201).json({ ...newProduct, message: 'Product created successfully' });
});

app.post('/api/demo/cart', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'productId and quantity are required' });
  }
  const product = demoProducts.find(p => p.id === parseInt(productId));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  const cartItem = { productId: parseInt(productId), quantity: parseInt(quantity), product };
  demoCart.push(cartItem);
  const total = demoCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  res.status(201).json({
    cartId: 'cart_' + Date.now(),
    items: demoCart,
    total: total.toFixed(2)
  });
});

// Image Gallery API
app.get('/api/demo/images', (req, res) => {
  res.json({ images: demoImages, count: demoImages.length });
});

app.get('/api/demo/images/:id', (req, res) => {
  const image = demoImages.find(img => img.id === parseInt(req.params.id));
  if (!image) return res.status(404).json({ error: 'Image not found' });
  res.json(image);
});

app.post('/api/demo/images', (req, res) => {
  const { title, file } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newImage = {
    id: demoImages.length + 1,
    url: 'https://picsum.photos/400/300?random=' + (demoImages.length + 1),
    title,
    size: '2.8MB',
    uploadedAt: new Date().toISOString().split('T')[0]
  };
  demoImages.push(newImage);
  res.status(201).json({ ...newImage, message: 'Image uploaded successfully' });
});

app.delete('/api/demo/images/:id', (req, res) => {
  const imageIndex = demoImages.findIndex(img => img.id === parseInt(req.params.id));
  if (imageIndex === -1) return res.status(404).json({ error: 'Image not found' });
  demoImages.splice(imageIndex, 1);
  res.json({ message: 'Image deleted successfully' });
});

// Chat/Messaging API
app.get('/api/demo/messages', (req, res) => {
  res.json({ messages: demoMessages, count: demoMessages.length });
});

app.get('/api/demo/messages/:id', (req, res) => {
  const message = demoMessages.find(m => m.id === parseInt(req.params.id));
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json(message);
});

app.post('/api/demo/messages', (req, res) => {
  const { sender, text } = req.body;
  if (!sender || !text) {
    return res.status(400).json({ error: 'Sender and text are required' });
  }
  const newMessage = {
    id: demoMessages.length + 1,
    sender,
    text,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  demoMessages.push(newMessage);
  res.status(201).json(newMessage);
});

app.delete('/api/demo/messages/:id', (req, res) => {
  const messageIndex = demoMessages.findIndex(m => m.id === parseInt(req.params.id));
  if (messageIndex === -1) return res.status(404).json({ error: 'Message not found' });
  demoMessages.splice(messageIndex, 1);
  res.json({ message: 'Message deleted successfully' });
});

// Location/Map API
app.get('/api/demo/locations', (req, res) => {
  res.json({ locations: demoLocations, count: demoLocations.length });
});

app.get('/api/demo/locations/:id', (req, res) => {
  const location = demoLocations.find(l => l.id === parseInt(req.params.id));
  if (!location) return res.status(404).json({ error: 'Location not found' });
  res.json(location);
});

app.post('/api/demo/locations/search', (req, res) => {
  const { query, lat, lng, radius } = req.body;
  // Simulate search results
  const results = [
    { id: 1, name: 'Restaurant A', distance: 500, rating: 4.5, lat: 40.7128, lng: -74.0060 },
    { id: 2, name: 'Restaurant B', distance: 1200, rating: 4.8, lat: 40.7130, lng: -74.0065 },
    { id: 3, name: 'Cafe C', distance: 800, rating: 4.2, lat: 40.7125, lng: -74.0055 }
  ];
  res.json({ query: query || 'restaurant', results, count: results.length });
});

// Analytics API
app.get('/api/demo/analytics', (req, res) => {
  // Simulate some variation
  const analytics = {
    ...demoAnalytics,
    totalUsers: demoAnalytics.totalUsers + Math.floor(Math.random() * 10),
    activeUsers: demoAnalytics.activeUsers + Math.floor(Math.random() * 5),
    pageViews: demoAnalytics.pageViews + Math.floor(Math.random() * 100),
    lastUpdated: new Date().toISOString()
  };
  res.json(analytics);
});

app.post('/api/demo/analytics/events', (req, res) => {
  const { event, userId, timestamp } = req.body;
  if (!event) {
    return res.status(400).json({ error: 'Event is required' });
  }
  res.status(201).json({
    eventId: 'evt_' + Date.now(),
    event,
    userId: userId || null,
    timestamp: timestamp || new Date().toISOString(),
    status: 'tracked',
    message: 'Event tracked successfully'
  });
});

httpServer.listen(PORT, () => { console.log(`🚀 Server running on http://localhost:${PORT}`); });


