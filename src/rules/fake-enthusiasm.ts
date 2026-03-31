import { Finding, CATEGORY_IDS } from '../types';

interface Rule { phrase: string; suggestion: string }

const ENTHUSIASM: Rule[] = [
  { phrase: 'absolutely amazing',      suggestion: 'What specifically makes it good?' },
  { phrase: 'literally unprecedented', suggestion: 'What has never happened before, exactly?' },
  { phrase: 'mind-blowing',            suggestion: '"surprising," "impressive," or be specific' },
  { phrase: 'mind blowing',            suggestion: '"surprising," "impressive," or be specific' },
  { phrase: 'state-of-the-art',        suggestion: '"new," "recent," or name the specific technology' },
  { phrase: 'state of the art',        suggestion: '"new," "recent," or name the specific technology' },
  { phrase: 'groundbreaking',          suggestion: 'Describe what ground it breaks' },
  { phrase: 'revolutionary',           suggestion: 'Describe what it changes and how' },
  { phrase: 'game-changing',           suggestion: 'Describe what specifically changes' },
  { phrase: 'game changing',           suggestion: 'Describe what specifically changes' },
  { phrase: 'world-class',             suggestion: 'Provide evidence or cut it' },
  { phrase: 'best-in-class',           suggestion: 'Provide evidence or cut it' },
  { phrase: 'unparalleled',            suggestion: 'What is it being compared to?' },
  { phrase: 'unprecedented',           suggestion: 'Describe what has not happened before' },
  { phrase: 'exceptional',             suggestion: 'Describe what makes it an exception' },
  { phrase: 'extraordinary',           suggestion: 'Describe what makes it extraordinary' },
  { phrase: 'amazing',                 suggestion: 'What specifically impresses you?' },
  { phrase: 'incredible',              suggestion: '"notable," "impressive," or be specific' },
  { phrase: 'unbelievable',            suggestion: '"notable," "impressive," or be specific' },
  { phrase: 'spectacular',             suggestion: 'Be specific about what you observed' },
  { phrase: 'phenomenal',              suggestion: 'Be specific' },
];

// Also detect strings of consecutive exclamation marks
const MULTI_EXCLAIM_RE = /!{2,}/g;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function detectFakeEnthusiasm(text: string): Finding[] {
  const findings: Finding[] = [];

  for (const { phrase, suggestion } of ENTHUSIASM) {
    const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      findings.push({
        categoryId: CATEGORY_IDS.ENTHUSIASM,
        categoryLabel: 'Fake Enthusiasm',
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion,
      });
    }
  }

  let m: RegExpExecArray | null;
  MULTI_EXCLAIM_RE.lastIndex = 0;
  while ((m = MULTI_EXCLAIM_RE.exec(text)) !== null) {
    findings.push({
      categoryId: CATEGORY_IDS.ENTHUSIASM,
      categoryLabel: 'Fake Enthusiasm',
      text: m[0],
      from: m.index,
      to: m.index + m[0].length,
      suggestion: 'One exclamation mark is usually enough. Consider whether any is needed.',
    });
  }

  return findings;
}
