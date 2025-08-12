require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

//  MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Модель заметки
const noteSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});
const Note = mongoose.model('Note', noteSchema);

app.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

app.get('/notes/:id', async (req, res) => {
  const note = await Note.findOne({ id: req.params.id });
  if (!note) return res.status(404).json({ error: 'Not Found' });
  res.json(note);
});

app.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: 'title and content are required' });

  const newNote = new Note({ title, content });
  await newNote.save();
  res.status(201).json(newNote);
});

app.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate(
    { id: req.params.id },
    { $set: { title, content } },
    { new: true }
  );
  if (!note) return res.status(404).json({ error: 'Not Found' });
  res.json(note);
});

app.delete('/notes/:id', async (req, res) => {
  const result = await Note.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0)
    return res.status(404).json({ error: 'Not Found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
