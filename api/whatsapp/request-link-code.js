import crypto from 'crypto';
import { getAdmin } from '../_lib/firebaseAdmin.js';

const TTL_MS = 15 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ error: 'idToken ausente' });
  }

  try {
    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const db = admin.firestore();

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + TTL_MS);

    const byUserRef = db.collection('whatsappUserLinkCode').doc(uid);
    const prev = await byUserRef.get();
    const batch = db.batch();

    if (prev.exists && prev.data()?.code) {
      batch.delete(db.collection('whatsappLinkCodes').doc(prev.data().code));
    }

    batch.set(db.collection('whatsappLinkCodes').doc(code), { uid, expiresAt });
    batch.set(byUserRef, { code, expiresAt });

    await batch.commit();

    return res.status(200).json({ code, expiresInMinutes: 15 });
  } catch (e) {
    console.error('request-link-code:', e);
    const msg = e.code === 'auth/argument-error' || e.code === 'auth/id-token-expired'
      ? 'Sessão inválida ou expirada — entre de novo no app.'
      : e.message || 'Erro ao gerar código';
    return res.status(401).json({ error: msg });
  }
}
