import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { WIKI_LINK_REGEX, normalizeTitle } from '../utils/parseWikiLinks';

function Preview({ title, content, onOpenWikiLink }) {
  // Replace every [[Page Name]] with a normal Markdown link before rendering.
  const markdownWithLinks = content.replace(WIKI_LINK_REGEX, (_, pageTitle) => {
    const cleanTitle = normalizeTitle(pageTitle);
    return `[${cleanTitle}](#/note/${encodeURIComponent(cleanTitle)})`;
  });

  return (
    <motion.section
      className="preview-panel glass-card"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <div className="panel-heading">
        <p className="eyebrow">Live Preview</p>
        <h2>{title || 'Untitled Note'}</h2>
      </div>

      <div className="markdown-preview">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => {
              if (href?.startsWith('#/note/')) {
                const linkedTitle = decodeURIComponent(href.replace('#/note/', ''));
                return (
                  <button className="wiki-link" onClick={() => onOpenWikiLink(linkedTitle)}>
                    {children}
                  </button>
                );
              }

              return (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              );
            },
          }}
        >
          {markdownWithLinks || 'Start typing in the editor to see your note preview.'}
        </ReactMarkdown>
      </div>
    </motion.section>
  );
}

export default Preview;
