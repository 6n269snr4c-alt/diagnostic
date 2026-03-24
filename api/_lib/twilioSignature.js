import crypto from 'crypto';

/**
 * Valida X-Twilio-Signature conforme https://www.twilio.com/docs/usage/webhooks/webhooks-security
 * @param {string} authToken - TWILIO_AUTH_TOKEN
 * @param {string|undefined} signature - header x-twilio-signature
 * @param {string} url - URL exata que o Twilio usou (https + host + path, sem query a menos que configurado assim)
 * @param {Record<string, string>} params - corpo POST parseado (chave → valor string)
 */
export function validateTwilioSignature(authToken, signature, url, params) {
  if (!authToken || !signature || !url || !params) return false;

  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const key of sortedKeys) {
    data += key + String(params[key] ?? '');
  }

  const expected = crypto.createHmac('sha1', authToken).update(data, 'utf8').digest('base64');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length) return false;

  try {
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Monta a URL pública do webhook (importante atrás de proxy / Vercel).
 */
export function buildTwilioWebhookUrl(req) {
  const explicit = process.env.TWILIO_WEBHOOK_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  let path = req.url || '';
  const q = path.indexOf('?');
  if (q !== -1) path = path.slice(0, q);
  if (!host) return '';
  return `${proto}://${host}${path}`;
}

/**
 * Normaliza req.body do Twilio para Record<string, string> (assinatura usa todos os campos).
 */
export function twilioParamsFromBody(body) {
  if (!body || typeof body !== 'object') return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    if (v === undefined || v === null) continue;
    out[k] = Array.isArray(v) ? String(v[0]) : String(v);
  }
  return out;
}
