import React from 'react'
import './App.css'
import plusSign from './assets/plus-sign.svg'
import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios'

const App = () => {

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('https://notes-y675.onrender.com/api/notes');
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to load notes", err);
      }
    };
  
    fetchNotes();
  }, []);


  // To store notes
  const [notes, setNotes] = useState([]);

  // To control open and close add-note-details
  const [showNoteBox, setShowNoteBox] = useState(false);

  // Edit Note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editIndex, setEditIndex] = useState(null); // null = adding new note, number = editing existing index of note

  // to hide and show the add note box
  const displayAddNoteDetails = () => {
    setShowNoteBox(prev => !prev);
  };
  
  // Close Button
  const closeNoteDetails = () => {
    setShowNoteBox(false);

    // reset state
    setNoteTitle('');
    setNoteContent('');
    setEditIndex(null);
  };

  // ADDING NOTES LOGIC
  const handleNote = async () => {
    const newNote = {
      title: noteTitle,
      content: noteContent
    };
  
    if (editIndex !== null) {
      // Edit existing note
      try {
        const noteId = notes[editIndex]._id;  // Get the ID of the note being edited
        await axios.put(`https://notes-y675.onrender.com/api/notes/${noteId}`, newNote);
  
        // Update the local state with the edited note
        setNotes(prevNotes => {
          const updatedNotes = [...prevNotes];
          updatedNotes[editIndex] = { ...updatedNotes[editIndex], ...newNote }; // Update the note
          return updatedNotes;
        });
  
      } catch (err) {
        alert('Failed to update note: ' + err.message);
      }
    } else {
      // Add new note
      try {
        const res = await axios.post('https://notes-y675.onrender.com/api/notes', newNote);
        setNotes(prev => [...prev, res.data]); // Add the new note to the list
      } catch (err) {
        alert('Failed to save note: ' + err.message);
      }
    }
  
    // Reset form after submission
    setNoteTitle('');
    setNoteContent('');
    setEditIndex(null);
    closeNoteDetails();
  };
  
  // Delete Note
  const deleteNote = async (indexToDelete) => {
    const noteId = notes[indexToDelete]._id;

    try {
      await axios.delete(`https://notes-y675.onrender.com/api/notes/${noteId}`);
      setNotes(prevNotes => prevNotes.filter((_, index) => index !== indexToDelete));
    } catch (err) {
      alert('Failed to delete note: ' + err.message);
    }
  };

  // handle edit button
  const editNote = (indexToEdit) => {
    const note = notes[indexToEdit];
    setNoteTitle(note.title);         // Fill the title
    setNoteContent(note.content);     // Fill the content
    setEditIndex(indexToEdit);        // Tell React you're editing this note
    setShowNoteBox(true);  
  }
  


  return (
    <div>


      <div className='add-note'>
        <h2>Add a note</h2> 
        <button onClick={displayAddNoteDetails} className='plus-btn'><img src={plusSign} alt="" /></button>
      </div>

      {showNoteBox && ( // if showNoteBox is true, then render it
        <div className='add-note-details'>
          <textarea 
            id="noteTitle" 
            className='note-title' 
            placeholder='Your Title' 
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          ></textarea>

          <textarea 
            id="noteContent" 
            className='note-content' 
            placeholder='Your Content' 
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          ></textarea>


          <div className="buttons">
            <button onClick={closeNoteDetails} className='add-note-button'>CANCEL</button>
            <button onClick={handleNote} className='add-note-button'>OK</button>
          </div>
        
        </div>
      )}


      <div className='existing-notes'>
        {notes.map((note, index) => (
          <div key={note._id} className='note'> 
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className='btn'>
              <button onClick={() => editNote(index)}>Edit</button>
              <button onClick={() => deleteNote(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>



    </div>
    
  )
}

export default App