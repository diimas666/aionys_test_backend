const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Памятка заметок
let notes = [
  {
    id: '1',
    title: 'Первая заметка',
    content: 'Текст заметки №1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Вторая заметка',
    content: 'Текст заметки №2',
    createdAt: new Date().toISOString(),
  },
];

// GET /notes — все заметки
app.get('/notes', (req, res) => {
  res.json(notes);
});

// GET /notes/:id — одна заметка
app.get('/notes/:id', (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Not Found' });
  res.json(note);
});

// POST /notes — создать заметку
app.post('/notes', (req, res) => {
  const { title, content } = req.body; // было { title, body }
  if (!title || !content)
    return res.status(400).json({ error: 'title and content are required' });

  const newNote = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  notes.unshift(newNote);
  res.status(201).json(newNote);
});

// PUT /notes/:id — обновить заметку (частично)
app.put('/notes/:id', (req, res) => {
  const { title, content } = req.body;
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Not Found' });

  note.title = title ?? note.title;
  note.content = content ?? note.content;
  res.json(note);
});

// DELETE /notes/:id — удалить заметку
app.delete('/notes/:id', (req, res) => {
  const before = notes.length;
  notes = notes.filter((n) => n.id !== req.params.id);
  if (notes.length === before)
    return res.status(404).json({ error: 'Not Found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
