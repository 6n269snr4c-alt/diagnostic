export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lines, savedMappings } = req.body;
  if (!lines || !lines.length) {
    return res.status(400).json({ error: 'No lines provided' });
  }

  const categories = [
    { id: 'receita_bruta',            desc: 'Faturamento, vendas brutas, receita de serviços' },
    { id: 'deducao_receita',          desc: 'Impostos sobre venda (PIS, COFINS, ISS, ICMS), devoluções, abatimentos' },
    { id: 'custo_variavel',           desc: 'CMV, custo dos serviços prestados, matéria-prima, custo direto do produto' },
    { id: 'custo_variavel_comercial', desc: 'Comissões de venda, frete sobre vendas, embalagens — custos que variam com o volume de vendas mas não são o produto em si' },
    { id: 'despesa_comercial',        desc: 'Marketing, publicidade, propaganda — custos fixos de venda' },
    { id: 'despesa_pessoal',          desc: 'Salários, pró-labore, encargos, benefícios, folha de pagamento' },
    { id: 'despesa_administrativa',   desc: 'Aluguel, software, utilidades, serviços gerais, telefone, escritório' },
    { id: 'despesa_financeira',       desc: 'Juros, IOF, tarifas bancárias, despesas com empréstimos' },
    { id: 'imposto_lucro',            desc: 'Imposto de Renda (IR/IRPJ), CSLL — impostos sobre o LUCRO' },
    { id: 'depreciacao',              desc: 'Depreciação de ativos fixos, amortização' },
    { id: 'receita_nao_operacional',  desc: 'Receitas excepcionais, venda de ativos, juros recebidos, ganhos não operacionais' },
    { id: 'ignorar',                  desc: 'TOTAIS, subtotais, linhas de resultado (Lucro Bruto, EBITDA, Margem Bruta, Margem Contribuição, Resultado Líquido), linhas zeradas, cabeçalhos, percentuais' },
  ];

  const mappingsHint = savedMappings && Object.keys(savedMappings).length
    ? `\n\nReferência de classificações anteriores desta empresa (use como guia para contas similares):\n${
        Object.entries(savedMappings).slice(0, 40)
          .map(([k, v]) => `  "${k}" → ${v}`).join('\n')
      }`
    : '';

  const prompt = `Você é um contador especialista em DRE brasileiro. Classifique cada linha do DRE abaixo em uma das categorias.

CATEGORIAS DISPONÍVEIS:
${categories.map(c => `• ${c.id}: ${c.desc}`).join('\n')}

REGRAS CRÍTICAS:
1. Linhas de TOTAL ou RESULTADO (ex: "Total Receitas", "Lucro Bruto", "EBITDA", "Margem Bruta", "Margem Contribuição", "Resultado do Exercício", "Total Despesas") → SEMPRE "ignorar"
2. Receita líquida já calculada → "ignorar" (evitar dupla contagem)
3. Linhas com valor zero mencionadas → "ignorar"
4. Percentuais (%) → SEMPRE "ignorar"
5. COFINS, PIS, ISS, ICMS → SEMPRE "deducao_receita" (são impostos sobre FATURAMENTO, não sobre lucro)
6. IR, IRPJ, CSLL → "imposto_lucro" (são impostos sobre LUCRO)
7. Comissões de representantes/vendedores externos, frete sobre vendas, embalagens → "custo_variavel_comercial"
8. Em caso de dúvida entre pessoal e administrativa: pessoal tem salário/folha; administrativa é tudo mais
9. CMV, custo de mercadoria, custo dos serviços → "custo_variavel" (custo do produto em si)
${mappingsHint}

LINHAS DO DRE (índice | nome da conta | valor):
${lines.map((l, i) => `${i} | ${l.name} | R$ ${l.value.toFixed(2)}`).join('\n')}

Responda APENAS com JSON puro (sem markdown, sem texto antes ou depois):
{"classifications":[{"index":0,"category":"receita_bruta","confidence":"high"},{"index":1,"category":"ignorar","confidence":"high"},...]}

confidence: "high" = certeza, "medium" = provável, "low" = incerto`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: 'Claude API error: ' + err });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Strip any markdown fences just in case
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
