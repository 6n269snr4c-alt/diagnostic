export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada no Vercel' });
  }

  try {
    const { prompt, system, history } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt ausente' });

    let messages = [];
    if (history && Array.isArray(history)) {
      messages = [...history];
    }
    messages.push({ role: 'user', content: prompt });

    const body = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages
    };

    if (system) body.system = system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'Erro na API Anthropic' 
      });
    }

    const text = (data.content || []).map(c => c.text || '').join('').trim();
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
}
