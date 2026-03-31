import { Finding, CATEGORY_IDS } from '../types';

interface Rule { phrase: string; suggestion: string }

const CLICHES: Rule[] = [
  { phrase: 'delve into',                   suggestion: '"explore" or "examine"' },
  { phrase: 'delve',                         suggestion: '"explore" or "examine"' },
  { phrase: 'tapestry',                      suggestion: 'Be specific — what is the actual relationship or mix?' },
  { phrase: 'nuanced',                       suggestion: 'Describe what the nuance actually is' },
  { phrase: 'multifaceted',                  suggestion: '"complex" or list the specific aspects' },
  { phrase: 'in the realm of',               suggestion: '"in" or "within"' },
  { phrase: 'stands as a testament',         suggestion: '"shows" or "demonstrates"' },
  { phrase: 'testament to',                  suggestion: '"proof of" or "evidence of"' },
  { phrase: 'it is what it is',              suggestion: 'Cut it — say what you actually mean' },
  { phrase: 'at the end of the day',         suggestion: 'Cut it — state your conclusion directly' },
  { phrase: 'game changer',                  suggestion: '"significant shift" or be specific about what changed' },
  { phrase: 'game-changer',                  suggestion: '"significant shift" or be specific about what changed' },
  { phrase: 'paradigm shift',                suggestion: 'Describe what actually changed and how' },
  { phrase: 'cutting-edge',                  suggestion: '"new," "recent," or name the specific technology' },
  { phrase: 'cutting edge',                  suggestion: '"new," "recent," or name the specific technology' },
  { phrase: 'ever-evolving',                 suggestion: '"changing" — or just name the change' },
  { phrase: 'ever evolving',                 suggestion: '"changing" — or just name the change' },
  { phrase: 'in today\'s world',             suggestion: 'Cut it — be specific about context' },
  { phrase: 'in today\'s fast-paced world',  suggestion: 'Cut the whole phrase' },
  { phrase: 'shed light on',                 suggestion: '"explain" or "clarify"' },
  { phrase: 'foster',                        suggestion: '"encourage," "build," or "support"' },
  { phrase: 'comprehensive',                 suggestion: 'Be specific about what is covered' },
  { phrase: 'robust',                        suggestion: '"strong," "reliable," or describe specifically' },
  { phrase: 'holistic',                      suggestion: 'Describe what you\'re including and why' },
  { phrase: 'ecosystem',                     suggestion: 'Be specific: "community," "tooling," "market," etc.' },
  { phrase: 'landscape',                     suggestion: 'Be specific: "market," "field," "space," etc.' },
  { phrase: 'unlock',                        suggestion: '"enable" or "allow"' },
  { phrase: 'dive deep',                     suggestion: '"examine closely" or "analyse in detail"' },
  { phrase: 'dive into',                     suggestion: '"examine" or "explore"' },
  { phrase: 'embark on',                     suggestion: '"start" or "begin"' },
  { phrase: 'journey',                       suggestion: 'Be concrete about the actual process or change' },
  { phrase: 'transformative',                suggestion: 'Describe what specifically changed' },
  { phrase: 'seamless',                      suggestion: 'Describe why it works smoothly, or cut it' },
  { phrase: 'innovative',                    suggestion: 'Describe what is actually new about it' },
  { phrase: 'synergy',                       suggestion: 'Describe how the parts actually work together' },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function detectCliches(text: string): Finding[] {
  const findings: Finding[] = [];
  for (const { phrase, suggestion } of CLICHES) {
    const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.CLICHES,
        categoryLabel: 'AI Clichés',
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion,
      });
    }
  }
  return findings;
}
