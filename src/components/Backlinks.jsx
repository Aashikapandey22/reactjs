import { motion } from 'framer-motion';

function Backlinks({ backlinks, onSelectNote }) {
  return (
    <motion.div
      className="backlinks glass-card"
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <p className="eyebrow">Backlinks</p>
      {backlinks.length === 0 ? (
        <p className="muted">No notes link here yet.</p>
      ) : (
        <div className="backlink-list">
          {backlinks.map((noteTitle) => (
            <button key={noteTitle} className="backlink-pill" onClick={() => onSelectNote(noteTitle)}>
              ← {noteTitle}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Backlinks;
