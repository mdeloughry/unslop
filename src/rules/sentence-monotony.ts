import { Finding, CATEGORY_IDS } from '../types';

const SENTENCE_END = /[^.!?]*[.!?]+/g;
// Minimum sentences needed before monotony can be flagged
const MIN_SENTENCES = 4;
// Coefficient of variation threshold — below this is "monotonous"
const CV_THRESHOLD = 0.25;
// Minimum run of same-structure sentences (similar length) to flag as a cluster
const CLUSTER_SIZE = 3;
// Two sentences are "similar length" if they differ by fewer than this many words
const SIMILAR_WORDS_DELTA = 3;

interface Sentence {
  text: string;
  from: number;
  to: number;
  wordCount: number;
}

function parseSentences(text: string): Sentence[] {
  const sentences: Sentence[] = [];
  let m: RegExpExecArray | null;
  SENTENCE_END.lastIndex = 0;
  while ((m = SENTENCE_END.exec(text)) !== null) {
    const raw = m[0].trim();
    if (!raw) continue;
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length < 3) continue; // ignore very short fragments
    sentences.push({
      text: raw,
      from: m.index,
      to: m.index + m[0].length,
      wordCount: words.length,
    });
  }
  return sentences;
}

function stdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function detectSentenceMonotony(text: string): Finding[] {
  const sentences = parseSentences(text);
  if (sentences.length < MIN_SENTENCES) return [];

  const findings: Finding[] = [];
  const lengths = sentences.map(s => s.wordCount);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const cv = mean > 0 ? stdDev(lengths) / mean : 0;

  if (cv < CV_THRESHOLD) {
    // Flag consecutive clusters of similar-length sentences
    let clusterStart = 0;
    for (let i = 1; i <= sentences.length; i++) {
      const inCluster =
        i < sentences.length &&
        Math.abs(sentences[i].wordCount - sentences[clusterStart].wordCount) <= SIMILAR_WORDS_DELTA;

      if (!inCluster) {
        const clusterLen = i - clusterStart;
        if (clusterLen >= CLUSTER_SIZE) {
          const first = sentences[clusterStart];
          const last = sentences[i - 1];
          findings.push({
            categoryId: CATEGORY_IDS.MONOTONY,
            categoryLabel: 'Sentence Monotony',
            text: text.slice(first.from, last.to),
            from: first.from,
            to: last.to,
            suggestion: `${clusterLen} consecutive sentences of similar length (~${Math.round(mean)} words). Vary sentence length and structure.`,
          });
        }
        clusterStart = i;
      }
    }
  }

  return findings;
}
