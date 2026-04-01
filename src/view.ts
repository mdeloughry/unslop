import { ItemView, WorkspaceLeaf, MarkdownView, setIcon, Notice } from 'obsidian';
import { AnalysisResult, CATEGORY_LABELS, CATEGORY_COLORS, CategoryId, Finding } from './types';
import { buildPrompt, PromptMode } from './prompt';
import { rewriteParagraph } from './ai/provider';
import type UnslopPlugin from './main';

export const VIEW_TYPE_UNSLOP = 'unslop-view';

const SCORE_LABELS: Array<{ max: number; label: string; cls: string }> = [
  { max: 20,  label: 'Clean',       cls: 'unslop-score-clean'    },
  { max: 50,  label: 'Mild',        cls: 'unslop-score-mild'     },
  { max: 75,  label: 'Sloppy',      cls: 'unslop-score-sloppy'   },
  { max: 101, label: 'Very sloppy', cls: 'unslop-score-heavy'    },
];

/** Return the paragraph (text between blank lines) that contains `pos`. */
function getParagraphAt(text: string, pos: number): { text: string; from: number; to: number } {
  let from = text.lastIndexOf('\n\n', pos);
  from = from === -1 ? 0 : from + 2;
  let to = text.indexOf('\n\n', pos);
  if (to === -1) to = text.length;
  return { text: text.slice(from, to), from, to };
}

export class UnslopView extends ItemView {
  private plugin: UnslopPlugin;
  private result: AnalysisResult | null = null;
  private analysisContent = '';
  private analysisFilePath = '';
  private contentEl2: HTMLElement;

  constructor(leaf: WorkspaceLeaf, plugin: UnslopPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string { return VIEW_TYPE_UNSLOP; }
  getDisplayText(): string { return 'Unslop'; }
  getIcon(): string { return 'scan-text'; }

  async onOpen(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass('unslop-root');
    this.contentEl2 = root.createDiv({ cls: 'unslop-content' });
    this.renderEmpty();
  }

  async onClose(): Promise<void> {}

  showResult(result: AnalysisResult, content: string, filePath: string): void {
    this.result = result;
    this.analysisContent = content;
    this.analysisFilePath = filePath;
    this.renderResult();
  }

  clearResult(): void {
    this.result = null;
    this.renderEmpty();
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  private renderEmpty(): void {
    this.contentEl2.empty();
    const empty = this.contentEl2.createDiv({ cls: 'unslop-empty' });
    empty.createEl('p', { text: 'Run "Unslop: Analyze note" to scan the active document.' }); // eslint-disable-line obsidianmd/ui/sentence-case -- quoting the command name
  }

  private renderResult(): void {
    const result = this.result!;
    this.contentEl2.empty();

    // ── Score header ──────────────────────────────────────────────────────
    const header = this.contentEl2.createDiv({ cls: 'unslop-header' });
    const scoreEntry = SCORE_LABELS.find(s => result.score < s.max) ?? SCORE_LABELS[SCORE_LABELS.length - 1];
    const scoreBadge = header.createDiv({ cls: `unslop-score-badge ${scoreEntry.cls}` });
    scoreBadge.createSpan({ cls: 'unslop-score-number', text: String(result.score) });
    scoreBadge.createSpan({ cls: 'unslop-score-label', text: scoreEntry.label });

    const meta = header.createDiv({ cls: 'unslop-meta' });
    meta.createSpan({ text: `${result.findings.length} issue${result.findings.length !== 1 ? 's' : ''}` });
    meta.createSpan({ text: ' · ' });
    meta.createSpan({ text: `${result.wordCount} words` });

    // ── Toolbar ───────────────────────────────────────────────────────────
    const toolbar = this.contentEl2.createDiv({ cls: 'unslop-toolbar' });
    this.renderPromptButton(toolbar);

    const clearBtn = toolbar.createEl('button', { cls: 'unslop-btn-ghost', text: 'Clear' });
    this.registerDomEvent(clearBtn, 'click', () => {
      this.plugin.clearDecorations();
      this.clearResult();
    });

    // ── No findings ───────────────────────────────────────────────────────
    if (result.findings.length === 0) {
      this.contentEl2.createDiv({ cls: 'unslop-empty' })
        .createEl('p', { text: '✓ No issues found.' }); // eslint-disable-line obsidianmd/ui/sentence-case -- starts after a symbol
      return;
    }

    // ── Group by category ─────────────────────────────────────────────────
    const groups = new Map<string, Finding[]>();
    for (const f of result.findings) {
      if (!groups.has(f.categoryId)) groups.set(f.categoryId, []);
      groups.get(f.categoryId)!.push(f);
    }

    for (const [categoryId, findings] of groups) {
      const color = CATEGORY_COLORS[categoryId as CategoryId] ?? '#aaa';
      const label = CATEGORY_LABELS[categoryId as CategoryId] ?? categoryId;

      const section = this.contentEl2.createDiv({ cls: 'unslop-section' });
      const sectionHeader = section.createDiv({ cls: 'unslop-section-header' });

      const swatch = sectionHeader.createSpan({ cls: 'unslop-swatch' });
      swatch.style.background = color;
      sectionHeader.createSpan({ cls: 'unslop-section-title', text: label });
      sectionHeader.createSpan({ cls: 'unslop-section-count', text: String(findings.length) });

      const chevron = sectionHeader.createSpan({ cls: 'unslop-chevron' });
      setIcon(chevron, 'chevron-down');

      const body = section.createDiv({ cls: 'unslop-section-body' });

      this.registerDomEvent(sectionHeader, 'click', () => {
        const collapsed = body.hasClass('unslop-collapsed');
        body.toggleClass('unslop-collapsed', !collapsed);
        chevron.empty();
        setIcon(chevron, collapsed ? 'chevron-down' : 'chevron-right');
      });

      for (const f of findings) {
        this.renderFinding(body, f, color);
      }
    }
  }

  private renderFinding(container: HTMLElement, f: Finding, color: string): void {
    const result = this.result!;
    const item = container.createDiv({ cls: 'unslop-finding' });

    // ── Chip row ──────────────────────────────────────────────────────────
    const chip = item.createDiv({ cls: 'unslop-chip' });
    chip.style.borderLeftColor = color;
    chip.createSpan({ cls: 'unslop-chip-text', text: `"${f.text}"` });

    // Jump button
    const jumpBtn = chip.createEl('button', { cls: 'unslop-icon-btn' });
    setIcon(jumpBtn, 'arrow-right');
    jumpBtn.setAttribute('aria-label', 'Jump to location');
    this.registerDomEvent(jumpBtn, 'click', (e) => {
      e.stopPropagation();
      this.jumpTo(f.from + result.offset, f.to + result.offset);
    });

    // AI rewrite button (only shown when provider is configured)
    if (this.plugin.settings.aiApiKey) {
      const rewriteBtn = chip.createEl('button', { cls: 'unslop-icon-btn unslop-rewrite-btn' });
      setIcon(rewriteBtn, 'wand');
      rewriteBtn.setAttribute('aria-label', 'AI rewrite paragraph');
      this.registerDomEvent(rewriteBtn, 'click', (e) => {
        e.stopPropagation();
        void this.handleRewrite(item, f);
      });
    }

    // Suggestion
    if (f.suggestion) {
      item.createDiv({ cls: 'unslop-suggestion', text: f.suggestion });
    }
  }

  // ── AI Rewrite ────────────────────────────────────────────────────────────

  private async handleRewrite(item: HTMLElement, finding: Finding): Promise<void> {
    const result = this.result!;
    const s = this.plugin.settings;

    // Find the paragraph containing this finding
    const para = getParagraphAt(this.analysisContent, finding.from);

    // Gather all findings within this paragraph for context
    const paraFindings = result.findings.filter(
      f => f.from >= para.from && f.to <= para.to
    );

    // Remove any existing rewrite UI on this item
    item.querySelector('.unslop-rewrite-area')?.remove();

    const area = item.createDiv({ cls: 'unslop-rewrite-area' });
    const spinner = area.createDiv({ cls: 'unslop-spinner', text: 'Rewriting…' });

    try {
      const rewritten = await rewriteParagraph(
        { provider: s.aiProvider, apiKey: s.aiApiKey, model: s.aiModel, baseUrl: s.aiBaseUrl },
        para.text,
        paraFindings.map(f => ({ text: f.text, suggestion: f.suggestion })),
      );

      spinner.remove();
      this.renderRewritePreview(area, para, rewritten);
    } catch (err) {
      spinner.remove();
      area.createEl('p', { cls: 'unslop-rewrite-error', text: `Error: ${(err as Error).message}` });
      const dismiss = area.createEl('button', { cls: 'unslop-btn-ghost', text: 'Dismiss' });
      this.registerDomEvent(dismiss, 'click', () => area.remove());
    }
  }

  private renderRewritePreview(
    area: HTMLElement,
    para: { text: string; from: number; to: number },
    rewritten: string
  ): void {
    area.createEl('p', { cls: 'unslop-rewrite-label', text: 'Suggested rewrite:' });

    area.createEl('blockquote', { cls: 'unslop-rewrite-preview', text: rewritten });

    const actions = area.createDiv({ cls: 'unslop-rewrite-actions' });

    const acceptBtn = actions.createEl('button', { cls: 'unslop-btn-primary', text: 'Accept' });
    this.registerDomEvent(acceptBtn, 'click', () => {
      this.applyRewrite(para, rewritten);
      area.remove();
      new Notice('Rewrite applied');
    });

    const copyBtn = actions.createEl('button', { cls: 'unslop-btn-ghost', text: 'Copy' });
    this.registerDomEvent(copyBtn, 'click', async () => {
      await navigator.clipboard.writeText(rewritten);
      new Notice('Copied to clipboard');
    });

    const dismissBtn = actions.createEl('button', { cls: 'unslop-btn-ghost', text: 'Dismiss' });
    this.registerDomEvent(dismissBtn, 'click', () => area.remove());
  }

  private applyRewrite(para: { from: number; to: number }, rewritten: string): void {
    const leaf = this.app.workspace.getMostRecentLeaf();
    if (!leaf || !(leaf.view instanceof MarkdownView)) return;
    const editor = leaf.view.editor;
    const result = this.result!;
    const absFrom = para.from + result.offset;
    const absTo   = para.to   + result.offset;
    editor.replaceRange(rewritten, editor.offsetToPos(absFrom), editor.offsetToPos(absTo));
  }

  // ── Prompt button ─────────────────────────────────────────────────────────

  private renderPromptButton(toolbar: HTMLElement): void {
    const wrap = toolbar.createDiv({ cls: 'unslop-prompt-wrap' });

    const btn = wrap.createEl('button', { cls: 'unslop-btn-primary' });
    setIcon(btn.createSpan(), 'clipboard-copy');
    btn.createSpan({ text: ' Copy AI prompt' });
    this.registerDomEvent(btn, 'click', () => this.copyPrompt());

    const toggle = wrap.createDiv({ cls: 'unslop-mode-toggle' });
    const modes: Array<{ value: PromptMode; label: string; title: string }> = [
      { value: 'content', label: 'Content', title: 'Embed document text in the prompt (recommended)' },
      { value: 'path',    label: 'Path',    title: 'Include file path only' },
    ];

    const render = () => {
      toggle.empty();
      for (const { value, label, title } of modes) {
        const opt = toggle.createEl('button', {
          cls: `unslop-mode-opt ${this.plugin.settings.promptMode === value ? 'is-active' : ''}`,
          text: label, title,
        });
        this.registerDomEvent(opt, 'click', async () => {
          this.plugin.settings.promptMode = value;
          await this.plugin.saveSettings();
          render();
        });
      }
      if (this.plugin.settings.promptMode === 'content') {
        toggle.createSpan({ cls: 'unslop-rec', text: '(recommended)' });
      }
    };
    render();
  }

  private async copyPrompt(): Promise<void> {
    if (!this.result) return;
    const prompt = buildPrompt(
      this.result,
      this.plugin.settings.promptMode,
      this.analysisContent,
      this.analysisFilePath,
    );
    await navigator.clipboard.writeText(prompt);
    new Notice('AI prompt copied to clipboard');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  private jumpTo(from: number, to: number): void {
    const leaf = this.app.workspace.getMostRecentLeaf();
    if (!leaf || !(leaf.view instanceof MarkdownView)) return;
    const editor = leaf.view.editor;
    const fromPos = editor.offsetToPos(from);
    const toPos   = editor.offsetToPos(to);
    editor.setSelection(fromPos, toPos);
    editor.scrollIntoView({ from: fromPos, to: toPos }, true);
    leaf.view.editor.focus();
  }
}
