import { AnalysisResult, CATEGORY_LABELS } from './types';

export type PromptMode = 'content' | 'path';

const PROMPT_INTRO = `You are a sharp writing editor. The text below has been flagged for AI writing patterns ("slop"). Your job is to rewrite it cleanly.

## Rules
- Fix every flagged issue
- Preserve the author's voice, intent, and all factual content
- Use plain, direct language — cut what adds no meaning
- Do not introduce new clichés, jargon, or filler
- Vary sentence length and structure where monotony is flagged
- Return only the rewritten text, no commentary

## Detected Issues
`;

function buildIssuesList(result: AnalysisResult): string {
  // Group by category
  const groups = new Map<string, typeof result.findings>();
  for (const f of result.findings) {
    if (!groups.has(f.categoryId)) groups.set(f.categoryId, []);
    groups.get(f.categoryId)!.push(f);
  }

  const lines: string[] = [];
  for (const [categoryId, findings] of groups) {
    const label = CATEGORY_LABELS[categoryId as keyof typeof CATEGORY_LABELS] ?? categoryId;
    lines.push(`### ${label}`);
    for (const f of findings) {
      const suggestion = f.suggestion ? ` → ${f.suggestion}` : '';
      lines.push(`- "${f.text}"${suggestion}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function buildPrompt(
  result: AnalysisResult,
  mode: PromptMode,
  content: string,
  filePath: string
): string {
  const issuesList = buildIssuesList(result);
  const scoreNote = `Slop score: ${result.score}/100 (${result.findings.length} issue${result.findings.length !== 1 ? 's' : ''} across ${result.wordCount} words)\n\n`;

  let textSection: string;
  if (mode === 'path') {
    textSection = `## File\n${filePath}\n\n(Open the file and use the issues list above to guide your edits.)`;
  } else {
    textSection = `## Text to Rewrite\n\`\`\`\n${content}\n\`\`\``;
  }

  return PROMPT_INTRO + scoreNote + issuesList + '\n---\n\n' + textSection;
}
