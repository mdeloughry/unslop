import { Finding, CATEGORY_IDS } from '../types';

// Transition words that signal list-structured thinking
const TRANSITIONS = [
  'firstly', 'secondly', 'thirdly', 'fourthly', 'fifthly',
  'lastly', 'finally',
  'moreover', 'furthermore', 'additionally', 'in addition',
  'also', 'besides', 'likewise',
  'in conclusion', 'to summarize', 'to conclude', 'in summary',
  'to begin with', 'first of all', 'last but not least',
];

// Minimum number of distinct transition words to trigger the rule
const MIN_TRANSITIONS = 3;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function detectListAddiction(text: string): Finding[] {
  const matches: Array<{ text: string; from: number; to: number }> = [];

  for (const phrase of TRANSITIONS) {
    const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({ text: m[0], from: m.index, to: m.index + m[0].length });
    }
  }

  if (matches.length < MIN_TRANSITIONS) return [];

  matches.sort((a, b) => a.from - b.from);

  return matches.map(({ text, from, to }) => ({
    categoryId: CATEGORY_IDS.LISTS,
    categoryLabel: 'List Addiction',
    text,
    from,
    to,
    suggestion: `${matches.length} list-transition words found. Prose flows better without sequential signposting — try connecting ideas directly.`,
  }));
}
