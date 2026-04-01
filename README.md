# Unslop — Obsidian Plugin

Detect and fix AI writing patterns — clichés, passive voice, corporate jargon, and more.

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22unslop%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2FHEAD%2Fcommunity-plugin-stats.json)

---

## What it does

Run **Unslop: Analyze note** from the command palette. The plugin will:

1. Underline flagged text in the editor (colour-coded by category)
2. Open a side panel showing a **slop score (0–100)**, findings grouped by category, and suggested rewrites
3. Let you click any finding to jump to it in the editor
4. Let you copy a ready-made **AI prompt** to paste into any AI assistant
5. Let you trigger an **inline AI rewrite** of the flagged paragraph (requires an API key)

Works on the full note, or on selected text only.

---

## Detection categories

| Category | What it catches |
|---|---|
| 🔴 AI Clichés | "delve," "tapestry," "nuanced," "in the realm of," "stands as a testament," … |
| 🟠 Filler & Hedging | "arguably," "essentially," "it goes without saying," "for what it's worth," … |
| 🟡 Passive Voice | Constructions hiding who does what ("was built," "is being considered," …) |
| 🔵 Corporate Jargon | "leverage," "bandwidth," "north star," "circle back," "move the needle," … |
| 🟣 Sentence Monotony | Consecutive sentences of suspiciously similar length |
| 🩷 Fake Enthusiasm | "absolutely amazing," "literally unprecedented," "mind-blowing," `!!` … |
| 🟢 Adverb Overuse | Clusters of -ly adverbs ("meticulously," "seamlessly," "remarkably," …) |
| 🔵 List Addiction | Sequences of "firstly… secondly… moreover… furthermore… additionally…" |

All rules skip **code blocks** (fenced and inline) automatically.

---

## Installation

### From Obsidian (once listed in the community registry)

1. Open **Settings → Community Plugins → Browse**
2. Search for **Unslop**
3. Install and enable

### Manual install

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](../../releases/latest)
2. Copy them into `<your-vault>/.obsidian/plugins/unslop/`
3. Enable the plugin in **Settings → Community Plugins**

### Via BRAT (beta testing)

1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this repository: `Settings → BRAT → Add Beta Plugin`

---

## Usage

| Action | How |
|---|---|
| Analyze note | Command palette → **Unslop: Analyze note** |
| Analyze selection | Select text first, then run the command |
| Clear highlights | Command palette → **Unslop: Clear analysis**, or click **Clear** in the panel |
| Jump to finding | Click the → button next to any finding |
| Copy AI prompt | Click **Copy AI prompt** in the panel |
| AI rewrite | Click the 🪄 button next to any finding (API key required) |

---

## AI features

### Copy AI prompt

Builds a structured prompt containing all detected issues and your document text (or file path). Paste it into any AI assistant (ChatGPT, Claude, Gemini, etc.).

**Prompt modes** (toggle in the panel or in settings):
- **Content** *(recommended)* — embeds the full document text, works with any AI
- **Path** — includes only the file path, only useful if your AI agent can read your local filesystem

### Inline rewrites (API key required)

Configure a provider in **Settings → Unslop → AI provider**:

| Provider | Default model | Get API key |
|---|---|---|
| OpenAI | `gpt-4o` | [platform.openai.com](https://platform.openai.com/api-keys) |
| Anthropic | `claude-3-5-sonnet-20241022` | [console.anthropic.com](https://console.anthropic.com/keys) |
| Google Gemini | `gemini-1.5-pro-latest` | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| Mistral | `mistral-large-latest` | [console.mistral.ai](https://console.mistral.ai/api-keys) |
| Cohere | `command-r-plus-08-2024` | [dashboard.cohere.com](https://dashboard.cohere.com/api-keys) |
| OpenRouter | `openai/gpt-4o` | [openrouter.ai](https://openrouter.ai/keys) |

The model field is editable. OpenAI, Mistral, and OpenRouter support a **base URL override** for proxies or self-hosted models.

Once configured, a 🪄 button appears next to each finding. Clicking it:
1. Extracts the surrounding paragraph
2. Sends it to the AI with all findings in that paragraph as context
3. Shows the suggested rewrite in the panel
4. **Accept** replaces the text in your editor · **Copy** copies it · **Dismiss** discards it

---

## Custom rules

Add your own phrases in **Settings → Unslop → Custom Rules**:

- **Phrase** — the word or phrase to flag (matched as a whole word, case-insensitive)
- **Suggestion** — optional hint shown in the panel
- **Enable/disable** per rule without deleting it

Custom rules appear in the **Custom Rules** category in the side panel and are included in the AI prompt and inline rewrite context.

---

## Development

```bash
git clone https://github.com/your-username/obsidian-unslop
cd obsidian-unslop
npm install --legacy-peer-deps

# Watch mode (rebuilds on save)
npm run dev

# Production build
npm run build
```

To test in Obsidian, symlink the project folder into your vault:

```bash
ln -s /path/to/obsidian-unslop \
  /path/to/vault/.obsidian/plugins/unslop
```

Then enable the plugin in Settings and use **Reload app without saving** (Ctrl/Cmd+R) after each build.

### Releasing

1. Update `version` in `manifest.json` and `package.json`
2. Add the new version to `versions.json`: `"x.y.z": "1.4.0"`
3. Commit: `git commit -am "x.y.z"`
4. Tag and push: `git tag x.y.z && git push && git push --tags`
5. The GitHub Actions workflow builds and creates a **draft release** automatically
6. Review and publish the draft release on GitHub

---

## Submitting to the Obsidian community registry

See the official guide: [Submit your plugin](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin).

The short version:
1. Publish your plugin on GitHub with a public release containing `main.js`, `manifest.json`, and `styles.css`
2. Fork [obsidian-releases](https://github.com/obsidianmd/obsidian-releases)
3. Add your plugin to `community-plugins.json`
4. Open a pull request

---

## License

MIT
