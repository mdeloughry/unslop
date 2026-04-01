import { Plugin, MarkdownView, Editor } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { analyze } from './analyzer';
import { buildUnslopExtension, setUnslopFindings, clearUnslopFindings } from './decorations';
import { UnslopView, VIEW_TYPE_UNSLOP } from './view';
import { UnslopSettings, DEFAULT_SETTINGS, UnslopSettingTab } from './settings';

export default class UnslopPlugin extends Plugin {
  settings: UnslopSettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerEditorExtension(buildUnslopExtension());

    this.registerView(VIEW_TYPE_UNSLOP, leaf => new UnslopView(leaf, this));

    this.addCommand({
      id: 'analyze-note',
      name: 'Analyze note',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        void this.runAnalysis(editor, view);
      },
    });

    this.addCommand({
      id: 'clear-analysis',
      name: 'Clear analysis',
      editorCallback: (editor: Editor) => {
        this.clearDecorations(editor);
        this.getUnslopView()?.clearResult();
      },
    });

    this.addSettingTab(new UnslopSettingTab(this.app, this));
  }

  onunload(): void {}

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<UnslopSettings>);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  // ── Core analysis ──────────────────────────────────────────────────────────

  private async runAnalysis(editor: Editor, mdView: MarkdownView): Promise<void> {
    const hasSelection = editor.somethingSelected();
    let text: string;
    let offset = 0;

    if (hasSelection) {
      text = editor.getSelection();
      const from = editor.getCursor('from');
      offset = editor.posToOffset(from);
    } else {
      text = editor.getValue();
    }

    const result = analyze(text, offset, this.settings.customRules);

    // Apply decorations to the CM6 editor
    const cmView = this.getCmView(mdView);
    if (cmView) {
      cmView.dispatch({ effects: setUnslopFindings.of({ result }) });
    }

    // Show / update the side panel
    const unslopView = await this.openUnslopView();
    const filePath = mdView.file?.path ?? '';
    const fullContent = hasSelection ? text : editor.getValue();
    unslopView?.showResult(result, fullContent, filePath);
  }

  clearDecorations(editor?: Editor): void {
    const mdView = editor
      ? this.app.workspace.getActiveViewOfType(MarkdownView)
      : this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!mdView) return;
    const cmView = this.getCmView(mdView);
    cmView?.dispatch({ effects: clearUnslopFindings.of() });
  }

  // ── Panel helpers ──────────────────────────────────────────────────────────

  private async openUnslopView(): Promise<UnslopView | null> {
    const existing = this.getUnslopView();
    if (existing) return existing;

    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return null;
    await leaf.setViewState({ type: VIEW_TYPE_UNSLOP, active: true });
    await this.app.workspace.revealLeaf(leaf);
    return this.getUnslopView();
  }

  private getUnslopView(): UnslopView | null {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_UNSLOP)) {
      if (leaf.view instanceof UnslopView) return leaf.view;
    }
    return null;
  }

  // ── CodeMirror helpers ─────────────────────────────────────────────────────

  private getCmView(mdView: MarkdownView): EditorView | null {
    // Obsidian exposes the CM6 EditorView on the editor's undocumented cm property
    const editor = mdView.editor as unknown as { cm?: EditorView };
    return editor.cm ?? null;
  }
}
