const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const ANTHROPIC_VERSION = '2023-06-01';

/**
 * @param {{ system?: string, messages: Array<{ role: string, content: string }>, maxTokens?: number }} opts
 * @returns {Promise<string>}
 */
export async function callAnthropicMessages({ system, messages, maxTokens = 1024 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
  }

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages
  };
  if (system) body.system = system;

  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    const msg = data.error?.message || `Anthropic HTTP ${response.status}`;
    throw new Error(msg);
  }

  return (data.content || []).map((c) => c.text || '').join('').trim();
}
