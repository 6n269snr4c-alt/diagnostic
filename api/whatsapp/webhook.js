import { callAnthropicMessages } from '../_lib/anthropic.js';
import {
  buildTwilioWebhookUrl,
  twilioParamsFromBody,
  validateTwilioSignature
} from '../_lib/twilioSignature.js';
import {
  completeWhatsAppLink,
  getUidForWhatsappPhone,
  getUserWhatsappContext,
  normalizeWhatsappE164
} from '../_lib/whatsappLink.js';

const WHATSAPP_SYSTEM = `Você é o assistente financeiro do Fluxa no WhatsApp.

REGRAS:
- Responda sempre em português do Brasil.
- Tom: claro, direto, profissional e acessível (empresário MEI/pequeno negócio).
- O usuário NÃO está autenticado no app: você NÃO tem acesso a dados reais da empresa dele (DRE, fluxo de caixa, etc.).
- Se a pergunta depender dos dados do Fluxa, explique com uma frase que, para análises com os números dele, ele pode usar o app Fluxa e vincular o WhatsApp em Configuração, e responda o que for possível de forma geral ou educativa.
- Use texto simples para celular: parágrafos curtos, listas com hífen quando ajudar. Evite Markdown pesado (sem ** ou #).
- Seja objetivo; se faltar contexto, faça no máximo 1–2 perguntas curtas de esclarecimento.`;

const WHATSAPP_SYSTEM_LINKED_HEAD = `Você é o assistente financeiro do Fluxa no WhatsApp. Esta pessoa já vinculou o número ao mesmo login do app — use o CONTEXTO abaixo como fonte principal (gerado quando ela salva dados no app).

REGRAS:
- Responda em português do Brasil.
- Tom: claro, direto, profissional.
- Ancore respostas nos números e fatos do CONTEXTO quando existirem.
- Se o contexto estiver vazio ou claramente incompleto, diga que ela pode abrir o app e salvar (Configuração ou após editar um mês) para atualizar o que você vê aqui.
- Texto simples para celular; evite Markdown pesado.
- No máximo 1–2 perguntas curtas se precisar esclarecer.

CONTEXTO:
`;

const MAX_OUT_TOKENS = 1024;
const MAX_LINKED_TOKENS = 1400;
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

const LINK_MESSAGES = {
  invalid:
    'Código inválido. No app Fluxa: Configuração → WhatsApp → Gerar código. Envie exatamente: FLUXA e o código (ex.: FLUXA A1B2C3).',
  expired:
    'Esse código expirou (válido por 15 min). Gere outro no app em Configuração → WhatsApp.',
  nouser:
    'Ainda não há dados salvos no app para esta conta. Abra o Fluxa, faça login e aguarde carregar; depois gere um novo código em Configuração → WhatsApp.'
};

async function tryHandleFluxaLink(bodyTrim, phoneE164, phoneForTwilio) {
  const m = bodyTrim.match(/^FLUXA\s+([A-F0-9]{6})$/i);
  if (!m) return false;

  try {
    const result = await completeWhatsAppLink(m[1].toUpperCase(), phoneE164);
    if (result.ok) {
      await enviarWhatsApp(
        phoneForTwilio,
        'Conta vinculada com sucesso. Agora posso usar os dados do seu Fluxa (atualizados quando você salva no app). Em que posso ajudar?'
      );
    } else {
      await enviarWhatsApp(phoneForTwilio, LINK_MESSAGES[result.reason] || LINK_MESSAGES.invalid);
    }
  } catch (e) {
    console.error('WhatsApp vínculo:', e);
    await enviarWhatsApp(
      phoneForTwilio,
      'Não foi possível concluir o vínculo agora. Confira se o app está com as credenciais do Firebase no servidor ou tente de novo em instantes.'
    );
  }
  return true;
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
  const phoneE164 = normalizeWhatsappE164(fromRaw);
  const phoneForTwilio = phoneE164 || fromRaw.replace(/^whatsapp:/i, '');
  const numMedia = parseInt(params.NumMedia || '0', 10) || 0;

  if (!phoneForTwilio) {
    return emptyTwiMLResponse(res);
  }

  if (numMedia > 0) {
    await enviarWhatsApp(
      phoneForTwilio,
      'No momento só consigo ler mensagens de texto por aqui. Envie sua dúvida em texto, por favor.'
    );
    return emptyTwiMLResponse(res);
  }

  if (!bodyText || !bodyText.trim()) {
    return emptyTwiMLResponse(res);
  }

  const bodyTrim = bodyText.trim();

  if (phoneE164) {
    const handled = await tryHandleFluxaLink(bodyTrim, phoneE164, phoneForTwilio);
    if (handled) return emptyTwiMLResponse(res);
  }

  let system = WHATSAPP_SYSTEM;
  let maxTokens = MAX_OUT_TOKENS;

  if (phoneE164) {
    try {
      const uid = await getUidForWhatsappPhone(phoneE164);
      if (uid) {
        const { contextText } = await getUserWhatsappContext(uid);
        system =
          WHATSAPP_SYSTEM_LINKED_HEAD +
          (contextText ||
            '(Contexto ainda não foi salvo — peça para abrir o app e salvar: Configuração ou após editar um mês.)');
        maxTokens = MAX_LINKED_TOKENS;
      }
    } catch (e) {
      console.warn('WhatsApp contexto Firestore:', e.message);
    }
  }

  try {
    const reply = await callAnthropicMessages({
      system,
      messages: [{ role: 'user', content: bodyTrim }],
      maxTokens
    });

    const chunks = splitForWhatsApp(reply || 'Não consegui gerar uma resposta agora. Tente de novo em instantes.');
    for (const chunk of chunks) {
      await enviarWhatsApp(phoneForTwilio, chunk);
    }
  } catch (err) {
    console.error('WhatsApp webhook:', err);
    try {
      await enviarWhatsApp(
        phoneForTwilio,
        'Desculpe, tive um problema ao processar sua mensagem. Tente novamente em alguns minutos.'
      );
    } catch (sendErr) {
      console.error('WhatsApp enviar erro:', sendErr);
    }
  }

  return emptyTwiMLResponse(res);
}
