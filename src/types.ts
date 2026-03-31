export const CATEGORY_IDS = {
  CLICHES: 'cliches',
  FILLER: 'filler',
  PASSIVE: 'passive',
  JARGON: 'jargon',
  MONOTONY: 'monotony',
  ENTHUSIASM: 'enthusiasm',
  ADVERBS: 'adverbs',
  LISTS: 'lists',
} as const;

export type CategoryId = typeof CATEGORY_IDS[keyof typeof CATEGORY_IDS];

export const CATEGORY_IDS_WITH_CUSTOM = { ...CATEGORY_IDS, CUSTOM: 'custom' } as const;

export const CATEGORY_LABELS: Record<CategoryId | 'custom', string> = {
  cliches: 'AI Clichés',
  filler: 'Filler & Hedging',
  passive: 'Passive Voice',
  jargon: 'Corporate Jargon',
  monotony: 'Sentence Monotony',
  enthusiasm: 'Fake Enthusiasm',
  adverbs: 'Adverb Overuse',
  lists: 'List Addiction',
  custom: 'Custom Rules',
};

export const CATEGORY_COLORS: Record<CategoryId | 'custom', string> = {
  cliches: '#e07b7b',
  filler: '#e0a87b',
  passive: '#d4c94a',
  jargon: '#7bc8e0',
  monotony: '#a07be0',
  enthusiasm: '#e07bb8',
  adverbs: '#7be0a0',
  lists: '#7b9ae0',
  custom: '#b07be0',
};

export interface CustomRule {
  id: string;
  phrase: string;
  /** Which built-in category to file this under, or 'custom' for its own group. */
  categoryId: CategoryId | 'custom';
  suggestion: string;
  enabled: boolean;
}

export interface Finding {
  categoryId: CategoryId;
  categoryLabel: string;
  text: string;
  from: number;
  to: number;
  suggestion?: string;
}

export interface AnalysisResult {
  findings: Finding[];
  score: number;
  wordCount: number;
  /** Character offset into the full document where analysis started (for selections). */
  offset: number;
}
