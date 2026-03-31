import { Finding, CATEGORY_IDS } from '../types';

// High-frequency AI adverbs — these are the ones that actually cluster in AI text.
// Generic -ly adverbs (quickly, slowly) are not flagged unless they cluster unusually.
const FLAGGED_ADVERBS = [
  'meticulously', 'seamlessly', 'remarkably', 'effortlessly',
  'comprehensively', 'significantly', 'particularly', 'fundamentally',
  'ultimately', 'undoubtedly', 'absolutely', 'definitely',
  'obviously', 'simply', 'highly', 'deeply', 'greatly',
  'carefully', 'precisely', 'thoughtfully', 'strategically',
  'effectively', 'efficiently', 'continuously', 'constantly',
  'completely', 'entirely', 'perfectly', 'incredibly',
  'tremendously', 'immensely', 'vastly', 'exceptionally',
];

const FLAGGED_RE = new RegExp(`\\b(${FLAGGED_ADVERBS.join('|')})\\b`, 'gi');

// Cluster detection: if N flagged adverbs appear within a window of W characters
const CLUSTER_WINDOW = 200;
const CLUSTER_MIN = 3;

export function detectAdverbOveruse(text: string): Finding[] {
  const allMatches: Array<{ text: string; from: number; to: number }> = [];

  let m: RegExpExecArray | null;
  FLAGGED_RE.lastIndex = 0;
  while ((m = FLAGGED_RE.exec(text)) !== null) {
    allMatches.push({ text: m[0], from: m.index, to: m.index + m[0].length });
  }

  const findings: Finding[] = [];
  const flaggedAsCluster = new Set<number>();

  // Sliding window: flag clusters of CLUSTER_MIN+ within CLUSTER_WINDOW chars
  for (let i = 0; i < allMatches.length; i++) {
    const windowEnd = allMatches[i].from + CLUSTER_WINDOW;
    let j = i;
    while (j < allMatches.length && allMatches[j].from <= windowEnd) j++;
    const count = j - i;
    if (count >= CLUSTER_MIN) {
      for (let k = i; k < j; k++) flaggedAsCluster.add(k);
    }
  }

  if (flaggedAsCluster.size > 0) {
    // Flag each clustered adverb individually
    for (const idx of flaggedAsCluster) {
      const match = allMatches[idx];
      findings.push({
        categoryId: CATEGORY_IDS.ADVERBS,
        categoryLabel: 'Adverb Overuse',
        text: match.text,
        from: match.from,
        to: match.to,
        suggestion: `Remove or replace "${match.text}" — it is part of an adverb cluster. Show, don't modify.`,
      });
    }
  } else {
    // Even outside clusters, flag repeated use of the same adverb (2+)
    const seen = new Map<string, number[]>();
    for (let i = 0; i < allMatches.length; i++) {
      const key = allMatches[i].text.toLowerCase();
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(i);
    }
    for (const [word, indices] of seen) {
      if (indices.length >= 2) {
        for (const idx of indices) {
          const match = allMatches[idx];
          findings.push({
            categoryId: CATEGORY_IDS.ADVERBS,
            categoryLabel: 'Adverb Overuse',
            text: match.text,
            from: match.from,
            to: match.to,
            suggestion: `"${word}" appears ${indices.length} times. Cut or replace it — stronger verbs often remove the need.`,
          });
        }
      }
    }
  }

  return findings;
}
