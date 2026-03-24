import { getAdmin } from './firebaseAdmin.js';

export function normalizeWhatsappE164(fromRaw) {
  if (!fromRaw) return '';
  const raw = String(fromRaw).replace(/^whatsapp:/i, '').trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return `+${digits}`;
}

/**
 * Confirma vínculo após usuário enviar "FLUXA CODE" pelo WhatsApp.
 */
export async function completeWhatsAppLink(code, phoneE164) {
  const admin = getAdmin();
  const db = admin.firestore();
  const codeRef = db.collection('whatsappLinkCodes').doc(code);
  const snap = await codeRef.get();
  if (!snap.exists) return { ok: false, reason: 'invalid' };
  const { uid, expiresAt } = snap.data();
  if (!expiresAt || expiresAt.toMillis() < Date.now()) {
    await codeRef.delete().catch(() => {});
    return { ok: false, reason: 'expired' };
  }

  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) return { ok: false, reason: 'nouser' };

  const phoneDigits = phoneE164.replace(/\D/g, '');
  const indexRef = db.collection('whatsappPhoneToUser').doc(phoneDigits);
  const prevIndexSnap = await indexRef.get();

  const batch = db.batch();
  batch.delete(codeRef);
  batch.delete(db.collection('whatsappUserLinkCode').doc(uid));

  if (prevIndexSnap.exists && prevIndexSnap.data().uid !== uid) {
    batch.update(db.collection('users').doc(prevIndexSnap.data().uid), {
      whatsappPhoneE164: admin.firestore.FieldValue.delete(),
      whatsappLinkedAt: admin.firestore.FieldValue.delete()
    });
  }

  const oldPhone = userSnap.data()?.whatsappPhoneE164;
  if (oldPhone) {
    const oldDigits = String(oldPhone).replace(/\D/g, '');
    if (oldDigits && oldDigits !== phoneDigits) {
      batch.delete(db.collection('whatsappPhoneToUser').doc(oldDigits));
    }
  }

  batch.set(indexRef, { uid, linkedAt: admin.firestore.FieldValue.serverTimestamp() });
  batch.set(
    userRef,
    {
      whatsappPhoneE164: phoneE164,
      whatsappLinkedAt: admin.firestore.FieldValue.serverTimestamp()
    },
  );

  await batch.commit();
  return { ok: true };
}

export async function getUidForWhatsappPhone(phoneE164) {
  const digits = phoneE164.replace(/\D/g, '');
  if (!digits) return null;
  const admin = getAdmin();
  const snap = await admin.firestore().collection('whatsappPhoneToUser').doc(digits).get();
  if (!snap.exists) return null;
  return snap.data()?.uid || null;
}

export async function getUserWhatsappContext(uid) {
  const admin = getAdmin();
  const snap = await admin.firestore().collection('users').doc(uid).get();
  if (!snap.exists) return { contextText: '', advisorId: null };
  const d = snap.data();
  return {
    contextText: typeof d.whatsappContextText === 'string' ? d.whatsappContextText : '',
    advisorId: d.advisor || null
  };
}
