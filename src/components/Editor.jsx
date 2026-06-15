import { motion } from 'framer-motion';

function Editor({ title, content, onTitleChange, onContentChange }) {
  return (
    <motion.section
      className="editor-panel glass-card"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.05 }}
    >
      <label className="field-label" htmlFor="note-title">
        Note title
      </label>
      <input
        id="note-title"
        className="title-input"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="Untitled Note"
      />

      <label className="field-label" htmlFor="note-content">
        Markdown editor
      </label>
      <textarea
        id="note-content"
        className="markdown-editor"
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder="Write Markdown here. Try linking another note with [[React]]."
      />
    </motion.section>
  );
}

export default Editor;
