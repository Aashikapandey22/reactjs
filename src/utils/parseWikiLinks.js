// Matches Obsidian-style wiki links such as [[React]] or [[Machine Learning]].
export const WIKI_LINK_REGEX = /\[\[([^\[\]]+?)\]\]/g;

// Normalizes note titles so [[ react ]] and [[React]] point to the same note.
export function normalizeTitle(title) {
  return title.trim().replace(/\s+/g, ' ');
}

// Returns a unique list of wiki link titles found in markdown text.
export function parseWikiLinks(markdown = '') {
  const titles = new Set();
  const matches = markdown.matchAll(WIKI_LINK_REGEX);

  for (const match of matches) {
    const title = normalizeTitle(match[1]);
    if (title) {
      titles.add(title);
    }
  }

  return Array.from(titles);
}
