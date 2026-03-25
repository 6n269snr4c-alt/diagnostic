# 🔧 CORREÇÕES COMPLETAS - RECEITA NÃO OPERACIONAL

**Data:** 25/03/2026  
**Problema:** Receita Não Operacional não estava sendo incluída no cálculo do Lucro Líquido

---

## 🎯 PROBLEMA RAIZ IDENTIFICADO

A categoria **"Receita Não Operacional"** estava presente no frontend (dropdown), mas **NÃO estava sendo salva corretamente no Firestore** devido a **6 problemas** no código:

---

## ✅ CORREÇÃO 1: API de Classificação Automática

**Arquivo:** `/api/classify-dre.js`  
**Linha:** 11-23

### Problema:
A categoria `receita_nao_operacional` **não existia** na lista de categorias que a IA pode usar.

### Solução:
```javascript
const categories = [
  { id: 'receita_bruta', ... },
  { id: 'deducao_receita', ... },
  // ... outras categorias
  { id: 'depreciacao', ... },
  { id: 'receita_nao_operacional',  desc: 'Receitas excepcionais, venda de ativos, juros recebidos, ganhos não operacionais' },  // ← ADICIONADO
  { id: 'ignorar', ... },
];
```

---

## ✅ CORREÇÃO 2: Salvamento no Firestore (dreConfirm)

**Arquivo:** `app.js`  
**Função:** `dreConfirm()`  
**Linhas:** 5292-5304

### Problema:
Quando o DRE era confirmado, o objeto `raw` salvo no Firestore **não incluía `f_recnop`**.

### Solução:
```javascript
const raw = {
  f_fat:     agg.f_fat              || undefined,
  f_cv:      (agg.f_cmv + agg.f_ded) || undefined,
  f_dc:      agg.f_dc               || undefined,
  f_df:      (agg.f_pessoal + agg.f_adm) || undefined,
  f_depfin:  agg.f_depfin           || undefined,
  f_recnop:  agg.f_recnop           || undefined,  // ← ADICIONADO
  f_cmv:     agg.f_cmv              || undefined,
  // ... resto dos campos
};
```

---

## ✅ CORREÇÃO 3: Mapeamento de Confiança (dreConfirm)

**Arquivo:** `app.js`  
**Função:** `dreConfirm()`  
**Linha:** 5322

### Problema:
O mapeamento de quais categorias afetam o KPI `lucroliq` **não incluía** `receita_nao_operacional`.

### Solução:
```javascript
const kpiLineMapping = {
  // ... outros KPIs
  'lucroliq': [
    'receita_bruta', 
    'deducao_receita', 
    'custo_variavel', 
    'despesa_comercial', 
    'despesa_pessoal', 
    'despesa_administrativa', 
    'depreciacao', 
    'despesa_financeira', 
    'imposto_lucro', 
    'receita_nao_operacional'  // ← ADICIONADO
  ],
  // ... outros KPIs
};
```

---

## ✅ CORREÇÃO 4: Edição Manual - Inicialização (lancSaveEdits)

**Arquivo:** `app.js`  
**Função:** `lancSaveEdits()`  
**Linha:** 5979

### Problema:
Quando você editava manualmente um lançamento, o objeto `agg` era inicializado **sem `f_recnop`**.

### Solução:
```javascript
const agg = { 
  f_fat:0, 
  f_ded:0, 
  f_cmv:0, 
  f_cvc:0, 
  f_pessoal:0, 
  f_adm:0, 
  f_dep:0, 
  f_dc:0, 
  f_depfin:0, 
  f_recnop:0  // ← ADICIONADO
};
```

---

## ✅ CORREÇÃO 5: Edição Manual - Agregação (lancSaveEdits)

**Arquivo:** `app.js`  
**Função:** `lancSaveEdits()`  
**Linhas:** 5980-5992

### Problema:
O loop que agregava as categorias **não tinha** o `else if` para `receita_nao_operacional`.

### Solução:
```javascript
_lancEditLines.forEach(l => {
  const v = l.value;
  if      (l.category === 'receita_bruta')            agg.f_fat     += v;
  else if (l.category === 'deducao_receita')          agg.f_ded     += v;
  // ... outras categorias
  else if (l.category === 'imposto_lucro')            agg.f_depfin  += v;
  else if (l.category === 'receita_nao_operacional')  agg.f_recnop  += v;  // ← ADICIONADO
});
```

---

## ✅ CORREÇÃO 6: Edição Manual - Salvamento (lancSaveEdits)

**Arquivo:** `app.js`  
**Função:** `lancSaveEdits()`  
**Linhas:** 5994-6006

### Problema:
O objeto `raw` salvo após edição manual **não incluía `f_recnop`**.

### Solução:
```javascript
const raw = {
  f_fat:     agg.f_fat                      || undefined,
  f_cv:      (agg.f_cmv + agg.f_ded)        || undefined,
  f_dc:      agg.f_dc                       || undefined,
  f_df:      (agg.f_pessoal + agg.f_adm)    || undefined,
  f_depfin:  agg.f_depfin                   || undefined,
  f_recnop:  agg.f_recnop                   || undefined,  // ← ADICIONADO
  // ... resto dos campos
};
```

---

## ✅ CORREÇÃO 7: Edição Manual - Mapeamento (lancSaveEdits)

**Arquivo:** `app.js`  
**Função:** `lancSaveEdits()`  
**Linha:** 6020

### Problema:
O mapeamento de confiança do `lucroliq` em edições manuais também **não incluía** `receita_nao_operacional`.

### Solução:
```javascript
const kpiLineMapping = {
  // ... outros KPIs
  'lucroliq': [
    'receita_bruta', 
    'deducao_receita', 
    'custo_variavel', 
    'despesa_comercial', 
    'despesa_pessoal', 
    'despesa_administrativa', 
    'depreciacao', 
    'despesa_financeira', 
    'imposto_lucro', 
    'receita_nao_operacional'  // ← ADICIONADO
  ],
  // ... outros KPIs
};
```

---

## ✅ CORREÇÃO 8: Modal de Detalhes - Onclick

**Arquivo:** `index.html`  
**Linha:** 142

### Problema:
O elemento do Lucro Líquido no dashboard **não tinha onclick** para abrir o modal.

### Solução:
```html
<!-- ANTES -->
<div id="execLucro" style="...">—</div>

<!-- DEPOIS -->
<div id="execLucro" style="...;cursor:pointer" 
     onclick="openKpiFromRaw('lucroliq', _dreGetLiveRaw())">—</div>
```

---

## ✅ CORREÇÃO 9: Modal de Detalhes - Variável

**Arquivo:** `app.js`  
**Função:** `_openKpiModal()`  
**Linha:** ~1645

### Problema:
O modal não lia a variável `f_recnop` dos dados brutos.

### Solução:
```javascript
const fv = k => { const x = parseFloat(raw[k]); return isNaN(x) ? 0 : x; };
// ... outras variáveis
const depfin = fv('f_depfin');
const recnop = fv('f_recnop');  // ← ADICIONADO
const recLiq = fat - ded;
```

---

## ✅ CORREÇÃO 10: Modal de Detalhes - Fórmula

**Arquivo:** `app.js`  
**Função:** `_openKpiModal()`  
**Linha:** ~1651

### Problema:
O cálculo do `lucro_r` no modal **não somava** `recnop`.

### Solução:
```javascript
// ANTES
const lucro_r = ebitda_r - dep - depfin;

// DEPOIS
const lucro_r = ebitda_r - dep - depfin + recnop;  // ← CORRIGIDO
```

---

## ✅ CORREÇÃO 11: Modal de Detalhes - Passos

**Arquivo:** `app.js`  
**Função:** `_openKpiModal()` → `STEPS.lucroliq`  
**Linhas:** 1703-1710

### Problema:
Os passos mostrados no modal **não incluíam** a linha de Receita Não Operacional.

### Solução:
```javascript
lucroliq: [
  {op:'',  label:'EBITDA R$',          val:fmt(ebitda_r)},
  {op:'−', label:'Depreciação',        val:fmt(dep)},
  {op:'−', label:'Desp. Financeiras + IR/CSLL', val:fmt(depfin)},
  {op:'+', label:'Receita Não Operacional', val:fmt(recnop), 
   sub: recnop > 0 ? 'Receitas excepcionais, venda de ativos' : 'Nenhuma lançada'},  // ← ADICIONADO
  {op:'=', label:'Lucro Líquido R$',   val:fmt(lucro_r)},
  {op:'÷', label:'Receita Líquida',    val:fmt(base)},
  {op:'=', label:'Lucro Líquido %',    val:fmtP(base?lucro_r/base*100:null), bold:true, color:col},
],
```

---

## 📋 RESUMO DAS CORREÇÕES

| # | Arquivo | Função/Local | O que foi adicionado |
|---|---------|--------------|---------------------|
| 1 | `classify-dre.js` | categories | Categoria `receita_nao_operacional` |
| 2 | `app.js` | `dreConfirm()` linha 5297 | `f_recnop: agg.f_recnop` no objeto raw |
| 3 | `app.js` | `dreConfirm()` linha 5322 | `'receita_nao_operacional'` no kpiLineMapping |
| 4 | `app.js` | `lancSaveEdits()` linha 5979 | `f_recnop:0` na inicialização do agg |
| 5 | `app.js` | `lancSaveEdits()` linha 5992 | `else if` para `receita_nao_operacional` |
| 6 | `app.js` | `lancSaveEdits()` linha 6000 | `f_recnop: agg.f_recnop` no objeto raw |
| 7 | `app.js` | `lancSaveEdits()` linha 6020 | `'receita_nao_operacional'` no kpiLineMapping |
| 8 | `index.html` | Dashboard linha 142 | `onclick` no elemento execLucro |
| 9 | `app.js` | `_openKpiModal()` linha 1645 | `const recnop = fv('f_recnop')` |
| 10 | `app.js` | `_openKpiModal()` linha 1652 | `+ recnop` na fórmula do lucro_r |
| 11 | `app.js` | `_openKpiModal()` linha 1708 | Linha de Receita Não Op nos STEPS |

---

## 🎯 FLUXO COMPLETO CORRIGIDO

### 1️⃣ Importação de DRE (Nova)
```
Upload Excel → Classificação AI (agora inclui receita_nao_operacional) 
→ Edição manual (dropdown tem a categoria) 
→ Confirmação → dreAggregate() (soma f_recnop) 
→ dreConfirm() (salva f_recnop no Firestore) 
→ calcKPIs() (usa f_recnop no cálculo do lucroliq)
```

### 2️⃣ Edição Manual de Lançamento Existente
```
Abrir modal de lançamento → Mudar categoria para "Receita Não Operacional" 
→ Salvar → lancSaveEdits() (agora processa receita_nao_operacional) 
→ Reagrega com f_recnop → Salva no Firestore com f_recnop 
→ Recalcula KPIs (lucroliq agora correto)
```

### 3️⃣ Visualização do Modal de Lucro Líquido
```
Clicar no valor do Lucro Líquido no dashboard 
→ openKpiFromRaw('lucroliq') → _openKpiModal() 
→ Lê f_recnop do raw → Calcula lucro_r = ebitda - dep - depfin + recnop 
→ Mostra passos incluindo "+ Receita Não Operacional"
```

---

## 🔍 COMO TESTAR

1. **Faça deploy** dos 3 arquivos corrigidos:
   - `app.js`
   - `index.html`
   - `api/classify-dre.js`

2. **Importe um novo DRE** ou **edite um existente**:
   - Classifique alguma linha como "Receita Não Operacional"
   - Confirme a importação

3. **Verifique no Dashboard**:
   - O Lucro Líquido deve refletir a receita não operacional
   - Clique no valor → Modal deve mostrar a linha "+ Receita Não Operacional R$ X.XXX,XX"

4. **Teste com dados reais**:
   - Exemplo: Juros recebidos de R$ 500,00
   - Venda de ativo de R$ 10.000,00
   - Ambos devem SOMAR no Lucro Líquido (não subtrair)

---

## ⚠️ IMPORTANTE

Se você já tem DREs importados ANTES desta correção, eles **NÃO TÊM** o campo `f_recnop` salvo no Firestore. Você precisa:

**Opção 1:** Re-importar os DREs (recomendado)  
**Opção 2:** Editar manualmente cada lançamento e salvar novamente  
**Opção 3:** Script de migração (posso criar se necessário)

---

## 📦 ARQUIVOS CORRIGIDOS

- ✅ `app.js` (11 correções)
- ✅ `index.html` (1 correção)
- ✅ `api/classify-dre.js` (1 correção)

**Total:** 13 correções em 3 arquivos

---

Pronto! Agora a Receita Não Operacional está **100% integrada** no sistema! 🎉
