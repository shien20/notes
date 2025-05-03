const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Note = require('./models/Note');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Create a note
app.post('/api/notes', async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);

app.delete('/api/notes/:id', async (req, res) => {
    try {
      const deletedNote = await Note.findByIdAndDelete(req.params.id);
      if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json({ message: 'Note deleted' });
    } catch (err) {
      console.error("Error deleting note:", err);
      res.status(500).json({ message: 'Error deleting note', error: err.message });
    }
  });

app.put('/api/notes/:id', async (req, res) => {
try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
    req.params.id, 
    { title, content }, 
    { new: true }  // Return the updated note
    );

    if (!updatedNote) {
    return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote); // Send back the updated note
} catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: 'Error updating note', error: err.message });
}
});
  