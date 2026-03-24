import { callAnthropicMessages } from './_lib/anthropic.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const text = await callAnthropicMessages({
      system: system || 'Você é um conselheiro financeiro experiente.',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 2500
    });
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(502).json({ error: 'Anthropic API error: ' + err.message });
  }
}
