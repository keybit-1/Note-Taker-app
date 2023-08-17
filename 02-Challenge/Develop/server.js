const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Importing the CORS middleware

const app = express();

app.use(cors());  // Using CORS middleware to handle cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});


app.get('/api/notes', (req, res) => {
    try {
        const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
        res.json(notes);
    } catch (error) {
        console.error('Error reading notes:', error);
        res.status(500).send('Internal server error.');
    }
});

app.post('/api/notes', (req, res) => {
    try {
        let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
        const newNote = { ...req.body, id: Date.now().toString() };
        notes.push(newNote);
        fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2));
        res.json(newNote);
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).send('Internal server error.');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    try {
        let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
        notes = notes.filter(note => note.id !== req.params.id);
        fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2));
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).send('Internal server error.');
    }
});



