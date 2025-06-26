import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'testDB';
const COLLECTION_NAME = 'participation';

// Safety check for MONGO_URI
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Please check your .env file or environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

let db;
let collection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    console.log(`✅ Connected to MongoDB at ${MONGO_URI}, DB: ${DB_NAME}`);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// Connect to MongoDB
connectDB();

// Routes

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
