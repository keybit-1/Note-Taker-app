document.addEventListener('DOMContentLoaded', function() {
    const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://ths-note-app-216bf97f5052.herokuapp.com';

    
    const noteTitle = document.querySelector('.note-title');
    const noteText = document.querySelector('.note-textarea');
    const saveNoteBtn = document.querySelector('#save-note');
    const newNoteBtn = document.querySelector('.new-note');
    const noteList = document.querySelector('.list-container .list-group');

    const fetchNotes = async () => {
        try {
            let response = await fetch(`${BASE_URL}/api/notes`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const postNote = async (note) => {
        try {
            await fetch(`${BASE_URL}/api/notes`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(note)
            });
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    const deleteNoteById = async (id) => {
        try {
            await fetch(`${BASE_URL}/api/notes/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleNoteView = (note) => {
        noteTitle.value = note.title;
        noteText.value = note.text;
    };

    const renderNotes = async () => {
        const notes = await fetchNotes();
        noteList.innerHTML = ''; // clear the note list

        notes.forEach(note => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.setAttribute('data-note', JSON.stringify(note));
            
            const noteTitleSpan = document.createElement('span');
            noteTitleSpan.textContent = note.title;
            li.appendChild(noteTitleSpan);
            
            const deleteBtn = document.createElement('span');
            deleteBtn.classList.add('delete-note');
            deleteBtn.textContent = ' X';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();  // Prevent triggering the li's click event
                await deleteNoteById(note.id);
                renderNotes();
            });

            li.appendChild(deleteBtn);

            // Making the entire list item clickable
            li.addEventListener('click', () => handleNoteView(note));

            noteList.appendChild(li);
        });
    };

    saveNoteBtn.addEventListener('click', async () => {
        const title = noteTitle.value.trim();
        const text = noteText.value.trim();

        if (title && text) {
            await postNote({ title, text });
            noteTitle.value = '';
            noteText.value = '';
            renderNotes();
        }
    });

    newNoteBtn.addEventListener('click', () => {
        noteTitle.value = '';
        noteText.value = '';
    });

    renderNotes();
});








