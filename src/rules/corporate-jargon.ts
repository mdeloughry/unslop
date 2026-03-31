import { Finding, CATEGORY_IDS } from '../types';

interface Rule { phrase: string; suggestion: string }

const JARGON: Rule[] = [
  { phrase: 'leverage',        suggestion: '"use"' },
  { phrase: 'bandwidth',       suggestion: '"time," "capacity," or "availability"' },
  { phrase: 'north star',      suggestion: '"goal" or "priority"' },
  { phrase: 'deep dive',       suggestion: '"close look," "analysis," or "review"' },
  { phrase: 'wheelhouse',      suggestion: '"area of expertise" or "specialty"' },
  { phrase: 'take offline',    suggestion: '"discuss separately" or "follow up on"' },
  { phrase: 'circle back',     suggestion: '"follow up" or "return to"' },
  { phrase: 'move the needle', suggestion: 'Describe the specific change or impact' },
  { phrase: 'boil the ocean',  suggestion: '"try to solve everything at once"' },
  { phrase: 'low-hanging fruit', suggestion: '"easy wins" or "quick fixes"' },
  { phrase: 'low hanging fruit', suggestion: '"easy wins" or "quick fixes"' },
  { phrase: 'value-add',       suggestion: '"benefit" or describe the specific value' },
  { phrase: 'value add',       suggestion: '"benefit" or describe the specific value' },
  { phrase: 'action item',     suggestion: '"task" or "to-do"' },
  { phrase: 'deliverable',     suggestion: '"result," "output," or be specific' },
  { phrase: 'stakeholder',     suggestion: '"people involved," "team," or name them' },
  { phrase: 'touch base',      suggestion: '"check in" or "talk"' },
  { phrase: 'ping',            suggestion: '"message" or "contact"' },
  { phrase: 'ideate',          suggestion: '"brainstorm" or "think of ideas"' },
  { phrase: 'ideation',        suggestion: '"brainstorming"' },
  { phrase: 'socialize',       suggestion: '"share" or "discuss with the team"' },
  { phrase: 'productize',      suggestion: '"turn into a product"' },
  { phrase: 'learnings',       suggestion: '"lessons" or "findings"' },
  { phrase: 'impact',          suggestion: 'Use as a noun not a verb: "affect" or "influence"' },
  { phrase: 'surface',         suggestion: '"raise," "share," or "bring up"' },
  { phrase: 'unpack',          suggestion: '"explain" or "break down"' },
  { phrase: 'double-click',    suggestion: '"examine more closely" or "dig into"' },
  { phrase: 'double click',    suggestion: '"examine more closely" or "dig into"' },
  { phrase: 'optics',          suggestion: '"how it looks" or "perception"' },
  { phrase: 'pivot',           suggestion: '"change direction" or "switch approach"' },
  { phrase: 'scale',           suggestion: '"grow" or "expand" — be specific' },
  { phrase: 'at scale',        suggestion: '"at a larger size" or be specific' },
  { phrase: 'agile',           suggestion: 'Use only when referring to the methodology specifically' },
  { phrase: 'bandwidth',       suggestion: '"time" or "capacity"' },
  { phrase: 'ecosystem',       suggestion: '"community," "tooling," or be specific' },
  { phrase: 'mission-critical', suggestion: '"essential" or "critical"' },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function detectJargon(text: string): Finding[] {
  const findings: Finding[] = [];
  for (const { phrase, suggestion } of JARGON) {
    const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.JARGON,
        categoryLabel: 'Corporate Jargon',
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion,
      });
    }
  }
  return findings;
}
