import { requestUrl } from 'obsidian';

export type AIProviderName = 'openai' | 'anthropic' | 'google' | 'mistral' | 'cohere' | 'openrouter';

export interface AIProviderConfig {
  provider: AIProviderName;
  apiKey: string;
  model: string;
  /** Optional base URL override (useful for proxies or self-hosted). */
  baseUrl?: string;
}

export const PROVIDER_LABELS: Record<AIProviderName, string> = {
  openai:     'OpenAI',
  anthropic:  'Anthropic (Claude)',
  google:     'Google Gemini',
  mistral:    'Mistral',
  cohere:     'Cohere',
  openrouter: 'OpenRouter',
};

export const DEFAULT_MODELS: Record<AIProviderName, string> = {
  openai:     'gpt-4o',
  anthropic:  'claude-3-5-sonnet-20241022',
  google:     'gemini-1.5-pro-latest',
  mistral:    'mistral-large-latest',
  cohere:     'command-r-plus-08-2024',
  openrouter: 'openai/gpt-4o',
};

export const PROVIDER_DOCS: Record<AIProviderName, string> = {
  openai:     'https://platform.openai.com/api-keys',
  anthropic:  'https://console.anthropic.com/keys',
  google:     'https://aistudio.google.com/app/apikey',
  mistral:    'https://console.mistral.ai/api-keys',
  cohere:     'https://dashboard.cohere.com/api-keys',
  openrouter: 'https://openrouter.ai/keys',
};

// ── Request helpers ────────────────────────────────────────────────────────

/** Call an OpenAI-compatible chat completions endpoint. */
async function openAICompletions(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
  extraHeaders?: Record<string, string>
): Promise<string> {
  const res = await requestUrl({
    url: `${baseUrl}/chat/completions`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  const data = res.json;
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Unexpected response from API: ${JSON.stringify(data)}`);
  return content.trim();
}

/** Call the Anthropic Messages API. */
async function anthropicMessages(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const res = await requestUrl({
    url: 'https://api.anthropic.com/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 2048,
    }),
  });

  const data = res.json;
  const content = data?.content?.[0]?.text;
  if (!content) throw new Error(`Unexpected Anthropic response: ${JSON.stringify(data)}`);
  return content.trim();
}

/** Call the Google Gemini generateContent API. */
async function googleGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await requestUrl({
    url,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    }),
  });

  const data = res.json;
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error(`Unexpected Gemini response: ${JSON.stringify(data)}`);
  return content.trim();
}

/** Call the Cohere Chat v2 API. */
async function cohereChat(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const res = await requestUrl({
    url: 'https://api.cohere.ai/v2/chat',
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
    }),
  });

  const data = res.json;
  const content = data?.message?.content?.[0]?.text;
  if (!content) throw new Error(`Unexpected Cohere response: ${JSON.stringify(data)}`);
  return content.trim();
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Send `userMessage` to the configured AI provider and return the response.
 * `systemPrompt` sets the model's role/instructions.
 */
export async function callAI(
  config: AIProviderConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const { provider, apiKey, model, baseUrl } = config;

  switch (provider) {
    case 'openai':
      return openAICompletions(
        baseUrl || 'https://api.openai.com/v1',
        apiKey, model, systemPrompt, userMessage
      );

    case 'anthropic':
      return anthropicMessages(apiKey, model, systemPrompt, userMessage);

    case 'google':
      return googleGemini(apiKey, model, systemPrompt, userMessage);

    case 'mistral':
      return openAICompletions(
        baseUrl || 'https://api.mistral.ai/v1',
        apiKey, model, systemPrompt, userMessage
      );

    case 'cohere':
      return cohereChat(apiKey, model, systemPrompt, userMessage);

    case 'openrouter':
      return openAICompletions(
        baseUrl || 'https://openrouter.ai/api/v1',
        apiKey, model, systemPrompt, userMessage,
        { 'HTTP-Referer': 'obsidian-unslop', 'X-Title': 'Unslop' }
      );

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

// ── Rewrite helper ─────────────────────────────────────────────────────────

const REWRITE_SYSTEM = `You are a sharp writing editor. Your only job is to rewrite the text the user gives you, fixing the specific issues listed. Rules:
- Return ONLY the rewritten text — no explanation, no preamble, no quotation marks around it
- Preserve all factual content and the author's voice
- Use plain, direct language
- Do not introduce new clichés, jargon, or filler`;

/**
 * Ask the AI to rewrite `paragraph`, fixing the specific `issues` listed.
 */
export async function rewriteParagraph(
  config: AIProviderConfig,
  paragraph: string,
  issues: Array<{ text: string; suggestion?: string }>
): Promise<string> {
  const issueList = issues
    .map(i => `- "${i.text}"${i.suggestion ? ` → ${i.suggestion}` : ''}`)
    .join('\n');

  const userMessage =
    `Fix these issues in the following text:\n${issueList}\n\n---\n\n${paragraph}`;

  return callAI(config, REWRITE_SYSTEM, userMessage);
}
