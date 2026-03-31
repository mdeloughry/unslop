import { Finding, CustomRule, CATEGORY_LABELS } from '../types';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function detectCustomRules(text: string, rules: CustomRule[]): Finding[] {
  const findings: Finding[] = [];

  for (const rule of rules) {
    if (!rule.enabled || !rule.phrase.trim()) continue;

    const re = new RegExp(`\\b${escapeRegex(rule.phrase.trim())}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const catId = rule.categoryId;
      findings.push({
        categoryId: catId as any,
        categoryLabel: CATEGORY_LABELS[catId] ?? 'Custom Rules',
        text: m[0],
        from: m.index,
        to: m.index + m[0].length,
        suggestion: rule.suggestion || undefined,
      });
    }
  }

  return findings;
}
