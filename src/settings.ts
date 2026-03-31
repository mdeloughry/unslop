import { App, PluginSettingTab, Setting, ButtonComponent, TextComponent } from 'obsidian';
import type UnslopPlugin from './main';
import type { PromptMode } from './prompt';
import { AIProviderName, PROVIDER_LABELS, DEFAULT_MODELS, PROVIDER_DOCS } from './ai/provider';
import { CustomRule } from './types';

export interface UnslopSettings {
  promptMode: PromptMode;
  customRules: CustomRule[];
  aiProvider: AIProviderName;
  aiApiKey: string;
  aiModel: string;
  aiBaseUrl: string;
}

export const DEFAULT_SETTINGS: UnslopSettings = {
  promptMode:   'content',
  customRules:  [],
  aiProvider:   'openai',
  aiApiKey:     '',
  aiModel:      'gpt-4o',
  aiBaseUrl:    '',
};

export class UnslopSettingTab extends PluginSettingTab {
  plugin: UnslopPlugin;

  constructor(app: App, plugin: UnslopPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Unslop' });

    // ── Prompt export ──────────────────────────────────────────────────────
    containerEl.createEl('h3', { text: 'Prompt export' });

    new Setting(containerEl)
      .setName('AI prompt mode')
      .setDesc(
        'Include the full document content (recommended — works with any AI) ' +
        'or just the file path (only if your AI agent can read your local filesystem).'
      )
      .addDropdown(drop =>
        drop
          .addOption('content', 'Include content (Recommended)')
          .addOption('path', 'Link to file path')
          .setValue(this.plugin.settings.promptMode)
          .onChange(async (value) => {
            this.plugin.settings.promptMode = value as PromptMode;
            await this.plugin.saveSettings();
          })
      );

    // ── AI provider ────────────────────────────────────────────────────────
    containerEl.createEl('h3', { text: 'AI provider (inline rewrites)' });
    containerEl.createEl('p', {
      text: 'Configure an AI provider to use the "Rewrite" button in the side panel.',
      cls: 'setting-item-description',
    });

    let modelTextComp: TextComponent;

    new Setting(containerEl)
      .setName('Provider')
      .addDropdown(drop => {
        for (const [value, label] of Object.entries(PROVIDER_LABELS)) {
          drop.addOption(value, label);
        }
        drop.setValue(this.plugin.settings.aiProvider);
        drop.onChange(async (value) => {
          this.plugin.settings.aiProvider = value as AIProviderName;
          // Reset model to provider default if the user hasn't customised it
          const currentModel = this.plugin.settings.aiModel;
          const wasDefault = Object.values(DEFAULT_MODELS).includes(currentModel);
          if (wasDefault) {
            this.plugin.settings.aiModel = DEFAULT_MODELS[value as AIProviderName];
            if (modelTextComp) modelTextComp.setValue(this.plugin.settings.aiModel);
          }
          await this.plugin.saveSettings();
          // Re-render to update docs link
          this.display();
        });
      });

    const selectedProvider = this.plugin.settings.aiProvider;
    const docsUrl = PROVIDER_DOCS[selectedProvider];

    new Setting(containerEl)
      .setName('API key')
      .setDesc(createFragment(frag => {
        frag.appendText('Paste your API key. Get one at ');
        frag.createEl('a', { text: docsUrl, href: docsUrl });
        frag.appendText('.');
      }))
      .addText(text => {
        text
          .setPlaceholder('sk-...')
          .setValue(this.plugin.settings.aiApiKey)
          .onChange(async (value) => {
            this.plugin.settings.aiApiKey = value.trim();
            await this.plugin.saveSettings();
          });
        text.inputEl.type = 'password';
        text.inputEl.style.width = '100%';
      });

    new Setting(containerEl)
      .setName('Model')
      .setDesc(`Default: ${DEFAULT_MODELS[selectedProvider]}`)
      .addText(text => {
        modelTextComp = text;
        text
          .setPlaceholder(DEFAULT_MODELS[selectedProvider])
          .setValue(this.plugin.settings.aiModel)
          .onChange(async (value) => {
            this.plugin.settings.aiModel = value.trim() || DEFAULT_MODELS[selectedProvider];
            await this.plugin.saveSettings();
          });
        text.inputEl.style.width = '100%';
      });

    if (selectedProvider === 'openrouter' || selectedProvider === 'mistral' || selectedProvider === 'openai') {
      new Setting(containerEl)
        .setName('Base URL (optional)')
        .setDesc('Override the API base URL — useful for proxies or self-hosted models.')
        .addText(text => {
          text
            .setPlaceholder('https://...')
            .setValue(this.plugin.settings.aiBaseUrl)
            .onChange(async (value) => {
              this.plugin.settings.aiBaseUrl = value.trim();
              await this.plugin.saveSettings();
            });
          text.inputEl.style.width = '100%';
        });
    }

    // ── Custom rules ───────────────────────────────────────────────────────
    containerEl.createEl('h3', { text: 'Custom rules' });
    containerEl.createEl('p', {
      text: 'Add your own phrases to flag. They will appear in the side panel alongside built-in findings.',
      cls: 'setting-item-description',
    });

    this.renderCustomRules(containerEl);

    new Setting(containerEl).addButton((btn: ButtonComponent) =>
      btn
        .setButtonText('+ Add rule')
        .setCta()
        .onClick(async () => {
          this.plugin.settings.customRules.push({
            id: crypto.randomUUID(),
            phrase: '',
            categoryId: 'custom',
            suggestion: '',
            enabled: true,
          });
          await this.plugin.saveSettings();
          this.display();
        })
    );
  }

  private renderCustomRules(containerEl: HTMLElement): void {
    const rules = this.plugin.settings.customRules;
    if (rules.length === 0) return;

    for (const rule of rules) {
      const setting = new Setting(containerEl)
        .setClass('unslop-custom-rule-row')
        .addToggle(toggle =>
          toggle
            .setValue(rule.enabled)
            .onChange(async (val) => {
              rule.enabled = val;
              await this.plugin.saveSettings();
            })
        )
        .addText(text =>
          text
            .setPlaceholder('Phrase to flag…')
            .setValue(rule.phrase)
            .onChange(async (val) => {
              rule.phrase = val;
              await this.plugin.saveSettings();
            })
        )
        .addText(text =>
          text
            .setPlaceholder('Suggestion (optional)')
            .setValue(rule.suggestion)
            .onChange(async (val) => {
              rule.suggestion = val;
              await this.plugin.saveSettings();
            })
        )
        .addExtraButton(btn =>
          btn
            .setIcon('trash')
            .setTooltip('Delete rule')
            .onClick(async () => {
              this.plugin.settings.customRules =
                this.plugin.settings.customRules.filter(r => r.id !== rule.id);
              await this.plugin.saveSettings();
              this.display();
            })
        );

      setting.settingEl.style.flexWrap = 'wrap';
      setting.settingEl.style.gap = '6px';
    }
  }
}
