import { parseWikiLinks } from './parseWikiLinks';

// Converts the notes object into the shape required by react-force-graph.
export function generateGraph(notes) {
  const nodes = Object.keys(notes).map((title) => ({
    id: title,
    name: title,
    val: Math.max(4, title.length),
  }));

  const links = [];

  Object.entries(notes).forEach(([sourceTitle, note]) => {
    parseWikiLinks(note.content).forEach((targetTitle) => {
      if (notes[targetTitle] && sourceTitle !== targetTitle) {
        links.push({
          source: sourceTitle,
          target: targetTitle,
        });
      }
    });
  });

  return { nodes, links };
}
