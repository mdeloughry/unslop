import { Finding, CATEGORY_IDS } from '../types';

// Common irregular past participles used in passive constructions
const IRREGULAR_PP = [
  'built','bought','brought','caught','done','driven','eaten','fallen',
  'felt','found','given','gone','grown','heard','held','kept','known',
  'left','made','meant','paid','put','read','run','said','seen','sent',
  'shown','spoken','taken','told','thought','understood','worn','written',
  'broken','chosen','drawn','drunk','flown','forgotten','frozen','hidden',
  'lain','proven','risen','stolen','thrown','woken','withdrawn',
].join('|');

// [be verb] [optional single -ly adverb] [past participle ending in -ed OR irregular]
const PASSIVE_RE = new RegExp(
  `\\b(am|is|are|was|were|be|been|being)\\b(?:\\s+\\w+ly)?\\s+(?:\\w+ed\\b|(?:${IRREGULAR_PP})\\b)`,
  'gi'
);

export function detectPassiveVoice(text: string): Finding[] {
  const findings: Finding[] = [];
  let m: RegExpExecArray | null;
  PASSIVE_RE.lastIndex = 0;
  while ((m = PASSIVE_RE.exec(text)) !== null) {
    findings.push({
      categoryId: CATEGORY_IDS.PASSIVE,
      categoryLabel: 'Passive Voice',
      text: m[0],
      from: m.index,
      to: m.index + m[0].length,
      suggestion: 'Rewrite to name who or what does the action',
    });
  }
  return findings;
}
