const express = require('express');
const router = express.Router();
const ForumEntry = require('../models/ForumEntry');

// Create new entry
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newEntry = new ForumEntry({ name, email, message });
    await newEntry.save();
    res.status(201).json({ result: 'success', data: newEntry });
  } catch (error) {
    res.status(500).json({ result: 'error', message: error.message });
  }
});

// Get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await ForumEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ result: 'error', message: error.message });
  }
});

// Update an entry by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedEntry = await ForumEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEntry) return res.status(404).json({ result: 'error', message: 'Entry not found' });
    res.json({ result: 'success', data: updatedEntry });
  } catch (error) {
    res.status(500).json({ result: 'error', message: error.message });
  }
});

// Delete an entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEntry = await ForumEntry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ result: 'error', message: 'Entry not found' });
    res.json({ result: 'success', message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ result: 'error', message: error.message });
  }
});

module.exports = router;
