
// ═══════════════════════════════════════════
// CASHFLOW MODULE - SAÚDE DE CAIXA
// Módulo independente - não afeta DRE
// ═══════════════════════════════════════════

// ── IMPORT / UPLOAD ────────────────────────────────────────────────

function importExtrato() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.ofx,.csv,.txt';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = evt => {
      parseExtrato(evt.target.result, file.name);
    };
    reader.readAsText(file);
  };
  input.click();
}

// Variável temporária para preview
let _pendingExtrato = null;

function parseExtrato(content, filename) {
  let transactions = [];
  
  // Detectar formato
  if (filename.toLowerCase().endsWith('.ofx')) {
    transactions = parseOFX(content);
  } else if (filename.toLowerCase().endsWith('.csv') || filename.toLowerCase().endsWith('.txt')) {
    transactions = parseCSV(content);
  }
  
  if (!transactions.length) {
    toast('❌ Nenhuma transação encontrada no arquivo');
    return;
  }
  
  // Auto-detectar banco
  const bancoDetectado = detectarBanco(filename, content);
  
  // Detectar período
  const sorted = [...transactions].sort((a,b) => a.date.localeCompare(b.date));
  const firstDate = new Date(sorted[0].date);
  const lastDate = new Date(sorted[sorted.length - 1].date);
  
  // Calcular resumo
  const totalIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + Math.abs(t.value), 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + Math.abs(t.value), 0);
  const saldo = totalIn - totalOut;
  
  // Gerar ID do período (ano-mes)
  const periodoId = `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}`;
  
  // Verificar se já existem extratos no período
  const extratosDoPeriodo = (S.extratos || []).filter(e => e.periodoId === periodoId);
  
  // Guardar temporariamente
  _pendingExtrato = {
    filename,
    transactions,
    firstDate,
    lastDate,
    periodoId,
    totalIn,
    totalOut,
    saldo,
    bancoDetectado,
    extratosDoPeriodo
  };
  
  // Mostrar modal de confirmação
  showExtratoConfirmModal();
}

function detectarBanco(filename, content) {
  const fn = filename.toLowerCase();
  const ct = content.toLowerCase();
  
  // Detectar por nome do arquivo
  if (fn.includes('bradesco')) return 'Bradesco';
  if (fn.includes('itau') || fn.includes('itaú')) return 'Itaú';
  if (fn.includes('santander')) return 'Santander';
  if (fn.includes('bb') || fn.includes('banco do brasil')) return 'Banco do Brasil';
  if (fn.includes('caixa')) return 'Caixa Econômica';
  if (fn.includes('nubank') || fn.includes('nu ')) return 'Nubank';
  if (fn.includes('inter')) return 'Inter';
  if (fn.includes('c6')) return 'C6 Bank';
  if (fn.includes('btg')) return 'BTG Pactual';
  if (fn.includes('safra')) return 'Safra';
  if (fn.includes('sicredi')) return 'Sicredi';
  
  // Detectar por conteúdo OFX (BANKID)
  const bankIdMatch = /<BANKID>(\d+)/.exec(content);
  if (bankIdMatch) {
    const codes = {
      '001': 'Banco do Brasil',
      '033': 'Santander',
      '104': 'Caixa Econômica',
      '237': 'Bradesco',
      '341': 'Itaú',
      '260': 'Nubank',
      '077': 'Inter',
      '336': 'C6 Bank',
      '208': 'BTG Pactual'
    };
    if (codes[bankIdMatch[1]]) return codes[bankIdMatch[1]];
  }
  
  // Detectar por conteúdo textual
  if (ct.includes('bradesco')) return 'Bradesco';
  if (ct.includes('itaú') || ct.includes('itau')) return 'Itaú';
  if (ct.includes('santander')) return 'Santander';
  if (ct.includes('nubank')) return 'Nubank';
  
  return null;
}

function showExtratoConfirmModal() {
  const p = _pendingExtrato;
  if (!p) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.id = 'extratoConfirmModal';
  modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;align-items:center;justify-content:center;padding:20px';
  
  const formatDate = d => d.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'});
  const mesLabel = MES[p.firstDate.getMonth()] + '/' + p.firstDate.getFullYear();
  
  // Inicializar contas se não existir
  if (!S.contasBancarias) S.contasBancarias = [];
  
  // Tentar encontrar conta existente do banco detectado
  let contaSugerida = null;
  if (p.bancoDetectado) {
    contaSugerida = S.contasBancarias.find(c => c.banco === p.bancoDetectado);
  }
  
  // Dropdown de contas
  let contasOptions = '<option value="">Selecione a conta...</option>';
  S.contasBancarias.forEach(c => {
    const selected = contaSugerida && c.id === contaSugerida.id ? ' selected' : '';
    contasOptions += `<option value="${c.id}"${selected}>${c.nome} · ${c.banco}</option>`;
  });
  contasOptions += '<option value="nova">+ Adicionar nova conta</option>';
  
  modal.innerHTML = `
    <div style="background:#0c1628;border:1px solid rgba(0,232,155,.3);border-radius:16px;max-width:520px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.8)">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,.08)">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:var(--teal);margin-bottom:4px">
          ✅ EXTRATO PROCESSADO
        </div>
        <div style="font-size:11px;color:var(--mut)">Revise os dados antes de confirmar a importação</div>
      </div>
      
      <div style="padding:24px 28px">
        <!-- Arquivo -->
        <div style="margin-bottom:16px;padding:12px 16px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06)">
          <div style="font-size:10px;letter-spacing:1px;color:var(--mut);font-weight:700;margin-bottom:4px">ARQUIVO</div>
          <div style="font-size:13px;color:#eef4ff;font-weight:600">${p.filename}</div>
        </div>
        
        <!-- Período -->
        <div style="margin-bottom:16px;padding:12px 16px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06)">
          <div style="font-size:10px;letter-spacing:1px;color:var(--mut);font-weight:700;margin-bottom:4px">PERÍODO DETECTADO</div>
          <div style="font-size:13px;color:#eef4ff;font-weight:600">${formatDate(p.firstDate)} a ${formatDate(p.lastDate)}</div>
          <div style="font-size:11px;color:var(--teal);margin-top:2px">${p.transactions.length} transações · ${mesLabel}</div>
        </div>
        
        <!-- Seleção de Conta (NOVO) -->
        <div style="margin-bottom:16px;padding:12px 16px;background:rgba(0,232,155,.06);border-radius:10px;border:1px solid rgba(0,232,155,.15)">
          <div style="font-size:10px;letter-spacing:1px;color:var(--teal);font-weight:700;margin-bottom:6px">💳 CONTA BANCÁRIA</div>
          ${p.bancoDetectado ? `<div style="font-size:10px;color:var(--mut);margin-bottom:6px">Banco detectado: <strong style="color:var(--teal)">${p.bancoDetectado}</strong></div>` : ''}
          <select id="extratoContaSelect" onchange="handleContaSelectChange()" style="width:100%;padding:8px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:13px;font-family:'Outfit',sans-serif;outline:none;cursor:pointer">
            ${contasOptions}
          </select>
        </div>
        
        <!-- Form nova conta (hidden inicialmente) -->
        <div id="novaContaForm" style="display:none;margin-bottom:16px;padding:12px 16px;background:rgba(0,232,155,.06);border-radius:10px;border:1px solid rgba(0,232,155,.15)">
          <div style="font-size:10px;letter-spacing:1px;color:var(--teal);font-weight:700;margin-bottom:8px">NOVA CONTA</div>
          <input type="text" id="novaContaNome" placeholder="Nome da conta (ex: Bradesco PJ)" style="width:100%;padding:8px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:13px;margin-bottom:8px;font-family:'Outfit',sans-serif;outline:none;box-sizing:border-box" value="${p.bancoDetectado ? p.bancoDetectado + ' - Principal' : ''}">
          <select id="novaContaBanco" style="width:100%;padding:8px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:13px;margin-bottom:8px;font-family:'Outfit',sans-serif;outline:none;cursor:pointer;box-sizing:border-box">
            <option value="">Selecione o banco...</option>
            <option value="Banco do Brasil"${p.bancoDetectado === 'Banco do Brasil' ? ' selected' : ''}>Banco do Brasil</option>
            <option value="Bradesco"${p.bancoDetectado === 'Bradesco' ? ' selected' : ''}>Bradesco</option>
            <option value="BTG Pactual"${p.bancoDetectado === 'BTG Pactual' ? ' selected' : ''}>BTG Pactual</option>
            <option value="C6 Bank"${p.bancoDetectado === 'C6 Bank' ? ' selected' : ''}>C6 Bank</option>
            <option value="Caixa Econômica"${p.bancoDetectado === 'Caixa Econômica' ? ' selected' : ''}>Caixa Econômica</option>
            <option value="Inter"${p.bancoDetectado === 'Inter' ? ' selected' : ''}>Inter</option>
            <option value="Itaú"${p.bancoDetectado === 'Itaú' ? ' selected' : ''}>Itaú</option>
            <option value="Nubank"${p.bancoDetectado === 'Nubank' ? ' selected' : ''}>Nubank</option>
            <option value="Safra"${p.bancoDetectado === 'Safra' ? ' selected' : ''}>Safra</option>
            <option value="Santander"${p.bancoDetectado === 'Santander' ? ' selected' : ''}>Santander</option>
            <option value="Sicredi"${p.bancoDetectado === 'Sicredi' ? ' selected' : ''}>Sicredi</option>
            <option value="Outro">Outro</option>
          </select>
          <select id="novaContaTipo" style="width:100%;padding:8px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:13px;font-family:'Outfit',sans-serif;outline:none;cursor:pointer;box-sizing:border-box">
            <option value="corrente">Conta Corrente</option>
            <option value="poupanca">Poupança</option>
            <option value="investimento">Investimentos</option>
            <option value="cartao">Cartão de Crédito</option>
          </select>
        </div>
        
        <!-- Resumo Financeiro -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
          <div style="padding:12px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:10px;text-align:center">
            <div style="font-size:9px;letter-spacing:1px;color:#10b981;font-weight:700;margin-bottom:4px">ENTRADAS</div>
            <div style="font-size:16px;font-weight:800;color:#10b981">${fmtV(p.totalIn, 'R$')}</div>
          </div>
          <div style="padding:12px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px;text-align:center">
            <div style="font-size:9px;letter-spacing:1px;color:#ef4444;font-weight:700;margin-bottom:4px">SAÍDAS</div>
            <div style="font-size:16px;font-weight:800;color:#ef4444">${fmtV(p.totalOut, 'R$')}</div>
          </div>
          <div style="padding:12px;background:rgba(0,232,155,.08);border:1px solid rgba(0,232,155,.2);border-radius:10px;text-align:center">
            <div style="font-size:9px;letter-spacing:1px;color:var(--teal);font-weight:700;margin-bottom:4px">SALDO</div>
            <div style="font-size:16px;font-weight:800;color:${p.saldo >= 0 ? 'var(--teal)' : '#ef4444'}">${fmtV(p.saldo, 'R$')}</div>
          </div>
        </div>
        
        ${p.extratosDoPeriodo.length > 0 ? `
        <!-- Info de consolidação -->
        <div style="padding:12px 16px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.3);border-radius:10px;margin-bottom:16px">
          <div style="font-size:11px;color:#3b82f6;line-height:1.6">
            <strong>💡 Info:</strong> Já existe${p.extratosDoPeriodo.length > 1 ? 'm' : ''} ${p.extratosDoPeriodo.length} extrato(s) para ${mesLabel}. 
            ${p.extratosDoPeriodo.map(e => {
              const conta = S.contasBancarias.find(c => c.id === e.contaId);
              return conta ? conta.nome : 'Conta sem nome';
            }).join(', ')}.
            Este extrato será <strong>consolidado</strong> com os existentes.
          </div>
        </div>
        ` : ''}
      </div>
      
      <div style="padding:16px 28px 24px;display:flex;gap:10px;justify-content:flex-end">
        <button onclick="closeExtratoConfirmModal()" class="btn-cancel" style="padding:10px 20px;font-size:13px">
          Cancelar
        </button>
        <button onclick="confirmExtratoImport()" class="bs" style="padding:10px 24px;font-size:13px;font-weight:700">
          ✓ Confirmar Importação
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function handleContaSelectChange() {
  const select = document.getElementById('extratoContaSelect');
  const form = document.getElementById('novaContaForm');
  
  if (select.value === 'nova') {
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}

function closeExtratoConfirmModal() {
  const modal = document.getElementById('extratoConfirmModal');
  if (modal) modal.remove();
  _pendingExtrato = null;
}

function confirmExtratoImport() {
  if (!_pendingExtrato) return;
  
  const p = _pendingExtrato;
  const contaSelect = document.getElementById('extratoContaSelect');
  
  if (!contaSelect || !contaSelect.value) {
    toast('⚠️ Selecione uma conta bancária');
    return;
  }
  
  let contaId = null;
  
  // Se selecionou "nova", criar conta
  if (contaSelect.value === 'nova') {
    const nomeInput = document.getElementById('novaContaNome');
    const bancoSelect = document.getElementById('novaContaBanco');
    const tipoSelect = document.getElementById('novaContaTipo');
    
    if (!nomeInput.value.trim()) {
      toast('⚠️ Digite o nome da conta');
      nomeInput.focus();
      return;
    }
    
    if (!bancoSelect.value) {
      toast('⚠️ Selecione o banco');
      bancoSelect.focus();
      return;
    }
    
    // Criar nova conta
    if (!S.contasBancarias) S.contasBancarias = [];
    const novaConta = {
      id: Date.now(),
      nome: nomeInput.value.trim(),
      banco: bancoSelect.value,
      tipo: tipoSelect.value,
      criadoEm: new Date().toISOString()
    };
    S.contasBancarias.push(novaConta);
    contaId = novaConta.id;
    toast(`✅ Conta "${novaConta.nome}" criada`);
  } else {
    contaId = parseInt(contaSelect.value);
  }
  
  // Inicializar array se necessário
  if (!S.extratos) S.extratos = [];
  
  // Adicionar novo extrato
  const conta = S.contasBancarias.find(c => c.id === contaId);
  S.extratos.push({
    id: Date.now(),
    filename: p.filename,
    periodoId: p.periodoId,
    contaId: contaId,
    contaNome: conta ? conta.nome : 'Sem nome',
    banco: conta ? conta.banco : 'Desconhecido',
    importedAt: new Date().toISOString(),
    firstDate: p.firstDate.toISOString().split('T')[0],
    lastDate: p.lastDate.toISOString().split('T')[0],
    totalIn: p.totalIn,
    totalOut: p.totalOut,
    saldo: p.saldo,
    transactions: p.transactions,
    count: p.transactions.length
  });
  
  sv();
  closeExtratoConfirmModal();
  
  const mesLabel = MES[p.firstDate.getMonth()] + '/' + p.firstDate.getFullYear();
  toast(`✅ ${p.transactions.length} transações importadas · ${conta ? conta.nome : ''} · ${mesLabel}`);
  
  // Atualizar página de cashflow se estiver aberta
  const cashflowPage = document.getElementById('page-cashflow');
  if (cashflowPage && cashflowPage.classList.contains('active')) {
    rCashflow();
  }
  
  // Atualizar lançamentos se estiver aberta
  const lancPage = document.getElementById('page-lancamentos');
  if (lancPage && lancPage.classList.contains('active')) {
    rLancamentos();
  }
}

// ── PARSERS ────────────────────────────────────────────────────────

function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return []; // Precisa de pelo menos header + 1 linha
  
  const transactions = [];
  
  // Tentar detectar separador
  const sep = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ';' : ',';
  
  // Parse do header (primeira linha)
  const header = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/[^a-záéíóúàâêôãõç0-9]/g, ''));
  
  // Detectar índices de colunas importantes
  const colIdx = {
    data: -1,
    desc: -1,
    valor: -1,
    debito: -1,
    credito: -1,
    tipo: -1,
    entrada: -1,
    saida: -1
  };
  
  header.forEach((h, i) => {
    // Data
    if (/data|date|dt|dia/.test(h)) colIdx.data = i;
    
    // Descrição
    if (/descri[cç][aã]o|hist[oó]rico|memo|obs|observ|lanc|movimento|conta/.test(h) && colIdx.desc === -1) {
      colIdx.desc = i;
    }
    
    // Valor único
    if (/^valor|vlr|montante|amount/.test(h) && colIdx.valor === -1) colIdx.valor = i;
    
    // Débito/Crédito separados
    if (/d[eé]bito|debito|saida|sa[ií]da|pago|pagamento/.test(h)) colIdx.debito = i;
    if (/cr[eé]dito|credito|entrada|recebimento|receb/.test(h)) colIdx.credito = i;
    
    // Entrada/Saída explícitas
    if (/^entrada/.test(h)) colIdx.entrada = i;
    if (/^saida|sa[ií]da/.test(h)) colIdx.saida = i;
    
    // Tipo (D/C, E/S, etc)
    if (/^tipo|^dc|^es|natureza/.test(h)) colIdx.tipo = i;
  });
  
  // Fallback: se não achou data, pegar primeira coluna que parece data
  if (colIdx.data === -1) {
    for (let i = 0; i < Math.min(header.length, 5); i++) {
      const sample = lines[1]?.split(sep)[i]?.trim();
      if (sample && parseDate(sample)) {
        colIdx.data = i;
        break;
      }
    }
  }
  
  // Fallback: se não achou descrição, pegar primeira coluna de texto não-data não-valor
  if (colIdx.desc === -1) {
    for (let i = 0; i < header.length; i++) {
      if (i === colIdx.data || i === colIdx.valor || i === colIdx.debito || i === colIdx.credito) continue;
      const sample = lines[1]?.split(sep)[i]?.trim();
      if (sample && sample.length > 2 && !/^[\d.,\-+]+$/.test(sample)) {
        colIdx.desc = i;
        break;
      }
    }
  }
  
  // Processar linhas de dados (pular header)
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < 2) continue;
    
    // Extrair data
    let date = null;
    if (colIdx.data >= 0 && cols[colIdx.data]) {
      date = parseDate(cols[colIdx.data]);
    }
    if (!date) {
      // Tentar encontrar data em qualquer coluna
      for (let j = 0; j < Math.min(cols.length, 5); j++) {
        date = parseDate(cols[j]);
        if (date) break;
      }
    }
    if (!date) continue; // Sem data, pular linha
    
    // Extrair valor
    let value = null;
    let type = null;
    
    // Caso 1: Tem coluna de valor único
    if (colIdx.valor >= 0 && cols[colIdx.valor]) {
      value = parseValue(cols[colIdx.valor]);
      // Detectar tipo pela coluna "Tipo" ou pelo sinal do valor
      if (colIdx.tipo >= 0 && cols[colIdx.tipo]) {
        const tipoStr = cols[colIdx.tipo].toLowerCase();
        if (/^c|cr[eé]d|entrada|e|receb|\+/.test(tipoStr)) {
          type = 'in';
          value = Math.abs(value);
        } else if (/^d|d[eé]b|saida|sa[ií]da|s|pag|\-/.test(tipoStr)) {
          type = 'out';
          value = -Math.abs(value);
        }
      }
      // Se não tem coluna tipo, usar sinal do valor
      if (!type) {
        type = value >= 0 ? 'in' : 'out';
      }
    }
    // Caso 2: Tem colunas Débito/Crédito separadas
    else if (colIdx.debito >= 0 || colIdx.credito >= 0) {
      const debito = colIdx.debito >= 0 ? parseValue(cols[colIdx.debito]) : 0;
      const credito = colIdx.credito >= 0 ? parseValue(cols[colIdx.credito]) : 0;
      
      if (credito > 0) {
        value = credito;
        type = 'in';
      } else if (debito > 0) {
        value = -debito;
        type = 'out';
      }
    }
    // Caso 3: Tem colunas Entrada/Saída separadas
    else if (colIdx.entrada >= 0 || colIdx.saida >= 0) {
      const entrada = colIdx.entrada >= 0 ? parseValue(cols[colIdx.entrada]) : 0;
      const saida = colIdx.saida >= 0 ? parseValue(cols[colIdx.saida]) : 0;
      
      if (entrada > 0) {
        value = entrada;
        type = 'in';
      } else if (saida > 0) {
        value = -saida;
        type = 'out';
      }
    }
    // Caso 4: Fallback - procurar valor em qualquer coluna
    else {
      for (let j = 0; j < cols.length; j++) {
        if (j === colIdx.data || j === colIdx.desc) continue;
        const v = parseValue(cols[j]);
        if (v !== null && Math.abs(v) > 0.01) {
          value = v;
          type = v >= 0 ? 'in' : 'out';
          break;
        }
      }
    }
    
    if (value === null || Math.abs(value) < 0.01) continue; // Sem valor válido, pular
    
    // Extrair descrição
    let desc = '';
    if (colIdx.desc >= 0 && cols[colIdx.desc]) {
      desc = cols[colIdx.desc];
    } else {
      // Coletar texto de colunas não-data não-valor
      for (let j = 0; j < cols.length; j++) {
        if (j === colIdx.data || j === colIdx.valor || j === colIdx.debito || j === colIdx.credito) continue;
        if (cols[j] && cols[j].length > 2 && !/^[\d.,\-+]+$/.test(cols[j])) {
          if (desc) desc += ' ';
          desc += cols[j];
        }
      }
    }
    
    transactions.push({
      date: date.toISOString().split('T')[0],
      desc: desc || 'Sem descrição',
      value: value,
      type: type
    });
  }
  
  return transactions;
}

function parseValue(str) {
  if (!str) return null;
  
  // Remover tudo exceto números, vírgula, ponto e sinal
  let clean = str.replace(/[^\d.,-]/g, '');
  
  // Se vazio, retornar null
  if (!clean) return null;
  
  // Detectar formato brasileiro (1.500,00) vs americano (1,500.00)
  const temVirgula = clean.includes(',');
  const temPonto = clean.includes('.');
  
  if (temVirgula && temPonto) {
    // Tem ambos - descobrir qual é separador decimal
    const posVirgula = clean.lastIndexOf(',');
    const posPonto = clean.lastIndexOf('.');
    
    if (posVirgula > posPonto) {
      // Vírgula depois do ponto = formato brasileiro (1.500,00)
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // Ponto depois da vírgula = formato americano (1,500.00)
      clean = clean.replace(/,/g, '');
    }
  } else if (temVirgula && !temPonto) {
    // Só vírgula - pode ser decimal brasileiro ou separador de milhar
    const parts = clean.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      // Provavelmente decimal brasileiro (1500,00)
      clean = clean.replace(',', '.');
    } else {
      // Provavelmente separador de milhar (1,500)
      clean = clean.replace(/,/g, '');
    }
  }
  
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

function parseOFX(content) {
  const transactions = [];
  
  // Regex para capturar blocos STMTTRN
  const regex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const block = match[1];
    
    // Extrair campos
    const dtMatch = /<DTPOSTED>(\d{8})/.exec(block);
    const amtMatch = /<TRNAMT>([-\d.]+)/.exec(block);
    const memoMatch = /<MEMO>(.*?)(?:<\/MEMO>|<)/.exec(block);
    const nameMatch = /<NAME>(.*?)(?:<\/NAME>|<)/.exec(block);
    
    if (!dtMatch || !amtMatch) continue;
    
    const dateStr = dtMatch[1];
    const value = parseFloat(amtMatch[1]);
    const desc = (memoMatch ? memoMatch[1] : '') || (nameMatch ? nameMatch[1] : '') || 'Sem descrição';
    
    transactions.push({
      date: `${dateStr.substr(0,4)}-${dateStr.substr(4,2)}-${dateStr.substr(6,2)}`,
      desc: desc.trim(),
      value: value,
      type: value > 0 ? 'in' : 'out'
    });
  }
  
  return transactions;
}

function parseDate(str) {
  if (!str) return null;
  str = str.trim();
  
  // dd/mm/yyyy ou dd/mm/yy
  const m1 = /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/.exec(str);
  if (m1) {
    let y = parseInt(m1[3]);
    if (y < 100) y += 2000;
    const d = new Date(y, parseInt(m1[2]) - 1, parseInt(m1[1]));
    return isNaN(d.getTime()) ? null : d;
  }
  
  // yyyy-mm-dd ou yyyy/mm/dd
  const m2 = /^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/.exec(str);
  if (m2) {
    const d = new Date(parseInt(m2[1]), parseInt(m2[2]) - 1, parseInt(m2[3]));
    return isNaN(d.getTime()) ? null : d;
  }
  
  // yyyymmdd
  const m3 = /^(\d{8})$/.exec(str);
  if (m3) {
    const d = new Date(parseInt(str.substr(0,4)), parseInt(str.substr(4,2)) - 1, parseInt(str.substr(6,2)));
    return isNaN(d.getTime()) ? null : d;
  }
  
  return null;
}

// ── ANÁLISE ────────────────────────────────────────────────────────

function analyzeCashflow(transactions) {
  if (!transactions || !transactions.length) return null;
  
  // Ordenar por data
  const sorted = [...transactions].sort((a,b) => a.date.localeCompare(b.date));
  
  // Calcular saldo (assumir inicial = 0, apenas variação)
  let saldo = 0;
  sorted.forEach(t => saldo += t.value);
  
  // Últimos 30 dias
  const hoje = new Date();
  const dias30 = new Date(hoje.getTime() - 30*24*60*60*1000);
  const recent = sorted.filter(t => new Date(t.date) >= dias30);
  
  const entradas = recent.filter(t => t.type === 'in');
  const saidas = recent.filter(t => t.type === 'out');
  
  const totalIn = entradas.reduce((sum, t) => sum + Math.abs(t.value), 0);
  const totalOut = saidas.reduce((sum, t) => sum + Math.abs(t.value), 0);
  
  const mediaSaidaDia = totalOut / 30;
  const diasCaixa = mediaSaidaDia > 0 ? Math.floor(Math.abs(saldo) / mediaSaidaDia) : 999;
  
  // Tendência (primeira metade vs segunda metade)
  const metade = Math.floor(recent.length / 2);
  const saldo1 = recent.slice(0, metade).reduce((s,t) => s + t.value, 0);
  const saldo2 = recent.slice(metade).reduce((s,t) => s + t.value, 0);
  const tendencia = saldo2 > saldo1 * 1.1 ? 'up' : saldo2 < saldo1 * 0.9 ? 'down' : 'stable';
  
  // Maior entrada/saída
  const maiorEntrada = entradas.length ? entradas.sort((a,b) => Math.abs(b.value) - Math.abs(a.value))[0] : null;
  const maiorSaida = saidas.length ? saidas.sort((a,b) => Math.abs(b.value) - Math.abs(a.value))[0] : null;
  
  // Agrupar por mês
  const byMonth = {};
  sorted.forEach(t => {
    const mes = t.date.substr(0,7);
    if (!byMonth[mes]) byMonth[mes] = {in: 0, out: 0};
    if (t.type === 'in') byMonth[mes].in += Math.abs(t.value);
    else byMonth[mes].out += Math.abs(t.value);
  });
  
  // Detectar padrões (simplificado - picos de entrada/saída por dia do mês)
  const byDay = {};
  sorted.forEach(t => {
    const day = new Date(t.date).getDate();
    if (!byDay[day]) byDay[day] = {in: [], out: []};
    if (t.type === 'in') byDay[day].in.push(Math.abs(t.value));
    else byDay[day].out.push(Math.abs(t.value));
  });
  
  const patterns = [];
  Object.keys(byDay).forEach(day => {
    const d = byDay[day];
    if (d.in.length >= 2) {
      const avg = d.in.reduce((s,v)=>s+v,0) / d.in.length;
      if (avg > totalIn * 0.15) {
        patterns.push({type: 'in', day: parseInt(day), avg: avg, count: d.in.length});
      }
    }
    if (d.out.length >= 2) {
      const avg = d.out.reduce((s,v)=>s+v,0) / d.out.length;
      if (avg > totalOut * 0.15) {
        patterns.push({type: 'out', day: parseInt(day), avg: avg, count: d.out.length});
      }
    }
  });
  
  return {
    saldo,
    diasCaixa,
    totalIn,
    totalOut,
    mediaSaidaDia,
    tendencia,
    maiorEntrada,
    maiorSaida,
    byMonth,
    patterns: patterns.sort((a,b) => b.avg - a.avg).slice(0, 3)
  };
}

// ── RENDER ─────────────────────────────────────────────────────────

function rCashflow() {
  const body = document.getElementById('cashflowBody');
  if (!body) return;
  
  body.innerHTML = '';
  
  if (!S.extratos || !S.extratos.length) {
    body.innerHTML = `
      <div style="text-align:center;padding:80px 20px;color:var(--mut)">
        <div style="font-size:48px;margin-bottom:16px">💰</div>
        <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px">
          Nenhum extrato importado
        </div>
        <div style="font-size:13px;margin-bottom:24px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.6">
          Importe um extrato bancário (OFX ou CSV) para ver análises automáticas de fluxo de caixa, tendências, padrões e projeções — tudo sem configuração.
        </div>
        <button class="bs" onclick="importExtrato()">📤 Importar Primeiro Extrato</button>
      </div>
    `;
    return;
  }
  
  // Pegar filtro de conta (se existir)
  const contaFiltro = window._cashflowContaFiltro || 'todas';
  
  // Filtrar extratos
  let extratosParaAnalise = S.extratos;
  if (contaFiltro !== 'todas') {
    extratosParaAnalise = S.extratos.filter(e => e.contaId === parseInt(contaFiltro));
  }
  
  if (!extratosParaAnalise.length) {
    body.innerHTML = '<div style="padding:40px;text-align:center;color:var(--mut)">Nenhum extrato para a conta selecionada</div>';
    return;
  }
  
  // Pegar todas as transações
  const allTx = extratosParaAnalise.flatMap(e => e.transactions);
  const analysis = analyzeCashflow(allTx);
  
  if (!analysis) {
    body.innerHTML = '<div style="padding:40px;text-align:center;color:var(--mut)">Erro ao analisar extratos</div>';
    return;
  }
  
  // Semáforo de status
  const statusColor = analysis.diasCaixa >= 35 ? 'var(--green)' : 
                     analysis.diasCaixa >= 15 ? 'var(--amber)' : 'var(--red)';
  const statusLabel = analysis.diasCaixa >= 35 ? 'Saudável' : 
                     analysis.diasCaixa >= 15 ? 'Atenção' : 'Crítico';
  const statusIcon = analysis.diasCaixa >= 35 ? '🟢' : 
                    analysis.diasCaixa >= 15 ? '🟡' : '🔴';
  
  const tendIcon = analysis.tendencia === 'up' ? '📈' : 
                  analysis.tendencia === 'down' ? '📉' : '➡️';
  const tendLabel = analysis.tendencia === 'up' ? 'Subindo' : 
                   analysis.tendencia === 'down' ? 'Caindo' : 'Estável';
  const tendColor = analysis.tendencia === 'up' ? 'var(--green)' : 
                   analysis.tendencia === 'down' ? 'var(--red)' : 'var(--mut)';
  
  // Contagem de contas únicas
  const contasUnicas = [...new Set(S.extratos.map(e => e.contaId))];
  const numContas = contasUnicas.length;
  
  // Filtro de contas (se tiver mais de uma conta)
  let filtroHtml = '';
  if (numContas > 1) {
    filtroHtml = `
      <div style="margin-bottom:16px;padding:12px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--mut)">FILTRAR POR CONTA:</div>
        <select onchange="setCashflowContaFiltro(this.value)" style="padding:6px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:12px;font-family:'Outfit',sans-serif;outline:none;cursor:pointer">
          <option value="todas"${contaFiltro === 'todas' ? ' selected' : ''}>📊 Todas as contas (${numContas})</option>
          ${S.contasBancarias.filter(c => contasUnicas.includes(c.id)).map(c => `
            <option value="${c.id}"${contaFiltro == c.id ? ' selected' : ''}>💳 ${c.nome} · ${c.banco}</option>
          `).join('')}
        </select>
        ${contaFiltro !== 'todas' ? `<span style="font-size:11px;color:var(--teal)">✓ Exibindo apenas ${S.contasBancarias.find(c => c.id == contaFiltro)?.nome}</span>` : ''}
      </div>
    `;
  }
  
  // Render principal
  body.innerHTML = `
    <div style="margin-bottom:16px;padding:12px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;font-size:11px;color:var(--mut)">
      📊 ${extratosParaAnalise.length} extrato(s)${numContas > 1 ? ' · ' + numContas + ' conta(s)' : ''} · ${allTx.length} transações · Última importação: ${new Date(S.extratos[S.extratos.length-1].importedAt).toLocaleDateString('pt-BR')}
    </div>
    
    ${filtroHtml}
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:24px">
      
      <!-- Card 1: Saldo -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px">
        <div style="font-size:10px;letter-spacing:2px;font-weight:700;color:var(--mut);margin-bottom:8px">💰 SALDO VARIAÇÃO</div>
        <div style="font-size:28px;font-weight:800;color:${analysis.saldo >= 0 ? 'var(--teal)' : 'var(--red)'};line-height:1">${fmtV(analysis.saldo, 'R$')}</div>
        <div style="font-size:11px;color:${tendColor};margin-top:4px;font-weight:600">${tendIcon} ${tendLabel}</div>
      </div>
      
      <!-- Card 2: Dias de Caixa -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px">
        <div style="font-size:10px;letter-spacing:2px;font-weight:700;color:var(--mut);margin-bottom:8px">⏱️ DIAS DE SOBREVIVÊNCIA</div>
        <div style="font-size:28px;font-weight:800;color:${statusColor};line-height:1">${analysis.diasCaixa > 999 ? '∞' : analysis.diasCaixa}</div>
        <div style="font-size:11px;color:var(--mut);margin-top:4px">${statusIcon} ${statusLabel}</div>
      </div>
      
      <!-- Card 3: Maior Entrada -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px">
        <div style="font-size:10px;letter-spacing:2px;font-weight:700;color:var(--mut);margin-bottom:8px">📥 MAIOR ENTRADA</div>
        <div style="font-size:22px;font-weight:800;color:var(--green);line-height:1">${analysis.maiorEntrada ? fmtV(Math.abs(analysis.maiorEntrada.value), 'R$') : '—'}</div>
        <div style="font-size:10px;color:var(--mut);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${analysis.maiorEntrada?.desc || ''}">${analysis.maiorEntrada?.desc || '—'}</div>
      </div>
      
      <!-- Card 4: Maior Saída -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px">
        <div style="font-size:10px;letter-spacing:2px;font-weight:700;color:var(--mut);margin-bottom:8px">📤 MAIOR SAÍDA</div>
        <div style="font-size:22px;font-weight:800;color:var(--red);line-height:1">${analysis.maiorSaida ? fmtV(Math.abs(analysis.maiorSaida.value), 'R$') : '—'}</div>
        <div style="font-size:10px;color:var(--mut);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${analysis.maiorSaida?.desc || ''}">${analysis.maiorSaida?.desc || '—'}</div>
      </div>
      
    </div>
    
    <!-- Gráfico de Fluxo -->
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px;margin-bottom:24px">
      <div style="font-size:12px;letter-spacing:2px;font-weight:700;color:var(--mut);margin-bottom:16px">📊 FLUXO MENSAL</div>
      <div id="flowChart" style="width:100%;height:280px"></div>
    </div>
    
    ${analysis.patterns.length > 0 ? `
    <!-- Padrões Detectados -->
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px;margin-bottom:24px">
      <div style="font-size:12px;letter-spacing:2px;font-weight:700;color:var(--mut);margin-bottom:16px">🔁 PADRÕES DETECTADOS</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${analysis.patterns.map(p => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(255,255,255,.02);border-radius:8px">
            <div style="font-size:24px">${p.type === 'in' ? '📥' : '📤'}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:${p.type === 'in' ? 'var(--green)' : 'var(--red)'}">
                ${p.type === 'in' ? 'Entradas' : 'Saídas'} recorrentes dia ${p.day}
              </div>
              <div style="font-size:11px;color:var(--mut);margin-top:2px">
                Média de ${fmtV(p.avg, 'R$')} · ${p.count} ocorrências detectadas
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- Tabela Mensal -->
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px">
      <div style="font-size:12px;letter-spacing:2px;font-weight:700;color:var(--mut);margin-bottom:16px">📅 COMPARATIVO MENSAL</div>
      <div id="monthlyTable"></div>
    </div>
  `;
  
  // Renderizar tabela mensal
  renderMonthlyTable(analysis.byMonth);
  
  // Renderizar gráfico SVG
  renderFlowChart(analysis.byMonth);
}

function renderMonthlyTable(byMonth) {
  const table = document.getElementById('monthlyTable');
  if (!table) return;
  
  const months = Object.keys(byMonth).sort().reverse();
  
  let html = '<table style="width:100%;border-collapse:collapse;font-size:13px">';
  html += '<thead><tr style="border-bottom:2px solid rgba(255,255,255,.08)">';
  html += '<th style="text-align:left;padding:10px;font-size:10px;color:var(--mut);font-weight:700;letter-spacing:1px">MÊS</th>';
  html += '<th style="text-align:right;padding:10px;font-size:10px;color:var(--mut);font-weight:700;letter-spacing:1px">ENTRADAS</th>';
  html += '<th style="text-align:right;padding:10px;font-size:10px;color:var(--mut);font-weight:700;letter-spacing:1px">SAÍDAS</th>';
  html += '<th style="text-align:right;padding:10px;font-size:10px;color:var(--mut);font-weight:700;letter-spacing:1px">RESULTADO</th>';
  html += '</tr></thead><tbody>';
  
  months.forEach(mes => {
    const data = byMonth[mes];
    const resultado = data.in - data.out;
    const [ano, m] = mes.split('-');
    const mesLabel = MES[parseInt(m)-1] + '/' + ano;
    
    html += `<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
      <td style="padding:12px;color:var(--mut)">${mesLabel}</td>
      <td style="padding:12px;text-align:right;color:var(--green);font-weight:600">${fmtV(data.in, 'R$')}</td>
      <td style="padding:12px;text-align:right;color:var(--red);font-weight:600">${fmtV(data.out, 'R$')}</td>
      <td style="padding:12px;text-align:right;color:${resultado > 0 ? 'var(--green)' : 'var(--red)'};font-weight:700">${fmtV(resultado, 'R$')}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  table.innerHTML = html;
}

function renderFlowChart(byMonth) {
  const chart = document.getElementById('flowChart');
  if (!chart) return;
  
  const months = Object.keys(byMonth).sort();
  if (!months.length) {
    chart.innerHTML = '<div style="padding:40px;text-align:center;color:var(--mut);font-size:12px">Sem dados para exibir</div>';
    return;
  }
  
  const w = chart.clientWidth;
  const h = 280;
  const pad = {t: 20, r: 30, b: 40, l: 60};
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  
  // Preparar dados
  const data = months.map(m => {
    const [ano, mes] = m.split('-');
    return {
      label: MES[parseInt(mes)-1],
      in: byMonth[m].in,
      out: byMonth[m].out,
      result: byMonth[m].in - byMonth[m].out
    };
  });
  
  // Escalas
  const maxVal = Math.max(...data.map(d => Math.max(d.in, d.out)));
  const yScale = v => pad.t + ch - (v / maxVal * ch);
  const xStep = cw / (data.length - 1 || 1);
  
  // SVG
  let svg = `<svg width="${w}" height="${h}" style="overflow:visible">`;
  
  // Grid horizontal
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (ch / 4) * i;
    const val = maxVal * (1 - i/4);
    svg += `<line x1="${pad.l}" y1="${y}" x2="${w-pad.r}" y2="${y}" stroke="rgba(255,255,255,.05)" stroke-width="1"/>`;
    svg += `<text x="${pad.l-10}" y="${y+4}" text-anchor="end" font-size="10" fill="var(--mut)">${(val/1000).toFixed(0)}k</text>`;
  }
  
  // Linhas de entrada/saída
  let pathIn = `M ${pad.l} ${yScale(data[0].in)}`;
  let pathOut = `M ${pad.l} ${yScale(data[0].out)}`;
  
  data.forEach((d, i) => {
    const x = pad.l + i * xStep;
    const yIn = yScale(d.in);
    const yOut = yScale(d.out);
    
    if (i > 0) {
      pathIn += ` L ${x} ${yIn}`;
      pathOut += ` L ${x} ${yOut}`;
    }
    
    // Pontos
    svg += `<circle cx="${x}" cy="${yIn}" r="4" fill="var(--green)" stroke="#0a1320" stroke-width="2"/>`;
    svg += `<circle cx="${x}" cy="${yOut}" r="4" fill="var(--red)" stroke="#0a1320" stroke-width="2"/>`;
    
    // Labels de mês
    svg += `<text x="${x}" y="${h-pad.b+20}" text-anchor="middle" font-size="11" fill="var(--mut)">${d.label}</text>`;
  });
  
  // Adicionar paths
  svg = svg.replace('<svg', `<svg><path d="${pathIn}" fill="none" stroke="var(--green)" stroke-width="2"/><path d="${pathOut}" fill="none" stroke="var(--red)" stroke-width="2"/>`);
  
  // Legenda
  svg += `<g transform="translate(${w-pad.r-140}, ${pad.t})">
    <circle cx="0" cy="0" r="4" fill="var(--green)"/>
    <text x="10" y="4" font-size="11" fill="var(--text)">Entradas</text>
    <circle cx="80" cy="0" r="4" fill="var(--red)"/>
    <text x="90" y="4" font-size="11" fill="var(--text)">Saídas</text>
  </g>`;
  
  svg += '</svg>';
  chart.innerHTML = svg;
}

// ── CLEAR ──────────────────────────────────────────────────────────

function setCashflowContaFiltro(contaId) {
  window._cashflowContaFiltro = contaId;
  rCashflow();
}

function clearExtratos() {
  if (!S.extratos || !S.extratos.length) {
    toast('⚠️ Nenhum extrato para limpar');
    return;
  }
  
  showDelDialog(
    '🗑️ Limpar Todos os Extratos',
    `Remover todos os ${S.extratos.length} extrato(s) importado(s)? Esta ação não pode ser desfeita.`,
    () => {
      S.extratos = [];
      sv();
      toast('✓ Extratos removidos');
      rCashflow();
    }
  );
}

function deleteExtrato(extratoId) {
  const extrato = (S.extratos || []).find(e => e.id === extratoId);
  if (!extrato) return;
  
  const [y, m] = extrato.periodoId.split('-');
  const mesLabel = MES[parseInt(m) - 1] + '/' + y;
  
  showDelDialog(
    '🗑️ Excluir Extrato',
    `Remover extrato de ${mesLabel} (${extrato.count} transações)?`,
    () => {
      S.extratos = S.extratos.filter(e => e.id !== extratoId);
      sv();
      toast(`✓ Extrato de ${mesLabel} removido`);
      
      // Atualizar página ativa
      const cashflowPage = document.getElementById('page-cashflow');
      if (cashflowPage && cashflowPage.classList.contains('active')) {
        rCashflow();
      }
      
      const lancPage = document.getElementById('page-lancamentos');
      if (lancPage && lancPage.classList.contains('active')) {
        rLancamentos();
      }
    }
  );
}

function viewExtratoDetail(extratoId) {
  const extrato = (S.extratos || []).find(e => e.id === extratoId);
  if (!extrato) return;
  
  const [y, m] = extrato.periodoId.split('-');
  const mesLabel = MES[parseInt(m) - 1] + '/' + y;
  
  // Criar modal de visualização
  const modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.id = 'extratoDetailModal';
  modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;align-items:center;justify-content:center;padding:20px';
  
  const formatDate = d => new Date(d).toLocaleDateString('pt-BR');
  
  // Agrupar por tipo
  const entradas = extrato.transactions.filter(t => t.type === 'in').sort((a,b) => b.date.localeCompare(a.date));
  const saidas = extrato.transactions.filter(t => t.type === 'out').sort((a,b) => b.date.localeCompare(a.date));
  
  modal.innerHTML = `
    <div style="background:#0c1628;border:1px solid rgba(255,255,255,.1);border-radius:16px;max-width:800px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.8)">
      <div style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;color:var(--teal)">
              Extrato · ${mesLabel}
            </div>
            <div style="font-size:11px;color:var(--mut);margin-top:2px">
              ${extrato.filename} · ${formatDate(extrato.firstDate)} a ${formatDate(extrato.lastDate)}
            </div>
          </div>
          <button onclick="closeExtratoDetailModal()" class="btn-cancel" style="padding:6px 12px">✕ Fechar</button>
        </div>
      </div>
      
      <div style="padding:20px 24px;overflow-y:auto;flex:1">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">
          <div style="padding:14px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:10px;text-align:center">
            <div style="font-size:9px;letter-spacing:1px;color:#10b981;font-weight:700;margin-bottom:4px">ENTRADAS</div>
            <div style="font-size:18px;font-weight:800;color:#10b981">${fmtV(extrato.totalIn, 'R$')}</div>
            <div style="font-size:10px;color:#10b98188;margin-top:2px">${entradas.length} transações</div>
          </div>
          <div style="padding:14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px;text-align:center">
            <div style="font-size:9px;letter-spacing:1px;color:#ef4444;font-weight:700;margin-bottom:4px">SAÍDAS</div>
            <div style="font-size:18px;font-weight:800;color:#ef4444">${fmtV(extrato.totalOut, 'R$')}</div>
            <div style="font-size:10px;color:#ef444488;margin-top:2px">${saidas.length} transações</div>
          </div>
          <div style="padding:14px;background:rgba(0,232,155,.08);border:1px solid rgba(0,232,155,.2);border-radius:10px;text-align:center">
            <div style="font-size:9px;letter-spacing:1px;color:var(--teal);font-weight:700;margin-bottom:4px">SALDO</div>
            <div style="font-size:18px;font-weight:800;color:${extrato.saldo >= 0 ? 'var(--teal)' : '#ef4444'}">${fmtV(extrato.saldo, 'R$')}</div>
            <div style="font-size:10px;color:var(--mut);margin-top:2px">${extrato.count} total</div>
          </div>
        </div>
        
        <!-- Tabs -->
        <div style="display:flex;gap:8px;margin-bottom:16px;border-bottom:1px solid rgba(255,255,255,.06)">
          <button onclick="switchExtratoTab('all')" id="extratoTabAll" class="extrato-tab active" style="padding:8px 16px;background:none;border:none;border-bottom:2px solid var(--teal);color:var(--teal);font-size:12px;font-weight:700;cursor:pointer">
            Todas (${extrato.count})
          </button>
          <button onclick="switchExtratoTab('in')" id="extratoTabIn" class="extrato-tab" style="padding:8px 16px;background:none;border:none;border-bottom:2px solid transparent;color:var(--mut);font-size:12px;font-weight:600;cursor:pointer">
            Entradas (${entradas.length})
          </button>
          <button onclick="switchExtratoTab('out')" id="extratoTabOut" class="extrato-tab" style="padding:8px 16px;background:none;border:none;border-bottom:2px solid transparent;color:var(--mut);font-size:12px;font-weight:600;cursor:pointer">
            Saídas (${saidas.length})
          </button>
        </div>
        
        <div id="extratoTabContent"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Armazenar extrato atual para acesso das tabs
  window._currentExtratoDetail = extrato;
  
  // Mostrar tab inicial
  switchExtratoTab('all');
}

function switchExtratoTab(tab) {
  const extrato = window._currentExtratoDetail;
  if (!extrato) return;
  
  // Atualizar botões
  document.querySelectorAll('.extrato-tab').forEach(btn => {
    btn.style.borderBottomColor = 'transparent';
    btn.style.color = 'var(--mut)';
  });
  const activeBtn = document.getElementById('extratoTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (activeBtn) {
    activeBtn.style.borderBottomColor = 'var(--teal)';
    activeBtn.style.color = 'var(--teal)';
  }
  
  // Filtrar transações
  let transactions = extrato.transactions;
  if (tab === 'in') transactions = transactions.filter(t => t.type === 'in');
  if (tab === 'out') transactions = transactions.filter(t => t.type === 'out');
  transactions.sort((a,b) => b.date.localeCompare(a.date));
  
  // Renderizar
  const content = document.getElementById('extratoTabContent');
  if (!content) return;
  
  if (!transactions.length) {
    content.innerHTML = '<div style="padding:40px;text-align:center;color:var(--mut);font-size:12px">Nenhuma transação nesta categoria</div>';
    return;
  }
  
  let html = '<div style="display:flex;flex-direction:column;gap:6px">';
  transactions.forEach(t => {
    const date = new Date(t.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'});
    const color = t.type === 'in' ? '#10b981' : '#ef4444';
    html += `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,.02);border-radius:8px;border:1px solid rgba(255,255,255,.04)">
        <div style="font-size:20px">${t.type === 'in' ? '📥' : '📤'}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;color:#c8dff5;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.desc}</div>
          <div style="font-size:10px;color:var(--mut);margin-top:2px">${date}</div>
        </div>
        <div style="font-size:14px;font-weight:800;color:${color};white-space:nowrap">${fmtV(Math.abs(t.value), 'R$')}</div>
      </div>
    `;
  });
  html += '</div>';
  content.innerHTML = html;
}

function closeExtratoDetailModal() {
  const modal = document.getElementById('extratoDetailModal');
  if (modal) modal.remove();
  window._currentExtratoDetail = null;
}

// ── HELPER para integração com Conselheiro (opcional) ─────────────

function getCashflowContext() {
  if (!S.extratos || !S.extratos.length) return null;
  
  const allTx = S.extratos.flatMap(e => e.transactions);
  const analysis = analyzeCashflow(allTx);
  if (!analysis) return null;
  
  const statusLabel = analysis.diasCaixa >= 35 ? '🟢 Saudável' : 
                     analysis.diasCaixa >= 15 ? '🟡 Atenção' : '🔴 Crítico';
  const tendLabel = analysis.tendencia === 'up' ? '📈 Crescente' : 
                   analysis.tendencia === 'down' ? '📉 Decrescente' : '➡️ Estável';
  
  let txt = `\n\nFLUXO DE CAIXA (dados reais de extratos bancários):
• Saldo atual (variação): ${fmtV(analysis.saldo, 'R$')}
• Dias de sobrevivência: ${analysis.diasCaixa > 999 ? '∞ (ilimitado)' : analysis.diasCaixa + ' dias'} ${statusLabel}
• Tendência: ${tendLabel}
• Entradas (últimos 30d): ${fmtV(analysis.totalIn, 'R$')}
• Saídas (últimos 30d): ${fmtV(analysis.totalOut, 'R$')}
• Queima diária média: ${fmtV(analysis.mediaSaidaDia, 'R$')}/dia`;

  if (analysis.patterns && analysis.patterns.length) {
    txt += '\n• Padrões detectados: ' + analysis.patterns.map(p => 
      `${p.type === 'in' ? 'Entradas' : 'Saídas'} recorrentes dia ${p.day} (média ${fmtV(p.avg, 'R$')})`
    ).join(', ');
  }

  // Alertas críticos
  if (analysis.diasCaixa < 15) {
    txt += '\n⚠️ ALERTA CRÍTICO: Menos de 15 dias de caixa — risco iminente de insolvência!';
  } else if (analysis.diasCaixa < 35) {
    txt += '\n⚠️ ATENÇÃO: Caixa apertado — monitorar de perto.';
  }

  return txt;
}

// ── GESTÃO DE CONTAS BANCÁRIAS ────────────────────────────────────

function rContasBancariasTable() {
  const table = document.getElementById('contasBancariasTable');
  if (!table) return;
  
  if (!S.contasBancarias || !S.contasBancarias.length) {
    table.innerHTML = `
      <div style="padding:24px;text-align:center;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:10px">
        <div style="font-size:13px;color:var(--mut);margin-bottom:8px">Nenhuma conta cadastrada</div>
        <div style="font-size:11px;color:var(--mut);opacity:.7">Contas serão criadas automaticamente ao importar extratos</div>
      </div>
    `;
    return;
  }
  
  let html = '<div style="display:flex;flex-direction:column;gap:8px">';
  
  S.contasBancarias.forEach(c => {
    const tipoLabels = {corrente: 'Corrente', poupanca: 'Poupança', investimento: 'Investimentos', cartao: 'Cartão'};
    const tipoLabel = tipoLabels[c.tipo] || c.tipo;
    
    // Contar extratos dessa conta
    const numExtratos = (S.extratos || []).filter(e => e.contaId === c.id).length;
    
    html += `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px">
        <div style="font-size:24px">💳</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:#eef4ff">${c.nome}</div>
          <div style="font-size:10px;color:var(--mut);margin-top:2px">${c.banco} · ${tipoLabel}${numExtratos > 0 ? ' · ' + numExtratos + ' extrato(s)' : ''}</div>
        </div>
        <button onclick="deleteConta(${c.id})" class="bs ghost" style="font-size:10px;padding:4px 10px;color:rgba(255,61,90,.8);border-color:rgba(255,61,90,.3)">🗑️ Excluir</button>
      </div>
    `;
  });
  
  html += '</div>';
  table.innerHTML = html;
}

function showNovaContaModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.id = 'novaContaModal';
  modal.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;align-items:center;justify-content:center;padding:20px';
  
  modal.innerHTML = `
    <div style="background:#0c1628;border:1px solid rgba(0,232,155,.3);border-radius:16px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.8)">
      <div style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.08)">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;color:var(--teal)">
          💳 NOVA CONTA BANCÁRIA
        </div>
      </div>
      
      <div style="padding:24px">
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:10px;letter-spacing:1px;color:var(--mut);font-weight:700;margin-bottom:6px">NOME DA CONTA</label>
          <input type="text" id="ncNome" placeholder="Ex: Bradesco PJ, Itaú Investimentos" style="width:100%;padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:13px;font-family:'Outfit',sans-serif;outline:none;box-sizing:border-box">
        </div>
        
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:10px;letter-spacing:1px;color:var(--mut);font-weight:700;margin-bottom:6px">BANCO</label>
          <select id="ncBanco" style="width:100%;padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:13px;font-family:'Outfit',sans-serif;outline:none;cursor:pointer;box-sizing:border-box">
            <option value="">Selecione...</option>
            <option value="Banco do Brasil">Banco do Brasil</option>
            <option value="Bradesco">Bradesco</option>
            <option value="BTG Pactual">BTG Pactual</option>
            <option value="C6 Bank">C6 Bank</option>
            <option value="Caixa Econômica">Caixa Econômica</option>
            <option value="Inter">Inter</option>
            <option value="Itaú">Itaú</option>
            <option value="Nubank">Nubank</option>
            <option value="Safra">Safra</option>
            <option value="Santander">Santander</option>
            <option value="Sicredi">Sicredi</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        
        <div style="margin-bottom:16px">
          <label style="display:block;font-size:10px;letter-spacing:1px;color:var(--mut);font-weight:700;margin-bottom:6px">TIPO DE CONTA</label>
          <select id="ncTipo" style="width:100%;padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eef4ff;font-size:13px;font-family:'Outfit',sans-serif;outline:none;cursor:pointer;box-sizing:border-box">
            <option value="corrente">Conta Corrente</option>
            <option value="poupanca">Poupança</option>
            <option value="investimento">Investimentos</option>
            <option value="cartao">Cartão de Crédito</option>
          </select>
        </div>
      </div>
      
      <div style="padding:16px 24px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid rgba(255,255,255,.08)">
        <button onclick="closeNovaContaModal()" class="btn-cancel" style="padding:8px 16px;font-size:12px">Cancelar</button>
        <button onclick="saveNovaConta()" class="bs" style="padding:8px 20px;font-size:12px;font-weight:700">✓ Salvar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('ncNome').focus(), 100);
}

function closeNovaContaModal() {
  const modal = document.getElementById('novaContaModal');
  if (modal) modal.remove();
}

function saveNovaConta() {
  const nome = document.getElementById('ncNome').value.trim();
  const banco = document.getElementById('ncBanco').value;
  const tipo = document.getElementById('ncTipo').value;
  
  if (!nome) {
    toast('⚠️ Digite o nome da conta');
    document.getElementById('ncNome').focus();
    return;
  }
  
  if (!banco) {
    toast('⚠️ Selecione o banco');
    document.getElementById('ncBanco').focus();
    return;
  }
  
  if (!S.contasBancarias) S.contasBancarias = [];
  
  S.contasBancarias.push({
    id: Date.now(),
    nome: nome,
    banco: banco,
    tipo: tipo,
    criadoEm: new Date().toISOString()
  });
  
  sv();
  toast(`✅ Conta "${nome}" criada`);
  closeNovaContaModal();
  rContasBancariasTable();
}

function deleteConta(contaId) {
  const conta = (S.contasBancarias || []).find(c => c.id === contaId);
  if (!conta) return;
  
  // Verificar se tem extratos
  const numExtratos = (S.extratos || []).filter(e => e.contaId === contaId).length;
  
  let msg = `Excluir a conta "${conta.nome}"?`;
  if (numExtratos > 0) {
    msg += `\n\n⚠️ Atenção: Esta conta tem ${numExtratos} extrato(s) importado(s). Os extratos NÃO serão excluídos, mas ficarão sem conta associada.`;
  }
  
  showDelDialog(
    '🗑️ Excluir Conta',
    msg,
    () => {
      S.contasBancarias = S.contasBancarias.filter(c => c.id !== contaId);
      sv();
      toast(`✓ Conta "${conta.nome}" removida`);
      rContasBancariasTable();
    }
  );
}
