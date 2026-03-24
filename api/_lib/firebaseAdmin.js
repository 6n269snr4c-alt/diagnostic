import admin from 'firebase-admin';

function parseServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    return JSON.parse(Buffer.from(b64.trim(), 'base64').toString('utf8'));
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  return JSON.parse(raw);
}

/** Inicializa uma vez e reutiliza (serverless warm). */
export function getAdmin() {
  if (admin.apps.length) return admin;
  const sa = parseServiceAccount();
  if (!sa) {
    throw new Error(
      'Configure FIREBASE_SERVICE_ACCOUNT_JSON (JSON completo) ou FIREBASE_SERVICE_ACCOUNT_BASE64 no ambiente do deploy.'
    );
  }
  admin.initializeApp({ credential: admin.credential.cert(sa) });
  return admin;
}
