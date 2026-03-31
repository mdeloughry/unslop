import { Finding, AnalysisResult, CustomRule } from './types';
import { detectCliches } from './rules/cliches';
import { detectFiller } from './rules/filler';
import { detectPassiveVoice } from './rules/passive-voice';
import { detectJargon } from './rules/corporate-jargon';
import { detectSentenceMonotony } from './rules/sentence-monotony';
import { detectFakeEnthusiasm } from './rules/fake-enthusiasm';
import { detectAdverbOveruse } from './rules/adverb-overuse';
import { detectListAddiction } from './rules/list-addiction';
import { detectCustomRules } from './rules/custom';

interface CodeBlockRange { from: number; to: number }

/**
 * Returns the character ranges of all fenced (``` or ~~~) and inline (`) code
 * blocks in a Markdown string. Findings that fall inside these ranges are
 * excluded from the analysis.
 */
export function getCodeBlockRanges(text: string): CodeBlockRange[] {
  const ranges: CodeBlockRange[] = [];

  // Fenced code blocks: ``` or ~~~, optionally with a language tag
  const fenced = /^[ \t]*(```+|~~~+)[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*$/gm;
  let m: RegExpExecArray | null;
  while ((m = fenced.exec(text)) !== null) {
    ranges.push({ from: m.index, to: m.index + m[0].length });
  }

  // Inline code spans: `...`  (not inside already-captured fenced blocks)
  const inline = /`[^`\n]+`/g;
  while ((m = inline.exec(text)) !== null) {
    const inFenced = ranges.some(r => m!.index >= r.from && m!.index + m![0].length <= r.to);
    if (!inFenced) {
      ranges.push({ from: m.index, to: m.index + m[0].length });
    }
  }

  return ranges;
}

function isInsideCodeBlock(from: number, to: number, ranges: CodeBlockRange[]): boolean {
  return ranges.some(r => from >= r.from && to <= r.to);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(s => s.length > 0).length;
}

/**
 * Weights per category for the slop score — passive voice and monotony are
 * considered less severe than explicit word-level slop.
 */
const CATEGORY_WEIGHT: Record<string, number> = {
  cliches:    2.5,
  filler:     2.0,
  passive:    1.0,
  jargon:     2.5,
  monotony:   1.5,
  enthusiasm: 2.0,
  adverbs:    1.5,
  lists:      1.5,
};

/**
 * Analyse `text` for AI writing patterns. `offset` is the character position
 * of the start of `text` within the full document (used when analysing a
 * selection so that decorations land in the right place).
 */
export function analyze(text: string, offset = 0, customRules: CustomRule[] = []): AnalysisResult {
  const codeRanges = getCodeBlockRanges(text);

  const runners = [
    detectCliches,
    detectFiller,
    detectPassiveVoice,
    detectJargon,
    detectSentenceMonotony,
    detectFakeEnthusiasm,
    detectAdverbOveruse,
    detectListAddiction,
  ];

  let allFindings: Finding[] = [
    ...runners.flatMap(fn => fn(text)),
    ...detectCustomRules(text, customRules),
  ];

  // Filter out any finding that falls inside a code block
  allFindings = allFindings.filter(
    f => !isInsideCodeBlock(f.from, f.to, codeRanges)
  );

  // Remove exact duplicate ranges (same from/to) — can happen when a phrase
  // appears in multiple rule lists
  const seen = new Set<string>();
  allFindings = allFindings.filter(f => {
    const key = `${f.from}:${f.to}:${f.categoryId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  allFindings.sort((a, b) => a.from - b.from);

  const wordCount = Math.max(1, countWords(text));

  // Weighted findings per 100 words, capped at 100
  const weightedSum = allFindings.reduce(
    (sum, f) => sum + (CATEGORY_WEIGHT[f.categoryId] ?? 1),
    0
  );
  const score = Math.min(100, Math.round((weightedSum / wordCount) * 100 * 3));

  return { findings: allFindings, score, wordCount, offset };
}
