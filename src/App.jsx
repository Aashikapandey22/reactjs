import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import GraphView from './components/GraphView';
import Backlinks from './components/Backlinks';
import { normalizeTitle, parseWikiLinks } from './utils/parseWikiLinks';

const STORAGE_KEY = 'knowledge-garden-notes';

const starterNotes = {
  Home: {
    content:
      '# Welcome to Knowledge Garden\n\nThis is a local-first Markdown note system. Try opening [[React]], [[JavaScript]], or [[Machine Learning]].\n\n## Features\n\n- Markdown editing\n- Internal wiki links\n- Automatic note creation\n- Backlinks\n- Interactive graph view',
  },
  React: {
    content: '# React\n\nReact uses components to build user interfaces. Link back to [[Home]] or explore [[JavaScript]].',
  },
  JavaScript: {
    content: '# JavaScript\n\nJavaScript powers the browser and makes this no-backend project possible with [[LocalStorage]].',
  },
};

function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  return savedNotes ? JSON.parse(savedNotes) : starterNotes;
}

function createMissingLinkedNotes(existingNotes) {
  const nextNotes = { ...existingNotes };

  Object.values(existingNotes).forEach((note) => {
    parseWikiLinks(note.content).forEach((linkedTitle) => {
      if (!nextNotes[linkedTitle]) {
        nextNotes[linkedTitle] = {
          content: `# ${linkedTitle}\n\nThis note was automatically created from a wiki link.`,
        };
      }
    });
  });

  return nextNotes;
}

function App() {
  const [notes, setNotes] = useState(() => createMissingLinkedNotes(loadNotes()));
  const [currentTitle, setCurrentTitle] = useState('Home');
  const [draftTitle, setDraftTitle] = useState('Home');
  const [showGraph, setShowGraph] = useState(false);

  const currentNote = notes[currentTitle] || { content: '' };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setDraftTitle(currentTitle);
  }, [currentTitle]);

  function ensureLinkedNotes(markdown, existingNotes) {
    const nextNotes = { ...existingNotes };

    parseWikiLinks(markdown).forEach((linkedTitle) => {
      if (!nextNotes[linkedTitle]) {
        nextNotes[linkedTitle] = {
          content: `# ${linkedTitle}\n\nThis note was automatically created from a wiki link.`,
        };
      }
    });

    return nextNotes;
  }

  function updateCurrentContent(content) {
    setNotes((previousNotes) => {
      const updatedNotes = {
        ...previousNotes,
        [currentTitle]: { content },
      };

      return ensureLinkedNotes(content, updatedNotes);
    });
  }

  function renameCurrentNote(nextTitle) {
    setDraftTitle(nextTitle);
    const cleanTitle = normalizeTitle(nextTitle);

    if (!cleanTitle || cleanTitle === currentTitle || notes[cleanTitle]) {
      return;
    }

    setNotes((previousNotes) => {
      const renamedNotes = { ...previousNotes };
      renamedNotes[cleanTitle] = renamedNotes[currentTitle];
      delete renamedNotes[currentTitle];
      return renamedNotes;
    });
    setCurrentTitle(cleanTitle);
  }

  function createNote() {
    let number = 1;
    let title = `New Note ${number}`;

    while (notes[title]) {
      number += 1;
      title = `New Note ${number}`;
    }

    setNotes((previousNotes) => ({
      ...previousNotes,
      [title]: { content: `# ${title}\n\nStart writing your note here.` },
    }));
    setCurrentTitle(title);
  }

  function openWikiLink(title) {
    const cleanTitle = normalizeTitle(title);

    setNotes((previousNotes) => {
      if (previousNotes[cleanTitle]) {
        return previousNotes;
      }

      return {
        ...previousNotes,
        [cleanTitle]: {
          content: `# ${cleanTitle}\n\nThis note was automatically created because you clicked a wiki link.`,
        },
      };
    });
    setCurrentTitle(cleanTitle);
  }

  function openNoteInEditor(title) {
    setCurrentTitle(title);
    setShowGraph(false);
  }

  const backlinks = useMemo(() => {
    return Object.entries(notes)
      .filter(([title, note]) => title !== currentTitle && parseWikiLinks(note.content).includes(currentTitle))
      .map(([title]) => title)
      .sort((a, b) => a.localeCompare(b));
  }, [notes, currentTitle]);

  return (
    <div className="app-shell">
      <Sidebar
        notes={notes}
        currentTitle={currentTitle}
        onSelectNote={setCurrentTitle}
        onCreateNote={createNote}
      />

      <main className="workspace">
        <div className="topbar glass-card">
          <div>
            <p className="eyebrow">LocalStorage Workspace</p>
            <strong>{Object.keys(notes).length} notes in your garden</strong>
          </div>
          <button className="primary-button" onClick={() => setShowGraph((value) => !value)}>
            {showGraph ? 'Show Editor' : 'Toggle Graph View'}
          </button>
        </div>

        {showGraph ? (
          <GraphView notes={notes} currentTitle={currentTitle} onSelectNote={openNoteInEditor} />
        ) : (
          <div className="editor-grid">
            <div className="editor-stack">
              <Editor
                title={draftTitle}
                content={currentNote.content}
                onTitleChange={renameCurrentNote}
                onContentChange={updateCurrentContent}
              />
            </div>
            <div className="editor-stack">
              <Preview title={currentTitle} content={currentNote.content} onOpenWikiLink={openWikiLink} />
              <Backlinks backlinks={backlinks} onSelectNote={setCurrentTitle} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
