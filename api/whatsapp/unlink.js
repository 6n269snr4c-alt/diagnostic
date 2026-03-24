import { getAdmin } from '../_lib/firebaseAdmin.js';

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

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    const batch = db.batch();

    if (userSnap.exists) {
      const phone = userSnap.data()?.whatsappPhoneE164;
      if (phone) {
        const digits = String(phone).replace(/\D/g, '');
        if (digits) {
          batch.delete(db.collection('whatsappPhoneToUser').doc(digits));
        }
      }
      batch.update(userRef, {
        whatsappPhoneE164: admin.firestore.FieldValue.delete(),
        whatsappLinkedAt: admin.firestore.FieldValue.delete()
      });
    }

    const pending = await db.collection('whatsappUserLinkCode').doc(uid).get();
    if (pending.exists && pending.data()?.code) {
      batch.delete(db.collection('whatsappLinkCodes').doc(pending.data().code));
    }
    batch.delete(db.collection('whatsappUserLinkCode').doc(uid));

    await batch.commit();
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('whatsapp unlink:', e);
    return res.status(401).json({ error: 'Sessão inválida ou erro ao desvincular' });
  }
}
