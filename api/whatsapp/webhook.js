// api/whatsapp/webhook.js
// Versão de TESTE - apenas recebe e loga, NÃO envia resposta
 
export default async function handler(req, res) {
  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  try {
    // 1. EXTRAIR dados da mensagem do Twilio
    const { From, Body, MessageSid } = req.body;
    const phoneNumber = From ? From.replace('whatsapp:', '') : 'unknown';
 
    console.log('🎉 WEBHOOK FUNCIONOU! Mensagem recebida:', {
      de: phoneNumber,
      texto: Body,
      id: MessageSid,
      timestamp: new Date().toISOString()
    });
 
    // 2. RETORNAR sucesso (SEM tentar enviar resposta)
    return res.status(200).json({ 
      status: 'success',
      message: 'Mensagem recebida com sucesso!',
      from: phoneNumber,
      body: Body
    });
 
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
