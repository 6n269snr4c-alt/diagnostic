import { callAnthropicMessages } from '../_lib/anthropic.js';
import {
  buildTwilioWebhookUrl,
  twilioParamsFromBody,
  validateTwilioSignature
} from '../_lib/twilioSignature.js';

const WHATSAPP_SYSTEM = `Você é o assistente financeiro do Fluxa no WhatsApp.

REGRAS:
- Responda sempre em português do Brasil.
- Tom: claro, direto, profissional e acessível (empresário MEI/pequeno negócio).
- O usuário NÃO está autenticado no app: você NÃO tem acesso a dados reais da empresa dele (DRE, fluxo de caixa, etc.).
- Se a pergunta depender dos dados do Fluxa, explique com uma frase que, para análises com os números dele, ele pode usar o app Fluxa, e responda o que for possível de forma geral ou educativa.
- Use texto simples para celular: parágrafos curtos, listas com hífen quando ajudar. Evite Markdown pesado (sem ** ou #).
- Seja objetivo; se faltar contexto, faça no máximo 1–2 perguntas curtas de esclarecimento.`;

const MAX_OUT_TOKENS = 1024;
const WHATSAPP_CHUNK = 1500;

function splitForWhatsApp(text, maxLen = WHATSAPP_CHUNK) {
  const t = text.trim();
  if (!t) return [];
  const parts = [];
  let rest = t;
  while (rest.length > maxLen) {
    let cut = rest.lastIndexOf('\n', maxLen);
    if (cut < Math.floor(maxLen * 0.5)) cut = rest.lastIndexOf(' ', maxLen);
    if (cut < Math.floor(maxLen * 0.5)) cut = maxLen;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

async function enviarWhatsApp(paraNumero, texto) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const deNumero = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !deNumero) {
    throw new Error('Credenciais Twilio incompletas (SID, token ou número)');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    From: deNumero,
    To: `whatsapp:${paraNumero}`,
    Body: texto
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro Twilio: ${response.status} - ${errorText}`);
  }

  return response.json();
}

function emptyTwiMLResponse(res) {
  const xml = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.status(200).end(xml);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).end('Fluxa WhatsApp webhook OK');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const params = twilioParamsFromBody(req.body);
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const skipSig = process.env.TWILIO_SKIP_SIGNATURE_VALIDATION === '1';

  if (authToken && !skipSig) {
    const webhookUrl = buildTwilioWebhookUrl(req);
    const signature = req.headers['x-twilio-signature'];
    if (!webhookUrl || !validateTwilioSignature(authToken, signature, webhookUrl, params)) {
      return res.status(403).end('Forbidden');
    }
  }

  const bodyText = params.Body;
  const fromRaw = params.From || '';
  const phoneNumber = fromRaw.replace(/^whatsapp:/i, '');
  const numMedia = parseInt(params.NumMedia || '0', 10) || 0;

  if (numMedia > 0) {
    await enviarWhatsApp(
      phoneNumber,
      'No momento só consigo ler mensagens de texto por aqui. Envie sua dúvida em texto, por favor.'
    );
    return emptyTwiMLResponse(res);
  }

  if (!bodyText || !bodyText.trim()) {
    return emptyTwiMLResponse(res);
  }

  try {
    const reply = await callAnthropicMessages({
      system: WHATSAPP_SYSTEM,
      messages: [{ role: 'user', content: bodyText.trim() }],
      maxTokens: MAX_OUT_TOKENS
    });

    const chunks = splitForWhatsApp(reply || 'Não consegui gerar uma resposta agora. Tente de novo em instantes.');
    for (const chunk of chunks) {
      await enviarWhatsApp(phoneNumber, chunk);
    }
  } catch (err) {
    console.error('WhatsApp webhook:', err);
    try {
      await enviarWhatsApp(
        phoneNumber,
        'Desculpe, tive um problema ao processar sua mensagem. Tente novamente em alguns minutos.'
      );
    } catch (sendErr) {
      console.error('WhatsApp enviar erro:', sendErr);
    }
  }

  return emptyTwiMLResponse(res);
}
