import { motion } from 'framer-motion';
import { useState } from 'react';

function Sidebar({ notes, currentTitle, onSelectNote, onCreateNote }) {
  const [searchTerm, setSearchTerm] = useState('');
  const noteTitles = Object.keys(notes)
    .filter((title) => title.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    <motion.aside
      className="sidebar glass-card"
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="sidebar-header">
        <div>
          <p className="eyebrow">Markdown Wiki</p>
          <h1>Knowledge Garden</h1>
        </div>
        <button className="icon-button" onClick={onCreateNote} title="Create note">
          +
        </button>
      </div>

      <div className="sidebar-search">
        <label className="field-label" htmlFor="note-search">
          Search notes
        </label>
        <input
          id="note-search"
          className="search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Find by title..."
        />
      </div>

      <div className="notes-list">
        {noteTitles.length === 0 && <p className="muted empty-state">No matching notes found.</p>}

        {noteTitles.map((title) => (
          <button
            key={title}
            className={`note-item ${title === currentTitle ? 'active' : ''}`}
            onClick={() => onSelectNote(title)}
          >
            <span>📝</span>
            {title}
          </button>
        ))}
      </div>
    </motion.aside>
  );
}

export default Sidebar;
