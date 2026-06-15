import { motion } from 'framer-motion';

function Sidebar({ notes, currentTitle, onSelectNote, onCreateNote }) {
  const noteTitles = Object.keys(notes).sort((a, b) => a.localeCompare(b));

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

      <div className="notes-list">
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
