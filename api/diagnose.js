import { callAnthropicMessages } from './_lib/anthropic.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, system, history } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt ausente' });

    const messages = [
      ...(history || []),
      { role: 'user', content: prompt }
    ];

    const text = await callAnthropicMessages({
      system,
      messages,
      maxTokens: 600
    });

    return res.status(200).json({ text });
  } catch (err) {
    const msg = err.message || String(err);
    if (msg.includes('ANTHROPIC_API_KEY')) {
      return res.status(500).json({ error: 'API key não configurada' });
    }
    return res.status(500).json({ error: 'Erro interno: ' + msg });
  }
}
