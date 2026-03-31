import { Finding, CATEGORY_IDS } from '../types';

interface Rule { phrase: string; suggestion: string }

const FILLERS: Rule[] = [
  { phrase: 'arguably',               suggestion: 'Make the argument or cut it' },
  { phrase: 'essentially',            suggestion: 'Cut it, or say exactly what you mean' },
  { phrase: 'it goes without saying', suggestion: 'If it goes without saying, don\'t say it' },
  { phrase: 'for what it\'s worth',   suggestion: 'Cut it — just say the thing' },
  { phrase: 'needless to say',        suggestion: 'Then don\'t say it, or cut the phrase' },
  { phrase: 'as a matter of fact',    suggestion: 'Cut it — just state the fact' },
  { phrase: 'basically',              suggestion: 'Cut it or be more precise' },
  { phrase: 'to be honest',           suggestion: 'Cut it — implies you\'re not always honest' },
  { phrase: 'if you will',            suggestion: 'Cut it' },
  { phrase: 'so to speak',            suggestion: 'Cut it, or commit to the metaphor' },
  { phrase: 'as it were',             suggestion: 'Cut it' },
  { phrase: 'in a sense',             suggestion: 'Specify which sense, or cut it' },
  { phrase: 'in some ways',           suggestion: 'Specify which ways, or cut it' },
  { phrase: 'sort of',                suggestion: 'Cut it or be more precise' },
  { phrase: 'kind of',                suggestion: 'Cut it or be more precise' },
  { phrase: 'per se',                 suggestion: 'Cut it — usually filler' },
  { phrase: 'in terms of',            suggestion: 'Rewrite: "regarding X" or just name it directly' },
  { phrase: 'the fact that',          suggestion: 'Rewrite: "that X" or restructure the sentence' },
  { phrase: 'due to the fact that',   suggestion: '"because"' },
  { phrase: 'in order to',            suggestion: '"to"' },
  { phrase: 'it is important to note', suggestion: 'Cut it — just make the point' },
  { phrase: 'it should be noted',     suggestion: 'Cut it — just state the thing' },
  { phrase: 'it is worth noting',     suggestion: 'Cut it — just state the thing' },
  { phrase: 'needless to mention',    suggestion: 'Cut the phrase and mention it directly' },
  { phrase: 'without further ado',    suggestion: 'Cut it — just start' },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function detectFiller(text: string): Finding[] {
  const findings: Finding[] = [];
  for (const { phrase, suggestion } of FILLERS) {
    const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.FILLER,
        categoryLabel: 'Filler & Hedging',
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion,
      });
    }
  }
  return findings;
}
