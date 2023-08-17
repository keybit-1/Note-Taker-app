const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    const newNote = { ...req.body, id: Date.now().toString() };
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2));
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    notes = notes.filter(note => note.id !== req.params.id);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2));
    res.sendStatus(200);
});


