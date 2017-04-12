/**
 * @license
 * Copyright (c) 2017 Nicholas Nelson (S247742)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

import Note from './Note';
import WebStore from './WebStore';

// Load EJS templates, handled by browserify-ejs
const notepadDisplayTemplate = require('../../templates/notepad-displaycard.ejs');
const editNoteScreenTemplate = require('../../templates/edit-note-screen.ejs');


class Notepad {
  constructor() {
    this._db = new WebStore();
    document.getElementById('new-note-button').addEventListener('click', (e) => this.createEditNoteScreen(), false);
    this._loadNotepad();
    this.renderNotes();
  }
  
  // Save the note described in the note edit form
  saveNote() {
    var note = new Note({
      date: document.getElementById('note-date-input').value,
      text: document.getElementById('note-text-input').value
    });
    this._notes[note.date.getTime()] = note;
    this.renderNotes();
    this.removeEditNoteScreen();
    this._saveNotepad();
  }
  
  // Delete the note specified by the note-date-input on the edit form
  deleteNote() {
    var noteID = (new Date(document.getElementById('note-date-input').value)).getTime();
    delete this._notes[noteID];
    this.renderNotes();
    this.removeEditNoteScreen();
    this._saveNotepad();
  }
  
  // Load the notepad from the database (webstorage in this case)
  _loadNotepad() {
    this._notes = this._db.loadItem('notepad') || {};
    for (const id in this._notes) {
      this._notes[id] = new Note(this._notes[id]);
    }
  }
  
  // Save the notepad to the database
  _saveNotepad() {
    this._db.saveItem('notepad', this._notes);
  }
  
  // Generates HTML from notepad-displaycard.ejs template
  toHTML() {
    return notepadDisplayTemplate({
      notes: this._notes
    });
  }
  
  // Renders the notepad to the notepad-display div and adds edit event listeners
  renderNotes() {
    // Add the notepad html to the appropriate div
    document.getElementById('notepad-display').innerHTML = this.toHTML();
    // Add event listener to each note to allow editing
    var noteElements = document.getElementsByClassName('displaycard-note');
    for (const noteElement of noteElements) {
      noteElement.addEventListener('click',
          (e) => this.createEditNoteScreen(this._notes[parseInt(noteElement.id)]),
          false);
    }
  }
  
  // Creates the edit note overlay
  createEditNoteScreen(note) {
    // Add the edit note screen, creating a new note if we don't have one
    var html = editNoteScreenTemplate({note: note ? note : new Note()});
    document.getElementById('notepad-edit-post-container').innerHTML = html;
    // Prevent clicks on the displaycard from bubbling up any further
    document.getElementById('edit-note-displaycard').addEventListener('click', function(e) {
      e.stopPropagation();
    }, false);
    // Clicks on the overlay should close the displaycard
    document.getElementById('edit-note-overlay').addEventListener('click', (e) => this.removeEditNoteScreen(), false);
    document.getElementById('save-note-button').addEventListener('click', (e) => this.saveNote(), false);
    document.getElementById('delete-note-button').addEventListener('click', (e) => this.deleteNote(), false);
    document.getElementById('edit-post-close-button').addEventListener('click', (e) => this.removeEditNoteScreen(), false);
  }
  
  removeEditNoteScreen() {
    document.getElementById('notepad-edit-post-container').innerHTML = '';
  }
}

export { Notepad as default };