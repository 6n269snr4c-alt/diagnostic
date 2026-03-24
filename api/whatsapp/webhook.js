// api/whatsapp/webhook.js
// Versão SIMPLIFICADA - SEM validação (apenas para testes)
 
export default async function handler(req, res) {
  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  try {
    // 1. EXTRAIR dados da mensagem do Twilio
    const { From, Body, MessageSid } = req.body;
    const phoneNumber = From ? From.replace('whatsapp:', '') : 'unknown';
 
    console.log('📱 Mensagem recebida:', {
      de: phoneNumber,
      texto: Body,
      id: MessageSid
    });
 
    // 2. RESPONDER de volta (eco simples)
    const respostaTexto = `Olá! Recebi sua mensagem: "${Body}"\n\n🔧 O Fluxa WhatsApp está em construção. Em breve você poderá consultar seus dados financeiros por aqui!`;
 
    await enviarWhatsApp(phoneNumber, respostaTexto);
 
    // 3. RETORNAR sucesso
    return res.status(200).json({ 
      status: 'success',
      mensagemEnviada: respostaTexto 
    });
 
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
 
// ============================================
// FUNÇÃO: Enviar mensagem via Twilio
// ============================================
async function enviarWhatsApp(paraNumero, texto) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const deNumero = process.env.TWILIO_WHATSAPP_NUMBER;
 
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
 
  const body = new URLSearchParams({
    From: deNumero,
    To: `whatsapp:${paraNumero}`,
    Body: texto
  });
 
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body
  });
 
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro Twilio: ${response.status} - ${errorText}`);
  }
 
  return await response.json();
}
 
