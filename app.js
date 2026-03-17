
// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════
const IND = [
  {id:'receita',   name:'Receita Bruta',               short:'Receita',    group:'tracao', icon:'💰', unit:'R$', goalDef:100000, hb:true,
   formula:'Faturamento bruto do período',
   desc:'Receita total gerada pelas vendas antes de qualquer dedução. Principal indicador de tração e crescimento.'},
  {id:'cac',       name:'CAC (Despesa Comercial %)',    short:'CAC%',       group:'tracao', icon:'🎯', unit:'%',  goalDef:8,      hb:false,
   formula:'Despesa Comercial ÷ Receita Líquida × 100',
   desc:'Percentual da receita líquida investido em despesas comerciais. Quanto menor, mais eficiente.'},
  {id:'margbruta', name:'Margem Bruta %',               short:'Mg.Bruta',   group:'rentab', icon:'📦', unit:'%',  goalDef:45,     hb:true,
   formula:'(Receita Líquida − CMV) ÷ Receita Líquida × 100',
   desc:'Percentual que sobra após o custo direto do produto ou serviço. Indica a viabilidade do modelo antes das despesas operacionais.'},
  {id:'margem',    name:'Margem de Contribuição %',     short:'Margem',     group:'rentab', icon:'💹', unit:'%',  goalDef:40,     hb:true,
   formula:'(Lucro Bruto − Custo Variável Comercial) ÷ Receita Líquida × 100',
   desc:'Percentual que sobra após custos variáveis para cobrir despesas fixas e gerar lucro.'},
  {id:'ebitda',    name:'EBITDA %',                     short:'EBITDA',     group:'rentab', icon:'📊', unit:'%',  goalDef:15,     hb:true,
   formula:'(MC − Desp. Comercial − Pessoal − Adm.) ÷ Receita Líquida × 100',
   desc:'Lucro operacional antes de juros, impostos, depreciação e amortização. Mede eficiência operacional pura.'},
  {id:'despop',    name:'Desp. Op. sobre Receita %',    short:'Desp.Op%',   group:'rentab', icon:'📋', unit:'%',  goalDef:35,     hb:false,
   formula:'(Desp. Comercial + Pessoal + Adm.) ÷ Receita Líquida × 100',
   desc:'Peso total das despesas operacionais sobre a receita líquida. Estrutura pesada compromete a rentabilidade.'},
  {id:'lucroliq',  name:'Lucro Líquido %',               short:'Lucro Líq.', group:'rentab', icon:'💰', unit:'%',  goalDef:10,     hb:true,
   formula:'(EBITDA − Depreciação − Desp. Financeiras − IR/CSLL) ÷ Receita Líquida × 100',
   desc:'O que sobrou de verdade após todas as despesas, juros e impostos. O KPI mais importante da empresa.'},
  {id:'pessoal',   name:'Peso do Pessoal %',             short:'Pessoal%',   group:'rentab', icon:'👥', unit:'%',  goalDef:25,     hb:false,
   formula:'Despesas com Pessoal ÷ Receita Líquida × 100',
   desc:'Percentual da receita líquida consumido pela folha de pagamento. Alto peso reduz a flexibilidade operacional.'},
  {id:'admperc',   name:'Peso Administrativo %',         short:'Adm%',       group:'rentab', icon:'🏢', unit:'%',  goalDef:12,     hb:false,
   formula:'Despesas Administrativas ÷ Receita Líquida × 100',
   desc:'Percentual da receita líquida consumido por despesas administrativas. Overhead elevado reduz a rentabilidade.'},
  {id:'spread',    name:'Spread Financeiro %',            short:'Spread Fin.', group:'rentab', icon:'🏦', unit:'%',  goalDef:5,      hb:false,
   formula:'Desp. Financeiras + IR ÷ Receita Líquida × 100',
   desc:'Peso do endividamento e carga tributária sobre o resultado. Acima de 5% sinaliza pressão financeira relevante.'},
  {id:'eficiencia',name:'Índice de Eficiência Op. %',     short:'Eficiência', group:'rentab', icon:'⚙️', unit:'%',  goalDef:65,     hb:false,
   formula:'Desp. Operacionais ÷ Lucro Bruto × 100',
   desc:'Quanto do Lucro Bruto é consumido pelas despesas operacionais. Acima de 100% significa que as despesas superaram o lucro bruto.'},
  {id:'margseg',   name:'Margem de Segurança Op. %',      short:'Mg.Segurança', group:'rentab', icon:'🛡️', unit:'%',  goalDef:20,     hb:true,
   formula:'(Receita Bruta − Ponto de Equilíbrio) ÷ Receita Bruta × 100',
   desc:'O quanto a receita pode cair antes de a empresa entrar no prejuízo operacional. Meta mínima de 20% para conforto operacional.'},
];
const GC={tracao:'#3b82f6',rentab:'#10d4a8'};
const GN={tracao:'Tração e Receita',rentab:'Rentabilidade'};
const GI={tracao:'📈',rentab:'💰'};
const MES=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

const FIELDS=[
  {id:'f_fat',   label:'Faturamento Bruto',            unit:'R$',hint:'Receita total bruta do período',             group:'tracao'},
  {id:'f_dc',    label:'Despesa Comercial/Marketing',  unit:'R$',hint:'Gastos com vendas, marketing e aquisição',   group:'tracao'},
  {id:'f_cv',    label:'Custos Variáveis',             unit:'R$',hint:'CMV, impostos sobre venda, comissões',       group:'rentab'},
  {id:'f_df',    label:'Despesas Fixas',               unit:'R$',hint:'Folha de pagamento, aluguel, serviços fixos',group:'rentab'},
  {id:'f_depfin',label:'Despesas Financeiras e Impostos s/ Lucro',unit:'R$',hint:'Juros, IOF, empréstimos e IR/CSLL do período',group:'rentab'},
];
const FG={tracao:{label:'Vendas e Receita',  color:'var(--g-tracao)',bg:'rgba(59,130,246,.12)',icon:'📈'},
          rentab:{label:'DRE e Eficiência', color:'var(--g-rentab)',bg:'rgba(16,212,168,.10)',icon:'💰'}};
const FCAST_FIELDS=[
  {id:'f_fat',   label:'Receita Prevista',              unit:'R$',group:'tracao'},
  {id:'f_dc',    label:'Desp. Comercial Prevista',      unit:'R$',group:'tracao'},
  {id:'f_cv',    label:'Custos Variáveis Previstos',    unit:'R$',group:'rentab'},
  {id:'f_df',    label:'Despesas Fixas Previstas',      unit:'R$',group:'rentab'},
  {id:'f_depfin',label:'Desp. Financeiras Previstas',   unit:'R$',group:'rentab'},
];

function calcKPIs(r){
  const v=k=>{const x=parseFloat(r[k]);return isNaN(x)?null:x;};
  const pct=(n,d)=>(d&&d!==0)?n/d*100:null;

  // ── Leitura dos campos brutos ──────────────────────────────────────
  const fat    = v('f_fat');         // Receita Bruta
  const ded    = v('f_ded')||0;      // Deduções (impostos sobre venda)
  const cmv    = v('f_cmv');         // CMV puro (granular)
  const dc     = v('f_dc')||0;       // Despesa Comercial
  const pess   = v('f_pessoal')||0;  // Despesas com Pessoal
  const adm    = v('f_adm')||0;      // Despesas Administrativas
  const dep    = v('f_dep')||0;      // Depreciação/Amortização
  const depfin = v('f_depfin')||0;   // Despesas Financeiras + IR/CSLL

  // Campos agregados — fallback para forecast/simulador que não tem granular
  const cv_agg = v('f_cv');  // = cmv + ded
  const df_agg = v('f_df');  // = pess + adm (SEM dc)

  if(fat === null) return {
    receita:null,cac:null,margbruta:null,margem:null,
    ebitda:null,despop:null,lucroliq:null,pessoal:null,admperc:null,
    spread:null,eficiencia:null,margseg:null
  };

  // ── Receita Líquida — BASE de todos os percentuais (convenção CVM/B3) ──
  const recLiq = fat - ded;
  const base   = recLiq > 0 ? recLiq : fat; // fallback se sem deduções

  // ── CMV efetivo: usa granular se disponível, senão desagrega do agregado ──
  // f_cv foi salvo como cmv+ded, então cmv = f_cv − ded
  const cmvEfetivo = cmv !== null ? cmv
                   : cv_agg !== null ? cv_agg - ded
                   : null;

  // ── Custo Variável Comercial (comissões, frete s/venda, embalagens) ──
  const cvc = v('f_cvc')||0;

  // ── Despesas Pessoal+Adm ──
  const dfEfetivo = (pess > 0 || adm > 0) ? pess + adm
                  : df_agg !== null ? df_agg
                  : null;

  // ── Cadeia de resultados ───────────────────────────────────────────
  // Lucro Bruto = Receita Líquida − CMV  (base da Margem Bruta)
  const lucBruto = cmvEfetivo !== null ? recLiq - cmvEfetivo : null;

  // Margem de Contribuição R$ = Lucro Bruto − Custo Variável Comercial
  // (comissões, frete sobre vendas, embalagens — custos que variam com volume)
  const mc_r = lucBruto !== null ? lucBruto - cvc : null;

  // EBITDA R$ = MC − Desp.Comercial − Desp.Pessoal − Desp.Adm
  const ebitda_r = mc_r !== null && dfEfetivo !== null
    ? mc_r - dc - dfEfetivo
    : null;

  // Lucro Líquido R$ = EBITDA − Depreciação − Desp.Financeiras − IR/CSLL
  const lucro_r = ebitda_r !== null
    ? ebitda_r - dep - depfin
    : null;

  // Despesas Operacionais Totais = DC + Pessoal + Adm
  const despOpTotal = dfEfetivo !== null ? dc + dfEfetivo : null;

  // ── Spread Financeiro = Desp.Fin+IR / Rec.Líq ─────────────────────
  const spread_r = depfin;

  // ── Índice de Eficiência = Desp.Op / Lucro Bruto ──────────────────
  const efic_r = despOpTotal !== null && lucBruto !== null ? despOpTotal : null;

  // ── Ponto de Equilíbrio e Margem de Segurança ─────────────────────
  // PE = Custos Fixos / Margem de Contribuição Unitária (%)
  // Custos Fixos = Pessoal + Adm + DC + Depfin + Dep
  // Índice MC% = MC_r / Rec.Líq  (quanto cada R$1 de receita contribui)
  let margseg_r = null;
  if(lucBruto !== null && fat > 0){
    const custosFixos = (dfEfetivo||0) + dc + depfin + dep;
    const mcPct = mc_r !== null ? mc_r / fat : lucBruto / fat; // MC sobre receita bruta
    if(mcPct > 0){
      const pe = custosFixos / mcPct;  // Ponto de Equilíbrio em R$
      margseg_r = (fat - pe) / fat * 100; // Margem de Segurança %
    }
  }

  // ── KPIs — todos sobre Receita Líquida (base) ─────────────────────
  return {
    receita:    fat,
    cac:        pct(dc,            base),
    margbruta:  lucBruto  !== null ? pct(lucBruto,   base) : null,
    margem:     mc_r      !== null ? pct(mc_r,       base) : null,
    ebitda:     ebitda_r  !== null ? pct(ebitda_r,   base) : null,
    despop:     despOpTotal !== null ? pct(despOpTotal, base) : null,
    lucroliq:   lucro_r   !== null ? pct(lucro_r,    base) : null,
    pessoal:    pess > 0 ? pct(pess, base) : null,
    admperc:    adm  > 0 ? pct(adm,  base) : null,
    spread:     pct(spread_r, base),
    eficiencia: efic_r !== null && lucBruto > 0 ? pct(efic_r, lucBruto) : null,
    margseg:    margseg_r,
  };
}

// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// FIREBASE
// ═══════════════════════════════════════════
const firebaseConfig={apiKey:"AIzaSyBBkP2KaV189LaCk1lck4ni8kDqoRhgwLw",authDomain:"diagnostic-88787.firebaseapp.com",projectId:"diagnostic-88787",storageBucket:"diagnostic-88787.firebasestorage.app",messagingSenderId:"735423883123",appId:"1:735423883123:web:d0c72dcb93f430b5cac706"};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth();
const db=firebase.firestore();

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
let S={
  company:'Minha Empresa',
  sector:'',
  userName:'',
  advisor:'analytics', // 'analytics' | 'growth' | 'strategist'
  advisorHistory:{analytics:[],growth:[],strategist:[]},
  benchMode:'ai',
  locked:false,
  logo:null,
  cfg:Object.fromEntries(IND.map(i=>[i.id,{weight:1,benchGoal:null,hb:i.hb}])),
  goals:Object.fromEntries(IND.map(i=>[i.id,{default:i.goalDef}])),
  months:[],
  data:{},
  raw:{},
  forecast:{},
  meetActions:{},
  actions:[],
  sel:null,
};

// Salva no Firestore (debounced)
let _svTimer=null;
function sv(){
  clearTimeout(_svTimer);
  _svTimer=setTimeout(async()=>{
    const u=auth.currentUser;if(!u)return;
    try{await db.collection('users').doc(u.uid).set(JSON.parse(JSON.stringify(S)),{merge:true});}
    catch(e){console.warn('Save error:',e);}
  },1500);
}
async function loadUserData(uid){
  try{
    const doc=await db.collection('users').doc(uid).get();
    if(doc.exists){
      const d=doc.data();
      if(d.company)S.company=d.company;
      if(d.sector)S.sector=d.sector;
      if(d.benchMode)S.benchMode=d.benchMode;
      if(d.logo)S.logo=d.logo;
      if(d.cfg)S.cfg=d.cfg;
      if(d.goals)S.goals=d.goals;
      if(d.months)S.months=d.months;
      if(d.data)S.data=d.data;
      if(d.raw)S.raw=d.raw;
      if(d.forecast)S.forecast=d.forecast;
      if(d.meetActions)S.meetActions=d.meetActions;
      if(d.actions)S.actions=d.actions;
      if(d.diagCache)S.diagCache=d.diagCache;
      if(d.sel)S.sel=d.sel;
      if(d.dreMappings)S.dreMappings=d.dreMappings;
      if(d.dreLines)S.dreLines=d.dreLines;
      if(d.dreModel)S.dreModel=d.dreModel;
      if(d.userName)S.userName=d.userName;
      if(d.advisor)S.advisor=d.advisor;
      if(d.advisorHistory)S.advisorHistory=d.advisorHistory;
    }
  }catch(e){console.warn('Load error:',e);}
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function getGoal(id,mk){
  const g=S.goals[id];if(!g)return IND.find(i=>i.id===id)?.goalDef||0;
  return(mk&&g[mk]!==undefined)?g[mk]:g.default||IND.find(i=>i.id===id)?.goalDef||0;
}
function grade(s){
  if(s>=90)return{l:'Excelente',c:'var(--green)'};if(s>=75)return{l:'Saudável',c:'var(--teal)'};
  if(s>=55)return{l:'Atenção',c:'var(--amber)'};if(s>=35)return{l:'Crítico',c:'var(--red)'};
  return{l:'Em Crise',c:'#ff0040'};
}
function fmtV(val,unit){
  if(val===null||val===undefined)return'—';
  const n=parseFloat(Number(val).toFixed(2));
  if(unit==='R$')return'R$ '+n.toLocaleString('pt-BR');
  return n.toLocaleString('pt-BR')+unit;
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}

// ═══════════════════════════════════════════
// SCORING
// ═══════════════════════════════════════════
function calcScore(mk){
  const d=S.data[mk];if(!d)return null;
  let tw=0,ws=0,dets=[];
  IND.forEach(ind=>{
    const e=d[ind.id];if(!e||e.value===''||e.value==null)return;
    const cfg=S.cfg[ind.id]||{weight:1,hb:ind.hb};
    const goal=_BENCHABLE.has(ind.id)&&cfg.benchMode==='ai'&&cfg.benchGoal?cfg.benchGoal:getGoal(ind.id,mk);
    const val=parseFloat(e.value),conf=e.confidence||'high';
    const hb=cfg.hb!=null?cfg.hb:ind.hb;
    let p=hb?(goal===0?100:Math.min((val/goal)*100,150)):(goal===0?100:Math.min((goal/Math.max(val,.001))*100,150));
    p=Math.max(0,Math.min(100,p));
    const cm=conf==='high'?1:conf==='medium'?.88:.7;
    tw+=cfg.weight;ws+=p*cm*cfg.weight;
    dets.push({ind,val,pct:p,adjPct:p*cm,conf,goal});
  });
  if(!tw)return null;
  return{score:Math.round(ws/tw),details:dets};
}
function calcConf(dets){
  if(!dets?.length)return null;
  const hi=dets.filter(d=>d.conf==='high').length,md=dets.filter(d=>d.conf==='medium').length,lo=dets.filter(d=>d.conf==='low').length;
  return{p:Math.round(((hi*100+md*60+lo*20)/(dets.length*100))*100),hi,md,lo};
}

// ═══════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// PLANOS DE AÇÃO
// ═══════════════════════════════════════════
function syncActionsFromMeeting(mk){
  if(!mk||!S.meetActions||!S.meetActions[mk])return;
  if(!S.actions)S.actions=[];
  var rows=(S.meetActions[mk].fechamento||[]).concat(S.meetActions[mk].adicionais||[]);
  rows.forEach(function(row){
    if(!row.text||!row.text.trim())return;
    var[y,mo]=mk.split('-');
    var mesLabel=MES[parseInt(mo)-1]+'/'+y;
    // Find existing action for same mk+kpi+text (upsert, no duplicates)
    var existing=S.actions.find(function(a){return a.mk===mk&&a.kpi===row.kpi&&a.text===row.text;});
    if(!existing){
      S.actions.push({
        id:Date.now()+'-'+Math.random().toString(36).slice(2,7),
        mk:mk, mes:mesLabel, kpi:row.kpi||'—',
        text:row.text.trim(), resp:row.resp||'', prazo:row.prazo||'',
        status:'open', obs:'', criadoEm:new Date().toISOString()
      });
    }
  });
}

function parsePrazo(str){
  if(!str)return null;
  // aceita dd/mm/aaaa ou dd/mm/aa
  var m=/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/.exec(str.trim());
  if(!m)return null;
  var y=parseInt(m[3]);if(y<100)y+=2000;
  var d=new Date(y,parseInt(m[2])-1,parseInt(m[1]));
  return isNaN(d)?null:d;
}
function rActions(){
  if(!S.actions)S.actions=[];
  var filterMes=document.getElementById('actFilterMes');
  var filterStatus=document.getElementById('actFilterStatus');
  var mesSel=filterMes?filterMes.value:'';
  var statusSel=filterStatus?filterStatus.value:'';

  // Populate month filter
  var meses=[...new Set(S.actions.map(function(a){return a.mk;}))].sort().reverse();
  if(filterMes){
    var prev=filterMes.value;
    filterMes.innerHTML='<option value="">Todos os meses</option>';
    meses.forEach(function(mk){
      var parts=mk.split('-');
      var o=document.createElement('option');
      o.value=mk;o.textContent=MES[parseInt(parts[1])-1]+'/'+parts[0];
      if(mk===prev)o.selected=true;
      filterMes.appendChild(o);
    });
  }

  var filtered=S.actions.filter(function(a){
    if(mesSel&&a.mk!==mesSel)return false;
    if(statusSel&&a.status!==statusSel)return false;
    return true;
  }).sort(function(a,b){return b.criadoEm.localeCompare(a.criadoEm);});

  var open=S.actions.filter(function(a){return a.status==='open';}).length;
  var sumEl=document.getElementById('actSummary');
  if(sumEl)sumEl.textContent=open+' em aberto · '+S.actions.length+' total';

  var tbl=document.getElementById('actionsTable');
  if(!tbl)return;
  tbl.innerHTML='';

  if(!filtered.length){
    var empty=document.createElement('div');
    empty.style.cssText='text-align:center;padding:60px 20px;color:var(--mut)';
    empty.innerHTML='<div style="font-size:40px;margin-bottom:12px">📋</div>'
      +'<div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:8px">Nenhuma ação encontrada</div>'
      +'<div style="font-size:12px">As ações são geradas no <strong>Modo Reunião</strong>. Abra uma reunião, preencha os planos de ação e eles aparecerão aqui.</div>';
    tbl.appendChild(empty);
    return;
  }

  var statusCfg={
    open:{label:'Em aberto',color:'#f59e0b',bg:'rgba(245,158,11,.12)'},
    done:{label:'Concluído',color:'#10b981',bg:'rgba(16,185,129,.12)'},
    cancelled:{label:'Cancelado',color:'#6b7280',bg:'rgba(107,114,128,.12)'}
  };

  var wrap=document.createElement('div');wrap.style.overflowX='auto';
  var table=document.createElement('table');
  table.style.cssText='width:100%;border-collapse:collapse;font-size:13px';

  // Header
  var thead=document.createElement('thead');
  var hrow=document.createElement('tr');
  hrow.style.borderBottom='2px solid rgba(255,255,255,.08)';
  ['MÊS','KPI','AÇÃO','RESPONSÁVEL','PRAZO','STATUS','OBSERVAÇÃO',''].forEach(function(col){
    var th=document.createElement('th');
    th.style.cssText='text-align:left;padding:10px 12px;font-size:10px;letter-spacing:1px;color:var(--mut);font-weight:700;white-space:nowrap';
    th.textContent=col;hrow.appendChild(th);
  });
  thead.appendChild(hrow);table.appendChild(thead);

  // Body
  var tbody=document.createElement('tbody');
  filtered.forEach(function(a){
    var sc=statusCfg[a.status]||statusCfg.open;
    var tr=document.createElement('tr');
    var _prazoDate=parsePrazo(a.prazo||'');
    var _prazoOverdue=_prazoDate&&a.status==='open'&&_prazoDate<(function(){var d=new Date();d.setHours(0,0,0,0);return d;})();
    tr.className='act-row'+(_prazoOverdue?' act-row-overdue':'');

    // Mês
    var tdMes=document.createElement('td');
    tdMes.style.cssText='padding:12px;white-space:nowrap;color:var(--mut);font-size:12px';
    tdMes.textContent=a.mes;tr.appendChild(tdMes);

    // KPI
    var tdKpi=document.createElement('td');tdKpi.style.padding='12px';
    var kpiSpan=document.createElement('span');
    kpiSpan.style.cssText='font-size:11px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,.1);padding:2px 8px;border-radius:20px';
    kpiSpan.textContent=a.kpi||'—';tdKpi.appendChild(kpiSpan);tr.appendChild(tdKpi);

    // Ação
    var tdAct=document.createElement('td');
    tdAct.style.cssText='padding:12px;color:var(--text);font-weight:500;max-width:260px';
    tdAct.textContent=a.text;tr.appendChild(tdAct);

    // Responsável
    var tdResp=document.createElement('td');tdResp.style.cssText='padding:12px;color:var(--mut)';
    tdResp.textContent=a.resp||'—';tr.appendChild(tdResp);

    // Prazo
    var tdPrazo=document.createElement('td');tdPrazo.style.cssText='padding:12px;white-space:nowrap';
    if(a.prazo){
      var prazoDate=parsePrazo(a.prazo);
      var today=new Date();today.setHours(0,0,0,0);
      var isOverdue=a.status==='open'&&prazoDate&&prazoDate<today;
      var prazoSpan=document.createElement('span');
      prazoSpan.style.cssText=isOverdue
        ?'color:#ef4444;font-weight:700;font-size:12px'
        :'color:var(--mut);font-size:12px';
      prazoSpan.textContent=a.prazo; // exibe como digitado
      tdPrazo.appendChild(prazoSpan);
      if(isOverdue){
        var badge=document.createElement('span');
        badge.style.cssText='margin-left:6px;font-size:9px;font-weight:700;color:#ef4444;background:rgba(239,68,68,.12);padding:1px 6px;border-radius:20px;letter-spacing:.5px';
        badge.textContent='ATRASADO';
        tdPrazo.appendChild(badge);
      }
    } else {
      var dash=document.createElement('span');dash.style.color='rgba(255,255,255,.2)';dash.textContent='—';
      tdPrazo.appendChild(dash);
    }
    tr.appendChild(tdPrazo);

    // Status select
    var tdSt=document.createElement('td');tdSt.style.padding='12px';
    var sel=document.createElement('select');
    sel.style.cssText='background:'+sc.bg+';color:'+sc.color+';border:1px solid '+sc.color+'40;border-radius:20px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;outline:none';
    [['open','Em aberto'],['done','Concluído'],['cancelled','Cancelado']].forEach(function(opt){
      var o=document.createElement('option');o.value=opt[0];o.textContent=opt[1];
      if(a.status===opt[0])o.selected=true;
      sel.appendChild(o);
    });
    (function(aid){sel.addEventListener('change',function(){updateActionStatus(aid,this.value);});})(a.id);
    tdSt.appendChild(sel);tr.appendChild(tdSt);

    // Observação
    var tdObs=document.createElement('td');tdObs.style.cssText='padding:12px;min-width:180px';
    var obsInp=document.createElement('input');
    obsInp.type='text';obsInp.value=a.obs||'';obsInp.placeholder='Adicionar observação...';
    obsInp.style.cssText='background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.1);color:var(--text);font-size:12px;width:100%;outline:none;padding:2px 0;font-family:Outfit,sans-serif';
    (function(aid){obsInp.addEventListener('change',function(){updateActionObs(aid,this.value);});})(a.id);
    tdObs.appendChild(obsInp);tr.appendChild(tdObs);

    // Excluir
    var tdDel=document.createElement('td');tdDel.style.padding='8px 12px';
    var delBtn=document.createElement('button');
    delBtn.title='Excluir ação';
    delBtn.textContent='🗑';
    delBtn.style.cssText='background:none;border:none;cursor:pointer;font-size:14px;opacity:.4;transition:opacity .15s;padding:4px';
    delBtn.onmouseover=function(){this.style.opacity='1';};
    delBtn.onmouseout=function(){this.style.opacity='.4';};
    (function(aid){delBtn.addEventListener('click',function(){deleteAction(aid);});})(a.id);
    tdDel.appendChild(delBtn);tr.appendChild(tdDel);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  tbl.appendChild(wrap);
}

function deleteAction(id){
  if(!confirm('Excluir este plano de ação?'))return;
  S.actions=(S.actions||[]).filter(function(a){return a.id!==id;});
  sv();rActions();
}
function updateActionStatus(id,status){
  var a=S.actions.find(function(x){return x.id===id;});
  if(a){a.status=status;sv();rActions();}
}

function updateActionObs(id,obs){
  var a=S.actions.find(function(x){return x.id===id;});
  if(a){a.obs=obs;sv();}
}

function toggleSidebar(){
  const sb=document.getElementById('sidebar');
  const collapsed=sb.classList.toggle('collapsed');
  const btn=sb.querySelector('.sb-toggle');
  if(btn)btn.textContent=collapsed?'›':'‹';
}
function go(name,btn){
  document.querySelectorAll('.page,.scrollpage').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tb').forEach(b=>b.classList.remove('active'));
  const pg=document.getElementById('page-'+name);
  if(pg)pg.classList.add('active');
  // Activate sidebar button
  const sbBtn=document.querySelector('.tb[data-page="'+name+'"]');
  if(sbBtn)sbBtn.classList.add('active');
  if(name==='dashboard'){rDash();setTimeout(sizeWheel,60);}
  if(name==='diag')rDiagPage();
  if(name==='input')dreInitPage();
  if(name==='config')rConfig();
  if(name==='sim')initSim();
  if(name==='import')rImportPage();
  if(name==='actions')rActions();
  if(name==='lancamentos')rLancamentos();
  if(name==='meth')rMeth();
  if(name==='advisor'){_currentAdvisor=_currentAdvisor||S.advisor||'analytics';rAdvisorPage();}
}

// ═══════════════════════════════════════════
// WHEEL
// ═══════════════════════════════════════════
function ns(t){return document.createElementNS('http://www.w3.org/2000/svg',t);}
function arcPath(svg,cx,cy,ir,or2,a1,a2,col,glow,dashed,op){
  const x1=cx+or2*Math.cos(a1),y1=cy+or2*Math.sin(a1),x2=cx+or2*Math.cos(a2),y2=cy+or2*Math.sin(a2);
  const x3=cx+ir*Math.cos(a2),y3=cy+ir*Math.sin(a2),x4=cx+ir*Math.cos(a1),y4=cy+ir*Math.sin(a1);
  const lg=a2-a1>Math.PI?1:0;
  const p=ns('path');
  p.setAttribute('d',`M${x1} ${y1} A${or2} ${or2} 0 ${lg} 1 ${x2} ${y2} L${x3} ${y3} A${ir} ${ir} 0 ${lg} 0 ${x4} ${y4}Z`);
  p.setAttribute('fill',col);if(op<1)p.setAttribute('opacity',op);
  if(dashed){p.setAttribute('stroke',col);p.setAttribute('stroke-width','1.5');p.setAttribute('stroke-dasharray','3 3');p.setAttribute('fill-opacity','.4');}
  if(glow)p.setAttribute('filter',`drop-shadow(0 0 5px ${col})`);
  svg.appendChild(p);
}
function rWheel(dets,sz,svgId){
  const svg=document.getElementById(svgId||'hw');if(!svg)return;
  if(!sz)sz=parseFloat(svg.getAttribute('width')||360);
  svg.innerHTML='';
  // rI=22% do sz → círculo central amplo para score sem sobrepor fatias
  const cx=sz/2,cy=sz/2,rO=sz*.40,rI=sz*.22,gap=.04;
  const rGrpIn=rO+5,rGrpOut=rO+sz*.062;
  // KPI list — lucroliq fica fora da roda
  const _wheelInds=IND.filter(i=>i.id!=='lucroliq');
  const n_w=_wheelInds.length,sa_w=(Math.PI*2)/n_w;
  // GROUP ARC RINGS
  ['tracao','rentab'].forEach(g=>{
    const inds=_wheelInds.filter(i=>i.group===g),fi=_wheelInds.indexOf(inds[0]),li=_wheelInds.indexOf(inds[inds.length-1]);
    if(fi<0)return;
    const _sa=sa_w;
    const a1=-Math.PI/2+fi*_sa+gap*1.8,a2=-Math.PI/2+(li+1)*_sa-gap*1.8;
    arcPath(svg,cx,cy,rGrpIn,rGrpOut,a1,a2,GC[g],false,false,.85);
    const ma=(a1+a2)/2,mr=(rGrpIn+rGrpOut)/2;
    const gx=cx+mr*Math.cos(ma),gy=cy+mr*Math.sin(ma);
    const gt=ns('text');gt.setAttribute('x',gx);gt.setAttribute('y',gy);
    gt.setAttribute('text-anchor','middle');gt.setAttribute('dominant-baseline','middle');
    gt.setAttribute('font-size',sz*.032+'');  // 3x bigger than before
    gt.setAttribute('fill','#07101c');
    gt.setAttribute('font-family','Bebas Neue,sans-serif');gt.setAttribute('font-weight','900');
    const ad=(ma*180/Math.PI)+90;const rd=(ad+360)%360;
    gt.setAttribute('transform',`rotate(${rd>90&&rd<270?ad+180:ad},${gx},${gy})`);
    gt.textContent=GN[g].split(' ')[0];svg.appendChild(gt);
  });
  // KPI SLICES
  _wheelInds.forEach((ind,i)=>{
    const sa=sa_w;
    const a1=-Math.PI/2+i*sa+gap/2,a2=a1+sa-gap,col=GC[ind.group];
    arcPath(svg,cx,cy,rI,rO,a1,a2,'rgba(255,255,255,.04)',false,false,1);
    let pct=0,conf='high';
    if(dets){const det=dets.find(d=>d.ind.id===ind.id);if(det){pct=det.pct;conf=det.conf;}}
    if(pct>0)arcPath(svg,cx,cy,rI,rI+(rO-rI)*(pct/100),a1,a2,col,false,false,1);
    // Label position — inside arc at 60% radius
    const ma=a1+(sa-gap)/2;
    const mr=rI+(rO-rI)*0.60;
    const tx=cx+mr*Math.cos(ma),ty=cy+mr*Math.sin(ma);
    // Determine if arc is filled enough to put dark text on it
    const onColor=pct>=50; // arc is mostly filled → use dark text on color bg
    const textCol=onColor?'#07101c':'rgba(210,230,255,.9)';
    const pctColor=pct>=80?'#07101c':pct>=60?'#f4a522':'#ff5470';
    const pctOnColor=pct>=80; // white arc → dark text; low pct → colored warning text
    // icon
    const ico=ns('text');ico.setAttribute('x',tx);ico.setAttribute('y',ty-sz*.026);
    ico.setAttribute('text-anchor','middle');ico.setAttribute('dominant-baseline','middle');
    ico.setAttribute('font-size',sz*.032+'');ico.textContent=ind.icon;svg.appendChild(ico);
    // short name
    const lt=ns('text');lt.setAttribute('x',tx);lt.setAttribute('y',ty+sz*.006);
    lt.setAttribute('text-anchor','middle');lt.setAttribute('dominant-baseline','middle');
    lt.setAttribute('font-size',sz*.024+'');lt.setAttribute('fill',textCol);
    lt.setAttribute('font-family','Outfit,sans-serif');lt.setAttribute('font-weight','700');
    lt.textContent=ind.short;svg.appendChild(lt);
    // pct
    if(pct>0){
      const pc=ns('text');pc.setAttribute('x',tx);pc.setAttribute('y',ty+sz*.034);
      pc.setAttribute('text-anchor','middle');pc.setAttribute('dominant-baseline','middle');
      pc.setAttribute('font-size',sz*.026+'');
      pc.setAttribute('fill',pct>=80?'#07101c':pct>=60?'#f4a522':'#ff5470');
      pc.setAttribute('font-family','JetBrains Mono,monospace');pc.setAttribute('font-weight','800');
      pc.textContent=Math.round(pct)+'%';svg.appendChild(pc);
    }
    // Click overlay
    const sa_loc=sa_w;
    const hitA1=-Math.PI/2+i*sa_loc+gap/2,hitA2=hitA1+sa_loc-gap;
    const hit=ns('path');
    const hx1=cx+(rI)*Math.cos(hitA1),hy1=cy+(rI)*Math.sin(hitA1);
    const hx2=cx+(rO+sz*.062)*Math.cos(hitA1),hy2=cy+(rO+sz*.062)*Math.sin(hitA1);
    const hx3=cx+(rO+sz*.062)*Math.cos(hitA2),hy3=cy+(rO+sz*.062)*Math.sin(hitA2);
    const hx4=cx+(rI)*Math.cos(hitA2),hy4=cy+(rI)*Math.sin(hitA2);
    hit.setAttribute('d',`M${hx1},${hy1} L${hx2},${hy2} A${rO+sz*.062},${rO+sz*.062} 0 0,1 ${hx3},${hy3} L${hx4},${hy4} A${rI},${rI} 0 0,0 ${hx1},${hy1} Z`);
    hit.setAttribute('fill','transparent');
    hit.style.cursor='pointer';
    (function(id){hit.addEventListener('click',function(){openKpi(id);});})(ind.id);
    svg.appendChild(hit);
  });
  const dc=ns('circle');dc.setAttribute('cx',cx);dc.setAttribute('cy',cy);dc.setAttribute('r',rI-2);
  dc.setAttribute('fill','none');dc.setAttribute('stroke','rgba(255,255,255,.07)');dc.setAttribute('stroke-width','1');svg.appendChild(dc);
}
function toggleKpiList(){
  var layout=document.querySelector('.dash-layout');
  if(!layout)return;
  var hidden=layout.classList.toggle('kpi-hidden');
  var btn=document.getElementById('kpiToggleBtn');
  if(btn){btn.textContent=hidden?'Recolher roda':'Expandir roda';btn.style.color=hidden?'var(--teal)':'var(--mut)';}
  // Aguarda o browser recalcular o layout antes de medir wheelCol
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      sizeWheel();
      setTimeout(sizeWheel,200);
      setTimeout(sizeWheel,350);
    });
  });
}
function sizeWheel(){
  const col=document.getElementById('wheelCol');if(!col)return;
  const W=col.clientWidth,H=col.clientHeight;
  const sz=Math.max(180,Math.min(W*.88,H*.9,500));
  const svg=document.getElementById('hw');
  svg.setAttribute('width',sz);svg.setAttribute('height',sz);svg.setAttribute('viewBox',`0 0 ${sz} ${sz}`);
  const ww=document.getElementById('wheelWrap');ww.style.width=sz+'px';ww.style.height=sz+'px';
  rWheel(window._lastDets||null,sz,'hw');
}
window.addEventListener('resize',()=>{
  const pg=document.getElementById('page-dashboard');
  if(pg&&pg.classList.contains('active'))sizeWheel();
  const sp=document.getElementById('page-sim');
  if(sp&&sp.classList.contains('active'))sizeSimWheel();
});

function sizeSimWheel(){
  const box=document.getElementById('simWheelBox');if(!box)return;
  const left=document.querySelector('.sim-left');
  if(!left)return;
  const W=left.offsetWidth||left.clientWidth||400;
  const H=left.offsetHeight||left.clientHeight||600;
  // Use most of the available space — subtract space for score bar + lucro card
  const avail=Math.min(W-32, H-140);
  const sz=Math.max(260,Math.min(avail,680));
  const svg=document.getElementById('simHw');
  svg.setAttribute('width',sz);svg.setAttribute('height',sz);svg.setAttribute('viewBox',`0 0 ${sz} ${sz}`);
  box.style.width=sz+'px';box.style.height=sz+'px';
  rWheel(window._simDets||null,sz,'simHw');
}

// ═══════════════════════════════════════════
// SPARKLINE
// ═══════════════════════════════════════════
function rTrend(){
  const ms=getKnownMonths(),scores=ms.map(m=>{const r=calcScore(m);return r?r.score:null;});
  const ts=document.getElementById('tStats');ts.innerHTML='';
  const hasD=scores.some(s=>s!==null);
  if(hasD){
    const f=scores.filter(s=>s!==null),last=f[f.length-1],prev=f.length>1?f[f.length-2]:null;
    const g=grade(last),diff=prev!==null?last-prev:null;
    ts.innerHTML=`<div class="tstat"><div class="v" style="color:${g.c}">${last}</div><div class="l">ATUAL</div></div>${diff!==null?`<div class="tstat"><div class="v" style="color:${diff>=0?'var(--green)':'var(--red)'}">${diff>=0?'+':''}${diff}</div><div class="l">VS ANT.</div></div>`:''}`;
  }
  const svg=document.getElementById('spSvg');svg.innerHTML='';
  const W=svg.parentElement.offsetWidth||280,H=52;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  if(!hasD||ms.length<2){rSparkLbs();return;}
  const pts=ms.map((m,i)=>{const r=calcScore(m);const v=r?r.score:null;return{x:(W/(ms.length-1))*i,y:v!==null?H-4-(v/100)*(H-10):null,v,hd:v!==null};});
  const vld=pts.filter(p=>p.hd);if(vld.length<2){rSparkLbs();return;}
  const defs=ns('defs'),lg=ns('linearGradient');lg.setAttribute('id','tg');lg.setAttribute('x1','0');lg.setAttribute('y1','0');lg.setAttribute('x2','0');lg.setAttribute('y2','1');
  const s1=ns('stop');s1.setAttribute('offset','0%');s1.setAttribute('stop-color','#00f0c8');
  const s2=ns('stop');s2.setAttribute('offset','100%');s2.setAttribute('stop-color','#00f0c8');s2.setAttribute('stop-opacity','0');
  lg.appendChild(s1);lg.appendChild(s2);defs.appendChild(lg);svg.appendChild(defs);
  const aD=`M${vld[0].x},${H} `+vld.map(p=>`L${p.x},${p.y}`).join(' ')+` L${vld[vld.length-1].x},${H} Z`;
  const ar=ns('path');ar.setAttribute('d',aD);ar.setAttribute('fill','url(#tg)');ar.setAttribute('opacity','.18');svg.appendChild(ar);
  const ln=ns('path');ln.setAttribute('d',vld.map((p,i)=>(i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`)).join(' '));
  ln.setAttribute('stroke','#00f0c8');ln.setAttribute('stroke-width','1.5');ln.setAttribute('fill','none');svg.appendChild(ln);
  vld.forEach(p=>{const g=grade(p.v);const ci=ns('circle');ci.setAttribute('cx',p.x);ci.setAttribute('cy',p.y);ci.setAttribute('r',3);
    ci.setAttribute('fill',g.c.startsWith('#')?g.c:'#00f0c8');ci.setAttribute('stroke','#07101c');ci.setAttribute('stroke-width','1.5');svg.appendChild(ci);
    const tx=ns('text');tx.setAttribute('x',p.x);tx.setAttribute('y',p.y-7);tx.setAttribute('text-anchor','middle');tx.setAttribute('font-size','8');tx.setAttribute('fill','#4a6690');tx.setAttribute('font-family','JetBrains Mono');tx.textContent=p.v;svg.appendChild(tx);});
  rSparkLbs();
}
function rSparkLbs(){
  const c=document.getElementById('spLbs');c.innerHTML='';
  getKnownMonths().forEach(m=>{const[y,mo]=m.split('-');const d=document.createElement('div');d.className='spl';d.textContent=MES[parseInt(mo)-1]+'/'+y.slice(2);c.appendChild(d);});
}

// ═══════════════════════════════════════════
// MODAL + PILLS
// ═══════════════════════════════════════════
// Deriva lista de meses conhecidos a partir dos dados (substitui S.months como fonte da verdade)
function getKnownMonths(){
  var keys=new Set();
  if(S.months&&S.months.length)S.months.forEach(function(m){keys.add(m);});
  if(S.data)Object.keys(S.data).forEach(function(m){if(S.data[m]&&Object.keys(S.data[m]).length)keys.add(m);});
  if(S.raw)Object.keys(S.raw).forEach(function(m){if(S.raw[m]&&Object.keys(S.raw[m]).length)keys.add(m);});
  if(S.forecast)Object.keys(S.forecast).forEach(function(m){if(S.forecast[m]&&Object.keys(S.forecast[m]).length)keys.add(m);});
  return Array.from(keys).sort();
}
function rPills(){
  const c=document.getElementById('mpills');c.innerHTML='';
  const known=getKnownMonths();
  // Sync S.months
  S.months=known;
  if(!S.sel||!known.includes(S.sel)){
    S.sel=known.length?known[known.length-1]:null;
  }

  // Build month selector
  const wrap=document.createElement('div');
  wrap.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap';

  // Month select
  const selMes=document.createElement('select');
  selMes.className='csel';
  selMes.style.cssText='font-size:12px;padding:5px 10px';
  MES.forEach(function(m,i){
    const o=document.createElement('option');
    o.value=String(i+1).padStart(2,'0');
    o.textContent=m;
    selMes.appendChild(o);
  });

  // Year select
  const selAno=document.createElement('select');
  selAno.className='csel';
  selAno.style.cssText='font-size:12px;padding:5px 10px;width:80px';
  const curY=new Date().getFullYear();
  for(var y=curY-3;y<=curY+1;y++){
    const o=document.createElement('option');o.value=y;o.textContent=y;
    selAno.appendChild(o);
  }

  // Set current values
  if(S.sel){
    const[sy,smo]=S.sel.split('-');
    selMes.value=smo;selAno.value=sy;
  } else {
    selMes.value=String(new Date().getMonth()+1).padStart(2,'0');
    selAno.value=curY;
  }

  
  function onSelChange(){
    var mk=selAno.value+'-'+selMes.value;
    S.sel=mk;
    _dashView='real'; // reset view on month change
    if(!S.months.includes(mk)){S.months.push(mk);S.months.sort();}
    sv();rDash();
  }
  selMes.addEventListener('change',onSelChange);
  selAno.addEventListener('change',onSelChange);

  // Status badge for current month
  // View toggle buttons
  var viewWrap=document.createElement('div');
  viewWrap.style.cssText='display:flex;gap:4px;align-items:center';
  viewWrap.id='dashViewBtns';

  function buildViewBtns(mk){
    viewWrap.innerHTML='';
    const hasDados=S.data[mk]&&Object.keys(S.data[mk]).length>0;
    const hasFcast=S.forecast&&S.forecast[mk]&&Object.keys(S.forecast[mk]).length>0;
    if(!hasDados&&!hasFcast){
      const empty=document.createElement('span');
      empty.style.cssText='font-size:11px;color:var(--mut);background:rgba(255,255,255,.05);padding:3px 10px;border-radius:20px';
      empty.textContent='Sem dados';viewWrap.appendChild(empty);return;
    }
    // Ensure _dashView is valid for this month
    if(_dashView==='forecast'&&!hasFcast)_dashView='real';
    if(_dashView==='real'&&!hasDados&&hasFcast)_dashView='forecast';
    if(hasDados){
      const btn=document.createElement('button');
      btn.id='dashBtnReal';
      btn.style.cssText='font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;cursor:pointer;border:1px solid;transition:all .15s';
      function styleReal(active){btn.style.background=active?'rgba(0,232,155,.15)':'rgba(255,255,255,.04)';btn.style.color=active?'var(--green)':'var(--mut)';btn.style.borderColor=active?'rgba(0,232,155,.4)':'rgba(255,255,255,.1)';}
      styleReal(_dashView==='real');
      btn.textContent='✓ Fechado';
      btn.onclick=function(){_dashView='real';styleReal(true);if(hasFcast){var fb=document.getElementById('dashBtnFcast');if(fb){fb.style.background='rgba(255,255,255,.04)';fb.style.color='var(--mut)';fb.style.borderColor='rgba(255,255,255,.1)';}}rDash();};
      viewWrap.appendChild(btn);
    }
    if(hasFcast){
      const btn=document.createElement('button');
      btn.id='dashBtnFcast';
      btn.style.cssText='font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;cursor:pointer;border:1px solid;transition:all .15s';
      function styleFcast(active){btn.style.background=active?'rgba(168,85,247,.15)':'rgba(255,255,255,.04)';btn.style.color=active?'#c084fc':'var(--mut)';btn.style.borderColor=active?'rgba(168,85,247,.4)':'rgba(255,255,255,.1)';}
      styleFcast(_dashView==='forecast');
      btn.textContent='🔮 Previsão';
      btn.onclick=function(){_dashView='forecast';styleFcast(true);var rb=document.getElementById('dashBtnReal');if(rb){rb.style.background='rgba(255,255,255,.04)';rb.style.color='var(--mut)';rb.style.borderColor='rgba(255,255,255,.1)';}rDash();};
      viewWrap.appendChild(btn);
    }
  }
  if(S.sel)buildViewBtns(S.sel);

  wrap.appendChild(selMes);
  wrap.appendChild(selAno);
  wrap.appendChild(viewWrap);
  c.appendChild(wrap);
}
// ── Delete dialog ──────────────────────────────────────────────────
function showDelDialog(title,msg,onConfirm){
  document.getElementById('delDialogTitle').textContent=title.replace(/^[^\s]+ /,'');
  document.getElementById('delDialogIcon').textContent=title.split(' ')[0];
  document.getElementById('delDialogMsg').innerHTML=msg;
  var btn=document.getElementById('delDialogConfirm');
  btn.onclick=function(){closeDelDialog();onConfirm();};
  document.getElementById('delDialog').classList.add('open');
}
function closeDelDialog(){
  document.getElementById('delDialog').classList.remove('open');
}
// Close on backdrop click
document.addEventListener('click',function(e){
  if(e.target.id==='delDialog')closeDelDialog();
});

// ── Delete actions ──────────────────────────────────────────────────
function deleteFechamento(mk){
  delete S.data[mk];delete S.raw[mk];
  if(S.diagCache)delete S.diagCache[mk];
  if(_bulletsCache)delete _bulletsCache[mk.split('|')[0]];
  // Clear bullets cache entries for this mk
  Object.keys(_bulletsCache).forEach(function(k){if(k.indexOf(mk+'|')===0)delete _bulletsCache[k];});
  sv();
  toast('✓ Fechamento de '+_mkLabel(mk)+' removido');
  rDash();rPills();
}
function deleteForecast(mk){
  if(S.forecast)delete S.forecast[mk];
  sv();
  toast('✓ Previsão de '+_mkLabel(mk)+' removida');
  rDash();rPills();
}
function deletePeriod(mk){
  S.months=(S.months||[]).filter(function(m){return m!==mk;});
  if(S.data)delete S.data[mk];
  if(S.raw)delete S.raw[mk];
  if(S.forecast)delete S.forecast[mk];
  if(S.meetActions)delete S.meetActions[mk];
  if(S.diagCache)delete S.diagCache[mk];
  Object.keys(_bulletsCache).forEach(function(k){if(k.indexOf(mk)===0)delete _bulletsCache[k];});
  if(S.sel===mk){var km=getKnownMonths();S.sel=km.length?km[km.length-1]:null;}
  sv();
  toast('✓ Período '+_mkLabel(mk)+' removido');
  rDash();rPills();
}
function _mkLabel(mk){
  var p=mk.split('-');return MES[parseInt(p[1])-1]+'/'+p[0];
}
// Legacy alias
function removePeriod(mk,e){
  if(e)e.stopPropagation();
  var pm=mk.split('-');
  showDelDialog('⚠️ Excluir mês completo',
    'Excluir <b>todos os dados</b> de <b>'+MES[parseInt(pm[1])-1]+'/'+pm[0]+'</b> permanentemente?',
    function(){deletePeriod(mk);}
  );
}
function openMod(){
  const s=document.getElementById('addAno');s.innerHTML='';
  const cur=new Date().getFullYear();
  for(let y=cur-2;y<=cur+2;y++){const o=document.createElement('option');o.value=y;o.textContent=y;if(y===cur)o.selected=true;s.appendChild(o);}
  document.getElementById('addMes').value=String(new Date().getMonth()+1).padStart(2,'0');
  document.getElementById('modal').classList.add('open');
}
function closeMod(){document.getElementById('modal').classList.remove('open');}
function confirmMod(){
  const mes=document.getElementById('addMes').value,ano=document.getElementById('addAno').value;
  const key=`${ano}-${mes}`;
  S.sel=key;
  if(!S.months.includes(key)){S.months.push(key);S.months.sort();}
  sv();closeMod();
  go('input',document.querySelector('[data-page=input]'));
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// DIAGNOSIS PAGE
// ═══════════════════════════════════════════
function rDiagPage(){
  if(!S.sel){return;}
  const[y,mo]=S.sel.split('-');
  const label=MES[parseInt(mo)-1]+'/'+y;
  const pd=document.getElementById('diagPagePeriod');
  if(pd)pd.textContent=label+(S.sector?' · '+S.sector:'');
  // Render goal cards
  rDiagGoals();
  // Render full diagnosis (reuse cached or call API)
  const res=calcScore(S.sel);
  if(!res){
    const body=document.getElementById('diagPageBody');
    if(body)body.innerHTML='<div class="empty"><div class="eico">📊</div><p>Lance os dados do período para gerar o diagnóstico</p></div>';
    return;
  }
  // Mirror diagC to diagPageBody
  const diagC=document.getElementById('diagC');
  const diagBody=document.getElementById('diagPageBody');
  if(diagBody){
    if(diagC&&diagC.innerHTML&&!diagC.innerHTML.includes('eico')){
      diagBody.innerHTML=diagC.innerHTML;
    } else {
      // Call diagnosis and render in both places
      rDiag(res,true);
    }
  }
}
function rDiagGoals(){
  const el=document.getElementById('diagGoals');if(!el)return;
  const res=S.sel?calcScore(S.sel):null;
  if(!res){el.innerHTML='<div class="empty"><div class="eico">🎯</div><p>Lance os dados para ver as metas</p></div>';return;}
  el.innerHTML='';
  [...res.details].sort((a,b)=>a.pct-b.pct).forEach(d=>{
    const col=d.pct>=80?'var(--green)':d.pct>=60?'var(--amber)':'var(--red)';
    const card=document.createElement('div');card.className='goal-card';
    card.innerHTML='<div class="goal-card-top">'+
      '<span class="goal-card-name">'+d.ind.icon+' '+d.ind.short+'</span>'+
      '<span class="goal-card-pct" style="color:'+col+'">'+Math.round(d.pct)+'%</span></div>'+
      '<div class="goal-bar"><div class="goal-bar-fill" style="width:'+Math.min(100,d.pct)+'%;background:'+col+'"></div></div>'+
      '<div class="goal-vals"><span>'+fmtV(d.val,d.ind.unit)+'</span><span>meta: '+fmtV(d.goal,d.ind.unit)+'</span></div>';
    el.appendChild(card);
  });
}

// ── AI Bullet Points for Dashboard ──────────────────────────────────
var _bulletsCache={};
async function rBullets(res){
  var el=document.getElementById('bulletContent');if(!el)return;
  if(!res||!S.sel){el.innerHTML='<div class="empty" style="padding:4px 0"><p style="font-size:11px">Sem dados</p></div>';return;}
  var parts=S.sel.split('-');var y=parts[0];var mo=parts[1];
  var cacheKey=S.sel+'|'+res.score;
  if(_bulletsCache[cacheKey]){el.innerHTML=_bulletsCache[cacheKey];return;}
  el.innerHTML='<div class="bullet-load"><div class="spin"></div><span>Analisando...</span></div>';
  var sorted=[].concat(res.details).sort(function(a,b){return a.adjPct-b.adjPct;});
  var worst=sorted.slice(0,2),best=sorted.slice(-1);
  var kpiCtx=res.details.map(function(d){return d.ind.short+': '+Math.round(d.adjPct)+'%';}).join(', ');
  var prompt='Empresa: '+S.company+(S.sector?' ('+S.sector+')':'')+'. Mês: '+MES[parseInt(mo)-1]+'/'+y+'. Score: '+res.score+'. KPIs: '+kpiCtx+'. '
    +'Escreva EXATAMENTE 3 bullet points curtos (máx 12 palavras cada) sobre os pontos mais importantes deste mês. '
    +'Misture alertas e pontos positivos. Prefixe cada linha com NEG: ou POS: conforme o caso. Sem markdown. Um por linha.';
  try{
    var r=await fetch('/api/diagnose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt})});
    var data=await r.json();
    if(data.error)throw new Error(data.error);
    var rawLines=(data.text||'').split(String.fromCharCode(10));
    var lines=[];
    for(var i=0;i<rawLines.length;i++){
      var l=rawLines[i].trim();
      if(l.indexOf('NEG:')==0||l.indexOf('POS:')==0)lines.push(l);
      if(lines.length>=3)break;
    }
    if(!lines.length)throw new Error('sem bullets');
    var html='';
    for(var j=0;j<lines.length;j++){
      var isNeg=lines[j].indexOf('NEG:')==0;
      var txt=lines[j].substring(4).trim();
      html+='<div class="bullet-item"><div class="bullet-dot '+(isNeg?'neg':'pos')+'"></div><span>'+txt+'</span></div>';
    }
    el.innerHTML=html;
    _bulletsCache[cacheKey]=html;
  }catch(e){
    var html='';
    for(var k=0;k<Math.min(2,worst.length);k++){
      html+='<div class="bullet-item"><div class="bullet-dot neg"></div><span>'+worst[k].ind.short+' em '+Math.round(worst[k].adjPct)+'% da meta</span></div>';
    }
    for(var m=0;m<Math.min(1,best.length);m++){
      html+='<div class="bullet-item"><div class="bullet-dot pos"></div><span>'+best[m].ind.short+' com '+Math.round(best[m].adjPct)+'% — destaque</span></div>';
    }
    el.innerHTML=html;
  }
}

function rDash(){
  document.getElementById('coName').textContent=S.company;
  const dp=document.getElementById('diagPeriod');
  if(dp&&S.sel){const[dy,dmo]=S.sel.split('-');dp.textContent=MES[parseInt(dmo)-1]+'/'+dy;}
  const ss=document.getElementById('scoreSector');if(ss)ss.textContent=S.sector||'';
  const nl=document.getElementById('navLogo');if(S.logo){nl.src=S.logo;nl.style.display='block';}else nl.style.display='none';
  rPills();rTrend();
  const res=S.sel?calcScore(S.sel):null;
  // Lucro Líquido card
  (function(){
    var lc=document.getElementById('lucroCard');
    var lv=document.getElementById('lucroVal');
    var ll=document.getElementById('lucroLbl');
    if(!lc||!lv||!ll)return;
    var raw=S.sel&&S.raw&&S.raw[S.sel]?S.raw[S.sel]:null;
    if(!raw){lc.style.display='none';return;}
    var kpis=calcKPIs(raw);
    var ll_val=kpis.lucroliq;
    if(ll_val===null){lc.style.display='none';return;}
    lc.style.display='flex';
    var col=ll_val>=10?'#10b981':ll_val>=0?'#f59e0b':'#ef4444';
    var lbl=ll_val>=10?'Saudável':ll_val>=0?'Atenção':'Negativo';
    lc.style.borderColor=col+'40';
    lv.style.color=col;
    lv.textContent=(ll_val>=0?'+':'')+ll_val.toFixed(1)+'%';
    ll.style.color=col;
    ll.textContent=lbl;
  })();
  // ── Resolve which view to show: 'real' or 'forecast' ──────────────
  const hasFcast=S.sel&&S.forecast&&S.forecast[S.sel]&&Object.keys(S.forecast[S.sel]).length>0;
  const hasReal=!!res;
  // If no real data and has forecast, auto-show forecast
  if(!hasReal&&hasFcast)_dashView='forecast';
  if(!hasReal&&!hasFcast)_dashView='real';

  // ── Build forecast score/dets if needed ─────────────────────────
  let fcDets=null,fcScore=null,fcG=null;
  if(hasFcast){
    const fcRaw={...(S.raw&&S.raw[S.sel]||{}),...S.forecast[S.sel]};
    const fcKpis=calcKPIs(fcRaw);
    const tw=IND.reduce((s,i)=>s+(S.cfg[i.id]?.weight||1),0);
    fcDets=IND.map(ind=>{
      const v=fcKpis[ind.id];const goal=getGoal(ind.id,S.sel);const hb=S.cfg[ind.id]?.hb??ind.hb;
      let pct=0;if(v!==null&&goal){pct=hb?Math.min((v/goal)*100,150):(goal===0?100:Math.min((goal/Math.max(v,.001))*100,150));pct=Math.max(0,Math.min(100,pct));}
      return{ind,val:v,pct,adjPct:pct,conf:'medium',goal};
    });
    const ws=fcDets.reduce((s,d)=>s+d.pct*(S.cfg[d.ind.id]?.weight||1),0);
    fcScore=tw>0?Math.round(ws/tw):0;fcG=grade(fcScore);
  }

  // ── Decide active dets for wheel ────────────────────────────────
  const activeDets=_dashView==='forecast'&&fcDets?fcDets:(res?res.details:null);
  window._lastDets=activeDets;
  sizeWheel();

  // ── No data at all ──────────────────────────────────────────────
  if(!hasReal&&!hasFcast){
    document.getElementById('sn').textContent='—';
    const sg=document.getElementById('sg');
    sg.textContent='Sem dados';sg.style.cssText='color:var(--mut)';
    ['rScore','rConf'].forEach(id=>document.getElementById(id).textContent='—');
    ['rScoreBar','rConfBar'].forEach(id=>document.getElementById(id).style.width='0%');
    document.getElementById('rConfChips').innerHTML='';document.getElementById('rConfWarn').textContent='';
    document.getElementById('indList').innerHTML='<div class="empty"><div class="eico">📊</div><p>Selecione um período e lance os dados, ou use a aba <strong>Lançamento</strong></p></div>';
    document.getElementById('diagC').innerHTML='<div class="empty"><div class="eico">🤖</div><p>Gerado ao salvar os dados</p></div>';
    return;
  }

  // ── FORECAST view ───────────────────────────────────────────────
  if(_dashView==='forecast'&&fcDets){
    document.getElementById('sn').textContent='~'+fcScore;
    document.getElementById('sn').style.color='#8b9cf4';
    const sg=document.getElementById('sg');
    // If also has real, show comparison
    if(hasReal){
      const diff=fcScore-res.score;
      sg.textContent='🔮 Prev '+fcScore+(diff>=0?' ▲ +':' ▼ ')+diff+' vs real';
    } else {
      sg.textContent='🔮 Previsão';
    }
    sg.style.cssText='color:#8b9cf4;background:rgba(139,156,244,.12);border:1px solid rgba(139,156,244,.3)';
    document.getElementById('rScore').textContent='~'+fcScore;document.getElementById('rScore').style.color='#8b9cf4';
    document.getElementById('rScoreBar').style.cssText='width:'+fcScore+'%;background:#8b9cf4';
    document.getElementById('rConf').textContent='Previsão';document.getElementById('rConf').style.color='#8b9cf4';
    document.getElementById('rConfBar').style.cssText='width:70%;background:#8b9cf4';
    document.getElementById('rConfChips').innerHTML='<span style="font-size:11px;color:#8b9cf4">🔮 Dados de previsão — score e KPIs projetados</span>';
    document.getElementById('rConfWarn').textContent=hasReal?'':'Sem fechamento — exibindo projeção';
    rIndListFcast(fcDets);
    // No API call for forecast — show static message
    document.getElementById('diagC').innerHTML='<div style="padding:12px 0;font-size:12px;color:#8b9cf4;line-height:1.6">🔮 <strong>Visão de previsão.</strong><br>O diagnóstico é gerado apenas com dados de fechamento.</div>';
    return;
  }

  // ── REAL (fechamento) view ──────────────────────────────────────
  const g=grade(res.score);
  document.getElementById('sn').textContent=res.score;
  document.getElementById('sn').style.color=g.c;
  const sg=document.getElementById('sg');
  // Badge: show forecast comparison if available
  if(fcScore!==null){
    const diff=res.score-fcScore;
    sg.textContent=g.l+' · prev '+fcScore+(diff>=0?' ▲ +':' ▼ ')+diff;
  } else {
    sg.textContent=g.l;
  }
  sg.style.cssText=`color:${g.c};background:${g.c}20;border:1px solid ${g.c}50`;
  document.getElementById('rScore').textContent=res.score;document.getElementById('rScore').style.color=g.c;
  document.getElementById('rScoreBar').style.cssText=`width:${res.score}%;background:${g.c}`;
  const cf=calcConf(res.details);
  if(cf){const cc=cf.p>=80?'var(--green)':cf.p>=60?'var(--amber)':'var(--red)';
    document.getElementById('rConf').textContent=cf.p+'%';document.getElementById('rConf').style.color=cc;
    document.getElementById('rConfBar').style.cssText=`width:${cf.p}%;background:${cc}`;
    document.getElementById('rConfChips').innerHTML=`<span class="cc" style="color:var(--green);border-color:rgba(0,232,155,.3);background:rgba(0,232,155,.08)">✅${cf.hi}</span><span class="cc" style="color:var(--amber);border-color:rgba(244,165,34,.3);background:rgba(244,165,34,.08)">⚠${cf.md}</span><span class="cc" style="color:var(--red);border-color:rgba(255,61,90,.3);background:rgba(255,61,90,.08)">❌${cf.lo}</span>`;
    const low=res.details.filter(d=>d.conf!=='high');
    document.getElementById('rConfWarn').textContent=low.length?`⚠️ Verifique: ${low.map(d=>d.ind.short).join(', ')}`:'';}
  rIndList(res.details);
  rDiag(res);    // API call — diagnóstico completo
  rBullets(res); // API call — bullet points dashboard
}
function rDashNoApi(){
  // Atualiza score, roda, lista de KPIs e gaps sem chamar a API de diagnóstico.
  // Usado quando apenas metas ou configurações mudam, não os dados brutos.
  document.getElementById('coName').textContent=S.company;
  rPills();rTrend();
  const res=S.sel?calcScore(S.sel):null;
  if(!res)return;
  const g=grade(res.score);
  document.getElementById('sn').textContent=res.score;
  document.getElementById('sn').style.color=g.c;
  const sg=document.getElementById('sg');sg.textContent=g.l;
  sg.style.cssText=`color:${g.c};background:${g.c}20;border:1px solid ${g.c}50`;
  document.getElementById('rScore').textContent=res.score;
  document.getElementById('rScore').style.color=g.c;
  document.getElementById('rScoreBar').style.cssText=`width:${res.score}%;background:${g.c}`;
  const cf=calcConf(res.details);
  if(cf){const cc=cf.p>=80?'var(--green)':cf.p>=60?'var(--amber)':'var(--red)';
    document.getElementById('rConf').textContent=cf.p+'%';document.getElementById('rConf').style.color=cc;
    document.getElementById('rConfBar').style.cssText=`width:${cf.p}%;background:${cc}`;}
  rIndList(res.details);
  sizeWheel();
}
function rIndList(dets){
  const el=document.getElementById('indList');el.innerHTML='';
  const fcRaw=S.sel&&S.forecast&&S.forecast[S.sel]?S.forecast[S.sel]:null;
  const fcKpis=fcRaw?calcKPIs(fcRaw):null;
  [...dets].sort((a,b)=>a.pct-b.pct).forEach(d=>{
    const{ind,pct,val,goal}=d,col=GC[ind.group],ac=pct<60?'r':d.conf!=='high'?'a':'h';
    // Forecast comparison
    let fcPct=null,fcDelta=null;
    if(fcKpis){
      const fv=fcKpis[ind.id];
      if(fv!==null&&fv!==undefined){
        const hb=S.cfg[ind.id]?.hb??ind.hb;
        let fp=hb?(d.goal===0?100:Math.min((fv/d.goal)*100,150)):(d.goal===0?100:Math.min((d.goal/Math.max(fv,.001))*100,150));
        fp=Math.max(0,Math.min(100,fp));
        fcPct=fp;
        fcDelta=Math.round(pct-fp);
      }
    }
    // ── Gap: realizado vs meta ─────────────────────────────────────
    // Monetary (R$): gap in % relative to goal
    // Percentage (%): gap in percentage points (pp)
    let gapStr='',gapCol='var(--mut)';
    if(val!==null&&val!==undefined&&goal){
      const hb=S.cfg[ind.id]?.hb??ind.hb;
      if(ind.unit==='R$'){
        // Gap = (realizado - meta) / meta * 100 → show as %
        const gapPct=((val-goal)/goal)*100;
        const above=hb?gapPct>=0:gapPct<=0; // "above" means good direction
        gapCol=above?'var(--green)':'var(--red)';
        gapStr=(gapPct>=0?'+':'')+gapPct.toFixed(1)+'% da meta';
      } else if(ind.unit==='%'){
        // Gap = realizado - meta → show in pp
        const gapPP=val-goal;
        const above=hb?gapPP>=0:gapPP<=0;
        gapCol=above?'var(--green)':'var(--red)';
        gapStr=(gapPP>=0?'+':'')+gapPP.toFixed(1)+' pp da meta';
      }
    }
    const row=document.createElement('div');row.className='ir';row.onclick=()=>openKpi(ind.id);
    const deltaCol=fcDelta===null?'':(fcDelta>=0?'var(--green)':'var(--red)');
    const deltaStr=fcDelta===null?'':(fcDelta>=0?'+':'')+fcDelta+'%';
    const _cfg=S.cfg[ind.id]||{};
    const _isAI=S.benchMode==='ai'&&_cfg.benchGoal!=null;
    const benchPill=_isAI
      ?'<span style="font-size:8px;background:rgba(168,85,247,.15);color:#c084fc;border:1px solid rgba(168,85,247,.3);border-radius:10px;padding:1px 5px;margin-left:4px;vertical-align:middle">🏦 mercado</span>'
      :'<span style="font-size:8px;background:rgba(255,255,255,.06);color:var(--mut);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:1px 5px;margin-left:4px;vertical-align:middle">🎯 manual</span>';
    row.innerHTML=`<div class="ii" style="background:${col}22;color:${col}">${ind.icon}</div>
      <div style="flex:1;min-width:0">
        <div class="inm">${ind.name}${benchPill}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:2px;flex-wrap:wrap">
          <span style="font-size:10px;color:rgba(255,255,255,.5)">
            ${val!==null&&val!==undefined?fmtV(val,ind.unit):'—'}
            <span style="color:var(--mut)"> / </span>
            <span style="color:var(--mut)">${fmtV(goal,ind.unit)}</span>
          </span>
          ${gapStr?`<span style="font-size:9px;font-weight:700;color:${gapCol}">${gapStr}</span>`:''}
        </div>
      </div>
      <div class="ir-bars">
        <div class="ir-bar-row">
          <span class="ir-bar-lbl">META</span>
          <div class="ibg"><div class="iff" style="width:${pct}%;background:${col}"></div></div>
        </div>
        ${fcPct!==null?`<div class="ir-bar-row">
          <span class="ir-bar-lbl">PREV</span>
          <div class="ibg"><div class="iff-fc" style="width:${fcPct}%"></div></div>
        </div>`:''}
      </div>
      <div>
        <div class="ip" style="color:${pct>=80?col:pct>=60?'var(--amber)':'var(--red)'}">${Math.round(pct)}%</div>
        ${fcDelta!==null?`<div class="ir-fc-delta" style="color:${deltaCol}">${deltaStr}</div>`:''}
      </div>
      <div class="ad ${ac}"></div>`;
    el.appendChild(row);
  });
}
function rIndListFcast(dets){
  const el=document.getElementById('indList');el.innerHTML='';
  const hdr=document.createElement('div');
  hdr.style.cssText='font-size:10px;color:#a855f7;letter-spacing:2px;text-transform:uppercase;font-weight:700;padding:4px 4px 8px;border-bottom:1px solid rgba(168,85,247,.2);margin-bottom:4px';
  hdr.textContent='🔮 PROJEÇÃO — SEM FECHAMENTO';el.appendChild(hdr);
  [...dets].sort((a,b)=>a.pct-b.pct).forEach(d=>{
    const{ind,pct}=d,col=GC[ind.group],ac=pct<60?'r':'a';
    const row=document.createElement('div');row.className='ir';row.onclick=()=>openKpi(ind.id);
    row.innerHTML=`<div class="ii" style="background:${col}22;color:${col};opacity:.85">${ind.icon}</div>
      <div><div class="inm" style="opacity:.9">${ind.name}</div><div class="ing">${GN[ind.group]}</div></div>
      <div><div class="ibg"><div class="iff" style="width:${pct}%;background:#8b9cf4;opacity:.8"></div></div></div>
      <div class="ip" style="color:#8b9cf4">~${Math.round(pct)}%</div>
      <div class="ad ${ac}" style="opacity:.7"></div>`;
    el.appendChild(row);
  });
}
function openKpi(id){
  const raw = S.sel && S.raw && S.raw[S.sel] ? S.raw[S.sel] : {};
  _openKpiModal(id, raw);
}

function openKpiFromRaw(id, raw){
  _openKpiModal(id, raw || {});
}

function _openKpiModal(id, raw){
  const ind = IND.find(i=>i.id===id); if(!ind) return;
  const res = S.sel ? calcScore(S.sel) : null;
  const det = res ? res.details.find(d=>d.ind.id===id) : null;
  const col = GC[ind.group];

  // ── Recalculate intermediates from raw for display ──────────────
  const fv = k => { const x = parseFloat(raw[k]); return isNaN(x) ? 0 : x; };
  const fat    = fv('f_fat');
  const ded    = fv('f_ded');
  const cmv    = raw.f_cmv != null ? fv('f_cmv') : Math.max(0, fv('f_cv') - ded);
  const cvc    = fv('f_cvc');  // Custo Variável Comercial (comissões, frete)
  const dc     = fv('f_dc');
  const pess   = fv('f_pessoal');
  const adm    = fv('f_adm');
  const dep    = fv('f_dep');
  const depfin = fv('f_depfin');
  const recLiq = fat - ded;
  const base   = recLiq > 0 ? recLiq : fat;
  const lucBruto = fat ? recLiq - cmv : 0;
  const mc_r     = lucBruto - cvc;
  const dfEfetivo = (pess > 0 || adm > 0) ? pess + adm : fv('f_df');
  const ebitda_r = mc_r - dc - dfEfetivo;
  const lucro_r  = ebitda_r - dep - depfin;
  const fmt = v => v ? 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}) : '—';
  const fmtP = v => v !== null && !isNaN(v) ? v.toFixed(1)+'%' : '—';

  // ── Per-KPI calculation steps ───────────────────────────────────
  const STEPS = {
    receita: [
      {op:'', label:'Receita Bruta (classificada no DRE)', val:fmt(fat), bold:true, color:'#00e89b'},
    ],
    cac: [
      {op:'',  label:'Despesa Comercial',  val:fmt(dc)},
      {op:'÷', label:'Receita Líquida',    val:fmt(base)},
      {op:'=', label:'CAC %',              val:fmtP(base?dc/base*100:null), bold:true, color:col},
    ],
    margbruta: [
      {op:'',  label:'Receita Líquida',    val:fmt(base), sub:'Rec.Bruta − Deduções'},
      {op:'−', label:'CMV / Custo do Produto', val:fmt(cmv)},
      {op:'=', label:'Lucro Bruto',        val:fmt(lucBruto)},
      {op:'÷', label:'Receita Líquida',    val:fmt(base)},
      {op:'=', label:'Margem Bruta %',     val:fmtP(base?lucBruto/base*100:null), bold:true, color:col},
    ],
    margem: [
      {op:'',  label:'Receita Líquida',    val:fmt(base), sub:'Rec.Bruta − Deduções'},
      {op:'−', label:'CMV / Custo do Produto', val:fmt(cmv)},
      {op:'=', label:'Lucro Bruto',        val:fmt(lucBruto)},
      {op:'−', label:'Custo Variável Comercial', val:fmt(cvc), sub: cvc > 0 ? 'Comissões, frete s/vendas, embalagens' : 'Nenhum lançado'},
      {op:'=', label:'Margem de Contribuição R$', val:fmt(mc_r)},
      {op:'÷', label:'Receita Líquida',    val:fmt(base)},
      {op:'=', label:'Margem de Contribuição %', val:fmtP(base?mc_r/base*100:null), bold:true, color:col},
    ],
    ebitda: [
      {op:'',  label:'Receita Líquida',    val:fmt(base), sub:'Rec.Bruta − Deduções'},
      {op:'−', label:'CMV / Custo do Produto', val:fmt(cmv)},
      {op:'=', label:'Lucro Bruto',        val:fmt(lucBruto)},
      {op:'−', label:'Custo Variável Comercial', val:fmt(cvc), sub: cvc > 0 ? 'Comissões, frete, embalagens' : 'Nenhum lançado'},
      {op:'=', label:'Margem de Contribuição', val:fmt(mc_r)},
      {op:'−', label:'Despesa Comercial',  val:fmt(dc)},
      {op:'−', label:'Despesas Pessoal',   val:fmt(pess)},
      {op:'−', label:'Despesas Adm.',      val:fmt(adm)},
      {op:'', label:'⚠ Depreciação NÃO entra no EBITDA', val:'', italic:true},
      {op:'=', label:'EBITDA R$',          val:fmt(ebitda_r)},
      {op:'÷', label:'Receita Líquida',    val:fmt(base)},
      {op:'=', label:'EBITDA %',           val:fmtP(base?ebitda_r/base*100:null), bold:true, color:col},
    ],
    despop: [
      {op:'',  label:'Despesa Comercial',  val:fmt(dc)},
      {op:'+', label:'Despesas Pessoal',   val:fmt(pess)},
      {op:'+', label:'Despesas Adm.',      val:fmt(adm)},
      {op:'=', label:'Total Desp. Op.',    val:fmt(dc+dfEfetivo)},
      {op:'÷', label:'Receita Líquida',    val:fmt(base)},
      {op:'=', label:'Desp. Op. %',        val:fmtP(base?(dc+dfEfetivo)/base*100:null), bold:true, color:col},
    ],
    lucroliq: [
      {op:'',  label:'EBITDA R$',          val:fmt(ebitda_r)},
      {op:'−', label:'Depreciação',        val:fmt(dep)},
      {op:'−', label:'Desp. Financeiras + IR/CSLL', val:fmt(depfin)},
      {op:'=', label:'Lucro Líquido R$',   val:fmt(lucro_r)},
      {op:'÷', label:'Receita Líquida',    val:fmt(base)},
      {op:'=', label:'Lucro Líquido %',    val:fmtP(base?lucro_r/base*100:null), bold:true, color:col},
    ],
    pessoal: [
      {op:'',  label:'Despesas com Pessoal', val:fmt(pess), sub:'Salários, pró-labore, encargos'},
      {op:'÷', label:'Receita Líquida',      val:fmt(base)},
      {op:'=', label:'Peso do Pessoal %',    val:fmtP(base?pess/base*100:null), bold:true, color:col},
    ],
    admperc: [
      {op:'',  label:'Despesas Administrativas', val:fmt(adm), sub:'Aluguel, software, serviços gerais'},
      {op:'÷', label:'Receita Líquida',           val:fmt(base)},
      {op:'=', label:'Peso Adm. %',               val:fmtP(base?adm/base*100:null), bold:true, color:col},
    ],
    spread: [
      {op:'',  label:'Despesas Financeiras + IR/CSLL', val:fmt(depfin), sub:'Juros, IOF, empréstimos, IR e CSLL'},
      {op:'÷', label:'Receita Líquida',                val:fmt(base)},
      {op:'=', label:'Spread Financeiro %',            val:fmtP(base?depfin/base*100:null), bold:true, color:col},
    ],
    eficiencia: (()=>{
      const despOp = dc + dfEfetivo;
      return [
        {op:'',  label:'Despesa Comercial',  val:fmt(dc)},
        {op:'+', label:'Despesas Pessoal',   val:fmt(pess)},
        {op:'+', label:'Despesas Adm.',      val:fmt(adm)},
        {op:'=', label:'Total Desp. Op.',    val:fmt(despOp)},
        {op:'÷', label:'Lucro Bruto',        val:fmt(lucBruto), sub:'Base do índice — não Receita Líquida'},
        {op:'=', label:'Índice de Eficiência %', val:fmtP(lucBruto>0?despOp/lucBruto*100:null), bold:true, color:col},
      ];
    })(),
    margseg: (()=>{
      const custosFixos = dfEfetivo + dc + depfin + dep;
      const mcPct = fat > 0 ? mc_r / fat : 0;
      const pe = mcPct > 0 ? custosFixos / mcPct : 0;
      const ms = fat > 0 ? (fat - pe) / fat * 100 : null;
      return [
        {op:'',  label:'Custos Fixos Totais', val:fmt(custosFixos), sub:'Pessoal + Adm + DC + Desp.Fin + Dep.'},
        {op:'÷', label:'Índice MC (MC ÷ Rec.Bruta)', val:fmtP(mcPct*100), sub:'Quanto cada R$1 de receita contribui'},
        {op:'=', label:'Ponto de Equilíbrio R$', val:fmt(pe)},
        {op:'',  label:'Receita Bruta', val:fmt(fat)},
        {op:'−', label:'Ponto de Equilíbrio', val:fmt(pe)},
        {op:'=', label:'Folga R$', val:fmt(fat - pe)},
        {op:'÷', label:'Receita Bruta', val:fmt(fat)},
        {op:'=', label:'Margem de Segurança %', val:fmtP(ms), bold:true, color:col},
      ];
    })(),
  };

  const steps = STEPS[id] || [];
  const stepsHtml = steps.map(s =>
    `<div class="kpi-calc-step" style="${s.bold?'background:rgba(255,255,255,.04);border-radius:6px;margin-top:4px;':''}">
      <span class="kpi-calc-op" style="${s.bold?'color:var(--teal)':''}">${s.op}</span>
      <span class="kpi-calc-label" style="${s.italic?'color:var(--amber);font-style:italic;font-size:10px':s.bold?'color:#c8dff5;font-weight:700':''}">
        ${s.label}${s.sub?`<br><span style="font-size:9px;color:var(--mut)">${s.sub}</span>`:''}
      </span>
      <span class="kpi-calc-val" style="${s.bold?`color:${s.color||col};font-size:13px`:s.italic?'display:none':''}">${s.val}</span>
    </div>`
  ).join('');

  // ── Source inputs panel ─────────────────────────────────────────
  const hasRaw = fat > 0;
  const inputsHtml = hasRaw ? `
    <div style="margin-top:14px">
      <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--mut);font-weight:700;margin-bottom:8px">Valores utilizados (do DRE importado)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${[
          {l:'Receita Bruta',    v:fat,    show:true},
          {l:'Deduções',         v:ded,    show:ded>0},
          {l:'Receita Líquida',  v:base,   show:true, hi:true},
          {l:'CMV',              v:cmv,    show:cmv>0},
          {l:'Desp. Comercial',  v:dc,     show:dc>0},
          {l:'Desp. Pessoal',    v:pess,   show:pess>0},
          {l:'Desp. Adm.',       v:adm,    show:adm>0},
          {l:'Depreciação',      v:dep,    show:dep>0},
          {l:'Desp. Fin.+IR',    v:depfin, show:depfin>0},
        ].filter(i=>i.show).map(i=>`
          <div style="background:rgba(255,255,255,.03);border:1px solid ${i.hi?'rgba(0,240,200,.2)':'rgba(255,255,255,.06)'};border-radius:7px;padding:7px 10px">
            <div style="font-size:9px;color:${i.hi?'var(--teal)':'var(--mut)'};margin-bottom:2px">${i.l}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${i.hi?'var(--teal)':'#c8dff5'};font-weight:${i.hi?'700':'400'}">${fmt(i.v)}</div>
          </div>`).join('')}
      </div>
    </div>` : `<div style="margin-top:12px;font-size:11px;color:var(--mut);font-style:italic">Nenhum dado importado para o período selecionado.</div>`;

  document.getElementById('kpiModal').classList.add('open');
  document.getElementById('kpiModalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <span style="font-size:28px">${ind.icon}</span>
      <div>
        <div style="font-size:10px;color:${col};letter-spacing:2px;text-transform:uppercase;font-weight:700">${GN[ind.group]}</div>
        <div style="font-size:16px;font-weight:700;color:#e8f0ff">${ind.name}</div>
      </div>
    </div>

    ${det ? `<div class="kpi-det-row">
      <div class="kpi-det-box" style="border-color:${det.pct>=80?col:det.pct>=60?'rgba(244,165,34,.4)':'rgba(255,61,90,.4)'}">
        <div class="kpi-det-lbl">% da Meta</div>
        <div class="kpi-det-val" style="color:${det.pct>=80?col:det.pct>=60?'var(--amber)':'var(--red)'};font-size:24px">${Math.round(det.pct)}%</div>
      </div>
      <div class="kpi-det-box">
        <div class="kpi-det-lbl">Valor Atual</div>
        <div class="kpi-det-val">${fmtV(det.val,ind.unit)}</div>
        <div style="font-size:9px;color:var(--mut);margin-top:3px">Meta: ${fmtV(det.goal,ind.unit)}</div>
      </div>
    </div>` : ''}

    <div style="margin-bottom:12px">
      <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--mut);font-weight:700;margin-bottom:8px">Como é calculado</div>
      <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:8px 6px">
        ${stepsHtml}
      </div>
    </div>

    <div style="background:rgba(255,255,255,.03);border-radius:8px;padding:10px 12px;margin-bottom:12px">
      <div style="font-size:10px;color:var(--mut);margin-bottom:4px">💡 Descrição</div>
      <p style="font-size:11px;color:#7a9abf;line-height:1.6">${ind.desc}</p>
    </div>

    ${inputsHtml}`;
}

function closeKpi(){document.getElementById('kpiModal').classList.remove('open');}

// ═══════════════════════════════════════════
// DIAGNOSIS + CHAT
// ═══════════════════════════════════════════
async function rDiag(res,diagPageOnly){
  const el=document.getElementById(diagPageOnly?'diagPageBody':'diagC');
  const sorted=[...res.details].sort(function(a,b){return a.adjPct-b.adjPct;});
  const worst=sorted.slice(0,3),best=sorted.slice(-2);
  const cf=calcConf(res.details);
  const[y,mo]=S.sel.split('-');
  const kpiAll=res.details.map(function(d){return d.ind.name+': '+Math.round(d.adjPct)+'% da meta';}).join(' | ');
  // ── Cache check ──────────────────────────────────────────────────
  const cacheKey=S.sel+'|'+res.score+'|'+kpiAll;
  if(!S.diagCache)S.diagCache={};
  const cached=S.diagCache[S.sel];
  if(cached&&cached.key===cacheKey){
    el.innerHTML=cached.html;
    var _dpb2=document.getElementById('diagPageBody');
    if(_dpb2&&_dpb2!==el)_dpb2.innerHTML=cached.html;
    _chatCtx=res;
    var _oa=(S.actions||[]).filter(function(a){return a.status==='open';}).length;
    var _aw=document.getElementById('actWidget'),_awc=document.getElementById('actWidgetCount');
    if(_aw&&_awc){_aw.style.display=_oa>0?'flex':'none';_awc.textContent=_oa+(_oa===1?' ação':' ações')+' em aberto';}
    return; // ← sem chamada à API
  }
  // ── Cache miss: mostra loader e chama API ────────────────────────
  el.innerHTML='<div class="dload"><div class="spin"></div><span>Analisando...</span></div>';
  const scoreLabel=res.score>=90?'SAUDÁVEL':res.score>=70?'ATENÇÃO':res.score>=50?'CRÍTICO':'GRAVE';
  const prompt='Você é um CFO experiente analisando '+S.company+(S.sector?' ('+S.sector+')':'')+'. '
    +'Mês: '+MES[parseInt(mo)-1]+'/'+y+'. Score: '+res.score+'% ('+scoreLabel+'). '
    +'KPIs: '+kpiAll+'. '
    +'Críticos: '+worst.map(function(d){return d.ind.name+' '+Math.round(d.adjPct)+'%';}).join(', ')+'. '
    +'Destaques: '+best.map(function(d){return d.ind.name+' '+Math.round(d.adjPct)+'%';}).join(', ')+'. '
    +'Confiança dos dados: '+(cf?cf.p+'%':'N/A')+'. '
    +'Escreva um diagnóstico executivo OBJETIVO em até 200 palavras. '
    +'Sem markdown. Formato: SITUACAO: [frase]. ALERTAS: • item1 • item2. ACOES: 1. acao 2. acao 3. acao';
  fetch('/api/diagnose',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({prompt:prompt})
  }).then(function(r){return r.json();}).then(function(data){
    if(data.error)throw new Error(data.error);
    const txt=data.text||'';
    if(!txt)throw new Error('Resposta vazia');
    _renderDiag(el,txt,res,worst,best,MES[parseInt(mo)-1]+'/'+y);
    if(!S.diagCache)S.diagCache={};
    S.diagCache[S.sel]={key:cacheKey,html:el.innerHTML};
    // Mirror to diagPageBody if it exists and is different
    var _dpb=document.getElementById('diagPageBody');
    if(_dpb&&_dpb!==el)_dpb.innerHTML=el.innerHTML;
    _chatCtx=res;
    var _oa=(S.actions||[]).filter(function(a){return a.status==='open';}).length;
    var _aw=document.getElementById('actWidget'),_awc=document.getElementById('actWidgetCount');
    if(_aw&&_awc){_aw.style.display=_oa>0?'flex':'none';_awc.textContent=_oa+(_oa===1?' ação':' ações')+' em aberto';}
  }).catch(function(e){
    el.innerHTML='<div class="diag-box"><p style="color:var(--amber)">Erro ao gerar diagnóstico: '+(e.message||'verifique a API key')+'</p>'
      +(worst[0]?'<div class="dact">⚠️ Foco: '+worst[0].ind.name+' em '+Math.round(worst[0].adjPct)+'% da meta</div>':'')+'</div>';
  });
}
function _renderDiag(el,txt,res,worst,best,mesLabel){
  // Strip markdown residue
  txt=txt.replace(/#+\s*/g,'').replace(/\*\*/g,'').replace(/\*/g,'').trim();
  // Detect sections
  var situacao='',alertas=[],acoes=[];
  var lines=txt.split('\n').map(function(l){return l.trim();}).filter(function(l){return l;});
  var mode='sit';
  lines.forEach(function(line){
    var lu=line.toUpperCase();
    if(lu.startsWith('SITUACAO')||lu.startsWith('SITUAÇÃO')){mode='sit';var rest=line.replace(/^[^:]+:/,'').trim();if(rest)situacao=rest;return;}
    if(lu.startsWith('ALERTAS')||lu.startsWith('ALERTA')){mode='alert';return;}
    if(lu.startsWith('ACOES')||lu.startsWith('AÇÕES')||lu.startsWith('ACAO')){mode='act';return;}
    if(mode==='sit'&&!situacao)situacao=line;
    else if(mode==='alert'&&(line.startsWith('•')||line.startsWith('-')))alertas.push(line.replace(/^[•\-]\s*/,''));
    else if(mode==='act'&&/^[123][\.\)]/.test(line))acoes.push(line.replace(/^[123][\.\)]\s*/,''));
  });
  // Fallback: show raw if structure not detected
  if(!situacao&&!alertas.length&&!acoes.length){
    el.innerHTML='<div class="diag-box"><p>'+txt+'</p></div>';return;
  }
  var g=grade(res.score);
  var html='<div class="diag-box">';
  html+='<div class="diag-score-badge" style="border-color:'+(g?g.c:'#94a3b8')+';color:'+(g?g.c:'#94a3b8')+'">'
    +mesLabel+' &nbsp;·&nbsp; <span style="font-family:Bebas Neue,sans-serif;font-size:18px">'+res.score+'</span>/100 '+(g?g.l:'')+'</div>';
  if(situacao)html+='<div class="diag-narrative">'+situacao+'</div>';
  if(alertas.length){
    html+='<div class="diag-section-title">⚠️ Alertas</div>';
    alertas.forEach(function(a){html+='<div class="dalert">• '+a+'</div>';});
  }
  if(acoes.length){
    html+='<div class="diag-section-title">🎯 Ações</div>';
    acoes.forEach(function(a,i){html+='<div class="dact">'+(i+1)+'. '+a+'</div>';});
  }
  html+='</div>';
  // KPI chips
  html+='<div class="dchips">';
  worst.slice(0,2).forEach(function(d){html+='<span class="dchip dcr">↓'+d.ind.short+'</span>';});
  best.slice(-1).forEach(function(d){html+='<span class="dchip dcg">✓'+d.ind.short+'</span>';});
  html+='</div>';

  // ── Simulator CTA: suggest simulation for actionable worst KPIs ──
  var _simSuggestions={
    ciclo:  'Simule o impacto de reduzir seu Prazo de Recebimento ou ampliar o Prazo de Pagamento',
    runway: 'Simule como reduzir saídas ou aumentar o saldo afeta sua sobrevida financeira',
    margem: 'Simule a redução de Custos Variáveis e veja o impacto na Margem de Contribuição',
    ebitda: 'Simule cortes em Despesas Fixas e veja como o EBITDA reage',
    despop: 'Simule a redução de Despesas Fixas sobre a Receita',
    cac:    'Simule a redução do gasto comercial e veja o efeito no CAC',
    churn:  'Simule uma redução de cancelamentos e veja o impacto na Receita recorrente',
    reccolab:'Simule aumento de receita ou ajuste de headcount e veja a produtividade por colaborador',
    turnover:'Simule a redução de saídas voluntárias e o custo evitado',
    estoque: 'Simule a redução do estoque e o impacto no ciclo operacional',
    caixa:   'Simule o aumento de entradas ou corte de saídas para melhorar a geração de caixa',
  };
  var simKpi=null;
  for(var _i=0;_i<worst.length;_i++){
    if(_simSuggestions[worst[_i].ind.id]){simKpi=worst[_i];break;}
  }
  if(simKpi){
    var ctaDiv=document.createElement('div');
    ctaDiv.style.cssText='margin-top:10px;padding:10px 12px;background:rgba(0,232,155,.05);border:1px solid rgba(0,232,155,.15);border-radius:10px;display:flex;align-items:center;gap:10px;cursor:pointer';
    ctaDiv.onclick=function(){go('sim',document.querySelector('[data-page=sim]'));};
    ctaDiv.innerHTML='<span style="font-size:18px">🧪</span>'
      +'<div><div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:2px">Experimente no Simulador</div>'
      +'<div style="font-size:11px;color:#7a9cc4;line-height:1.5">'+_simSuggestions[simKpi.ind.id]+'</div></div>'
      +'<span style="margin-left:auto;font-size:14px;color:var(--green)">→</span>';
    el.appendChild(ctaDiv);
  }

  el.innerHTML=html;
}

let _chatCtx=null,_chatHist=[];
function openChat(){
  if(_dashView==='forecast'){
    toast('💬 Chat disponível apenas com dados de fechamento');return;
  }
  // Navigate to Diagnóstico tab if not already there
  const diagPage=document.getElementById('page-diag');
  const isDiagActive=diagPage&&diagPage.classList.contains('active');
  if(!isDiagActive){
    go('diag',document.querySelector('[data-page=diag]'));
    // Small delay to allow page render before showing chat
    setTimeout(function(){
      var popup=document.getElementById('chatPopup');
      if(popup)popup.style.display='flex';
      _initChatGreeting();
    },120);
    return;
  }
  const popup=document.getElementById('chatPopup');
  popup.style.display='flex';
  _initChatGreeting();
}
function _initChatGreeting(){
  const out=document.getElementById('chatOut');
  if(!out||out.children.length)return;
  const empresa=S.company||'sua empresa';
  const score=_chatCtx?_chatCtx.score:'?';
  out.innerHTML='<div style="font-size:12px;color:#8aabce;line-height:1.6;padding:8px 10px;background:rgba(0,232,155,.05);border-radius:10px;border:1px solid rgba(0,232,155,.1)">Olá! Sou o analista financeiro de <strong style="color:#eef4ff">'+empresa+'</strong>. Score atual: <strong style="color:var(--teal)">'+score+'/100</strong>. Pode me perguntar sobre qualquer KPI, tendência ou estratégia.</div>';
  setTimeout(function(){var inp=document.getElementById('chatInp');if(inp)inp.focus();},100);
}
function closeChat(){document.getElementById('chatPopup').style.display='none';}
async function sendChat(){
  if(_dashView==='forecast')return; // no API on forecast view
  const inp=document.getElementById('chatInp');
  const msg=inp.value.trim();if(!msg)return;
  inp.value='';
  const out=document.getElementById('chatOut');
  // User message
  const userDiv=document.createElement('div');
  userDiv.style.cssText='font-size:12px;color:#eef4ff;background:rgba(0,232,155,.07);border-left:2px solid var(--teal);padding:8px 10px;border-radius:0 8px 8px 0;line-height:1.6';
  userDiv.textContent=msg;
  out.appendChild(userDiv);
  _chatHist.push({role:'user',content:msg});
  // Loading
  const loadDiv=document.createElement('div');
  loadDiv.style.cssText='font-size:11px;color:#7a9cc4;font-style:italic;padding:4px 0';
  loadDiv.textContent='Analisando...';
  out.appendChild(loadDiv);
  out.scrollTop=out.scrollHeight;
  // Build system prompt with full KPI context
  const[y,mo]=(S.sel||'-').split('-');
  const ctx=_chatCtx;
  const kpiCtx=ctx?ctx.details.map(function(d){
    return d.ind.name+': '+Math.round(d.adjPct)+'% da meta'+(d.value!=null?' (valor: '+d.value.toLocaleString('pt-BR')+')':'');
  }).join(', '):'sem dados';
  const sys='Você é o analista financeiro de '+S.company+(S.sector?' ('+S.sector+')':'')+'. '
    +'Mês de referência: '+MES[parseInt(mo)-1||0]+'/'+y+'. '
    +'Score de saúde: '+(ctx?ctx.score+'%':'desconhecido')+'. '
    +'KPIs: '+kpiCtx+'. '
    +'Responda de forma direta e prática em até 150 palavras. Sem markdown.';
  fetch('/api/diagnose',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({prompt:msg,system:sys,history:_chatHist.slice(0,-1)})
  }).then(function(r){return r.json();}).then(function(data){
    out.removeChild(loadDiv);
    if(data.error)throw new Error(data.error);
    const reply=data.text||'';
    _chatHist.push({role:'assistant',content:reply});
    const replyDiv=document.createElement('div');
    replyDiv.style.cssText='font-size:12px;color:#c8dff5;background:rgba(255,255,255,.04);padding:8px 10px;border-radius:8px;line-height:1.6';
    replyDiv.textContent=reply;
    out.appendChild(replyDiv);
    out.scrollTop=out.scrollHeight;
  }).catch(function(e){
    out.removeChild(loadDiv);
    const errDiv=document.createElement('div');
    errDiv.style.cssText='font-size:11px;color:var(--red)';
    errDiv.textContent='Erro: '+(e.message||'tente novamente');
    out.appendChild(errDiv);
  });
}
function chatKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}}

// ═══════════════════════════════════════════
// INPUT PAGE
// ═══════════════════════════════════════════
let _inputMode='real';
let _dashView='real'; // 'real' ou 'forecast'
function setInputMode(mode,btn){
  _inputMode=mode;
  document.querySelectorAll('#modeReal,#modeFcast').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');
  const hintEl=document.getElementById('modeHint');
  if(hintEl)hintEl.textContent='';
  rInputFields();
}

function rInput(){
  // Populate month select
  var selMes=document.getElementById('inpSelMes');
  var selAno=document.getElementById('inpSelAno');
  if(!selMes||!selAno){rInputFields();return;}

  // Fill years if empty
  if(!selAno.options.length){
    var cy=new Date().getFullYear();
    for(var y=cy-3;y<=cy+2;y++){
      var o=document.createElement('option');o.value=y;o.textContent=y;
      if(y===cy)o.selected=true;
      selAno.appendChild(o);
    }
  }
  // Fill months if empty
  if(!selMes.options.length){
    MES.forEach(function(m,i){
      var o=document.createElement('option');
      o.value=String(i+1).padStart(2,'0');
      o.textContent=m;
      selMes.appendChild(o);
    });
  }

  // Set current selection from S.sel or today
  var curMk=S.sel||(new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0'));
  var parts=curMk.split('-');
  selMes.value=parts[1];selAno.value=parts[0];

  _autoDetectMode(selAno.value+'-'+selMes.value);
  rInputFields();
  _buildInpDelBtns(selAno.value+'-'+selMes.value);
}
function _buildInpDelBtns(mk){
  var wrap=document.getElementById('inpDelBtns');if(!wrap)return;
  wrap.innerHTML='';
  var hasFech=S.raw&&S.raw[mk]&&Object.keys(S.raw[mk]).length>0;
  var hasFcast=S.forecast&&S.forecast[mk]&&Object.keys(S.forecast[mk]).length>0;
  if(!hasFech&&!hasFcast)return;
  var pm=mk.split('-');var lbl=MES[parseInt(pm[1])-1]+'/'+pm[0];
  if(hasFech){
    var b=document.createElement('button');b.className='del-opt-btn';b.innerHTML='✕ Excluir fechamento';
    b.onclick=function(){showDelDialog('🗑️ Excluir Fechamento','Excluir os dados de <b>fechamento</b> de <b>'+lbl+'</b>?<br><br>A previsão será mantida.',function(){deleteFechamento(mk);_buildInpDelBtns(mk);});};
    wrap.appendChild(b);
  }
  if(hasFcast){
    var b2=document.createElement('button');b2.className='del-opt-btn';b2.innerHTML='✕ Excluir previsão';
    b2.onclick=function(){showDelDialog('🔮 Excluir Previsão','Excluir os dados de <b>previsão</b> de <b>'+lbl+'</b>?<br><br>O fechamento será mantido.',function(){deleteForecast(mk);_buildInpDelBtns(mk);});};
    wrap.appendChild(b2);
  }
  if(hasFech&&hasFcast){
    var b3=document.createElement('button');b3.className='del-opt-btn del-all';b3.innerHTML='✕ Excluir mês inteiro';
    b3.onclick=function(){showDelDialog('⚠️ Excluir mês completo','Excluir <b>todos os dados</b> de <b>'+lbl+'</b> permanentemente?',function(){deletePeriod(mk);go('dashboard',document.querySelector('[data-page=dashboard]'));});};
    wrap.appendChild(b3);
  }
}
function _autoDetectMode(mk){
  if(!mk)return;
  const now=new Date();
  const[y,mo]=mk.split('-').map(Number);
  const monthIsPast=(y<now.getFullYear())||(y===now.getFullYear()&&mo<now.getMonth()+1);
  const hasFcast=S.forecast&&S.forecast[mk]&&Object.keys(S.forecast[mk]).length>0;
  const hasReal=S.raw&&S.raw[mk]&&Object.keys(S.raw[mk]).filter(function(k){return !k.startsWith('_');}).length>0;
  var mode,hint='',hintColor='';
  if(monthIsPast&&hasFcast&&!hasReal){
    mode='real';hint='Você tem uma previsão lançada. Hora de registrar o fechamento!';hintColor='#00e89b';
  } else if(!monthIsPast&&!hasReal){
    mode='forecast';hint='Mês ainda não fechado. Lance sua previsão.';hintColor='#a78bfa';
  } else {
    mode='real';
    if(hasFcast&&hasReal){hint='Forecast e fechamento registrados.';hintColor='#7a9cc4';}
  }
  _inputMode=mode;
  const btnReal=document.getElementById('modeReal');
  const btnFcast=document.getElementById('modeFcast');
  if(btnReal&&btnFcast){
    btnReal.classList.toggle('active',mode==='real');
    btnFcast.classList.toggle('active',mode==='forecast');
  }
  const hintEl=document.getElementById('modeHint');
  if(hintEl){hintEl.textContent=hint;hintEl.style.color=hintColor;}
}

function rInputFields(){
  const mk=(function(){var _m=document.getElementById('inpSelMes'),_y=document.getElementById('inpSelAno');return _y&&_m?_y.value+'-'+_m.value:S.sel||'';})();
  if(!mk){rKpiLive({});return;}
  showAssert(mk);
  if(_inputMode==='forecast'){rFcastFields(mk);return;}
  const raw=(S.raw&&S.raw[mk])||{};
  const left=document.getElementById('inpLeft');left.innerHTML='';
  ['tracao','rentab'].forEach(grp=>{
    const fg=FG[grp],fields=FIELDS.filter(f=>f.group===grp);
    const bl=document.createElement('div');bl.className='inp-block';
    let html=`<div class="ibt"><div class="ibi" style="background:${fg.bg};color:${fg.color}">${fg.icon}</div><div class="ibl" style="color:${fg.color}">${fg.label}</div></div>`;
    fields.forEach(fld=>{
      const val=raw[fld.id]!==undefined?raw[fld.id]:'';
      const conf=raw['_c_'+fld.id]||'high';
      html+=`<div class="inp-field">
        <div class="ifl"><span>${fld.label}</span>${fld.unit?`<span class="ifu">${fld.unit}</span>`:''}</div>
        <div class="ifr">
          <input type="number" step="any" class="inp" id="fv_${fld.id}" value="${val}" placeholder="0" oninput="onRawChange('${mk}')">
          <select class="csel ${confCls(conf)}" id="fc_${fld.id}" onchange="this.className='csel '+confCls(this.value)">
            <option value="high" ${conf==='high'?'selected':''}>✅ Alta</option>
            <option value="medium" ${conf==='medium'?'selected':''}>⚠️ Média</option>
            <option value="low" ${conf==='low'?'selected':''}>❌ Baixa</option>
          </select>
        </div>
        <div class="ifhint">${fld.hint}</div>
      </div>`;
    });
    bl.innerHTML=html;left.appendChild(bl);
  });
  onRawChange(mk);
}
function confCls(v){return v==='high'?'chi':v==='medium'?'cmd':'clo';}
function getRaw(){
  const r={};
  FIELDS.forEach(fld=>{
    const el=document.getElementById('fv_'+fld.id);if(el&&el.value!=='')r[fld.id]=parseFloat(el.value);
    const ce=document.getElementById('fc_'+fld.id);r['_c_'+fld.id]=ce?ce.value:'high';
  });
  return r;
}
function onRawChange(mk){rKpiLive(calcKPIs(getRaw()),mk);}
function rKpiLive(kpis,mk){
  const body=document.getElementById('kpiLiveBody');
  const sub=document.getElementById('kpiSub');
  const filled=Object.values(kpis).filter(v=>v!==null).length;
  if(sub)sub.textContent=filled>0?`${filled} de ${IND.length} KPIs calculados`:'Preencha os campos ao lado';
  let html='';
  ['tracao','rentab'].forEach(grp=>{
    const col=GC[grp],inds=IND.filter(i=>i.group===grp);
    html+=`<div class="klp-grp"><div class="klp-glbl" style="color:${col}">${GI[grp]} ${GN[grp]}</div>`;
    inds.forEach(ind=>{
      const val=kpis[ind.id];
      const goal=mk?getGoal(ind.id,mk):ind.goalDef;
      let cls='empty',pct=null;
      if(val!==null&&val!==undefined&&goal){
        const hb=S.cfg[ind.id]?S.cfg[ind.id].hb:ind.hb;
        pct=hb?Math.min((val/goal)*100,150):(goal===0?100:Math.min((goal/Math.max(val,.001))*100,150));
        pct=Math.max(0,Math.min(100,pct));
        cls=pct>=75?'ok':pct>=50?'warn':'bad';
      }
      const disp=val===null||val===undefined?'—':fmtV(val,ind.unit);
      const vcol=pct!==null?(pct>=75?'var(--green)':pct>=50?'var(--amber)':'var(--red)'):'var(--mut)';
      html+=`<div class="klp-row ${cls}"><div><div class="klp-name">${ind.icon} ${ind.short}</div>${pct!==null?`<div class="klp-pct" style="color:${vcol}">${Math.round(pct)}% da meta</div>`:''}</div><div class="klp-val" style="color:${vcol}">${disp}</div></div>`;
    });
    html+='</div>';
  });
  body.innerHTML=html;
}
function rFcastFields(mk){
  const left=document.getElementById('inpLeft');left.innerHTML='';
  const fc=(S.forecast&&S.forecast[mk])||{};
  ['tracao','rentab'].forEach(function(grp){
    const fg=FG[grp];
    const fields=FIELDS.filter(function(f){return f.group===grp;});
    const bl=document.createElement('div');bl.className='inp-block';
    const hdr=document.createElement('div');hdr.className='ibt';
    hdr.innerHTML='<div class="ibi" style="background:'+fg.bg+';color:'+fg.color+'">'+fg.icon+'</div><div class="ibl" style="color:'+fg.color+'">'+fg.label+'</div>';
    bl.appendChild(hdr);
    fields.forEach(function(fld){
      const val=fc[fld.id]!==undefined?fc[fld.id]:'';
      const wrap=document.createElement('div');wrap.className='inp-field';
      const lbl=document.createElement('div');lbl.className='ifl';
      lbl.innerHTML='<span>'+fld.label+'</span>'+(fld.unit?'<span class="ifu">'+fld.unit+'</span>':'');
      wrap.appendChild(lbl);
      const row=document.createElement('div');row.className='ifr';
      const inp=document.createElement('input');
      inp.type='number';inp.step='any';inp.className='inp';
      inp.id='ff_'+fld.id;inp.value=val;inp.placeholder='0';
      inp.addEventListener('input',function(){onFcastChange(mk);});
      const spacer=document.createElement('div');spacer.style.width='88px';
      row.appendChild(inp);row.appendChild(spacer);
      wrap.appendChild(row);
      const hint=document.createElement('div');hint.className='ifhint';
      hint.style.color='#a78bfa';hint.textContent=fld.hint;
      wrap.appendChild(hint);
      bl.appendChild(wrap);
    });
    left.appendChild(bl);
  });
  onFcastChange(mk);
}

function onFcastChange(mk){
  const fc=(S.forecast&&S.forecast[mk])||{};
  const realR=(S.raw&&S.raw[mk])||{};
  const simR=Object.assign({},realR);
  FIELDS.forEach(function(fld){
    const el=document.getElementById('ff_'+fld.id);
    if(el&&el.value!=='')simR[fld.id]=parseFloat(el.value);
    else if(fc[fld.id]!=null)simR[fld.id]=fc[fld.id];
  });
  // calcKPIs retorna mapa simples {id: valor} — passar direto para rKpiLive
  const kpis=calcKPIs(simR);
  rKpiLive(kpis,mk);
}

function showAssert(mk){
  const el=document.getElementById('inpAssert');if(!el)return;
  const fc=S.forecast&&S.forecast[mk],real=S.raw&&S.raw[mk];
  if(!fc||!real){el.innerHTML='';return;}
  let tot=0,cnt=0;
  FIELDS.forEach(function(fld){
    const f=fc[fld.id],r=real[fld.id];
    if(f==null||r==null||r===0)return;
    tot+=Math.max(0,100-Math.abs(f-r)/Math.abs(r)*100);cnt++;
  });
  if(!cnt){el.innerHTML='';return;}
  const acc=Math.round(tot/cnt);
  const c=acc>=90?'var(--green)':acc>=70?'var(--amber)':'var(--red)';
  el.innerHTML='<span style="font-size:11px;font-weight:700;color:'+c+'">Acuracidade do forecast: '+acc+'%</span>';
}

function saveData(){
  if(_inputMode==='forecast'){saveForecast();return;}
  const mk=(function(){var _m=document.getElementById('inpSelMes'),_y=document.getElementById('inpSelAno');return _y&&_m?_y.value+'-'+_m.value:S.sel||'';})();if(!mk){toast('⚠️ Selecione um período');return;}
  const raw=getRaw();const kpis=calcKPIs(raw);
  const filled=Object.values(kpis).filter(v=>v!==null).length;
  if(!filled){toast('⚠️ Preencha pelo menos alguns campos');return;}
  if(!S.raw)S.raw={};S.raw[mk]=raw;
  if(!S.data)S.data={};if(!S.data[mk])S.data[mk]={};
  const KF={receita:['f_fat'],cac:['f_dc','f_fat'],churn:['f_cancel','f_bcli'],margem:['f_fat','f_cv'],
    ebitda:['f_fat','f_cv','f_df'],despop:['f_df','f_fat'],caixa:['f_ent','f_said'],ciclo:['f_pmr','f_pmp'],
    runway:['f_saldo','f_said'],reccolab:['f_fat','f_colab'],estoque:['f_estq','f_cv'],turnover:['f_saiv','f_colab']};
  const cr={high:2,medium:1,low:0};const rc=r=>r===2?'high':r===1?'medium':'low';
  IND.forEach(ind=>{const v=kpis[ind.id];if(v!==null){
    const deps=KF[ind.id]||[];const mr=deps.length?Math.min(...deps.map(f=>cr[raw['_c_'+f]||'high'])):2;
    S.data[mk][ind.id]={value:parseFloat(v.toFixed(4)),confidence:rc(mr)};}});
  S.sel=mk;
  if(S.diagCache)delete S.diagCache[mk]; // invalida cache do diagnóstico
  sv();toast(`✓ ${filled} KPIs salvos!`);
  _buildInpDelBtns(mk);
  setTimeout(()=>go('dashboard',document.querySelector('[data-page=dashboard]')),900);
}
function saveForecast(){
  const _sm=document.getElementById('inpSelMes'),_sa=document.getElementById('inpSelAno');
  const mk=_sm&&_sa?_sa.value+'-'+_sm.value:S.sel;
  if(!mk){toast('⚠️ Selecione um período');return;}
  S.sel=mk;if(!S.months.includes(mk)){S.months.push(mk);S.months.sort();}
  if(!S.forecast)S.forecast={};
  const fc={};
  FIELDS.forEach(function(fld){
    const el=document.getElementById('ff_'+fld.id);
    if(el&&el.value!=='')fc[fld.id]=parseFloat(el.value);
  });
  if(!Object.keys(fc).length){toast('⚠️ Preencha pelo menos um campo');return;}
  S.forecast[mk]=fc;sv();toast('✓ Previsão salva!');showAssert(mk);_buildInpDelBtns(mk);
}

function rConfig(){
  document.getElementById('cfgCo').value=S.company;
  document.getElementById('cfgSec').value=S.sector||'';
  const unEl=document.getElementById('cfgUserName');
  if(unEl)unEl.value=S.userName||'';

  const mc=Object.keys(S.dreMappings||{}).length;
  const mcEl=document.getElementById('mappingsCount');
  if(mcEl)mcEl.textContent=mc>0
    ?`${mc} classificações de contas aprendidas para ${S.company||'esta empresa'}`
    :'Nenhum aprendizado salvo ainda — será criado após a primeira importação';

  dreModelRenderStatus();
  rMappingsTable();
  rAdvisorCfgCards();

  // Popula year select ANTES de chamar rGoalsTable
  const ys=document.getElementById('goalsYear');
  if(!ys.options.length){
    const cur=new Date().getFullYear();
    for(let y=cur-1;y<=cur+2;y++){
      const o=document.createElement('option');o.value=y;o.textContent=y;
      if(y===cur)o.selected=true;ys.appendChild(o);
    }
  }

  // Config sempre abre bloqueado
  S.locked=true;
  _applyLockState();

  const rmBtn=document.getElementById('rmLogoBtn');
  if(S.logo){
    document.getElementById('logoPlaceholder').style.display='none';
    let img=document.querySelector('#logoArea img');
    if(!img){img=document.createElement('img');document.getElementById('logoArea').appendChild(img);}
    img.src=S.logo;img.style.display='block';if(rmBtn)rmBtn.style.display='inline-block';
  } else {
    document.getElementById('logoPlaceholder').style.display='flex';
    const img=document.querySelector('#logoArea img');if(img)img.remove();
    if(rmBtn)rmBtn.style.display='none';
  }
}
function rGoalsTable(){
  const yr=parseInt(document.getElementById('goalsYear')?.value)||new Date().getFullYear();
  const table=document.getElementById('goalsTable');table.innerHTML='';
  const dis=S.locked?'disabled':'';
  let hhtml=`<thead><tr><th>KPI</th>`;
  MES.forEach((m,i)=>hhtml+=`<th>${m}<br><span style="font-size:8px">${yr}</span></th>`);
  hhtml+=`<th>Padrão</th></tr></thead>`;
  let bhtml='<tbody>';
  IND.forEach(ind=>{
    const g=S.goals[ind.id]||{default:ind.goalDef};
    bhtml+=`<tr><td>${ind.icon} ${ind.short}</td>`;
    for(let m=1;m<=12;m++){
      const mk=`${yr}-${String(m).padStart(2,'0')}`;
      const val=g[mk]!==undefined?g[mk]:'';
      bhtml+=`<td><input class="gi" type="number" step="any" id="goal_${ind.id}_${yr}_${m}" value="${val}" placeholder="${g.default||ind.goalDef}" ${dis}></td>`;
    }
    bhtml+=`<td><input class="gi" type="number" step="any" id="goaldef_${ind.id}" value="${g.default!==undefined?g.default:ind.goalDef}" ${dis}></td></tr>`;
  });
  bhtml+='</tbody>';
  table.innerHTML=hhtml+bhtml;
}
function fillAllMonths(){
  if(S.locked)return;
  const yr=parseInt(document.getElementById('goalsYear')?.value)||new Date().getFullYear();
  IND.forEach(ind=>{
    const defEl=document.getElementById('goaldef_'+ind.id);
    const defVal=defEl?defEl.value:ind.goalDef;
    if(!defVal)return;
    for(let m=1;m<=12;m++){
      const el=document.getElementById(`goal_${ind.id}_${yr}_${m}`);
      if(el&&el.value==='')el.value=defVal;
    }
  });
  toast('✓ Meses preenchidos com o valor padrão');
}
// KPIs onde benchmark de mercado faz sentido (métricas relativas)
const _BENCHABLE=new Set(['cac','margem','ebitda','despop','lucroliq','margbruta','pessoal','admperc','spread','eficiencia','margseg']);
function rCfgKpiTable(){
  const t=document.getElementById('cfgGrid');t.innerHTML='';
  const dis=S.locked?'disabled':'';
  let html=`<thead><tr><th>KPI</th><th>Grupo</th><th>Peso</th><th>Meta (quadro acima)</th><th>Benchmark</th><th>Direção</th></tr></thead><tbody>`;
  IND.forEach(ind=>{
    const cfg=S.cfg[ind.id]||{weight:1,hb:ind.hb,benchMode:'manual'};const col=GC[ind.group];
    const canBench=_BENCHABLE.has(ind.id);
    const isAI=canBench&&cfg.benchMode==='ai'&&cfg.benchGoal!=null;
    // Meta column: when AI mode, show bench value read-only; otherwise empty (uses goals table above)
    const metaCell=isAI
      ?`<span style="font-size:11px;color:#c084fc;font-weight:700">${cfg.benchGoal} ${ind.unit} <span style="font-size:9px;opacity:.7">(IA)</span></span>`
      :`<span style="font-size:11px;color:var(--mut)">do quadro acima</span>`;
    const benchCell=canBench
      ?`<div class="dir-sel" id="bm_${ind.id}">
          <button class="dir-btn ${!isAI?'active':''}" onclick="setKpiBM('${ind.id}','manual')" ${dis}>🎯 Manual</button>
          <button class="dir-btn ${isAI?'active':''}" style="${isAI?'color:#c084fc':''}" onclick="setKpiBM('${ind.id}','ai')" ${dis}>🏦 Mercado</button>
        </div>`
      :`<span style="font-size:10px;color:var(--mut)">só manual</span>`;
    html+=`<tr id="cfgrow_${ind.id}"><td style="font-size:12px">${ind.icon} ${ind.name}</td>
      <td style="font-size:11px;color:${col}">${GN[ind.group].split(' ')[0]}</td>
      <td><input type="number" min="0" max="5" step=".5" class="gi2" id="cw_${ind.id}" value="${cfg.weight}" ${dis}></td>
      <td>${metaCell}</td>
      <td>${benchCell}</td>
      <td><div class="dir-sel" id="hb_${ind.id}">
        <button class="dir-btn ${cfg.hb?'active':''}" onclick="setHb('${ind.id}',true)" ${dis}>↑ Maior</button>
        <button class="dir-btn ${!cfg.hb?'active':''}" onclick="setHb('${ind.id}',false)" ${dis}>↓ Menor</button>
      </div></td></tr>`;
  });
  html+='</tbody>';t.innerHTML=html;
}
function setHb(id,val){if(S.locked)return;S.cfg[id].hb=val;
  const w=document.getElementById('hb_'+id);if(w)w.querySelectorAll('.dir-btn').forEach((b,i)=>b.classList.toggle('active',i===0?val:!val));}
function setKpiBM(id,mode){
  if(S.locked)return;
  if(!_BENCHABLE.has(id))return; // não permitir bench em KPIs absolutos
  if(!S.cfg[id])S.cfg[id]={weight:1,hb:IND.find(i=>i.id===id)?.hb??true};
  S.cfg[id].benchMode=mode;
  const w=document.getElementById('bm_'+id);
  if(w){w.querySelectorAll('.dir-btn').forEach((b,i)=>{b.classList.toggle('active',i===(mode==='manual'?0:1));b.style.color=i===1&&mode==='ai'?'#c084fc':'';});}
  const inp=document.getElementById('cb_'+id);
  if(mode==='ai'){
    // Fetch bench for this single KPI
    if(!S.sector){toast('⚠️ Configure o setor primeiro');S.cfg[id].benchMode='manual';rCfgKpiTable();return;}
    const ind=IND.find(i=>i.id===id);
    if(inp){inp.disabled=true;inp.placeholder='buscando...';inp.style.color='#c084fc';}
    const prompt='Setor "'+S.sector+'". Responda SOMENTE com um número (sem texto, sem JSON, sem unidade): qual a MÉDIA MENSAL de mercado para o KPI "'+ind.name+'" ('+ind.formula+') em empresas deste setor? Unidade: '+ind.unit+'. Exemplo de resposta: 5.2';
    fetch('/api/diagnose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt})})
    .then(r=>r.json()).then(data=>{
      if(data.error)throw new Error(data.error);
      const num=parseFloat((data.text||'').replace(/[^0-9.,\-]/g,'').replace(',','.'));
      if(isNaN(num))throw new Error('Valor inválido');
      S.cfg[id].benchGoal=num;sv();
      if(inp){inp.value=num;inp.disabled=true;inp.placeholder='(IA)';inp.style.color='#c084fc';inp.style.opacity='.6';}
      toast('✓ Benchmark de mercado: '+num+' '+ind.unit);
    }).catch(e=>{
      toast('⚠️ Erro ao buscar benchmark: '+e.message);
      S.cfg[id].benchMode='manual';rCfgKpiTable();
    });
  } else {
    // Manual: re-enable input, clear AI value
    S.cfg[id].benchGoal=null;
    if(inp){inp.disabled=false;inp.value='';inp.placeholder='meta';inp.style.color='';inp.style.opacity='1';}
  }
}
function toggleLock(){
  S.locked=!S.locked;
  _applyLockState();
}
function _applyLockState(){
  const locked=S.locked;
  const btn=document.getElementById('lockBtn');
  if(btn){
    btn.textContent=locked?'🔓 Editar':'✕ Cancelar';
    btn.className='lock-btn'+(locked?'':' locked');
  }
  // Salvar visível sempre que desbloqueado
  const saveBtn=document.getElementById('cfgSaveBtn');
  if(saveBtn)saveBtn.style.display=locked?'none':'inline-block';
  ['cfgCo','cfgSec'].forEach(function(id){
    var el=document.getElementById(id);
    if(el){el.disabled=!!locked;el.style.opacity=locked?'.45':'1';el.style.cursor=locked?'not-allowed':'text';}
  });
  rGoalsTable();
  rCfgKpiTable();
}
function saveConfig(){
  if(S.locked){toast('⚠️ Clique em "🔓 Editar" primeiro');return;}
  S.company=document.getElementById('cfgCo').value||'Minha Empresa';
  S.sector=document.getElementById('cfgSec').value||'';
  const unEl=document.getElementById('cfgUserName');
  if(unEl)S.userName=unEl.value.trim();
  const yr=parseInt(document.getElementById('goalsYear')?.value)||new Date().getFullYear();
  IND.forEach(ind=>{
    if(!S.goals[ind.id])S.goals[ind.id]={default:ind.goalDef};
    if(!S.cfg[ind.id])S.cfg[ind.id]={weight:1,benchGoal:null,hb:ind.hb};
    const def=document.getElementById('goaldef_'+ind.id);
    if(def&&def.value!=='')S.goals[ind.id].default=parseFloat(def.value);
    for(let m=1;m<=12;m++){
      const mk=`${yr}-${String(m).padStart(2,'0')}`;
      const el=document.getElementById(`goal_${ind.id}_${yr}_${m}`);
      if(el&&el.value!=='')S.goals[ind.id][mk]=parseFloat(el.value);
      else if(el&&el.value===''&&S.goals[ind.id][mk]!==undefined)delete S.goals[ind.id][mk];
    }
    const we=document.getElementById('cw_'+ind.id),be=document.getElementById('cb_'+ind.id);
    if(we&&we.value!=='')S.cfg[ind.id].weight=parseFloat(we.value)||1;
    if(be)S.cfg[ind.id].benchGoal=be.value?parseFloat(be.value):null;
  });
  S.locked=true;
  sv();
  document.getElementById('coName').textContent=S.company;
  _applyLockState();
  toast('✓ Configurações salvas!');
  rDash();
}
function fetchBench(){
  const prompt='Setor "'+S.sector+'". JSON só: {"receita":100000,"cac":10,"churn":3,"margem":40,"ebitda":15,"despop":30,"caixa":10000,"ciclo":0,"runway":6,"reccolab":10000,"estoque":45,"turnover":2}';
  fetch('/api/diagnose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt})})
  .then(function(r){return r.json();})
  .then(function(data){
    if(data.error)throw new Error(data.error);
    const txt=(data.text||'').replace(/```json|```/g,'').trim();
    const bench=JSON.parse(txt);
    IND.forEach(function(ind){if(bench[ind.id]!=null)S.cfg[ind.id].benchGoal=bench[ind.id];});
    sv();toast('✓ Benchmarks carregados!');
  }).catch(function(e){console.warn('fetchBench:',e);});
}
function clearAllData(){if(!confirm('Limpar todos os dados?'))return;S.months=[];S.data={};S.raw={};S.forecast={};S.meetActions={};S.sel=null;sv();toast('✓ Dados limpos');rDash();}
function handleLogo(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();reader.onload=e=>{S.logo=e.target.result;sv();
    document.getElementById('logoPlaceholder').style.display='none';
    let img=document.querySelector('#logoArea img');if(!img){img=document.createElement('img');document.getElementById('logoArea').appendChild(img);}img.src=S.logo;
    const nl=document.getElementById('navLogo');if(nl){nl.src=S.logo;nl.style.display='block';}
    const rmBtn=document.getElementById('rmLogoBtn');if(rmBtn)rmBtn.style.display='inline-block';
    toast('✓ Logo carregada!');};reader.readAsDataURL(file);}
function removeLogo(){S.logo=null;sv();document.getElementById('logoPlaceholder').style.display='flex';const img=document.querySelector('#logoArea img');if(img)img.remove();
  const nl=document.getElementById('navLogo');if(nl){nl.src='';nl.style.display='none';}
  const rmBtn=document.getElementById('rmLogoBtn');if(rmBtn)rmBtn.style.display='none';
  const fi=document.getElementById('logoFile');if(fi)fi.value='';toast('✓ Logo removida');}

// ═══════════════════════════════════════════
// SIMULATOR
// ═══════════════════════════════════════════
let _simBase={},_simRaw={};
function simChangePeriod(mk){
  if(mk){
    window._simMk=mk;
    initSim();
  }
}
function simSetMode(mode){
  _simMode=mode;
  const btnR=document.getElementById('simBtnReal');
  const btnF=document.getElementById('simBtnFcast');
  if(btnR)btnR.className='mode-btn'+(mode==='real'?' active':'');
  if(btnF)btnF.className='mode-btn'+(mode==='forecast'?' active':'');
  const mk=window._simMk||S.sel;
  if(!mk)return;
  const hasReal=mk&&S.raw&&S.raw[mk]&&Object.keys(S.raw[mk]).length>0;
  const hasFcast=mk&&S.forecast&&S.forecast[mk]&&Object.keys(S.forecast[mk]).length>0;
  if(mode==='real')_simBase=hasReal?{...S.raw[mk]}:{};
  else _simBase=hasFcast?{...S.forecast[mk]}:hasReal?{...S.raw[mk]}:{};
  _simRaw={..._simBase};
  simBuildFields(mk);
  simCalc();
}
let _simMode='real';
function initSim(){
  const now=new Date();
  const curY=now.getFullYear(),curMo=now.getMonth()+1;

  const knownWithData=getKnownMonths().filter(m=>S.raw&&S.raw[m]&&Object.keys(S.raw[m]).length>0);
  const futureMonths=[];
  for(let i=1;i<=6;i++){
    const d=new Date(curY,curMo-1+i,1);
    const mk=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    if(!knownWithData.includes(mk))futureMonths.push(mk);
  }
  const fcOnly=getKnownMonths().filter(m=>!knownWithData.includes(m)&&S.forecast&&S.forecast[m]&&Object.keys(S.forecast[m]).length>0);
  const allMonths=[...new Set([...knownWithData,...fcOnly,...futureMonths])].sort();

  // Base month selector
  const sel=document.getElementById('simMonthSel');
  if(sel){
    sel.innerHTML=allMonths.map(m=>{
      const[y,mo]=m.split('-');
      const hasReal=knownWithData.includes(m);
      const hasFc=S.forecast&&S.forecast[m]&&Object.keys(S.forecast[m]).length>0;
      const lbl=MES[parseInt(mo)-1]+'/'+y+(hasReal?' ✓':hasFc?' 🔮':' ·');
      return`<option value="${m}"${m===(window._simMk||S.sel)?' selected':''}>${lbl}</option>`;
    }).join('');
    if(!sel.value&&allMonths.length)sel.value=allMonths[0];
  }

  const mk=sel?sel.value:(window._simMk||S.sel);
  window._simMk=mk;

  const hasReal=mk&&S.raw&&S.raw[mk]&&Object.keys(S.raw[mk]).length>0;
  const hasFcast=mk&&S.forecast&&S.forecast[mk]&&Object.keys(S.forecast[mk]).length>0;

  // Mode buttons
  const btnR=document.getElementById('simBtnReal');
  const btnF=document.getElementById('simBtnFcast');
  if(btnR){btnR.disabled=!hasReal;btnR.style.opacity=hasReal?'1':'.4';}
  if(btnF){btnF.disabled=!hasFcast&&!hasReal;btnF.style.opacity=(hasFcast||hasReal)?'1':'.4';}

  // Auto select sensible mode
  if(_simMode==='real'&&!hasReal&&hasFcast)_simMode='forecast';
  if(btnR)btnR.className='mode-btn'+(_simMode==='real'?' active':'');
  if(btnF)btnF.className='mode-btn'+(_simMode==='forecast'?' active':'');

  // Set base
  if(_simMode==='real')_simBase=hasReal?{...S.raw[mk]}:{};
  else _simBase=hasFcast?{...S.forecast[mk]}:hasReal?{...S.raw[mk]}:{};
  _simRaw={..._simBase};

  // Badge
  const badge=document.getElementById('simModeBadge');
  if(badge){
    if(hasReal&&_simMode==='real'){
      badge.textContent='✓ Fechamento';
      badge.style.cssText='font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;background:rgba(0,232,155,.12);color:var(--green);border:1px solid rgba(0,232,155,.3)';
    } else if(_simMode==='forecast'&&hasFcast){
      badge.textContent='🔮 Previsão';
      badge.style.cssText='font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;background:rgba(168,85,247,.12);color:#c084fc;border:1px solid rgba(168,85,247,.3)';
    } else {
      badge.style.display='none';
    }
  }

  // Save bar: populate future months selector
  simUpdateSaveBar(allMonths, mk);

  requestAnimationFrame(()=>requestAnimationFrame(sizeSimWheel));
  simBuildFields(mk);
  simCalc();
}

function simUpdateSaveBar(allMonths, baseMk){
  const saveBar=document.getElementById('simSaveBar');
  const saveSel=document.getElementById('simSaveMonthSel');
  if(!saveBar||!saveSel)return;

  // Show save bar always (user can always project to a future month)
  const now=new Date();
  const curY=now.getFullYear(),curMo=now.getMonth()+1;

  // Future months + months without real data
  const futureCandidates=[];
  for(let i=0;i<=12;i++){
    const d=new Date(curY,curMo-1+i,1);
    const mk=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    const hasReal=S.raw&&S.raw[mk]&&Object.keys(S.raw[mk]).length>0;
    if(!hasReal)futureCandidates.push(mk);
  }

  if(!futureCandidates.length){saveBar.style.display='none';return;}
  saveBar.style.display='flex';

  // Select next month as default
  const nextMk=(function(){
    const d=new Date(curY,curMo,1);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  })();
  saveSel.innerHTML=futureCandidates.map(m=>{
    const[y,mo]=m.split('-');
    const hasFc=S.forecast&&S.forecast[m]&&Object.keys(S.forecast[m]).length>0;
    const lbl=MES[parseInt(mo)-1]+'/'+y+(hasFc?' (já tem previsão)':'');
    return`<option value="${m}"${m===nextMk?' selected':''}>${lbl}</option>`;
  }).join('');
}

function simBuildFields(mk){
  const right=document.getElementById('simRight');
  if(!right)return;
  if(!mk){right.innerHTML='<div style="font-size:12px;color:var(--mut)">Nenhum período disponível.</div>';return;}
  const[y,mo]=mk.split('-');
  const modeColor=_simMode==='forecast'?'#a78bfa':'var(--mut)';
  const modeLabel=_simMode==='forecast'?'Previsão':'Ajuste de cenário';
  right.innerHTML=`<div style="font-size:10px;color:${modeColor};letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--bdr)">${modeLabel} — ${MES[parseInt(mo)-1]}/${y}</div>`;
  ['tracao','rentab'].forEach(grp=>{
    const fg=FG[grp],fields=FIELDS.filter(f=>f.group===grp);
    const sec=document.createElement('div');sec.className='sim-sec';sec.style.color=fg.color;sec.textContent=`${fg.icon} ${fg.label}`;right.appendChild(sec);
    fields.forEach(fld=>{
      const baseV=_simBase[fld.id]!==undefined?_simBase[fld.id]:null;
      const curV=_simRaw[fld.id]!==undefined?_simRaw[fld.id]:'';
      const row=document.createElement('div');row.className='sim-row';
      const ph=baseV!==null?baseV:'—';
      row.innerHTML=`<span style="font-size:13px">${fg.icon}</span>
        <div style="min-width:0"><div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${fld.label}</div>${fld.unit?`<span style="font-size:10px;color:var(--mut)">${fld.unit}</span>`:''}</div>
        <input type="number" step="any" class="inp" style="font-size:12px;padding:4px 7px${_simMode==='forecast'?';border-color:rgba(168,85,247,.4)':''}" id="sf_${fld.id}" placeholder="${ph}" value="${curV}" oninput="simFldUpd('${fld.id}',this.value)">
        <span id="sfd_${fld.id}" style="font-size:10px;text-align:right;color:var(--mut)"></span>`;
      right.appendChild(row);
    });
  });
}
function simFldUpd(fid,val){
  const num=val===''?undefined:parseFloat(val);
  if(num===undefined||isNaN(num))delete _simRaw[fid];else _simRaw[fid]=num;
  const base=_simBase[fid];const de=document.getElementById('sfd_'+fid);
  if(de&&base!==undefined&&base!==0&&num!==undefined){const p=((num-base)/Math.abs(base)*100).toFixed(1);de.textContent=(p>=0?'+':'')+p+'%';de.style.color=p>=0?'var(--green)':'var(--red)';}
  else if(de)de.textContent='';
  simCalc();
}
function simCalc(){
  const mk=window._simMk||S.sel;
  // Verifica se houve alguma alteração nos campos em relação à base
  const hasChanges=Object.keys(_simBase).some(k=>_simRaw[k]!==_simBase[k])||
                   Object.keys(_simRaw).some(k=>_simRaw[k]!==_simBase[k]);

  // SEM alterações: usa S.data[mk] diretamente (mesma fonte do dashboard)
  if(!hasChanges && S.data && S.data[mk]){
    const res=calcScore(mk);
    if(res){
      window._simDets=res.details;
      const score=res.score; const g=grade(score);
      document.getElementById('simSn').textContent=score;document.getElementById('simSn').style.color=g.c;
      document.getElementById('simSg').textContent=g.l;document.getElementById('simSg').style.color=g.c;document.getElementById('simSg').style.background=g.c+'20';
      document.getElementById('simScoreSim').textContent=score;document.getElementById('simScoreSim').style.color=g.c;
      document.getElementById('simScoreBase').textContent=score;
      document.getElementById('simDelta').textContent='';
      const gl=document.getElementById('simGradeL');gl.textContent=g.l;gl.style.color=g.c;gl.style.borderColor=g.c+'44';gl.style.background=g.c+'12';
      // Lucro líquido no branch sem alterações
      (function(){
        const card=document.getElementById('simLucroCard');if(!card)return;
        const ind=IND.find(i=>i.id==='lucroliq');if(!ind)return;
        const _mk=window._simMk||S.sel;
        const ll=(_mk&&S.data&&S.data[_mk]&&S.data[_mk].lucroliq)?S.data[_mk].lucroliq.value:null;
        const goal=_mk?getGoal('lucroliq',_mk):ind.goalDef;
        if(ll===null||ll===undefined){card.style.display='none';return;}
        card.style.display='flex';
        const valEl=document.getElementById('simLucroVal');
        const pctEl=document.getElementById('simLucroPct');
        const goalEl=document.getElementById('simLucroGoal');
        valEl.textContent=ll.toFixed(1)+'%';
        if(goal){const pct=Math.max(0,Math.min(150,(ll/goal)*100));const col=pct>=80?'var(--green)':pct>=60?'var(--amber)':'var(--red)';
          valEl.style.color=col;pctEl.textContent=Math.round(pct)+'% da meta';pctEl.style.color=col;goalEl.textContent='meta: '+goal+'%';
        } else {valEl.style.color='var(--teal)';pctEl.textContent='';goalEl.textContent='';}
      })();
      sizeSimWheel();return;
    }
  }

  // COM alterações: recalcula usando os campos modificados
  // Para KPIs não afetados pela mudança, usa o valor salvo em S.data[mk]
  const kpisNovos=calcKPIs(_simRaw);
  const kpisBase=S.data&&S.data[mk]?S.data[mk]:null;
  let tw=0,ws=0,dets=[];
  IND.forEach(ind=>{
    // Usa valor novo se calculável, senão usa o salvo
    let v=kpisNovos[ind.id];
    let usandoBase=false;
    if((v===null||v===undefined)&&kpisBase&&kpisBase[ind.id]){
      v=kpisBase[ind.id].value; usandoBase=true;
    }
    if(v===null||v===undefined)return;
    const cfg=S.cfg[ind.id]||{weight:1,hb:ind.hb};
    const goal=_BENCHABLE.has(ind.id)&&cfg.benchMode==='ai'&&cfg.benchGoal?cfg.benchGoal:getGoal(ind.id,mk);
    if(!goal)return;
    const hb=cfg.hb!=null?cfg.hb:ind.hb;
    // Arredonda igual ao S.data para manter consistência
    const vr=usandoBase?v:parseFloat(parseFloat(v).toFixed(4));
    let p=hb?(goal===0?100:Math.min((vr/goal)*100,150)):(goal===0?100:Math.min((goal/Math.max(vr,.001))*100,150));
    p=Math.max(0,Math.min(100,p));
    tw+=cfg.weight;ws+=p*cfg.weight;
    dets.push({ind,pct:p,val:vr,goal});
  });
  window._simDets=dets;
  const score=tw>0?Math.round(ws/tw):0;const g=grade(score);
  const curRes=mk?calcScore(mk):null,curScore=curRes?curRes.score:0,diff=score-curScore;
  const dc=diff>0?'var(--green)':diff<0?'var(--red)':'var(--mut)';
  document.getElementById('simSn').textContent=score;document.getElementById('simSn').style.color=g.c;
  document.getElementById('simSg').textContent=g.l;document.getElementById('simSg').style.color=g.c;document.getElementById('simSg').style.background=g.c+'20';
  document.getElementById('simScoreSim').textContent=score;document.getElementById('simScoreSim').style.color=g.c;
  document.getElementById('simScoreBase').textContent=curScore||'—';
  document.getElementById('simDelta').textContent=(diff>=0?'▲ +':'▼ ')+diff;document.getElementById('simDelta').style.color=dc;
  const gl=document.getElementById('simGradeL');gl.textContent=g.l;gl.style.color=g.c;gl.style.borderColor=g.c+'44';gl.style.background=g.c+'12';
  sizeSimWheel();
  // ── Lucro Líquido card ──────────────────────────────────────────
  (function(){
    const card=document.getElementById('simLucroCard');if(!card)return;
    const ind=IND.find(i=>i.id==='lucroliq');if(!ind)return;
    const ll=calcKPIs(_simRaw).lucroliq;
    const mk=window._simMk||S.sel;
    const goal=mk?getGoal('lucroliq',mk):ind.goalDef;
    if(ll===null||ll===undefined){card.style.display='none';return;}
    card.style.display='flex';
    const valEl=document.getElementById('simLucroVal');
    const pctEl=document.getElementById('simLucroPct');
    const goalEl=document.getElementById('simLucroGoal');
    valEl.textContent=ll.toFixed(1)+'%';
    if(goal){
      const pct=Math.max(0,Math.min(150,(ll/goal)*100));
      const col=pct>=80?'var(--green)':pct>=60?'var(--amber)':'var(--red)';
      valEl.style.color=col;
      pctEl.textContent=Math.round(pct)+'% da meta';
      pctEl.style.color=col;
      goalEl.textContent='meta: '+goal+'%';
    } else {
      valEl.style.color='var(--teal)';
      pctEl.textContent='';goalEl.textContent='';
    }
  })();
}
function simReset(){
  const mk=window._simMk||S.sel;
  const hasReal=mk&&S.raw&&S.raw[mk]&&Object.keys(S.raw[mk]).length>0;
  const hasFcast=mk&&S.forecast&&S.forecast[mk]&&Object.keys(S.forecast[mk]).length>0;
  if(_simMode==='real')_simBase=hasReal?{...S.raw[mk]}:{};
  else _simBase=hasFcast?{...S.forecast[mk]}:hasReal?{...S.raw[mk]}:{};
  _simRaw={..._simBase};
  simBuildFields(mk);
  simCalc();
  toast('↺ Valores resetados para a base');
}
function simSaveForecast(){
  const saveSel=document.getElementById('simSaveMonthSel');
  const targetMk=saveSel?saveSel.value:null;
  if(!targetMk){toast('⚠️ Selecione o mês de destino');return;}
  // Collect current simulated field values
  const fc={};
  FIELDS.forEach(function(fld){
    const el=document.getElementById('sf_'+fld.id);
    if(el&&el.value!=='')fc[fld.id]=parseFloat(el.value);
    else if(_simRaw[fld.id]!==undefined)fc[fld.id]=_simRaw[fld.id];
  });
  if(!Object.keys(fc).length){toast('⚠️ Ajuste pelo menos um campo antes de salvar');return;}
  if(!S.forecast)S.forecast={};
  S.forecast[targetMk]=fc;
  if(!S.months.includes(targetMk)){S.months.push(targetMk);S.months.sort();}
  sv();
  const[y,mo]=targetMk.split('-');
  toast('✓ Previsão de '+MES[parseInt(mo)-1]+'/'+y+' salva!');
  // Refresh save bar to reflect saved state
  const now=new Date();
  const curY=now.getFullYear(),curMo=now.getMonth()+1;
  const knownWithData=getKnownMonths().filter(m=>S.raw&&S.raw[m]&&Object.keys(S.raw[m]).length>0);
  const allMonths=[...new Set([...knownWithData,...getKnownMonths()])].sort();
  simUpdateSaveBar(allMonths, window._simMk||S.sel);
}

// ═══════════════════════════════════════════
// IMPORT
// ═══════════════════════════════════════════
function rImportPage(){
  const cols='grid-template-columns:180px 90px 90px 90px 60px';
  const hdr=document.getElementById('tmplHdr');hdr.setAttribute('style',cols);
  hdr.innerHTML='<span>Campo</span><span>01/2026</span><span>02/2026</span><span>03/2026</span><span>...</span>';
  const rows=document.getElementById('tmplRows');rows.innerHTML='';
  const samples=[['Faturamento Bruto','120.000','132.000','145.000','...'],['Despesa Comercial','6.000','6.600','7.000','...'],['Novos Clientes','10','12','14','...'],
    ['Base Clientes','100','108','118','...'],['Cancelamentos','2','2','3','...'],['Custos Variáveis','48.000','52.800','58.000','...'],
    ['Despesas Fixas','35.000','35.000','36.000','...'],['Entradas Banco','115.000','126.500','139.000','...'],['Saídas Banco','105.000','115.000','126.000','...'],
    ['Saldo Final','150.000','161.500','174.500','...'],['Prazo Receb. (d)','45','45','40','...'],['Prazo Pagam. (d)','30','30','30','...'],
    ['Colaboradores','15','15','16','...'],['Saídas Voluntárias','1','0','1','...'],['Estoque (R$)','60.000','60.000','65.000','...']];
  samples.forEach(row=>{const d=document.createElement('div');d.className='tmpl-row';d.setAttribute('style',cols);
    d.innerHTML=row.map((v,j)=>`<span style="${j===0?'color:#9ab8d8':'color:var(--mut)'}">${v}</span>`).join('');rows.appendChild(d);});
}
function downloadTemplate(){
  if(!window.XLSX){toast('⚠️ SheetJS não carregado');return;}
  const cur=new Date().getFullYear();
  const wb=XLSX.utils.book_new();
  const headers=['Campo','01/'+cur,'02/'+cur,'03/'+cur,'...'];
  const names=['Faturamento Bruto','Despesa Comercial','Novos Clientes','Base Clientes','Cancelamentos','Custos Variáveis','Despesas Fixas','Entradas Banco','Saídas Banco','Saldo Final','Prazo Recebimento (d)','Prazo Pagamento (d)','Colaboradores','Saídas Voluntárias','Estoque (R$)'];
  const data=[headers,...names.map(n=>[n,'','','',''])];
  const ws=XLSX.utils.aoa_to_sheet(data);ws['!cols']=[{wch:26},{wch:12},{wch:12},{wch:12},{wch:6}];
  XLSX.utils.book_append_sheet(wb,ws,'Dados');XLSX.writeFile(wb,'VitalDiagnostic_Template.xlsx');toast('✓ Template baixado!');
}
function handleImport(input){
  const file=input.files[0];if(!file)return;
  if(!window.XLSX){toast('⚠️ SheetJS não carregado');return;}
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const wb=XLSX.read(e.target.result,{type:'binary'});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const data=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
      if(data.length<2){toast('⚠️ Planilha vazia');return;}
      const FM={'faturamento bruto':'f_fat','receita bruta':'f_fat','despesa comercial':'f_dc','marketing':'f_dc',
        'novos clientes':'f_ncli','base clientes':'f_bcli','clientes início':'f_bcli','cancelamentos':'f_cancel','churn':'f_cancel',
        'custos variáveis':'f_cv','cmv':'f_cv','despesas fixas':'f_df','entradas banco':'f_ent','entradas':'f_ent',
        'saídas banco':'f_said','saidas banco':'f_said','saídas':'f_said','saidas':'f_said','saldo final':'f_saldo','saldo':'f_saldo',
        'prazo recebimento (d)':'f_pmr','prazo recebimento':'f_pmr','pmr':'f_pmr','prazo pagamento (d)':'f_pmp','prazo pagamento':'f_pmp','pmp':'f_pmp',
        'colaboradores':'f_colab','headcount':'f_colab','saídas voluntárias':'f_saiv','saidas voluntarias':'f_saiv','estoque (r$)':'f_estq','estoque':'f_estq'};
      let imported=0,months=0;
      const headers=data[0];
      for(let c=1;c<headers.length;c++){
        const colH=String(headers[c]).trim();if(!colH||colH==='...')continue;
        let mk=null;const m1=colH.match(/^(\d{1,2})\/(\d{4})$/);const m2=colH.match(/^(\d{4})-(\d{2})$/);
        if(m1)mk=`${m1[2]}-${String(parseInt(m1[1])).padStart(2,'0')}`;else if(m2)mk=colH;
        if(!mk)continue;
        if(!S.months.includes(mk)){S.months.push(mk);S.months.sort();}
        if(!S.raw[mk])S.raw[mk]={};months++;
        for(let r=1;r<data.length;r++){
          const rn=String(data[r][0]).trim().toLowerCase();const fid=FM[rn];if(!fid)continue;
          const val=parseFloat(String(data[r][c]).replace(/[.\s]/g,'').replace(',','.'));
          if(!isNaN(val)){S.raw[mk][fid]=val;imported++;}
        }
        const kpis=calcKPIs(S.raw[mk]);if(!S.data[mk])S.data[mk]={};
        IND.forEach(ind=>{const v=kpis[ind.id];if(v!==null)S.data[mk][ind.id]={value:parseFloat(v.toFixed(4)),confidence:'medium'};});
      }
      sv();
      document.getElementById('importResult').innerHTML=`<span style="color:var(--green)">✓ ${imported} valores importados em ${months} períodos.</span><br><span style="color:var(--mut)">Todos os KPIs marcados com confiabilidade Média. Revise no Lançamento.</span>`;
      toast('✓ Importação concluída!');
    }catch(err){toast('⚠️ Erro: '+err.message);}
    input.value='';
  };reader.readAsBinaryString(file);
}

// ═══════════════════════════════════════════
// METODOLOGIA
// ═══════════════════════════════════════════
function rMeth(){
  const grid=document.getElementById('methGrid');
  grid.innerHTML='';

  // ── INTRO ──────────────────────────────────────────────────────────
  const intro=document.createElement('div');
  intro.className='mc2';intro.style.gridColumn='1/-1';
  intro.innerHTML=`
    <div class="mt">Como o Vital Diagnostic funciona</div>
    <div class="mb">O sistema processa o DRE mensal da empresa e o transforma em <strong>${IND.length} KPIs estratégicos</strong>.
    Cada KPI é pontuado 0–100% com base em metas configuráveis, ponderado por importância e ajustado pela confiabilidade do dado.
    O resultado é um <strong>Score de Saúde 0–100</strong> que resume o estado financeiro do negócio em um único número.</div>
    <div style="background:rgba(0,240,200,.06);border:1px solid rgba(0,240,200,.15);border-radius:12px;padding:14px 18px;margin-top:8px;font-size:12px;color:rgba(255,255,255,.6);line-height:1.8">
      <strong style="color:var(--teal)">Convenção adotada:</strong> todos os percentuais de margem e eficiência são calculados sobre a
      <strong style="color:#c8dff5">Receita Líquida</strong> (Receita Bruta − Deduções de impostos sobre venda),
      seguindo a convenção do mercado de capitais brasileiro (CVM / B3).
    </div>`;
  grid.appendChild(intro);

  // ── FLUXO DO DRE ───────────────────────────────────────────────────
  const fluxo=document.createElement('div');
  fluxo.className='mc2';fluxo.style.gridColumn='1/-1';
  fluxo.innerHTML=`
    <div class="mt">Fluxo de Cálculo — do DRE aos KPIs</div>
    <div style="display:flex;flex-direction:column;gap:0;margin-top:8px">
      ${[
        {label:'Receita Bruta',     color:'#00e89b', desc:'Total de vendas brutas do período'},
        {label:'( − ) Deduções',    color:'#64748b', desc:'Impostos sobre venda (PIS, COFINS, ISS, ICMS), devoluções e abatimentos'},
        {label:'= Receita Líquida', color:'#00f0c8', desc:'Base para todos os cálculos de percentual — convenção CVM/B3', bold:true},
        {label:'( − ) CMV',         color:'#ef4444', desc:'Custo da mercadoria vendida ou custo dos serviços prestados'},
        {label:'= Lucro Bruto',     color:'#10d4a8', desc:'Resultado após os custos diretos do produto/serviço', bold:true},
        {label:'( − ) Desp. Comercial', color:'#3b82f6', desc:'Marketing, publicidade, comissões de venda'},
        {label:'( − ) Desp. Pessoal',   color:'#a855f7', desc:'Salários, pró-labore, encargos e benefícios'},
        {label:'( − ) Desp. Adm.',      color:'#f59e0b', desc:'Aluguel, software, utilidades, serviços gerais'},
        {label:'= EBITDA',          color:'#10d4a8', desc:'Lucro antes de juros, impostos, depreciação e amortização', bold:true},
        {label:'( − ) Depreciação', color:'#64748b', desc:'Depreciação e amortização de ativos — excluída do EBITDA por definição'},
        {label:'( − ) Desp. Financeiras + IR', color:'#ef4444', desc:'Juros, IOF, empréstimos, IR/CSLL sobre o lucro'},
        {label:'= Lucro Líquido',   color:'#00e89b', desc:'Resultado final após todas as despesas e impostos', bold:true},
      ].map(r=>`
        <div style="display:grid;grid-template-columns:200px 1fr;gap:12px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.04);align-items:center">
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:${r.bold?'700':'500'};color:${r.color}">${r.label}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.45)">${r.desc}</div>
        </div>`).join('')}
    </div>`;
  grid.appendChild(fluxo);

  // ── KPIs por grupo ─────────────────────────────────────────────────
  const KPIDEFS = [
    {
      id:'receita', name:'Receita Bruta', icon:'💰', group:'tracao',
      formula:'Valor total das vendas brutas do período',
      denominador:'—',
      fonte:'Linha "Receita de Vendas" ou equivalente no DRE',
      hb:'Maior = melhor',
    },
    {
      id:'cac', name:'CAC — Despesa Comercial %', icon:'🎯', group:'tracao',
      formula:'Despesa Comercial ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Linhas classificadas como "Despesa Comercial" no DRE',
      hb:'Menor = melhor',
    },
    {
      id:'margbruta', name:'Margem Bruta %', icon:'📦', group:'rentab',
      formula:'(Receita Líquida − CMV) ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'CMV: linhas "Custo Variável / CMV" no DRE',
      hb:'Maior = melhor',
    },
    {
      id:'margem', name:'Margem de Contribuição %', icon:'💹', group:'rentab',
      formula:'(Lucro Bruto − Despesa Comercial) ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Lucro Bruto − Desp. Comercial',
      hb:'Maior = melhor',
    },
    {
      id:'ebitda', name:'EBITDA %', icon:'📊', group:'rentab',
      formula:'(Margem de Contribuição − Desp. Pessoal − Desp. Adm.) ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Excluí depreciação/amortização por definição (EBITDA = antes da D&A)',
      hb:'Maior = melhor',
    },
    {
      id:'despop', name:'Desp. Operacionais %', icon:'📋', group:'rentab',
      formula:'(Desp. Comercial + Pessoal + Adm.) ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Soma das despesas operacionais classificadas no DRE',
      hb:'Menor = melhor',
    },
    {
      id:'lucroliq', name:'Lucro Líquido %', icon:'💰', group:'rentab',
      formula:'(EBITDA − Depreciação − Desp. Financeiras − IR/CSLL) ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Resultado final após todas as deduções',
      hb:'Maior = melhor',
    },
    {
      id:'pessoal', name:'Peso do Pessoal %', icon:'👥', group:'rentab',
      formula:'Despesas com Pessoal ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Linhas "Despesa com Pessoal" no DRE (salários, encargos, pró-labore)',
      hb:'Menor = melhor',
    },
    {
      id:'admperc', name:'Peso Administrativo %', icon:'🏢', group:'rentab',
      formula:'Despesas Administrativas ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Linhas "Despesa Administrativa" no DRE',
      hb:'Menor = melhor',
    },
    {
      id:'spread', name:'Spread Financeiro %', icon:'🏦', group:'rentab',
      formula:'Desp. Financeiras + IR ÷ Receita Líquida × 100',
      denominador:'Receita Líquida',
      fonte:'Linhas "Despesa Financeira" e "Imposto sobre Lucro" no DRE',
      hb:'Menor = melhor',
    },
    {
      id:'eficiencia', name:'Índice de Eficiência Op. %', icon:'⚙️', group:'rentab',
      formula:'Desp. Operacionais ÷ Lucro Bruto × 100',
      denominador:'Lucro Bruto',
      fonte:'(DC + Pessoal + Adm) ÷ (Rec.Líq − CMV). Acima de 100% = despesas superam o Lucro Bruto',
      hb:'Menor = melhor',
    },
    {
      id:'margseg', name:'Margem de Segurança Op. %', icon:'🛡️', group:'rentab',
      formula:'(Receita Bruta − Ponto de Equilíbrio) ÷ Receita Bruta × 100',
      denominador:'Receita Bruta',
      fonte:'PE = Custos Fixos ÷ (MC ÷ Rec.Bruta). Mostra quanto a receita pode cair antes do prejuízo',
      hb:'Maior = melhor',
    },
  ];

  ['tracao','rentab'].forEach(grp=>{
    const card=document.createElement('div');card.className='mc2';
    const col=GC[grp];
    const kpis=KPIDEFS.filter(k=>k.group===grp);
    card.innerHTML=`
      <span class="mpill" style="background:${col}22;color:${col}">${GI[grp]} ${GN[grp]}</span>
      <div class="mkg">
        ${kpis.map(k=>`
          <div class="mkc">
            <div class="mkn">${k.icon} ${k.name}</div>
            <div class="mkf">${k.formula}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
              <span style="font-size:9px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:2px 8px;color:rgba(255,255,255,.4)">Base: ${k.denominador}</span>
              <span style="font-size:9px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:2px 8px;color:rgba(255,255,255,.4)">${k.hb}</span>
            </div>
            <div class="mkd" style="margin-top:5px;color:rgba(255,255,255,.35);font-style:italic">${k.fonte}</div>
          </div>`).join('')}
      </div>`;
    grid.appendChild(card);
  });

  // ── SCORE ──────────────────────────────────────────────────────────
  const sc=document.createElement('div');sc.className='mc2';sc.style.gridColumn='1/-1';
  sc.innerHTML=`
    <div class="mt">Sistema de Pontuação — Score de Saúde 0–100</div>
    <div class="mb">Cada KPI recebe uma pontuação 0–100% baseada na distância para a meta mensal configurada.
    A pontuação é multiplicada pelo fator de confiabilidade do dado e pelo peso do KPI.
    O Score final é a média ponderada de todos os KPIs com dados disponíveis.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
      <div style="background:rgba(255,255,255,.03);border-radius:10px;padding:12px 14px">
        <div style="font-size:10px;color:var(--mut);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Confiabilidade do Dado</div>
        <div style="font-size:12px;line-height:2;color:rgba(255,255,255,.6)">
          ✅ Alta → 100% do peso<br>⚠️ Média → 88% do peso<br>❌ Baixa → 70% do peso
        </div>
      </div>
      <div style="background:rgba(255,255,255,.03);border-radius:10px;padding:12px 14px">
        <div style="font-size:10px;color:var(--mut);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Faixas do Score</div>
        <div style="font-size:12px;line-height:2">
          <span style="color:var(--green)">90–100 Excelente</span><br>
          <span style="color:var(--teal)">75–89 Saudável</span><br>
          <span style="color:var(--amber)">55–74 Atenção</span><br>
          <span style="color:var(--red)">35–54 Crítico</span><br>
          <span style="color:#ff0040">0–34 Em Crise</span>
        </div>
      </div>
    </div>`;
  grid.appendChild(sc);
}

// ═══════════════════════════════════════════
// MEETING MODE
// ═══════════════════════════════════════════
let _meetPg=0;

// ── _meetSlides registry ────────────────────────────────────────────
var _meetSlideBuilders=[];

function openMeeting(){
  const res=S.sel?calcScore(S.sel):null;
  if(!res){toast('⚠️ Lance os dados de um período primeiro');return;}
  _meetPg=0;
  const[y,mo]=S.sel.split('-');
  const co=S.company||'Empresa';
  const period=MES[parseInt(mo)-1]+'/'+y;
  // Header
  const coEl=document.getElementById('meetCoLbl');if(coEl)coEl.textContent=co;
  const perEl=document.getElementById('meetPeriodLbl');if(perEl)perEl.textContent=period;
  const logoEl=document.getElementById('meetLogo');
  if(logoEl){if(S.logo){logoEl.src=S.logo;logoEl.style.display='block';}else logoEl.style.display='none';}
  // Build slides
  _meetSlideBuilders=[
    function(){return buildSlide0(res);},  // capa
    function(){return buildSlideDiag(res);}, // roda + diagnóstico
    function(){return buildSlide1(res);},  // KPIs
    function(){return buildSlide2(res);},  // forecast
    function(){return buildSlide3(res);},  // planos de ação
  ];
  // Render dots
  const dots=document.getElementById('meetDots');
  if(dots){
    dots.innerHTML='';
    _meetSlideBuilders.forEach(function(_,i){
      var d=document.createElement('div');d.className='mdot';
      d.onclick=function(){meetGo(i);};
      dots.appendChild(d);
    });
  }
  document.getElementById('meetingOverlay').classList.add('open');
  document.addEventListener('keydown',meetKey);
  // Entra em tela cheia automaticamente ao abrir a apresentação
  document.documentElement.requestFullscreen().catch(()=>{});
  meetGo(0);
}
function closeMeeting(){
  saveMeetActions();
  document.getElementById('meetingOverlay').classList.remove('open');
  document.removeEventListener('keydown',meetKey);
  // Sai da tela cheia ao fechar a apresentação
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
}
function meetKey(e){
  if(e.key==='Escape')closeMeeting();
  if(e.key==='ArrowRight'||e.key===' ')meetStep(1);
  if(e.key==='ArrowLeft')meetStep(-1);
}
function meetStep(d){meetGo(_meetPg+d);}
function meetGo(pg){
  saveMeetActions();
  var total=_meetSlideBuilders.length||3;
  _meetPg=Math.max(0,Math.min(total-1,pg));
  // Build/render current slide
  var container=document.getElementById('meetSlides');
  if(container){
    container.innerHTML='';
    var slideEl=document.createElement('div');
    slideEl.className='mslide on';
    slideEl.id='mslide'+_meetPg;
    var content=_meetSlideBuilders[_meetPg]();
    if(typeof content==='string'){slideEl.innerHTML=content;}
    else if(content instanceof HTMLElement){slideEl.appendChild(content);}
    container.appendChild(slideEl);
    // Trigger action inputs init per slide
    if(_meetPg===1)setTimeout(function(){initSlide1Actions(slideEl);},50);
    if(_meetPg===2)setTimeout(function(){
      slideEl.querySelectorAll('.act-prazo').forEach(maskPrazo);
    },50);
    if(_meetPg===3)setTimeout(function(){initSlide3Actions(slideEl);},50);
  }
  // Update dots
  document.querySelectorAll('.mdot').forEach(function(d,i){d.classList.toggle('on',i===_meetPg);});
  document.getElementById('mBtnPrev').disabled=_meetPg===0;
  document.getElementById('mBtnNext').disabled=_meetPg===total-1;
  var labels=['Capa','Resultados — KPIs','Forecast & Próximo Mês'];
  document.getElementById('mPageLbl').textContent=
    (labels[_meetPg]||'Slide '+(_meetPg+1))+' · '+(_meetPg+1)+' / '+total;
}

function saveMeetAndToast(){
  saveMeetActions();
  const btn=document.getElementById('meetSaveBtn');
  if(btn){btn.textContent='✓ Salvo!';btn.style.background='#059669';
    setTimeout(()=>{btn.textContent='💾 Salvar';btn.style.background='#10b981';},1800);}
  toast('✓ Planos de ação salvos!');
}
function saveMeetActions(){
  if(!S.sel)return;
  if(!S.meetActions)S.meetActions={};
  if(!S.meetActions[S.sel])S.meetActions[S.sel]={fechamento:[],forecast:[],adicionais:[]};
  // Ações adicionais
  var _adic=[];
  document.querySelectorAll('#actAdicBody tr').forEach(function(tr){
    var t=(tr.querySelector('.act-text')||{}).value||'';t=t.trim();
    var r=(tr.querySelector('.act-resp')||{}).value||'';r=r.trim();
    var p=(tr.querySelector('.act-prazo')||{}).value||'';p=p.trim();
    if(t||r||p)_adic.push({text:t,resp:r,prazo:p,kpi:'Adicional'});
  });
  S.meetActions[S.sel].adicionais=_adic;
  // KPI inline actions (no data-type)
  var texts=document.querySelectorAll('.kcard-act .act-text:not([data-type])');
  var resps=document.querySelectorAll('.kcard-act .act-resp:not([data-type])');
  var prazos=document.querySelectorAll('.kcard-act .act-prazo:not([data-type])');
  var fech=[];
  for(var i=0;i<texts.length;i++){
    fech.push({
      text:(texts[i].value||'').trim(),
      resp:(resps[i]?resps[i].value||'':'').trim(),
      prazo:(prazos[i]?prazos[i].value||'':'').trim(),
      kpi:texts[i].dataset.kpi||''
    });
  }
  S.meetActions[S.sel].fechamento=fech;
  // Forecast actions
  var ftexts=document.querySelectorAll('.act-text[data-type="forecast"]');
  var fresps=document.querySelectorAll('.act-resp[data-type="forecast"]');
  var fprazos=document.querySelectorAll('.act-prazo[data-type="forecast"]');
  var farr=[];
  for(var j=0;j<ftexts.length;j++){
    farr.push({
      text:(ftexts[j].value||'').trim(),
      resp:(fresps[j]?fresps[j].value||'':'').trim(),
      prazo:(fprazos[j]?fprazos[j].value||'':'').trim(),
      kpi:ftexts[j].dataset.kpi||''
    });
  }
  S.meetActions[S.sel].forecast=farr;
  syncActionsFromMeeting(S.sel);
  sv();
}
function clearKpiAct(btn){
  const row=btn.closest('.kcard-act')||btn.closest('.m-kr-act');if(!row)return;
  row.querySelectorAll('input').forEach(i=>i.value='');
}

function actTableHTML(mk,type){
  const saved=(S.meetActions?.[mk]?.[type])||[];
  const dfl=type==='fechamento'?[{text:'',resp:'',prazo:''},{text:'',resp:'',prazo:''}]:[{text:'',resp:'',prazo:''}];
  const acts=saved.length?saved:dfl;
  let html=`<table class="m-act-tbl"><thead><tr><th style="width:42%">Ação</th><th style="width:25%">Responsável</th><th style="width:20%">Prazo</th><th></th></tr></thead><tbody id="actBody_${type}">`;
  acts.forEach(a=>{html+=`<tr class="act-row" data-type="${type}"><td><input class="m-ai act-text" value="${a.text||''}" placeholder="Descreva a ação..."></td><td><input class="m-ai act-resp" value="${a.resp||''}" placeholder="Nome..."></td><td><input type="text" class="m-ai act-prazo" value="${a.prazo||''}" placeholder="dd/mm/aaaa"></td><td><button class="m-del" onclick="this.closest('tr').remove()">✕</button></td></tr>`;});
  html+=`</tbody></table><button class="m-add-row" onclick="addActRow('${type}')">+ Adicionar Ação</button>`;
  return html;
}
function addAdicRow(){
  const tbody=document.getElementById('actAdicBody');if(!tbody)return;
  const tr=document.createElement('tr');
  const mk=(inp,cls,ph)=>{const i=document.createElement('input');i.type='text';i.className='m-ai '+cls;i.placeholder=ph;return i;};
  const td1=document.createElement('td');td1.appendChild(mk('act-text','Descreva a ação...'));
  const td2=document.createElement('td');td2.appendChild(mk('act-resp','Responsável'));
  const td3=document.createElement('td');const pi=mk('act-prazo','dd/mm/aaaa');maskPrazo(pi);td3.appendChild(pi);
  const td4=document.createElement('td');const btn=document.createElement('button');btn.className='m-del';btn.textContent='✕';btn.onclick=function(){this.closest('tr').remove();};td4.appendChild(btn);
  tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);tr.appendChild(td4);
  tbody.appendChild(tr);
}
function maskPrazo(inp){
  inp.addEventListener('input',function(e){
    // Remove tudo que não for dígito
    var v=this.value.replace(/\D/g,'');
    // Limita a 8 dígitos (ddmmaaaa)
    if(v.length>8)v=v.slice(0,8);
    // Formata dd/mm/aaaa progressivamente
    if(v.length>4) v=v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4);
    else if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2);
    this.value=v;
  });
  inp.addEventListener('blur',function(){
    // Valida ao sair do campo
    var v=this.value.trim();
    if(!v)return;
    var ok=/^(\d{2})\/(\d{2})\/(\d{4})$/.test(v);
    if(!ok){
      this.style.borderColor='#ef4444';
      this.title='Formato inválido. Use dd/mm/aaaa';
    } else {
      this.style.borderColor='';
      this.title='';
    }
  });
  inp.addEventListener('focus',function(){
    this.style.borderColor='';
  });
}
function addActRow(type){
  const tbody=document.getElementById('actBody_'+type);if(!tbody)return;
  const tr=document.createElement('tr');tr.className='act-row';tr.setAttribute('data-type',type);
  tr.innerHTML=`<td><input class="m-ai act-text" placeholder="Descreva a ação..."></td><td><input class="m-ai act-resp" placeholder="Nome..."></td><td><input type="text" class="m-ai act-prazo" placeholder="dd/mm/aaaa"></td><td><button class="m-del" onclick="this.closest('tr').remove()">✕</button></td>`;
  tbody.appendChild(tr);
  const newPrazo=tr.querySelector('.act-prazo');if(newPrazo)maskPrazo(newPrazo);
}

// ── SLIDE 0: CAPA ────────────────────────────────────────────────────
function buildSlide0(res){
  var g=grade(res.score);
  var parts=S.sel.split('-');var y=parts[0];var mo=parts[1];
  var period=MES[parseInt(mo)-1]+' '+y;
  var col=g.c;
  var idx=getKnownMonths().indexOf(S.sel);
  var deltaH='';
  if(idx>0){
    var km=getKnownMonths();var prev=calcScore(km[idx-1]);
    if(prev){
      var d=res.score-prev.score;var dc=d>0?'var(--green)':d<0?'var(--red)':'rgba(255,255,255,.4)';
      var pm=km[idx-1].split('-');
      deltaH='<div style="font-size:13px;font-weight:600;color:'+dc+';margin-top:8px">'+(d>0?'▲ +':'▼ ')+d+' pts vs '+MES[parseInt(pm[1])-1]+'/'+pm[0]+'</div>';
    }
  }
  var logoH='';
  if(S.logo){
    logoH='<div class="s0-logo-wrap"><img src="'+S.logo+'" alt="logo"></div>';
  } else {
    var initials=(S.company||'E').split(' ').map(function(w){return w[0];}).slice(0,2).join('').toUpperCase();
    logoH='<div class="s0-logo-wrap"><span class="s0-logo-initials">'+initials+'</span></div>';
  }
  return '<div class="s0-wrap">'
    +'<div class="s0-bg"></div>'
    +'<div class="s0-content">'
    +'<div class="s0-tag">FECHAMENTO MENSAL</div>'
    +logoH
    +'<div class="s0-company">'+(S.company||'EMPRESA')+'</div>'
    +(S.sector?'<div class="s0-period" style="letter-spacing:3px;font-size:13px">'+S.sector.toUpperCase()+'</div>':'')
    +'<div class="s0-score-wrap" style="border-color:'+col+'22">'
    +'<div class="s0-score-num" style="color:'+col+'">'+res.score+'</div>'
    +'<div class="s0-score-right">'
    +'<div class="s0-score-lbl">SCORE DE SAÚDE</div>'
    +'<div class="s0-score-grade" style="color:'+col+';background:'+col+'15;border:1px solid '+col+'35">'+g.l+'</div>'
    +deltaH
    +'<div class="s0-score-sector">'+period+'</div>'
    +'</div></div>'
    +'</div></div>';
}


// ── SLIDE DIAG: Roda + Diagnóstico ───────────────────────────────────
function buildSlideDiag(res){
  var g=grade(res.score);var col=g.c;
  var parts=S.sel.split('-');var y=parts[0];var mo=parts[1];
  var period=MES[parseInt(mo)-1]+'/'+y;
  var sz=420;
  var wheelId='meetDiagWheel';

  // Get diagnosis from cache — strip the outer diag-box wrapper to re-style
  var diagInner='';
  var cached=S.diagCache&&S.diagCache[S.sel];
  if(cached&&cached.html){
    diagInner=cached.html;
  } else {
    diagInner='<div style="color:var(--mut);font-size:13px;line-height:1.8">'
      +'Abra o Dashboard primeiro para gerar o diagnóstico de IA deste período.'
      +'</div>';
  }

  var html='<div style="flex:1;display:grid;grid-template-columns:1fr 1fr;min-height:0;overflow:hidden">'
    // Left: wheel — full height, centered
    +'<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px 16px;border-right:1px solid rgba(255,255,255,.07);overflow:hidden">'
    +'<div style="font-size:9px;letter-spacing:4px;color:var(--teal);font-weight:700;text-transform:uppercase;margin-bottom:4px">Score de Saúde · '+period+'</div>'
    +'<div style="position:relative;width:'+sz+'px;height:'+sz+'px;flex-shrink:0">'
    +'<svg id="'+wheelId+'" width="'+sz+'" height="'+sz+'" viewBox="0 0 '+sz+' '+sz+'"></svg>'
    +'<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none">'
    +'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:86px;line-height:.85;color:'+col+'">'+res.score+'</div>'
    +'<div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,.4);margin-top:6px">SCORE</div>'
    +'<div style="font-size:20px;font-weight:700;color:'+col+';margin-top:6px;background:'+col+'15;border:1px solid '+col+'30;border-radius:8px;padding:3px 16px">'+g.l+'</div>'
    +'</div></div>'
    +'</div>'
    // Right: diagnosis — full height scroll
    +'<div style="display:flex;flex-direction:column;min-height:0;padding:28px 28px 24px;overflow:hidden">'
    +'<div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,.3);font-weight:700;text-transform:uppercase;margin-bottom:16px;flex-shrink:0">Diagnóstico Executivo</div>'
    +'<div class="meet-diag" style="flex:1;overflow-y:auto;min-height:0">'+diagInner+'</div>'
    +'</div>'
    +'</div>';

  setTimeout(function(){
    var svg=document.getElementById(wheelId);
    if(svg)rWheel(res.details,sz,wheelId);
  },60);

  return html;
}

// ── SLIDE 1: KPIs ────────────────────────────────────────────────────
function buildSlide1(res){
  var g=grade(res.score);var col=g.c;
  var parts=S.sel.split('-');var y=parts[0];var mo=parts[1];
  var idx=getKnownMonths().indexOf(S.sel);
  var deltaH='';
  if(idx>0){
    var km=getKnownMonths();var prev=calcScore(km[idx-1]);
    if(prev){
      var d=res.score-prev.score;var dc=d>0?'var(--green)':d<0?'var(--red)':'rgba(255,255,255,.3)';
      var pm=km[idx-1].split('-');
      deltaH='<div class="s1-delta" style="color:'+dc+'">'+(d>0?'▲ +':'▼ ')+d+' vs '+MES[parseInt(pm[1])-1]+'/'+pm[0]+'</div>';
    }
  }
  // Group bars
  var grpBars=['tracao','rentab'].map(function(grp){
    var dts=res.details.filter(function(d){return d.ind.group===grp;});
    var avg=dts.length?Math.round(dts.reduce(function(s,d){return s+d.pct;},0)/dts.length):0;
    var c=GC[grp];
    return '<div class="s1-grp">'
      +'<div class="s1-grp-header">'
      +'<span class="s1-grp-name">'+GN[grp].split(' ')[0]+'</span>'
      +'<span class="s1-grp-val" style="color:'+c+'">'+avg+'</span>'
      +'</div>'
      +'<div class="s1-grp-bar"><div class="s1-grp-fill" style="width:'+avg+'%;background:'+c+'"></div></div>'
      +'</div>';
  }).join('');
  // Assertividade
  var fc=S.forecast&&S.forecast[S.sel];var real=S.raw&&S.raw[S.sel];
  var assertH='';
  if(fc&&real){
    var tot=0,cnt=0;
    FIELDS.forEach(function(fld){
      var fv=fc[fld.id],rv=real[fld.id];
      if(fv==null||rv==null||rv===0)return;
      tot+=Math.max(0,100-Math.abs(fv-rv)/Math.abs(rv)*100);cnt++;
    });
    if(cnt){
      var acc=tot/cnt;var ac=acc>=90?'var(--green)':acc>=70?'var(--amber)':'var(--red)';
      assertH='<div class="s1-assert">'
        +'<div class="s1-assert-num" style="color:'+ac+'">'+acc.toFixed(0)+'%</div>'
        +'<div><div class="s1-assert-lbl">Assertividade Forecast</div>'
        +'<div class="s1-assert-txt" style="color:'+ac+'">'+(acc>=90?'Alta':acc>=70?'Razoável':'Baixa')+'</div></div>'
        +'</div>';
    }
  }
  // KPI cards — calculate grid columns based on count
  var sorted=[].concat(res.details).sort(function(a,b){return a.pct-b.pct;});
  var n=sorted.length; // 12 KPIs (lucroliq excluded from wheel but shown here)
  // Always 3 columns, rows = ceil(n/3)
  var cols=3;var rows=Math.ceil(n/cols);
  // KPI cards — clean, no embedded action inputs
  var sorted=[].concat(res.details).sort(function(a,b){return a.pct-b.pct;});
  var saved_f=(S.meetActions&&S.meetActions[S.sel]&&S.meetActions[S.sel].fechamento)||[];

  var kpiCards=sorted.map(function(d,i){
    var c=d.pct<50?'#ef4444':d.pct<75?'#f59e0b':'#10b981';
    var border=d.pct<80?c+'40':'rgba(255,255,255,.07)';
    return '<div style="background:rgba(255,255,255,.03);border:1px solid '+border+';border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:7px">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">'
      +'<div style="display:flex;align-items:center;gap:7px;min-width:0">'
      +'<span style="font-size:16px">'+d.ind.icon+'</span>'
      +'<span style="font-size:12px;font-weight:700;color:#e8f0ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+d.ind.short+'</span>'
      +'</div>'
      +'<span style="font-size:18px;font-weight:800;font-family:\'Bebas Neue\',sans-serif;color:'+c+';flex-shrink:0">'+Math.round(d.pct)+'%</span>'
      +'</div>'
      +'<div style="height:4px;background:rgba(255,255,255,.08);border-radius:2px">'
      +'<div style="height:100%;width:'+Math.min(100,d.pct)+'%;background:'+c+';border-radius:2px;transition:width .4s"></div>'
      +'</div>'
      +'<div style="font-size:10px;color:rgba(255,255,255,.35)">'+fmtV(d.val,d.ind.unit)+' <span style="color:rgba(255,255,255,.2)">/ meta</span> '+fmtV(d.goal,d.ind.unit)+'</div>'
      +'</div>';
  }).join('');

  // Action rows — only KPIs below 80%, clean table
  var actionRows=sorted.filter(function(d){return d.pct<80;}).map(function(d,i){
    var sa=saved_f[i]||{};
    var c=d.pct<50?'#ef4444':'#f59e0b';
    return '<div style="display:grid;grid-template-columns:180px 1fr 130px 120px;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)">'
      +'<div style="display:flex;align-items:center;gap:6px">'
      +'<span style="font-size:13px">'+d.ind.icon+'</span>'
      +'<span style="font-size:11px;font-weight:700;color:'+c+'">'+d.ind.short+'</span>'
      +'<span style="font-size:10px;color:rgba(255,255,255,.3)">'+Math.round(d.pct)+'%</span>'
      +'</div>'
      +'<input class="kact-inp act-text" data-kpi="'+d.ind.id+'" data-idx="'+i+'" placeholder="Descrever a ação..." value="'+(sa.text||'').replace(/"/g,'&quot;')+'" style="font-size:11px">'
      +'<input class="kact-inp act-resp" data-kpi="'+d.ind.id+'" data-idx="'+i+'" placeholder="Responsável" value="'+(sa.resp||'').replace(/"/g,'&quot;')+'" style="font-size:11px">'
      +'<input type="text" class="kact-inp act-prazo" data-kpi="'+d.ind.id+'" data-idx="'+i+'" placeholder="dd/mm/aaaa" value="'+(sa.prazo||'').replace(/"/g,'&quot;')+'" style="font-size:11px">'
      +'</div>';
  }).join('');

  var actionSection = sorted.some(function(d){return d.pct<80;})
    ? '<div style="flex-shrink:0;border-top:1px solid rgba(255,255,255,.07);padding:16px 0 4px">'
      +'<div style="font-size:9px;letter-spacing:3px;color:var(--amber);font-weight:700;text-transform:uppercase;margin-bottom:10px">⚡ Planos de Ação — KPIs em Atenção</div>'
      +'<div style="font-size:9px;color:rgba(255,255,255,.2);display:grid;grid-template-columns:180px 1fr 130px 120px;gap:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.05);text-transform:uppercase;letter-spacing:1px">'
      +'<span>KPI</span><span>Ação</span><span>Responsável</span><span>Prazo</span>'
      +'</div>'
      +actionRows
      +'</div>'
    : '';

  return '<div class="s1-wrap">'
    // Col A: score + groups
    +'<div class="s1-col-a">'
    +'<div class="s1-score-block">'
    +'<div class="s1-period">'+MES[parseInt(mo)-1]+' '+y+'</div>'
    +'<div class="s1-score-num" style="color:'+col+'">'+res.score+'</div>'
    +'<div class="s1-score-grade" style="color:'+col+';background:'+col+'15;border:1px solid '+col+'30">'+g.l+'</div>'
    +deltaH
    +'</div>'
    +'<div class="s1-groups">'+grpBars+'</div>'
    +assertH
    +'</div>'
    // Col B: KPI grid + action section
    +'<div class="s1-col-b" style="display:flex;flex-direction:column;min-height:0;overflow:hidden">'
    +'<div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,.3);font-weight:700;text-transform:uppercase;margin-bottom:12px;flex-shrink:0">Resultados — KPIs</div>'
    +'<div style="flex:1;overflow-y:auto;min-height:0;display:flex;flex-direction:column;gap:0">'
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex-shrink:0">'+kpiCards+'</div>'
    +actionSection
    +'</div>'
    +'</div>'
    +'</div>';
}

function initSlide1Actions(slideEl){
  // Populate actAdicBody
  var tbody=slideEl.querySelector('#actAdicBody');if(!tbody)return;
  var sa=(S.meetActions&&S.meetActions[S.sel]&&S.meetActions[S.sel].adicionais)||[];
  var rows=sa.length?sa:[{text:'',resp:'',prazo:''}];
  rows.forEach(function(a){
    var tr=document.createElement('tr');
    function mkI(cls,ph,val){var i=document.createElement('input');i.type='text';i.className='m-ai '+cls;i.placeholder=ph;i.value=val||'';return i;}
    var td1=document.createElement('td');td1.appendChild(mkI('act-text','Descreva...',a.text));
    var td2=document.createElement('td');td2.appendChild(mkI('act-resp','Nome',a.resp));
    var td3=document.createElement('td');var pi=mkI('act-prazo','dd/mm/aaaa',a.prazo);maskPrazo(pi);td3.appendChild(pi);
    var td4=document.createElement('td');var btn=document.createElement('button');
    btn.className='m-del';btn.textContent='✕';btn.onclick=function(){this.closest('tr').remove();};
    td4.appendChild(btn);
    tr.append(td1,td2,td3,td4);tbody.appendChild(tr);
  });
  slideEl.querySelectorAll('.act-prazo').forEach(maskPrazo);
}


function buildSlide2(res){
  var parts=S.sel.split('-');var y=parts[0];var mo=parts[1];
  var mesLabel=MES[parseInt(mo)-1]+' '+y;
  var fc=S.forecast&&S.forecast[S.sel];
  var real=S.raw&&S.raw[S.sel];
  var moN=parseInt(mo),yrN=parseInt(y);
  var nextMk=moN===12?(yrN+1)+'-01':yrN+'-'+String(moN+1).padStart(2,'0');
  var nm=nextMk.split('-');
  var nextLabel=MES[parseInt(nm[1])-1]+'/'+nm[0];

  // ── Left: forecast vs real ────────────────────────────────────────
  var fcastHTML='';
  if(fc&&real){
    var hdr='<div style="display:grid;grid-template-columns:1fr 72px 72px 40px;gap:6px;padding:0 0 6px;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0">'
      +'<div style="font-size:8px;color:rgba(255,255,255,.25);font-weight:700;letter-spacing:1.5px;text-transform:uppercase">CAMPO</div>'
      +'<div style="font-size:8px;color:#818cf8;font-weight:700;text-align:right;letter-spacing:1px">PREV</div>'
      +'<div style="font-size:8px;color:#34d399;font-weight:700;text-align:right;letter-spacing:1px">REAL</div>'
      +'<div style="font-size:8px;color:rgba(255,255,255,.25);font-weight:700;text-align:right">ACUR</div>'
      +'</div>';
    var rows='';
    FIELDS.forEach(function(fld){
      var fv=fc[fld.id],rv=real[fld.id];
      if(fv==null&&rv==null)return;
      var acc='—',ac='rgba(255,255,255,.25)';
      if(fv!=null&&rv!=null&&rv!==0){var a=Math.max(0,100-Math.abs(fv-rv)/Math.abs(rv)*100);acc=a.toFixed(0)+'%';ac=a>=90?'#34d399':a>=70?'#f59e0b':'#ef4444';}
      rows+='<div class="s2-fcast-row">'
        +'<div class="s2-fcast-label">'+fld.label+'</div>'
        +'<div class="s2-fcast-val">'+(fv!=null?fv.toLocaleString('pt-BR'):'—')+'</div>'
        +'<div class="s2-fcast-real">'+(rv!=null?rv.toLocaleString('pt-BR'):'—')+'</div>'
        +'<div class="s2-fcast-acc" style="color:'+ac+'">'+acc+'</div>'
        +'</div>';
    });
    fcastHTML=hdr+'<div class="s2-fcast-table">'+rows+'</div>';
  } else {
    fcastHTML='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;opacity:.5">'
      +'<div style="font-size:36px">🔮</div>'
      +'<div style="font-size:14px;font-weight:700;color:#e8f0ff">Sem forecast para '+mesLabel+'</div>'
      +'<div style="font-size:11px;color:rgba(255,255,255,.4);text-align:center">Lance uma previsão em Lançamento → Previsão</div>'
      +'</div>';
  }

  // ── Right: next month projection ─────────────────────────────────
  var nextFc=S.forecast&&S.forecast[nextMk];
  var rightHTML='';
  var nextScore=null,ng=null,ndiff=null;
  if(nextFc){
    var simR=Object.assign({},real||{},nextFc);
    var simKpis=calcKPIs(simR);
    var tw=IND.reduce(function(s,i){return s+((S.cfg[i.id]&&S.cfg[i.id].weight)||1);},0);
    var ws=IND.reduce(function(s,ind){
      var v=simKpis[ind.id];var goal=getGoal(ind.id,nextMk);
      var hb=S.cfg[ind.id]?S.cfg[ind.id].hb:ind.hb;
      var pct=0;
      if(v!==null&&goal){pct=hb?Math.min((v/goal)*100,150):(goal===0?100:Math.min((goal/Math.max(v,.001))*100,150));pct=Math.max(0,Math.min(100,pct));}
      return s+pct*((S.cfg[ind.id]&&S.cfg[ind.id].weight)||1);
    },0);
    nextScore=tw>0?Math.round(ws/tw):0;ng=grade(nextScore);ndiff=nextScore-res.score;
    var dc=ndiff>0?'var(--green)':ndiff<0?'var(--red)':'rgba(255,255,255,.4)';
    var kpiRows=IND.filter(function(i){return nextFc[i.id]!=null||simKpis[i.id]!=null;}).map(function(ind){
      var v=simKpis[ind.id];var goal=getGoal(ind.id,nextMk);var hb=S.cfg[ind.id]?S.cfg[ind.id].hb:ind.hb;
      var pct=0;if(v!=null&&goal){pct=hb?Math.min((v/goal)*100,150):(goal===0?100:Math.min((goal/Math.max(v,.001))*100,150));pct=Math.max(0,Math.min(100,pct));}
      var c=pct<50?'#ef4444':pct<75?'#f59e0b':'#34d399';
      return '<div class="s2-kpi-row"><span class="s2-kpi-label">'+ind.icon+' '+ind.short+'</span>'
        +'<span class="s2-kpi-val" style="color:'+c+'">'+Math.round(pct)+'%</span></div>';
    }).join('');
    rightHTML='<div class="s2-score-block" style="border-color:'+(ng?ng.c:'rgba(255,255,255,.1)')+'22">'
      +'<div class="s2-score-num" style="color:'+(ng?ng.c:'rgba(255,255,255,.4)')+'">'+nextScore+'</div>'
      +'<div><div class="s2-score-period">Score Projetado</div>'
      +'<div class="s2-score-grade" style="color:'+(ng?ng.c:'')+'">'+( ng?ng.l:'')+'</div>'
      +'<div class="s2-score-delta" style="color:'+dc+'">'+(ndiff>0?'▲ +':'▼ ')+ndiff+' pts vs '+mesLabel+'</div>'
      +'</div></div>'
      +'<div class="s2-kpi-list">'+kpiRows+'</div>';
  } else {
    rightHTML='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;opacity:.5">'
      +'<div style="font-size:36px">📈</div>'
      +'<div style="font-size:14px;font-weight:700;color:#e8f0ff">Sem previsão para '+nextLabel+'</div>'
      +'<div style="font-size:11px;color:rgba(255,255,255,.4);text-align:center">Lance em Lançamento → Previsão</div>'
      +'</div>';
  }

  // Saved actions
  var acts_fc=(S.meetActions&&S.meetActions[S.sel]&&S.meetActions[S.sel].forecast)||[];
  var actRows='';
  var dfl=acts_fc.length?acts_fc:[{text:'',resp:'',prazo:''}];
  dfl.forEach(function(a){
    actRows+='<tr data-type="forecast">'
      +'<td><input class="m-ai act-text" data-type="forecast" placeholder="Ação..." value="'+(a.text||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><input class="m-ai act-resp" data-type="forecast" placeholder="Nome" value="'+(a.resp||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><input type="text" class="m-ai act-prazo" data-type="forecast" placeholder="dd/mm/aaaa" value="'+(a.prazo||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><button class="m-del" onclick="this.closest(&quot;tr&quot;).remove()">✕</button></td>'
      +'</tr>';
  });

  return '<div class="s2-wrap">'
    +'<div class="s2-col">'
    +'<div class="s2-col-title">🔮 Forecast vs Realizado — '+mesLabel+'<span></span></div>'
    +'<div style="flex:1;display:flex;flex-direction:column;min-height:0;gap:8px">'+fcastHTML+'</div>'
    +'</div>'
    +'<div class="s2-col">'
    +'<div class="s2-col-title">📈 Projeção — '+nextLabel+'<span></span></div>'
    +'<div style="flex:1;display:flex;flex-direction:column;min-height:0;gap:10px">'+rightHTML+'</div>'
    +'<div style="flex-shrink:0;margin-top:8px">'
    +'<div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.25);font-weight:700;margin-bottom:5px">Plano de Ação — '+nextLabel+'</div>'
    +'<table class="m-act-tbl"><thead><tr><th>Ação</th><th>Resp.</th><th>Prazo</th><th></th></tr></thead>'
    +'<tbody id="actFcBody">'+actRows+'</tbody></table>'
    +'<button class="m-add-row" onclick="addActRow(&quot;forecast&quot;)">+ Adicionar</button>'
    +'</div>'
    +'</div>'
    +'</div>';
}


// ── SLIDE 3: PLANOS DE AÇÃO ──────────────────────────────────────────
function buildSlide3(res){
  var parts=S.sel.split('-');var y=parts[0];var mo=parts[1];
  var mesLabel=MES[parseInt(mo)-1]+' '+y;
  var moN=parseInt(mo),yrN=parseInt(y);
  var nextMk=moN===12?(yrN+1)+'-01':yrN+'-'+String(moN+1).padStart(2,'0');
  var nm=nextMk.split('-');
  var nextLabel=MES[parseInt(nm[1])-1]+'/'+nm[0];

  // Saved actions from previous save
  var saved=(S.meetActions&&S.meetActions[S.sel])||{};
  var fech_acts=saved.fechamento||[];
  var adic_acts=saved.adicionais||[];
  var fc_acts=saved.forecast||[];

  // Build KPI actions table (from current fechamento)
  var kpiRows='';
  var kpiActsDefined=fech_acts.filter(function(a){return a.text||a.resp||a.prazo;});
  if(kpiActsDefined.length){
    kpiActsDefined.forEach(function(a,i){
      var kpiLabel=a.kpi?'<span style="font-size:9px;background:rgba(0,240,200,.1);border:1px solid rgba(0,240,200,.2);border-radius:4px;padding:1px 6px;color:var(--teal)">'+a.kpi+'</span>':'';
      kpiRows+='<tr><td>'+kpiLabel+' '+(a.text||'—')+'</td>'
        +'<td style="white-space:nowrap">'+(a.resp||'—')+'</td>'
        +'<td style="white-space:nowrap;font-family:JetBrains Mono,monospace">'+(a.prazo||'—')+'</td>'
        +'<td><input class="kact-inp act-text" data-type="fech" placeholder="Editar..." value="'+(a.text||'').replace(/"/g,'&quot;')+'" style="min-width:120px">'
        +'</td></tr>';
    });
  }

  // Ações adicionais table
  var adicDfl=adic_acts.length?adic_acts:[{text:'',resp:'',prazo:''}];
  var adicRows=adicDfl.map(function(a){
    return '<tr data-type="adic">'
      +'<td><input class="m-ai act-text" data-type="adic" placeholder="Descreva a ação..." value="'+(a.text||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><input class="m-ai act-resp" data-type="adic" placeholder="Responsável" value="'+(a.resp||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><input class="m-ai act-prazo" data-type="adic" placeholder="dd/mm/aaaa" value="'+(a.prazo||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><button class="m-del" onclick="this.closest(&quot;tr&quot;).remove()">✕</button></td>'
      +'</tr>';
  }).join('');

  // Próximo mês actions
  var fcDfl=fc_acts.length?fc_acts:[{text:'',resp:'',prazo:''}];
  var fcRows=fcDfl.map(function(a){
    return '<tr data-type="forecast">'
      +'<td><input class="m-ai act-text" data-type="forecast" placeholder="Meta ou ação para o mês..." value="'+(a.text||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><input class="m-ai act-resp" data-type="forecast" placeholder="Responsável" value="'+(a.resp||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><input class="m-ai act-prazo" data-type="forecast" placeholder="dd/mm/aaaa" value="'+(a.prazo||'').replace(/"/g,'&quot;')+'"></td>'
      +'<td><button class="m-del" onclick="this.closest(&quot;tr&quot;).remove()">✕</button></td>'
      +'</tr>';
  }).join('');

  return '<div class="s3-wrap">'
    // Header row
    +'<div class="s3-header">'
    +'<div class="s3-header-left">'
    +'<div class="s3-tag">📋 PLANOS DE AÇÃO</div>'
    +'<div class="s3-company">'+(S.company||'Empresa')+'</div>'
    +'<div class="s3-period">'+mesLabel+'</div>'
    +'</div>'
    +'<div class="s3-header-right">'
    +'<div style="text-align:center">'
    +'<div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:4px">Score Atual</div>'
    +'<div style="font-family:Bebas Neue,sans-serif;font-size:48px;line-height:1;color:'+grade(res.score).c+'">'+res.score+'</div>'
    +'<div style="font-size:11px;font-weight:700;color:'+grade(res.score).c+'">'+grade(res.score).l+'</div>'
    +'</div>'
    +'</div>'
    +'</div>'
    // Three columns
    +'<div class="s3-body">'
    // Col 1: KPI actions (from slide 1)
    +'<div class="s3-col">'
    +'<div class="s3-col-title"><span>⚡</span> Ações por KPI — '+mesLabel+'</div>'
    +(kpiActsDefined.length
      ? '<table class="m-act-tbl"><thead><tr><th>KPI / Ação</th><th>Resp.</th><th>Prazo</th><th>Edit.</th></tr></thead><tbody>'+kpiRows+'</tbody></table>'
      : '<div class="s3-empty">Nenhuma ação definida nos KPIs.<br>Volte ao slide de KPIs e adicione ações nos cards com baixa performance.</div>'
    )
    +'</div>'
    // Col 2: Ações adicionais
    +'<div class="s3-col">'
    +'<div class="s3-col-title"><span>📌</span> Ações Adicionais</div>'
    +'<table class="m-act-tbl"><thead><tr><th>Ação</th><th>Resp.</th><th>Prazo</th><th></th></tr></thead>'
    +'<tbody id="actAdicBody">'+adicRows+'</tbody></table>'
    +'<button class="m-add-row" onclick="addAdicRow()">+ Adicionar</button>'
    +'</div>'
    // Col 3: Próximo mês
    +'<div class="s3-col">'
    +'<div class="s3-col-title"><span>🎯</span> Metas — '+nextLabel+'</div>'
    +'<table class="m-act-tbl"><thead><tr><th>Meta / Ação</th><th>Resp.</th><th>Prazo</th><th></th></tr></thead>'
    +'<tbody id="actFcBody">'+fcRows+'</tbody></table>'
    +'<button class="m-add-row" onclick="addActRow(&quot;forecast&quot;)">+ Adicionar</button>'
    +'</div>'
    +'</div>'
    +'</div>';
}

function initSlide3Actions(slideEl){
  slideEl.querySelectorAll('.act-prazo').forEach(maskPrazo);
}


function exportMeetingPDF(){
  saveMeetActions();
  const res=S.sel?calcScore(S.sel):null;if(!res){toast('⚠️ Sem dados para exportar');return;}
  const[y,mo]=S.sel.split('-');
  const mesLabel=MES[parseInt(mo)-1]+'/'+y;
  const moN=parseInt(mo),yrN=parseInt(y);
  const nextMk=moN===12?`${yrN+1}-01`:`${yrN}-${String(moN+1).padStart(2,'0')}`;
  const[nY,nMo]=nextMk.split('-');
  const nextLabel=MES[parseInt(nMo)-1]+'/'+nY;
  const today=new Date().toLocaleDateString('pt-BR');
  const g=grade(res.score);
  const gc=g.c.replace('var(--green)','#059669').replace('var(--teal)','#0284c7').replace('var(--amber)','#d97706').replace('var(--red)','#dc2626');
  const acts_f=(S.meetActions?.[S.sel]?.fechamento)||[];
  const acts_fc=(S.meetActions?.[S.sel]?.forecast)||[];
  const acts_f_clean=acts_f.filter(a=>a.text||a.resp);
  const acts_fc_clean=acts_fc.filter(a=>a.text||a.resp);
  const fc=S.forecast&&S.forecast[S.sel],real=S.raw&&S.raw[S.sel];
  const nextFc=S.forecast&&S.forecast[nextMk];
  const sorted=[...res.details].sort((a,b)=>a.pct-b.pct);

  const fcastRows=fc&&real?FCAST_FIELDS.map(fld=>{
    const fv=fc[fld.id],rv=real[fld.id];
    const fd=FCAST_FIELDS.find(f=>f.id===fld.id)||FIELDS.find(f=>f.id===fld.id);
    let acc='—';if(fv!=null&&rv!=null&&rv!==0){acc=Math.max(0,100-Math.abs(fv-rv)/Math.abs(rv)*100).toFixed(0)+'%';}
    return`<tr><td>${fd?.label||fld.id}</td><td style="color:#6366f1;font-weight:600">${fv!=null?fmtV(fv,fld.unit):'—'}</td><td style="color:#0369a1;font-weight:600">${rv!=null?fmtV(rv,fld.unit):'—'}</td><td>${acc}</td></tr>`;
  }).join(''):null;

  let nextKpiRows='',nextScore=null,nextGradeLabel='',nextGradeColor='#64748b';
  if(nextFc){
    const baseR=real||{};const simR={...baseR,...nextFc};
    const simKpis=calcKPIs(simR);
    const nextDets=IND.map(ind=>{const v=simKpis[ind.id];const goal=getGoal(ind.id,nextMk);const hb=S.cfg[ind.id]?.hb??ind.hb;
      let pct=0;if(v!==null&&goal){pct=hb?Math.min((v/goal)*100,150):(goal===0?100:Math.min((goal/Math.max(v,.001))*100,150));pct=Math.max(0,Math.min(100,pct));}
      return{ind,val:v,pct,goal};});
    const tw=IND.reduce((s,i)=>s+(S.cfg[i.id]?.weight||1),0);
    const ws=nextDets.reduce((s,d)=>s+d.pct*(S.cfg[d.ind.id]?.weight||1),0);
    nextScore=tw>0?Math.round(ws/tw):0;
    const ng=grade(nextScore);nextGradeLabel=ng.l;
    nextGradeColor=ng.c.replace('var(--green)','#059669').replace('var(--teal)','#0284c7').replace('var(--amber)','#d97706').replace('var(--red)','#dc2626');
    nextKpiRows=[...nextDets].sort((a,b)=>a.pct-b.pct).map(d=>{
      const cls=d.pct<50?'bad':d.pct<75?'warn':'ok';
      const curDet=res.details.find(x=>x.ind.id===d.ind.id);
      const diff=curDet?Math.round(d.pct-curDet.pct):null;
      return`<tr><td>${d.ind.icon} ${d.ind.name}</td><td>${fmtV(d.val,d.ind.unit)}</td><td>${fmtV(d.goal,d.ind.unit)}</td><td class="${cls}">${Math.round(d.pct)}%</td><td class="${diff!==null&&diff>=0?'ok':'bad'}">${diff!==null?(diff>=0?'▲ +':'▼ ')+diff+'%':'—'}</td></tr>`;
    }).join('');
  }

  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
body{font-family:Arial,sans-serif;color:#1e293b;padding:32px;font-size:13px;line-height:1.5}
h1{font-size:20px;color:#0f172a;border-bottom:3px solid #0ea5e9;padding-bottom:8px;margin-bottom:6px}
.meta{color:#64748b;font-size:12px;margin-bottom:22px;padding:8px 14px;background:#f8fafc;border-radius:8px;display:flex;gap:20px;flex-wrap:wrap;border:1px solid #e2e8f0}
.meta strong{color:#1e293b}
h2{font-size:14px;color:#1e3a5f;margin:22px 0 10px;padding:8px 12px;background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:0 6px 6px 0}
.score-box{display:inline-flex;align-items:center;gap:18px;background:#f8fafc;border:2px solid #e2e8f0;border-radius:14px;padding:14px 24px;margin:8px 0 16px}
.score-num{font-size:54px;font-weight:900;color:${gc};line-height:1}
.score-lbl{font-size:15px;font-weight:700;color:${gc};padding:5px 16px;background:${gc}18;border-radius:10px;border:1px solid ${gc}44}
.score-period{font-size:10px;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;font-weight:700}
table{width:100%;border-collapse:collapse;margin:8px 0}
th{background:#f1f5f9;color:#475569;padding:8px 10px;text-align:left;font-size:11px;letter-spacing:.5px;text-transform:uppercase;border-bottom:2px solid #e2e8f0}
td{padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:12px}
.ok{color:#059669;font-weight:700}.warn{color:#d97706;font-weight:700}.bad{color:#dc2626;font-weight:700}
.act-tbl td:first-child{width:42%;font-weight:500}
.section-sep{border:none;border-top:1px solid #e2e8f0;margin:18px 0}
.footer{font-size:10px;color:#94a3b8;text-align:center;margin-top:32px;padding-top:10px;border-top:1px solid #e2e8f0}
.next-score{display:inline-flex;align-items:center;gap:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px 20px;margin-bottom:14px}
@media print{body{padding:16px}}
</style></head><body>

<h1>Ata de Reunião — ${S.company||'Empresa'}</h1>
<div class="meta">
  <span>📅 Reunião: <strong>${today}</strong></span>
  <span>📊 Fechamento: <strong>${mesLabel}</strong></span>
  <span>🔮 Projeção: <strong>${nextLabel}</strong></span>
  ${S.sector?`<span>🏢 Setor: <strong>${S.sector}</strong></span>`:''}
</div>

<h2>1. Resultados Fechados — ${mesLabel}</h2>
<div class="score-box">
  <div><div class="score-period">Score de Saúde</div><div class="score-num">${res.score}</div></div>
  <div class="score-lbl">${g.l}</div>
</div>
<table><thead><tr><th>KPI</th><th>Valor</th><th>Meta</th><th>% da Meta</th><th>Status</th></tr></thead><tbody>
${sorted.map(d=>{const cls=d.pct<50?'bad':d.pct<75?'warn':'ok';return`<tr><td>${d.ind.icon} ${d.ind.name}</td><td>${fmtV(d.val,d.ind.unit)}</td><td>${fmtV(d.goal,d.ind.unit)}</td><td class="${cls}">${Math.round(d.pct)}%</td><td class="${cls}">${d.pct>=80?'✓ Atingida':d.pct>=60?'⚠ Próximo':'✗ Abaixo'}</td></tr>`}).join('')}
</tbody></table>

<hr class="section-sep">
<h2>2. Plano de Ação — ${mesLabel}</h2>
<table class="act-tbl"><thead><tr><th>Ação</th><th>KPI</th><th>Responsável</th><th>Prazo</th></tr></thead><tbody>
${acts_f_clean.length?acts_f_clean.map(a=>`<tr><td>${a.text||'—'}</td><td>${a.kpi?IND.find(i=>i.id===a.kpi)?.short||'':''}</td><td>${a.resp||'—'}</td><td>${a.prazo||'—'}</td></tr>`).join(''):
  '<tr><td colspan="4" style="color:#94a3b8;font-style:italic">Nenhuma ação registrada</td></tr>'}
</tbody></table>

${fcastRows?`<hr class="section-sep">
<h2>3. Assertividade Forecast — ${mesLabel}</h2>
<table><thead><tr><th>Campo</th><th style="color:#6366f1">Previsto</th><th style="color:#0369a1">Realizado</th><th>Assertividade</th></tr></thead><tbody>
${fcastRows}
</tbody></table>`:''}

<hr class="section-sep">
<h2>${fcastRows?'4':'3'}. Projeção — ${nextLabel}</h2>
${nextScore!==null?`<div class="next-score">
  <div><div class="score-period">Score Projetado</div>
  <div style="font-size:46px;font-weight:900;color:${nextGradeColor};line-height:1">${nextScore}</div></div>
  <div style="font-size:14px;font-weight:700;color:${nextGradeColor};padding:4px 14px;background:${nextGradeColor}18;border-radius:8px;border:1px solid ${nextGradeColor}44">${nextGradeLabel}</div>
  <div style="font-size:14px;font-weight:700;color:${(nextScore-res.score)>=0?'#059669':'#dc2626'}">${(nextScore-res.score)>=0?'▲ +':'▼ '}${nextScore-res.score} pts vs ${mesLabel}</div>
</div>
<table><thead><tr><th>KPI</th><th>Valor Proj.</th><th>Meta</th><th>% Meta</th><th>vs ${mesLabel}</th></tr></thead><tbody>
${nextKpiRows}
</tbody></table>
<hr class="section-sep">
<h2>${fcastRows?'5':'4'}. Plano de Ação — ${nextLabel}</h2>
<table class="act-tbl"><thead><tr><th>Ação</th><th>KPI</th><th>Responsável</th><th>Prazo</th></tr></thead><tbody>
${acts_fc_clean.length?acts_fc_clean.map(a=>`<tr><td>${a.text||'—'}</td><td>${a.kpi?IND.find(i=>i.id===a.kpi)?.short||'':''}</td><td>${a.resp||'—'}</td><td>${a.prazo||'—'}</td></tr>`).join(''):
  '<tr><td colspan="4" style="color:#94a3b8;font-style:italic">Nenhuma ação registrada</td></tr>'}
</tbody></table>`
:`<div style="color:#94a3b8;font-style:italic;padding:12px 0">Sem previsão lançada para ${nextLabel}. Use Lançamento → Previsão.</div>`}

<div class="footer">Vital Diagnostic &nbsp;·&nbsp; ${S.company||'Empresa'} &nbsp;·&nbsp; Reunião em ${today} &nbsp;·&nbsp; Fechamento ${mesLabel}</div>
</body></html>`;

  const win=window.open('','_blank');win.document.write(html);win.document.close();
  setTimeout(()=>{win.print();},500);
}
// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
// Auth functions
function doLogin(){
  const email=document.getElementById('liEmail').value.trim();
  const pass=document.getElementById('liPass').value;
  const btn=document.getElementById('liBtn');
  const msg=document.getElementById('loginMsg');
  if(!email||!pass){msg.textContent='Preencha e-mail e senha.';return;}
  btn.disabled=true;btn.textContent='Entrando...';msg.textContent='';
  auth.signInWithEmailAndPassword(email,pass)
    .catch(e=>{
      const errs={'auth/user-not-found':'Usuário não encontrado.','auth/wrong-password':'Senha incorreta.','auth/invalid-email':'E-mail inválido.','auth/invalid-credential':'E-mail ou senha incorretos.'};
      msg.textContent=errs[e.code]||'Erro: '+e.message;
      btn.disabled=false;btn.textContent='Entrar';
    });
}
// ═══════════════════════════════════════════
// CONSELHEIRO IA
// ═══════════════════════════════════════════

const ADVISORS = {
  analytics: {
    id: 'analytics',
    icon: '📊',
    name: 'O Analítico',
    tagline: 'Se não tem número, não tem conversa.',
    color: '#3b82f6',
    desc: 'CFO de dados. Diagnóstico preciso, linguagem direta, zero achismo.',
    personality: `Você é O Analítico — um CFO com 25 anos de experiência em grandes empresas brasileiras. 
Formação em contabilidade e finanças. Fala curto e certeiro. Cada afirmação que você faz tem um número por trás.
Não tolera achismo. Se o dado não existe, você diz que não existe.
Quando a situação é ruim, você diz que é ruim — sem rodeios e sem suavizar.
Tom: direto, objetivo, confiante. Sem floreios.`,
    responseFormat: `ESTRUTURA OBRIGATÓRIA DA SUA RESPOSTA:

[Nome do usuário], [uma frase direta sobre o que os números mostram — máx 2 linhas]

**SITUAÇÃO:**
• [dado real com número exato]
• [dado real com número exato]
• [comparação com histórico ou benchmark de mercado se relevante]

**CONCLUSÃO:** [1-2 frases no máximo. Resposta direta à pergunta.]

**PLANO DE AÇÃO:**
1. [ação específica, mensurável, com prazo]
2. [ação específica, mensurável, com prazo]
3. [ação específica, mensurável, com prazo]

[Nome], concorda com este plano?`
  },
  growth: {
    id: 'growth',
    icon: '🚀',
    name: 'O Growth',
    tagline: 'Crescimento sustentável é o único que importa.',
    color: '#10d4a8',
    desc: 'Pensa em alavancagem e oportunidades. Celebra o que funciona, aponta o que trava.',
    personality: `Você é O Growth — ex-consultor de estratégia que foi CPO de startup de alto crescimento.
Você pensa primeiro em alavancagem, receita e oportunidades de expansão.
É entusiasta mas brutalmente honesto: celebra o que funciona e aponta com clareza o que está travando o crescimento.
Usa analogias de mercado e benchmarks de setor para contextualizar.
Você vê os números como indicadores de onde a empresa pode ir, não só de onde está.
Tom: energético, analítico, otimista com base em dados — mas sem ilusões.`,
    responseFormat: `ESTRUTURA OBRIGATÓRIA DA SUA RESPOSTA:

[Nome do usuário], [abertura que conecta a pergunta com o momento atual da empresa — 1-2 linhas]

**O QUE OS NÚMEROS DIZEM:**
• [insight de crescimento ou trava com dado exato]
• [comparação com histórico próprio — tendência]
• [referência de mercado ou benchmark do setor]

**OPORTUNIDADE / RISCO:**
[parágrafo curto — o que você pode ganhar atuando aqui, ou o que pode perder ignorando]

**PLANO DE AÇÃO:**
1. [ação com prazo sugerido e resultado esperado]
2. [ação com prazo sugerido e resultado esperado]
3. [ação com prazo sugerido e resultado esperado]

[Nome do usuário], este é o caminho que eu seguiria. Concorda com este plano?`
  },
  strategist: {
    id: 'strategist',
    icon: '🎯',
    name: 'O Estrategista',
    tagline: 'Tática sem estratégia é só desperdício bem executado.',
    color: '#a855f7',
    desc: 'Visão de longo prazo. Conecta os números de hoje com onde a empresa precisa chegar.',
    personality: `Você é O Estrategista — consultor sênior de board com passagem por empresas de médio e grande porte.
Você pensa em posicionamento, decisões estruturais e movimentos de 12-24 meses.
É mais didático: explica o raciocínio por trás das suas recomendações.
Quando necessário, faz perguntas de volta para entender melhor o contexto antes de opinar.
Conecta sempre o operacional (os KPIs do dia a dia) com o estratégico (para onde a empresa deve ir).
Tom: reflexivo, experiente, direto quando tem convicção, cauteloso quando os dados são insuficientes.`,
    responseFormat: `ESTRUTURA OBRIGATÓRIA DA SUA RESPOSTA:

[Nome do usuário], [frase de enquadramento estratégico — o contexto maior em que essa pergunta se insere]

**ANÁLISE ESTRATÉGICA:**
• [ponto estratégico ancorado em dado real]
• [ponto estratégico ancorado em dado real]  
• [tendência de mercado ou benchmark relevante]

**O QUE ISSO SIGNIFICA PARA [empresa]:**
[parágrafo — conecta os dados com a decisão de médio/longo prazo. Explica o raciocínio.]

**PLANO DE AÇÃO:**
1. [ação estratégica — o quê + por quê + prazo]
2. [ação estratégica — o quê + por quê + prazo]
3. [ação estratégica — o quê + por quê + prazo]

[Nome do usuário], esta é minha leitura. Concorda com este plano?`
  }
};

const ADVISOR_SUGGESTIONS = [
  'Posso contratar mais funcionários agora?',
  'Faz sentido subir o meu preço?',
  'Onde estou perdendo mais dinheiro?',
  'Estou pronto para buscar crédito?',
  'O que eu precisaria mudar para dobrar o lucro?',
  'Qual KPI devo atacar primeiro?',
  'Minha estrutura de custos está adequada para o meu setor?',
  'Como está minha tendência nos últimos meses?',
];

function _buildAdvisorContext() {
  const userName = S.userName || 'você';
  const empresa = S.company || 'a empresa';
  const setor = S.sector || 'não informado';

  // ── Situação atual ────────────────────────────────────────────────
  const knownMonths = getKnownMonths().filter(m => S.raw && S.raw[m] && Object.keys(S.raw[m]).length > 0);
  const latestMk = knownMonths[knownMonths.length - 1];
  let situacaoAtual = '';
  let historicoTxt = '';

  if (latestMk) {
    const [y, mo] = latestMk.split('-');
    const label = MES[parseInt(mo)-1] + '/' + y;
    const res = calcScore(latestMk);
    if (res) {
      const g = grade(res.score);
      situacaoAtual = `Período mais recente: ${label} — Score ${res.score}/100 (${g.l})\n`;
      situacaoAtual += `KPIs (use como base principal da análise):\n`;
      res.details.forEach(d => {
        const gap = d.ind.unit === '%'
          ? `gap: ${(d.val - d.goal).toFixed(1)}pp`
          : `gap: ${((d.val - d.goal)/d.goal*100).toFixed(1)}%`;
        situacaoAtual += `  • ${d.ind.name}: ${fmtV(d.val, d.ind.unit)} (meta ${fmtV(d.goal, d.ind.unit)}, ${Math.round(d.pct)}% da meta, ${gap})\n`;
      });
    }
  } else {
    situacaoAtual = 'Nenhum período com dados importados ainda.';
  }

  // ── Histórico completo ────────────────────────────────────────────
  if (knownMonths.length > 1) {
    historicoTxt = '\nHISTÓRICO COMPLETO (todos os meses — use para identificar tendências):\n';
    knownMonths.slice(0, -1).reverse().forEach(mk => {
      const [y, mo] = mk.split('-');
      const label = MES[parseInt(mo)-1] + '/' + y;
      const res = calcScore(mk);
      if (res) {
        const g = grade(res.score);
        historicoTxt += `  ${label}: Score ${res.score} (${g.l})`;
        // Key KPIs summary
        const ll = res.details.find(d => d.ind.id === 'lucroliq');
        const rec = res.details.find(d => d.ind.id === 'receita');
        const ebitda = res.details.find(d => d.ind.id === 'ebitda');
        if (ll) historicoTxt += ` | LL: ${ll.val?.toFixed(1)}%`;
        if (ebitda) historicoTxt += ` | EBITDA: ${ebitda.val?.toFixed(1)}%`;
        if (rec) historicoTxt += ` | Receita: ${fmtV(rec.val, 'R$')}`;
        historicoTxt += '\n';
      }
    });
  }

  // ── Planos de ação em aberto ──────────────────────────────────────
  const openActions = (S.actions || []).filter(a => a.status === 'open');
  const actionsTxt = openActions.length
    ? `\nPLANOS DE AÇÃO EM ABERTO (${openActions.length}):\n` +
      openActions.slice(0, 5).map(a => `  • [${a.kpi}] ${a.text}${a.resp ? ' — Resp: ' + a.resp : ''}`).join('\n')
    : '';

  return `DADOS DA EMPRESA (use sempre — nunca dê conselho genérico):
Empresa: ${empresa}
Setor: ${setor}
Usuário: ${userName}

SITUAÇÃO ATUAL:
${situacaoAtual}${historicoTxt}${actionsTxt}

INSTRUÇÕES CRÍTICAS:
1. Chame o usuário pelo nome "${userName}" — obrigatoriamente na abertura e no fechamento
2. NUNCA dê conselho sem ancorar nos números acima
3. Se os dados forem insuficientes, diga e peça o que falta
4. Se a situação for ruim, diga — sem suavizar
5. Toda resposta termina com um plano de ação numerado
6. Use web search para buscar benchmarks de mercado quando a pergunta exigir contexto externo
7. O período mais recente é a realidade de hoje — pese mais. O histórico serve para tendências.`;
}

function rAdvisorPage() {
  _renderAdvisorCards('advisorCards', false);
  _renderAdvisorSuggestions();
  _renderAdvisorHistory();
}

function _renderAdvisorCards(containerId, isConfig) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Object.values(ADVISORS).map(a => {
    const isSelected = S.advisor === a.id;
    const border = isSelected ? `2px solid ${a.color}` : '1px solid var(--bdr)';
    const bg = isSelected ? `background:${a.color}12` : 'background:var(--glass)';
    return `<div onclick="${isConfig ? 'cfgSetAdvisor' : 'advisorSelect'}('${a.id}')"
      id="${isConfig ? 'cfg' : ''}advisor-card-${a.id}"
      style="cursor:pointer;border-radius:14px;padding:16px;${bg};border:${border};transition:all .2s;position:relative">
      ${isSelected ? `<div style="position:absolute;top:10px;right:10px;width:8px;height:8px;border-radius:50%;background:${a.color}"></div>` : ''}
      <div style="font-size:28px;margin-bottom:8px">${a.icon}</div>
      <div style="font-size:13px;font-weight:700;color:#e8f0ff;margin-bottom:4px">${a.name}</div>
      <div style="font-size:10px;color:${a.color};font-style:italic;margin-bottom:8px">"${a.tagline}"</div>
      <div style="font-size:11px;color:var(--mut);line-height:1.6">${a.desc}</div>
      ${isConfig ? '' : `<div style="margin-top:10px;font-size:10px;color:${isSelected?a.color:'var(--mut)'};font-weight:${isSelected?'700':'400'}">${isSelected?'✓ Selecionado':'Clique para selecionar'}</div>`}
    </div>`;
  }).join('');
}

function advisorSelect(id) {
  // Update selected advisor for this session (not default)
  _currentAdvisor = id;
  // Re-render cards
  _renderAdvisorCards('advisorCards', false);
  // Update send button
  const a = ADVISORS[id];
  const btn = document.getElementById('advisorSendBtn');
  if (btn) btn.textContent = `Consultar ${a.name} →`;
  // Show history for this advisor
  _renderAdvisorHistory();
}

function cfgSetAdvisor(id) {
  S.advisor = id;
  sv();
  _renderAdvisorCards('cfgAdvisorCards', true);
  toast(`✓ ${ADVISORS[id].name} definido como conselheiro padrão`);
}

function _renderAdvisorSuggestions() {
  const el = document.getElementById('advisorSuggestions');
  if (!el) return;
  // Pick 4 random suggestions
  const shuffled = [...ADVISOR_SUGGESTIONS].sort(() => Math.random() - 0.5).slice(0, 4);
  el.innerHTML = shuffled.map(s =>
    `<button onclick="document.getElementById('advisorQuestion').value='${s.replace(/'/g,"\\'")}'"
      style="background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:20px;color:var(--mut);font-size:11px;padding:5px 12px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s"
      onmouseover="this.style.borderColor='var(--teal)';this.style.color='var(--teal)'"
      onmouseout="this.style.borderColor='var(--bdr)';this.style.color='var(--mut)'">${s}</button>`
  ).join('');
}

let _currentAdvisor = null;
let _advisorLoading = false;

async function advisorAsk() {
  if (_advisorLoading) return;
  const question = document.getElementById('advisorQuestion')?.value?.trim();
  if (!question) { toast('⚠️ Digite sua pergunta'); return; }

  const advisorId = _currentAdvisor || S.advisor || 'analytics';
  const advisor = ADVISORS[advisorId];
  const context = _buildAdvisorContext();

  _advisorLoading = true;
  const sendBtn = document.getElementById('advisorSendBtn');
  if (sendBtn) { sendBtn.textContent = 'Consultando...'; sendBtn.disabled = true; }

  const respEl = document.getElementById('advisorResponse');
  respEl.style.display = 'block';
  respEl.innerHTML = `
    <div style="background:var(--glass);border:1px solid ${advisor.color}33;border-radius:14px;padding:20px 24px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <span style="font-size:24px">${advisor.icon}</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:${advisor.color}">${advisor.name}</div>
          <div style="font-size:10px;color:var(--mut)">Analisando seus dados...</div>
        </div>
        <div class="spin" style="margin-left:auto;width:18px;height:18px;border-width:2px"></div>
      </div>
      <div style="font-size:12px;color:var(--mut)">Consultando histórico completo da empresa e benchmarks de mercado...</div>
    </div>`;

  try {
    const systemPrompt = `${advisor.personality}

${advisor.responseFormat}

IMPORTANTE: Formate sua resposta usando markdown simples (negrito com **, listas com •, numeração). Seja específico, use os números reais fornecidos.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `${context}\n\nPERGUNTA DO USUÁRIO:\n${question}` }
        ]
      })
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || 'Não foi possível obter resposta.';

    // Format the response
    const formatted = _formatAdvisorResponse(text, advisor);

    // Extract action items from response
    const actions = _extractAdvisorActions(text, advisorId);

    respEl.innerHTML = `
      <div style="background:var(--glass);border:1px solid ${advisor.color}33;border-radius:14px;overflow:hidden">
        <div style="padding:16px 24px;border-bottom:1px solid ${advisor.color}22;display:flex;align-items:center;gap:10px">
          <span style="font-size:22px">${advisor.icon}</span>
          <div>
            <div style="font-size:12px;font-weight:700;color:${advisor.color}">${advisor.name}</div>
            <div style="font-size:10px;color:var(--mut);font-style:italic">"${advisor.tagline}"</div>
          </div>
        </div>
        <div style="padding:20px 24px;font-size:13px;color:#c8dff5;line-height:1.8" id="advisorRespText">${formatted}</div>
        ${actions.length ? `
        <div style="padding:16px 24px;border-top:1px solid ${advisor.color}22;background:${advisor.color}06">
          <div style="font-size:10px;letter-spacing:2px;color:${advisor.color};font-weight:700;text-transform:uppercase;margin-bottom:10px">
            Plano de ação identificado (${actions.length} ações)
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px" id="advisorActionsList">
            ${actions.map((a,i) => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid rgba(255,255,255,.06)">
              <span style="font-size:11px;font-weight:700;color:${advisor.color};flex-shrink:0;margin-top:1px">${i+1}.</span>
              <span style="font-size:12px;color:#c8dff5;line-height:1.5">${a}</span>
            </div>`).join('')}
          </div>
          <button onclick="advisorSaveActions()" class="bs" style="font-size:12px;padding:8px 20px;background:${advisor.color};color:#07101c;border-color:${advisor.color}">
            ✓ Concordo — Salvar plano de ação
          </button>
        </div>` : ''}
      </div>`;

    // Save to history
    if (!S.advisorHistory) S.advisorHistory = { analytics:[], growth:[], strategist:[] };
    if (!S.advisorHistory[advisorId]) S.advisorHistory[advisorId] = [];
    S.advisorHistory[advisorId].unshift({
      ts: new Date().toISOString(),
      question,
      answer: text,
      actions,
      advisor: advisorId
    });
    // Keep last 20 per advisor
    S.advisorHistory[advisorId] = S.advisorHistory[advisorId].slice(0, 20);
    sv();

    // Clear question
    const qEl = document.getElementById('advisorQuestion');
    if (qEl) qEl.value = '';
    _renderAdvisorHistory();

    // Store actions for saving
    window._pendingAdvisorActions = actions;
    window._pendingAdvisorId = advisorId;

  } catch(e) {
    respEl.innerHTML = `<div style="background:var(--glass);border:1px solid rgba(255,61,90,.3);border-radius:14px;padding:20px 24px;color:var(--red)">
      Erro ao consultar o conselheiro: ${e.message}
    </div>`;
  }

  _advisorLoading = false;
  if (sendBtn) {
    const a = ADVISORS[_currentAdvisor || S.advisor || 'analytics'];
    sendBtn.textContent = `Consultar ${a.name} →`;
    sendBtn.disabled = false;
  }
}

function _formatAdvisorResponse(text, advisor) {
  return text
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:#e8f0ff">$1</strong>`)
    .replace(/^#{1,3}\s(.+)$/gm, `<div style="font-size:11px;letter-spacing:2px;color:${advisor.color};font-weight:700;text-transform:uppercase;margin:14px 0 6px">$1</div>`)
    .replace(/^[•\-]\s(.+)$/gm, `<div style="display:flex;gap:8px;margin:4px 0"><span style="color:${advisor.color};flex-shrink:0">•</span><span>$1</span></div>`)
    .replace(/^\d+\.\s(.+)$/gm, `<div style="display:flex;gap:8px;margin:4px 0"><span style="color:${advisor.color};font-weight:700;flex-shrink:0;min-width:16px">·</span><span>$1</span></div>`)
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function _extractAdvisorActions(text, advisorId) {
  const actions = [];
  // Extract numbered action items from PLANO DE AÇÃO section
  const planMatch = text.match(/PLANO DE AÇÃO[\s\S]*?(?=\n[A-Z\[{]|$)/i);
  if (planMatch) {
    const lines = planMatch[0].split('\n');
    lines.forEach(line => {
      const m = line.match(/^\s*(\d+)\.\s+(.+)/);
      if (m) actions.push(m[2].trim());
    });
  }
  return actions.slice(0, 5);
}

function advisorSaveActions() {
  const actions = window._pendingAdvisorActions || [];
  const advisorId = window._pendingAdvisorId || S.advisor || 'analytics';
  const advisor = ADVISORS[advisorId];
  if (!actions.length) { toast('Nenhuma ação para salvar'); return; }

  if (!S.actions) S.actions = [];
  const mk = S.sel || null;
  const [y, mo] = mk ? mk.split('-') : [new Date().getFullYear(), String(new Date().getMonth()+1).padStart(2,'0')];
  const mesLabel = MES[parseInt(mo)-1] + '/' + y;

  actions.forEach(text => {
    S.actions.push({
      id: Date.now() + '-' + Math.random().toString(36).slice(2,7),
      mk: mk || '',
      mes: mesLabel,
      kpi: 'Conselheiro',
      text: text.trim(),
      resp: '',
      prazo: '',
      status: 'open',
      obs: `Gerado pelo ${advisor.name}`,
      criadoEm: new Date().toISOString()
    });
  });

  sv();
  toast(`✓ ${actions.length} ações salvas em Planos de Ação`);

  // Update button
  const btn = document.querySelector('[onclick="advisorSaveActions()"]');
  if (btn) {
    btn.textContent = `✓ ${actions.length} ações salvas!`;
    btn.disabled = true;
    btn.style.opacity = '.6';
  }
  window._pendingAdvisorActions = [];
}

function _renderAdvisorHistory() {
  const advisorId = _currentAdvisor || S.advisor || 'analytics';
  const history = (S.advisorHistory?.[advisorId] || []);
  const wrap = document.getElementById('advisorHistory');
  const list = document.getElementById('advisorHistoryList');
  if (!wrap || !list) return;
  if (!history.length) { wrap.style.display = 'none'; return; }

  wrap.style.display = 'block';
  const advisor = ADVISORS[advisorId];
  list.innerHTML = history.slice(0, 5).map((h, i) => {
    const d = new Date(h.ts);
    const dateStr = d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
    return `<div style="background:var(--glass);border:1px solid var(--bdr);border-radius:10px;overflow:hidden">
      <div style="padding:10px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;border-bottom:1px solid transparent"
        onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
        <div style="font-size:12px;color:#c8dff5;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h.question}</div>
        <div style="font-size:10px;color:var(--mut);flex-shrink:0;margin-left:12px">${dateStr}</div>
      </div>
      <div style="display:none;padding:14px 16px;font-size:12px;color:var(--mut);line-height:1.7;border-top:1px solid var(--bdr)">
        ${_formatAdvisorResponse(h.answer, advisor)}
      </div>
    </div>`;
  }).join('');
}

function rAdvisorCfgCards() {
  _renderAdvisorCards('cfgAdvisorCards', true);
}

function doLogout(){auth.signOut();}
function toggleFullscreen(){
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen().catch(()=>{});
  } else {
    document.exitFullscreen().catch(()=>{});
  }
}
// Update fullscreen button icon when state changes
document.addEventListener('fullscreenchange',function(){
  const full=!!document.fullscreenElement;
  const icon=full?'✕ Sair tela cheia':'⛶ Tela cheia';
  const iconShort=full?'✕':'⛶';
  const s=document.getElementById('fsBtnSide');
  const m=document.getElementById('fsBtn');
  if(s)s.textContent=icon;
  if(m)m.textContent=iconShort;
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&document.getElementById('loginScreen').style.display!=='none')doLogin();
});
document.addEventListener('DOMContentLoaded',()=>{
  rImportPage();
  auth.onAuthStateChanged(async(user)=>{
    if(user){
      await loadUserData(user.uid);
      // Garante que todos os KPIs do IND têm entrada em S.cfg e S.goals
      // (necessário quando novos KPIs são adicionados ao produto)
      IND.forEach(function(ind){
        if(!S.cfg[ind.id])S.cfg[ind.id]={weight:1,benchGoal:null,hb:ind.hb};
        if(!S.goals[ind.id])S.goals[ind.id]={default:ind.goalDef};
      });
      // Ensure S.sel points to a month with data, or most recent known
      // Clean up benchGoal from non-benchable KPIs
      IND.forEach(function(ind){
        if(!_BENCHABLE.has(ind.id)&&S.cfg[ind.id]&&S.cfg[ind.id].benchGoal!=null){
          S.cfg[ind.id].benchGoal=null;S.cfg[ind.id].benchMode='manual';
        }
      });
      var _km=getKnownMonths();
      if(!S.sel||!_km.includes(S.sel)){
        S.sel=_km.length?_km[_km.length-1]:null;
      }
      const emailEl=document.getElementById('userEmail');
      if(emailEl)emailEl.textContent=user.email;
      document.getElementById('appShell').style.display='block';
      document.getElementById('loginScreen').style.display='none';
      rDash();setTimeout(sizeWheel,100);
    } else {
      document.getElementById('appShell').style.display='none';
      document.getElementById('loginScreen').style.display='flex';
    }
  });
});


// ═══════════════════════════════════════════
// DRE IMPORT FLOW
// ═══════════════════════════════════════════
let _dreLines = [];
let _dreClassified = [];

const DRE_CATS = [
  {id:'receita_bruta',            label:'Receita Bruta',                color:'#00e89b', icon:'💰'},
  {id:'deducao_receita',          label:'Dedução de Receita',           color:'#f59e0b', icon:'➖'},
  {id:'custo_variavel',           label:'CMV / Custo do Produto',       color:'#ef4444', icon:'📦'},
  {id:'custo_variavel_comercial', label:'Custo Variável Comercial',     color:'#f97316', icon:'🤝'},
  {id:'despesa_comercial',        label:'Despesa Comercial',            color:'#3b82f6', icon:'📣'},
  {id:'despesa_pessoal',          label:'Despesa com Pessoal',          color:'#a855f7', icon:'👥'},
  {id:'despesa_administrativa',   label:'Despesa Administrativa',       color:'#f59e0b', icon:'🏢'},
  {id:'despesa_financeira',       label:'Despesa Financeira',           color:'#ef4444', icon:'🏦'},
  {id:'imposto_lucro',            label:'Imposto s/ Lucro (IR/CSLL)',   color:'#dc2626', icon:'🏛'},
  {id:'depreciacao',              label:'Depreciação / Amortização',    color:'#64748b', icon:'📉'},
  {id:'ignorar',                  label:'Ignorar (total/subtotal)',     color:'#374151', icon:'🚫'},
];

function dreInitPage() {
  // Fill year selector
  const anoSel = document.getElementById('dreAno');
  if (!anoSel) return;
  if (!anoSel.options.length) {
    const cur = new Date().getFullYear();
    for (let y = cur - 2; y <= cur + 1; y++) {
      const o = document.createElement('option');
      o.value = y; o.textContent = y;
      if (y === cur) o.selected = true;
      anoSel.appendChild(o);
    }
  }
  // Pre-select previous month
  const now = new Date();
  const pm = now.getMonth(); // 0-indexed → previous month index
  document.getElementById('dreMes').value = String(pm === 0 ? 12 : pm).padStart(2, '0');
  if (pm === 0) {
    const opt = anoSel.querySelector(`option[value="${now.getFullYear()-1}"]`);
    if (opt) opt.selected = true;
  }
  // Reset state
  _dreLines = [];
  _dreClassified = [];
  document.getElementById('dreFileBadge').style.display = 'none';
  document.getElementById('dreProcessBtn').style.display = 'none';
  document.getElementById('dreStep1').style.display = 'flex';
  document.getElementById('dreStep2').style.display = 'none';
  document.getElementById('dreStep3').style.display = 'none';
  const prev = document.getElementById('dreMappingsPreview');
  if (prev) prev.style.display = 'none';
  dreSetStep(1);
}

function dreSetStep(n) {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('step-dot-' + i);
    if (!el) return;
    el.className = 'dre-step' + (i < n ? ' done' : i === n ? ' active' : '');
    const numEl = el.querySelector('.dre-step-num');
    if (numEl) numEl.textContent = i < n ? '✓' : String(i);
  });
}

function dreHandleFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      const lines = [];
      rows.forEach(row => {
        const name = String(row[0] || '').trim();
        if (!name || name.length < 2) return;
        let value = null;
        for (let c = 1; c < row.length; c++) {
          const v = dreParseNum(row[c]);
          if (v !== null && v > 0) { value = v; break; }
        }
        if (value !== null) lines.push({ name, value });
      });
      if (!lines.length) { toast('⚠️ Nenhuma linha com valor encontrada no arquivo'); return; }
      _dreLines = lines;
      document.getElementById('dreFileName').textContent = file.name;
      document.getElementById('dreLineCount').textContent = '· ' + lines.length + ' linhas encontradas';
      document.getElementById('dreFileBadge').style.display = 'flex';
      document.getElementById('dreProcessBtn').style.display = 'inline-block';
      // Show mappings preview
      dreMappingsPreview(lines);
      input.value = '';
    } catch(err) {
      toast('❌ Erro ao ler o arquivo: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function dreClearFile() {
  _dreLines = [];
  document.getElementById('dreFileBadge').style.display = 'none';
  document.getElementById('dreProcessBtn').style.display = 'none';
  const prev = document.getElementById('dreMappingsPreview');
  if (prev) prev.style.display = 'none';
}

function dreMappingsPreview(lines) {
  const el = document.getElementById('dreMappingsPreview');
  if (!el) return;
  const mappings = S.dreMappings || {};
  const total = Object.keys(mappings).length;
  if (!total) { el.style.display = 'none'; return; }

  // Find which uploaded lines have saved mappings
  const matched = lines.filter(l => mappings[l.name.toLowerCase().trim()]);
  const newLines = lines.filter(l => !mappings[l.name.toLowerCase().trim()]);

  el.style.display = 'block';
  el.innerHTML = `
    <div style="background:rgba(0,240,200,.04);border:1px solid rgba(0,240,200,.15);border-radius:12px;padding:14px 16px;width:100%">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--teal)">🧠 Aprendizado aplicado</div>
          <div style="font-size:11px;color:var(--mut);margin-top:2px">
            ${matched.length} de ${lines.length} contas já classificadas anteriormente
            ${newLines.length ? ` · ${newLines.length} novas serão classificadas pela IA` : ' · nenhuma conta nova'}
          </div>
        </div>
        <button onclick="clearMappings()" style="background:none;border:1px solid rgba(255,61,90,.25);color:rgba(255,61,90,.6);border-radius:6px;font-size:10px;padding:4px 10px;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap"
          onmouseover="this.style.borderColor='#ff3d5a';this.style.color='#ff3d5a'"
          onmouseout="this.style.borderColor='rgba(255,61,90,.25)';this.style.color='rgba(255,61,90,.6)'">
          🗑 Limpar aprendizado
        </button>
      </div>
      ${matched.length ? `
        <div style="max-height:140px;overflow-y:auto;display:flex;flex-direction:column;gap:3px">
          ${matched.map(l => {
            const cat = DRE_CATS.find(c => c.id === mappings[l.name.toLowerCase().trim()]);
            return `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:rgba(255,255,255,.03);border-radius:6px;font-size:11px">
              <span style="color:rgba(255,255,255,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:55%">${l.name}</span>
              <span style="flex-shrink:0;font-size:10px;padding:2px 8px;border-radius:5px;background:${cat?.color||'#64748b'}18;color:${cat?.color||'#64748b'};border:1px solid ${cat?.color||'#64748b'}33">
                ${cat?.icon||''} ${cat?.label||mappings[l.name.toLowerCase().trim()]}
              </span>
            </div>`;
          }).join('')}
        </div>` : ''}
      <div style="margin-top:10px;font-size:10px;color:rgba(255,255,255,.25);line-height:1.5">
        💡 As classificações acima serão aplicadas automaticamente. Você poderá revisar e corrigir no passo seguinte antes de confirmar.
      </div>
    </div>`;
}

function clearMappings() {
  const count = Object.keys(S.dreMappings || {}).length;
  if (!count) { toast('Nenhum aprendizado salvo'); return; }
  showDelDialog(
    '🧠 Limpar Aprendizado',
    `Remover ${count} classificações aprendidas? A IA voltará a classificar todas as contas do zero nas próximas importações.`,
    () => {
      S.dreMappings = {};
      sv();
      toast('✓ Aprendizado limpo — próxima importação será classificada do zero pela IA');
      // Refresh preview if file already loaded
      if (_dreLines.length) dreMappingsPreview(_dreLines);
      // Refresh config page counter
      const el = document.getElementById('mappingsCount');
      if (el) el.textContent = '';
    }
  );
}

async function dreProcess() {
  if (!_dreLines.length) { toast('⚠️ Selecione um arquivo primeiro'); return; }
  document.getElementById('dreStep1').style.display = 'none';
  document.getElementById('dreStep2').style.display = 'flex';
  dreSetStep(2);

  const msgs = [
    'Lendo estrutura do arquivo...',
    'Aplicando aprendizado anterior...',
    'Classificando contas desconhecidas com IA...',
    'Validando classificações...',
    'Quase lá — finalizando análise...'
  ];
  const msgEl = document.getElementById('dreProcMsg');
  const fillEl = document.getElementById('dreProcFill');
  let mi = 0;
  const ticker = setInterval(() => {
    if (mi < msgs.length) {
      msgEl.textContent = msgs[mi];
      fillEl.style.width = ((mi + 1) / msgs.length * 82) + '%';
      mi++;
    }
  }, 800);

  try {
    const savedMappings = S.dreMappings || {};
    const dreModel = S.dreModel || {};

    // ── Pré-classificar localmente contas já conhecidas ──────────────
    // Ordem de prioridade: correção manual (dreMappings) > modelo base (dreModel)
    const preClassified = _dreLines.map((line, i) => {
      const key = line.name.toLowerCase().trim();
      const known = savedMappings[key] || dreModel[key];
      return { index: i, known: known || null };
    });

    const unknownLines = _dreLines
      .map((line, i) => ({ ...line, _idx: i }))
      .filter((_, i) => !preClassified[i].known);

    let apiClassMap = {};

    if (unknownLines.length > 0) {
      // Só manda as linhas desconhecidas para a API
      const res = await fetch('/api/classify-dre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: unknownLines.map(l => ({ name: l.name, value: l.value })),
          savedMappings // ainda passa como contexto para a IA raciocinar
        })
      });
      if (!res.ok) throw new Error('Erro na API (' + res.status + ')');
      const data = await res.json();
      // Remapeia os índices da resposta da API para os índices originais
      (data.classifications || []).forEach(c => {
        const origIdx = unknownLines[c.index]?._idx;
        if (origIdx !== undefined) apiClassMap[origIdx] = c;
      });
    }

    clearInterval(ticker);
    fillEl.style.width = '100%';

    // ── Monta resultado final: conhecido local + novo da API ─────────
    _dreClassified = _dreLines.map((line, i) => {
      const known = preClassified[i].known;
      if (known) {
        return { ...line, category: known, confidence: 'high' };
      }
      return {
        ...line,
        category: apiClassMap[i]?.category || 'ignorar',
        confidence: apiClassMap[i]?.confidence || 'low'
      };
    });

    const knownCount = preClassified.filter(p => p.known).length;
    const newCount = unknownLines.length;
    if (knownCount > 0) {
      msgs[1] = `${knownCount} contas reconhecidas do histórico, ${newCount} classificadas pela IA`;
    }

    setTimeout(() => {
      document.getElementById('dreStep2').style.display = 'none';
      document.getElementById('dreStep3').style.display = 'flex';
      dreSetStep(3);
      dreRenderReview();
    }, 400);
  } catch(err) {
    clearInterval(ticker);
    toast('❌ ' + err.message);
    document.getElementById('dreStep2').style.display = 'none';
    document.getElementById('dreStep1').style.display = 'flex';
    dreSetStep(1);
  }
}

function dreRenderReview() {
  const autoCount = _dreClassified.filter(l => l.confidence === 'high' && l.category !== 'ignorar').length;
  const reviewCount = _dreClassified.filter(l => l.confidence !== 'high' && l.category !== 'ignorar').length;
  document.getElementById('dreReviewSub').textContent =
    autoCount + ' linhas classificadas automaticamente' +
    (reviewCount ? ' · ⚠️ ' + reviewCount + ' precisam de atenção' : '');

  const opts = DRE_CATS.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('');
  let rows = '';
  _dreClassified.forEach((line, i) => {
    const confIcon = line.confidence === 'high' ? '✅' : line.confidence === 'medium' ? '⚠️' : '❓';
    const rowCls = line.confidence === 'low' ? 'dre-low' : line.confidence === 'medium' ? 'dre-med' : '';
    const cat = DRE_CATS.find(c => c.id === line.category);
    const catColor = cat?.color || '#64748b';
    rows += `<tr class="dre-tbl-row ${rowCls}" id="dre-row-${i}">
      <td class="dre-td-name" title="${line.name}">${line.name}</td>
      <td class="dre-td-val">${dreFormatNum(line.value)}</td>
      <td style="min-width:190px">
        <select class="dre-cat-sel" data-idx="${i}"
          style="border-color:${catColor}55;color:${catColor}"
          onchange="dreUpdateCat(${i},this.value)">
          ${DRE_CATS.map(c => `<option value="${c.id}"${c.id===line.category?' selected':''}>${c.icon} ${c.label}</option>`).join('')}
        </select>
      </td>
      <td style="text-align:center;font-size:15px">${confIcon}</td>
    </tr>`;
  });
  document.getElementById('dreReviewRows').innerHTML = rows;
  dreRenderSummary();
}

function dreUpdateCat(idx, newCat) {
  _dreClassified[idx].category = newCat;
  _dreClassified[idx].confidence = 'high';
  const row = document.getElementById('dre-row-' + idx);
  if (row) row.className = 'dre-tbl-row';
  const sel = document.querySelector(`[data-idx="${idx}"]`);
  if (sel) {
    const col = DRE_CATS.find(c => c.id === newCat)?.color || '#64748b';
    sel.style.borderColor = col + '55';
    sel.style.color = col;
  }
  dreRenderSummary();
}

function dreAggregate() {
  const a = { f_fat:0, f_ded:0, f_cmv:0, f_cvc:0, f_pessoal:0, f_adm:0, f_dep:0, f_dc:0, f_depfin:0 };
  _dreClassified.forEach(l => {
    const v = l.value;
    if      (l.category === 'receita_bruta')            a.f_fat     += v;
    else if (l.category === 'deducao_receita')          a.f_ded     += v;
    else if (l.category === 'custo_variavel')           a.f_cmv     += v; // CMV puro → Margem Bruta
    else if (l.category === 'custo_variavel_comercial') a.f_cvc     += v; // comissões, frete → MC
    else if (l.category === 'despesa_comercial')        a.f_dc      += v;
    else if (l.category === 'despesa_pessoal')          a.f_pessoal += v;
    else if (l.category === 'despesa_administrativa')   a.f_adm     += v;
    else if (l.category === 'depreciacao')              a.f_dep     += v;
    else if (l.category === 'despesa_financeira')       a.f_depfin  += v;
    else if (l.category === 'imposto_lucro')            a.f_depfin  += v;
  });
  return a;
}

function dreRenderSummary() {
  const a = dreAggregate();
  // Campos corretos após refactor:
  // a.f_fat = Receita Bruta
  // a.f_ded = Deduções
  // a.f_cmv = CMV / Custo Variável
  // a.f_dc  = Despesa Comercial
  // a.f_pessoal = Despesas com Pessoal
  // a.f_adm = Despesas Administrativas + Depreciação
  // a.f_depfin = Desp. Financeiras + IR/CSLL
  const recLiq = a.f_fat - a.f_ded;
  const base   = recLiq > 0 ? recLiq : a.f_fat;
  // Usa calcKPIs para garantir consistência com o resto do produto
  const raw = {
    f_fat:     a.f_fat     || undefined,
    f_cv:      (a.f_cmv + a.f_ded) || undefined,
    f_dc:      a.f_dc      || undefined,
    f_df:      (a.f_pessoal + a.f_adm) || undefined,
    f_depfin:  a.f_depfin  || undefined,
    f_cmv:     a.f_cmv     || undefined,
    f_cvc:     a.f_cvc     || undefined,
    f_ded:     a.f_ded     || undefined,
    f_pessoal: a.f_pessoal || undefined,
    f_adm:     a.f_adm     || undefined,
    f_dep:     a.f_dep     || undefined,
  };
  const kpis = calcKPIs(raw);
  const lucroR = kpis.lucroliq !== null ? kpis.lucroliq / 100 * base : null;
  const lucroP = kpis.lucroliq;
  const fmt = v => 'R$ ' + dreFormatNum(v);
  const items = [
    { label: '💰 Receita Bruta',           val: a.f_fat,     color: '#00e89b' },
    { label: '➖ Deduções',                val: a.f_ded,     color: '#64748b', hide: !a.f_ded },
    { label: '📦 CMV / Custo do Produto',  val: a.f_cmv,     color: '#ef4444', hide: !a.f_cmv },
    { label: '🤝 Custo Var. Comercial',    val: a.f_cvc,     color: '#f97316', hide: !a.f_cvc },
    { label: '📣 Despesa Comercial',       val: a.f_dc,      color: '#3b82f6', hide: !a.f_dc },
    { label: '👥 Despesa Pessoal',         val: a.f_pessoal, color: '#a855f7', hide: !a.f_pessoal },
    { label: '🏢 Despesa Adm.',            val: a.f_adm,     color: '#f59e0b', hide: !a.f_adm },
    { label: '🏦 Desp. Fin. + IR',         val: a.f_depfin,  color: '#ef4444', hide: !a.f_depfin },
  ];
  let html = `<div class="dre-sum-title">Resumo de valores</div>`;
  items.forEach(it => {
    if (it.hide || !it.val) return;
    html += `<div class="dre-sum-item">
      <span class="dre-sum-label" style="color:${it.color}">${it.label}</span>
      <span class="dre-sum-value" style="color:${it.color};font-size:12px">${fmt(it.val)}</span>
    </div>`;
  });
  if (a.f_fat > 0) {
    html += `<div class="dre-sum-title" style="margin-top:8px">Resultado calculado</div>`;
    const lucroCol = lucroR >= 0 ? 'var(--teal)' : 'var(--red)';
    html += `<div class="dre-sum-item" style="border-color:${lucroCol}44;cursor:pointer"
      onmouseover="this.style.borderColor='${lucroCol}'" onmouseout="this.style.borderColor='${lucroCol}44'"
      onclick="openKpiFromRaw('lucroliq', _dreGetLiveRaw())">
      <span class="dre-sum-label">💰 Lucro Líquido R$</span>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span class="dre-sum-value" style="color:${lucroCol};font-size:12px">${fmt(lucroR)}</span>
        <span style="font-size:9px;color:var(--mut)">ver →</span>
      </div>
    </div>`;
    if (lucroP !== null) {
      html += `<div class="dre-sum-item" style="border-color:${lucroCol}44;cursor:pointer"
        onmouseover="this.style.borderColor='${lucroCol}'" onmouseout="this.style.borderColor='${lucroCol}44'"
        onclick="openKpiFromRaw('lucroliq', _dreGetLiveRaw())">
        <span class="dre-sum-label">💰 Lucro Líquido %</span>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span class="dre-sum-value" style="color:${lucroCol}">${lucroP.toFixed(1)}%</span>
          <span style="font-size:9px;color:var(--mut)">ver →</span>
        </div>
      </div>`;
    }
    const kpiPreview = [
      { label: '📈 Margem Contribuição', id: 'margem' },
      { label: '📦 Margem Bruta',        id: 'margbruta' },
      { label: '📊 EBITDA',              id: 'ebitda' },
      { label: '👥 Peso Pessoal',        id: 'pessoal' },
      { label: '🏢 Peso Adm.',           id: 'admperc' },
    ];
    kpiPreview.forEach(it => {
      const v = kpis[it.id];
      if (v === null || v === undefined || isNaN(v)) return;
      const col = v >= 0 ? 'var(--teal)' : 'var(--red)';
      html += `<div class="dre-sum-item" style="cursor:pointer;transition:border-color .2s"
        onmouseover="this.style.borderColor='rgba(0,240,200,.3)'" onmouseout="this.style.borderColor=''"
        onclick="openKpiFromRaw('${it.id}', _dreGetLiveRaw())">
        <span class="dre-sum-label">${it.label}</span>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span class="dre-sum-value" style="color:${col}">${v.toFixed(1)}%</span>
          <span style="font-size:9px;color:var(--mut)">ver detalhes →</span>
        </div>
      </div>`;
    });
  }
  document.getElementById('dreReviewSummary').innerHTML = html;
}

function _dreGetLiveRaw() {
  const a = dreAggregate();
  return {
    f_fat:     a.f_fat     || undefined,
    f_cv:      (a.f_cmv + a.f_ded) || undefined,
    f_dc:      a.f_dc      || undefined,
    f_df:      (a.f_pessoal + a.f_adm) || undefined,
    f_depfin:  a.f_depfin  || undefined,
    f_cmv:     a.f_cmv     || undefined,
    f_cvc:     a.f_cvc     || undefined,
    f_ded:     a.f_ded     || undefined,
    f_pessoal: a.f_pessoal || undefined,
    f_adm:     a.f_adm     || undefined,
    f_dep:     a.f_dep     || undefined,
  };
}

function dreConfirm() {
  const mes = document.getElementById('dreMes').value;
  const ano = document.getElementById('dreAno').value;
  if (!mes || !ano) { toast('⚠️ Selecione o mês e ano'); return; }
  const mk = ano + '-' + mes;
  const agg = dreAggregate();
  if (!agg.f_fat) { toast('⚠️ Nenhuma linha classificada como Receita Bruta'); return; }

  // Save mappings for future learning
  if (!S.dreMappings) S.dreMappings = {};
  _dreClassified.filter(l => l.category !== 'ignorar').forEach(l => {
    S.dreMappings[l.name.toLowerCase().trim()] = l.category;
  });

  // Save raw DRE lines so they can be reviewed/edited later
  if (!S.dreLines) S.dreLines = {};
  S.dreLines[mk] = _dreClassified.map(l => ({ name: l.name, value: l.value, category: l.category }));

  // Build raw for calcKPIs
  // f_cv = CMV + deduções (para Margem de Contribuição)
  // f_df = pessoal + adm (para EBITDA e Desp.Op%)
  // f_cmv, f_ded, f_pessoal, f_adm, f_dep salvos separadamente para KPIs granulares
  const raw = {
    f_fat:     agg.f_fat              || undefined,
    f_cv:      (agg.f_cmv + agg.f_ded) || undefined,
    f_dc:      agg.f_dc               || undefined,
    f_df:      (agg.f_pessoal + agg.f_adm) || undefined,
    f_depfin:  agg.f_depfin           || undefined,
    f_cmv:     agg.f_cmv              || undefined,
    f_cvc:     agg.f_cvc              || undefined,
    f_ded:     agg.f_ded              || undefined,
    f_pessoal: agg.f_pessoal          || undefined,
    f_adm:     agg.f_adm              || undefined,
    f_dep:     agg.f_dep              || undefined,
  };
  Object.keys(raw).forEach(k => { if (!raw[k]) delete raw[k]; });

  if (!S.raw) S.raw = {};
  S.raw[mk] = raw;

  const kpis = calcKPIs(raw);
  const filled = Object.values(kpis).filter(v => v !== null).length;
  if (!S.data) S.data = {};
  if (!S.data[mk]) S.data[mk] = {};
  IND.forEach(ind => {
    const v = kpis[ind.id];
    if (v !== null) {
      S.data[mk][ind.id] = { value: parseFloat(v.toFixed(4)), confidence: 'high' };
    }
  });

  if (!S.months.includes(mk)) { S.months.push(mk); S.months.sort(); }
  S.sel = mk;
  if (S.diagCache) delete S.diagCache[mk];

  sv();
  toast('✓ ' + filled + ' KPIs gerados a partir do DRE!');
  setTimeout(() => go('dashboard', document.querySelector('[data-page=dashboard]')), 900);
}

function lancDelete(mk) {
  const parts = mk.split('-');
  const lbl = MES[parseInt(parts[1]) - 1] + '/' + parts[0];
  showDelDialog(
    '🗑️ Excluir Lançamento',
    `Excluir todos os dados de <strong>${lbl}</strong>? Os KPIs, dados brutos e linhas do DRE serão removidos. Esta ação não pode ser desfeita.`,
    () => {
      // Remove all data for this month
      if (S.months) S.months = S.months.filter(m => m !== mk);
      if (S.data && S.data[mk])     delete S.data[mk];
      if (S.raw && S.raw[mk])       delete S.raw[mk];
      if (S.forecast && S.forecast[mk]) delete S.forecast[mk];
      if (S.dreLines && S.dreLines[mk]) delete S.dreLines[mk];
      if (S.diagCache && S.diagCache[mk]) delete S.diagCache[mk];
      if (S.meetActions && S.meetActions[mk]) delete S.meetActions[mk];
      // If deleted month was selected, reset to latest
      if (S.sel === mk) {
        const km = S.months && S.months.length ? S.months[S.months.length - 1] : null;
        S.sel = km;
      }
      sv();
      toast(`✓ Lançamento de ${lbl} removido`);
      rLancamentos();
    }
  );
}
function dreParseNum(raw) {
  // Handle numbers that come as actual JS numbers from XLSX (already parsed)
  if (typeof raw === 'number') return isNaN(raw) ? null : Math.abs(raw);

  let s = String(raw).trim();
  if (!s || s === '-' || s === '') return null;

  // Remove currency symbols, spaces, and common wrappers
  s = s.replace(/R\$\s*/g, '').replace(/\s/g, '');

  // Handle negatives in parentheses: (1.234,56) → -1234.56
  const negative = s.startsWith('(') && s.endsWith(')');
  if (negative) s = s.slice(1, -1);

  // Detect format by analyzing separators
  // Count dots and commas
  const dots   = (s.match(/\./g) || []).length;
  const commas = (s.match(/,/g) || []).length;

  let normalized;

  if (dots > 0 && commas > 0) {
    // Has both separators — identify which is decimal
    const lastDot   = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    if (lastComma > lastDot) {
      // Format: 40.090.143,39 (BR) → remove dots, comma→period
      normalized = s.replace(/\./g, '').replace(',', '.');
    } else {
      // Format: 40,090,143.39 (US) → remove commas
      normalized = s.replace(/,/g, '');
    }
  } else if (commas === 1 && dots === 0) {
    // Only a comma — could be decimal: 143,39 → 143.39
    // or thousands: 40,000 → check if after comma has exactly 3 digits
    const afterComma = s.split(',')[1];
    if (afterComma && afterComma.length === 3 && !afterComma.includes('.')) {
      // Likely thousands separator: 40,000
      normalized = s.replace(',', '');
    } else {
      // Decimal comma: 143,39
      normalized = s.replace(',', '.');
    }
  } else if (dots === 1 && commas === 0) {
    // Only a dot — standard decimal or thousands
    const afterDot = s.split('.')[1];
    if (afterDot && afterDot.length === 3) {
      // Could be thousands: 40.000 → treat as integer
      normalized = s.replace('.', '');
    } else {
      // Standard decimal: 40090143.39
      normalized = s;
    }
  } else if (dots > 1 && commas === 0) {
    // Multiple dots, no comma: 40.090.143 (BR thousands, integer)
    normalized = s.replace(/\./g, '');
  } else if (commas > 1 && dots === 0) {
    // Multiple commas, no dot: 40,090,143 (US thousands, integer)
    normalized = s.replace(/,/g, '');
  } else {
    normalized = s;
  }

  const v = parseFloat(normalized);
  return isNaN(v) ? null : Math.abs(v);
}

function dreFormatNum(n) {
  return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ═══════════════════════════════════════════
// LANÇAMENTOS PAGE
// ═══════════════════════════════════════════
let _lancEditMk = null;
let _lancEditLines = [];

function rLancamentos() {
  const body = document.getElementById('lancBody');
  if (!body) return;
  const months = (S.months || []).slice().sort().reverse();
  if (!months.length) {
    body.innerHTML = '<div class="empty" style="padding:40px 0"><div class="eico">🗂️</div><p>Nenhum lançamento ainda.<br>Use Lançamento para importar um DRE.</p></div>';
    return;
  }
  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">';
  months.forEach(mk => {
    const parts = mk.split('-');
    const lbl = MES[parseInt(parts[1]) - 1] + '/' + parts[0];
    const hasLines = S.dreLines && S.dreLines[mk];
    const raw = S.raw && S.raw[mk];
    const kpis = raw ? calcKPIs(raw) : {};
    const score = S.data && S.data[mk] ? calcScore(mk) : null;
    const g = score ? grade(score.score) : null;
    const recVal = raw && raw.f_fat ? 'R$ ' + dreFormatNum(raw.f_fat) : '—';
    const lucroVal = kpis.lucroliq !== null && kpis.lucroliq !== undefined
      ? kpis.lucroliq.toFixed(1) + '%' : '—';
    const lucroCol = kpis.lucroliq > 0 ? 'var(--teal)' : kpis.lucroliq < 0 ? 'var(--red)' : 'var(--mut)';
    const lineCount = hasLines ? S.dreLines[mk].filter(l => l.category !== 'ignorar').length : 0;

    html += `<div style="background:rgba(255,255,255,.03);border:1px solid var(--bdr);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px;transition:border-color .2s;cursor:pointer"
      onmouseover="this.style.borderColor='rgba(0,240,200,.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,.075)'"
      onclick="lancOpenModal('${mk}')">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:2px;color:#c8dff5">${lbl}</div>
        ${g ? `<span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;background:${g.c}18;color:${g.c};border:1px solid ${g.c}44">${g.l}</span>` : '<span style="font-size:10px;color:var(--mut)">Sem score</span>'}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:rgba(255,255,255,.03);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--mut);letter-spacing:1px;text-transform:uppercase;margin-bottom:3px">Receita</div>
          <div style="font-size:13px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--teal)">${recVal}</div>
        </div>
        <div style="background:rgba(255,255,255,.03);border-radius:8px;padding:8px 10px">
          <div style="font-size:9px;color:var(--mut);letter-spacing:1px;text-transform:uppercase;margin-bottom:3px">Lucro Líq.</div>
          <div style="font-size:13px;font-weight:700;font-family:'JetBrains Mono',monospace;color:${lucroCol}">${lucroVal}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:10px;color:var(--mut)">${hasLines ? lineCount + ' linhas do DRE' : 'Lançamento manual'}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <button onclick="event.stopPropagation();lancDelete('${mk}')" style="background:none;border:1px solid rgba(255,61,90,.25);color:rgba(255,61,90,.6);border-radius:6px;font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s" onmouseover="this.style.borderColor='#ff3d5a';this.style.color='#ff3d5a'" onmouseout="this.style.borderColor='rgba(255,61,90,.25)';this.style.color='rgba(255,61,90,.6)'">🗑 Excluir</button>
          <span style="font-size:11px;color:var(--teal);font-weight:600">Ver detalhes →</span>
        </div>
      </div>
    </div>`;
  });
  html += '</div>';
  body.innerHTML = html;
}

function lancOpenModal(mk) {
  _lancEditMk = mk;
  const parts = mk.split('-');
  const lbl = MES[parseInt(parts[1]) - 1] + '/' + parts[0];
  document.getElementById('lancModalTitle').textContent = 'Lançamento — ' + lbl;

  const hasLines = S.dreLines && S.dreLines[mk];
  document.getElementById('lancModalSub').textContent = hasLines
    ? 'Importado via DRE · Ajuste as classificações e salve para recalcular os KPIs'
    : 'Lançamento manual · Valores agregados';

  _lancEditLines = hasLines
    ? S.dreLines[mk].map(l => ({ ...l }))
    : [];

  lancRenderModal(mk);
  document.getElementById('lancModal').classList.add('open');
}

function lancCloseModal() {
  document.getElementById('lancModal').classList.remove('open');
  _lancEditMk = null;
  _lancEditLines = [];
}

function lancRenderModal(mk) {
  const body = document.getElementById('lancModalBody');
  const raw = (S.raw && S.raw[mk]) || {};
  const kpis = calcKPIs(raw);

  // Right panel: current KPIs + aggregated values
  const fmt = v => v ? 'R$ ' + dreFormatNum(v) : '—';
  const lucroCol = kpis.lucroliq > 0 ? 'var(--teal)' : kpis.lucroliq < 0 ? 'var(--red)' : 'var(--mut)';
  let rightHtml = `<div style="display:flex;flex-direction:column;gap:8px">
    <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--mut);font-weight:700;margin-bottom:4px">Valores Calculados</div>`;

  const summItems = [
    { label:'💰 Receita Bruta', val: fmt(raw.f_fat), col:'#00e89b' },
    { label:'📦 Custos Variáveis', val: fmt(raw.f_cv), col:'#ef4444' },
    { label:'📣 Desp. Comercial', val: fmt(raw.f_dc), col:'#3b82f6' },
    { label:'📋 Despesas Fixas', val: fmt(raw.f_df), col:'#f59e0b' },
    { label:'🏦 Desp. Fin. + IR', val: fmt(raw.f_depfin), col:'#a855f7' },
  ];
  summItems.forEach(it => {
    if (it.val === '—') return;
    rightHtml += `<div class="dre-sum-item">
      <span class="dre-sum-label" style="color:${it.col}">${it.label}</span>
      <span class="dre-sum-value" style="color:${it.col};font-size:12px">${it.val}</span>
    </div>`;
  });

  const kpiItems = [
    { label:'📈 Margem Contrib.', val: kpis.margem !== null ? kpis.margem.toFixed(1)+'%' : '—', col: kpis.margem >= 0 ? 'var(--teal)' : 'var(--red)' },
    { label:'📊 EBITDA', val: kpis.ebitda !== null ? kpis.ebitda.toFixed(1)+'%' : '—', col: kpis.ebitda >= 0 ? 'var(--teal)' : 'var(--red)' },
    { label:'💰 Lucro Líquido %', val: kpis.lucroliq !== null ? kpis.lucroliq.toFixed(1)+'%' : '—', col: lucroCol },
  ];
  rightHtml += `<div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--mut);font-weight:700;margin:8px 0 4px">KPIs Gerados</div>`;
  kpiItems.forEach(it => {
    rightHtml += `<div class="dre-sum-item">
      <span class="dre-sum-label">${it.label}</span>
      <span class="dre-sum-value" style="color:${it.col};font-size:13px">${it.val}</span>
    </div>`;
  });
  rightHtml += '</div>';

  // Left panel: DRE lines table or message
  let leftHtml = '';
  if (_lancEditLines.length) {
    const opts = DRE_CATS.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('');
    leftHtml = `<div style="overflow-y:auto;min-height:0;border-radius:10px;border:1px solid rgba(255,255,255,.06)">
      <table class="dre-tbl" style="min-width:100%">
        <thead><tr>
          <th>Conta do DRE</th>
          <th style="text-align:right">Valor (R$)</th>
          <th>Classificação</th>
        </tr></thead><tbody>`;
    _lancEditLines.forEach((line, i) => {
      const cat = DRE_CATS.find(c => c.id === line.category);
      const col = cat?.color || '#64748b';
      leftHtml += `<tr class="dre-tbl-row">
        <td class="dre-td-name" title="${line.name}">${line.name}</td>
        <td class="dre-td-val">${dreFormatNum(line.value)}</td>
        <td style="min-width:180px">
          <select class="dre-cat-sel" data-lanc-idx="${i}"
            style="border-color:${col}55;color:${col}"
            onchange="lancUpdateLine(${i},this.value)">
            ${DRE_CATS.map(c => `<option value="${c.id}"${c.id===line.category?' selected':''}>${c.icon} ${c.label}</option>`).join('')}
          </select>
        </td>
      </tr>`;
    });
    leftHtml += '</tbody></table></div>';
  } else {
    leftHtml = `<div style="color:var(--mut);font-size:12px;padding:20px;text-align:center;background:rgba(255,255,255,.02);border:1px solid var(--bdr);border-radius:10px">
      Lançamento manual — linhas do DRE não disponíveis.<br>
      <span style="font-size:11px;color:rgba(255,255,255,.2)">Para ajustar, importe um novo DRE para este mês.</span>
    </div>`;
  }

  body.innerHTML = leftHtml + rightHtml;
}

function lancUpdateLine(idx, newCat) {
  _lancEditLines[idx].category = newCat;
  const sel = document.querySelector(`[data-lanc-idx="${idx}"]`);
  if (sel) {
    const col = DRE_CATS.find(c => c.id === newCat)?.color || '#64748b';
    sel.style.borderColor = col + '55';
    sel.style.color = col;
  }
  // Recalculate live preview using correct aggregation
  const agg = { f_fat:0, f_ded:0, f_cmv:0, f_cvc:0, f_pessoal:0, f_adm:0, f_dep:0, f_dc:0, f_depfin:0 };
  _lancEditLines.forEach(l => {
    const v = l.value;
    if      (l.category === 'receita_bruta')            agg.f_fat     += v;
    else if (l.category === 'deducao_receita')          agg.f_ded     += v;
    else if (l.category === 'custo_variavel')           agg.f_cmv     += v;
    else if (l.category === 'custo_variavel_comercial') agg.f_cvc     += v;
    else if (l.category === 'despesa_comercial')        agg.f_dc      += v;
    else if (l.category === 'despesa_pessoal')          agg.f_pessoal += v;
    else if (l.category === 'despesa_administrativa')   agg.f_adm     += v;
    else if (l.category === 'depreciacao')              agg.f_dep     += v;
    else if (l.category === 'despesa_financeira')       agg.f_depfin  += v;
    else if (l.category === 'imposto_lucro')            agg.f_depfin  += v;
  });
  // Store preview in a temp raw for live right panel update
  const previewRaw = {
    f_fat:     agg.f_fat                      || undefined,
    f_cv:      (agg.f_cmv + agg.f_ded)        || undefined,
    f_dc:      agg.f_dc                       || undefined,
    f_df:      (agg.f_pessoal + agg.f_adm)    || undefined,
    f_depfin:  agg.f_depfin                   || undefined,
    f_cmv:     agg.f_cmv                      || undefined,
    f_cvc:     agg.f_cvc                      || undefined,
    f_ded:     agg.f_ded                      || undefined,
    f_pessoal: agg.f_pessoal                  || undefined,
    f_adm:     agg.f_adm                      || undefined,
    f_dep:     agg.f_dep                      || undefined,
  };
  // Temporarily update S.raw for lancRenderModal right panel, restore after
  const origRaw = (S.raw && S.raw[_lancEditMk]) || {};
  if (!S.raw) S.raw = {};
  S.raw[_lancEditMk] = previewRaw;
  lancRenderModal(_lancEditMk);
  S.raw[_lancEditMk] = origRaw;
}

function lancSaveEdits() {
  if (!_lancEditMk || !_lancEditLines.length) { lancCloseModal(); return; }
  const mk = _lancEditMk;

  // Save updated lines
  if (!S.dreLines) S.dreLines = {};
  S.dreLines[mk] = _lancEditLines.map(l => ({ ...l }));

  // Update mappings
  if (!S.dreMappings) S.dreMappings = {};
  _lancEditLines.filter(l => l.category !== 'ignorar').forEach(l => {
    S.dreMappings[l.name.toLowerCase().trim()] = l.category;
  });

  // Recalculate aggregation
  const agg = { f_fat:0, f_ded:0, f_cmv:0, f_cvc:0, f_pessoal:0, f_adm:0, f_dep:0, f_dc:0, f_depfin:0 };
  _lancEditLines.forEach(l => {
    const v = l.value;
    if      (l.category === 'receita_bruta')            agg.f_fat     += v;
    else if (l.category === 'deducao_receita')          agg.f_ded     += v;
    else if (l.category === 'custo_variavel')           agg.f_cmv     += v;
    else if (l.category === 'custo_variavel_comercial') agg.f_cvc     += v;
    else if (l.category === 'despesa_comercial')        agg.f_dc      += v;
    else if (l.category === 'despesa_pessoal')          agg.f_pessoal += v;
    else if (l.category === 'despesa_administrativa')   agg.f_adm     += v;
    else if (l.category === 'depreciacao')              agg.f_dep     += v;
    else if (l.category === 'despesa_financeira')       agg.f_depfin  += v;
    else if (l.category === 'imposto_lucro')            agg.f_depfin  += v;
  });

  const raw = {
    f_fat:     agg.f_fat                      || undefined,
    f_cv:      (agg.f_cmv + agg.f_ded)        || undefined,
    f_dc:      agg.f_dc                       || undefined,
    f_df:      (agg.f_pessoal + agg.f_adm)    || undefined,
    f_depfin:  agg.f_depfin                   || undefined,
    f_cmv:     agg.f_cmv                      || undefined,
    f_cvc:     agg.f_cvc                      || undefined,
    f_ded:     agg.f_ded                      || undefined,
    f_pessoal: agg.f_pessoal                  || undefined,
    f_adm:     agg.f_adm                      || undefined,
    f_dep:     agg.f_dep                      || undefined,
  };
  Object.keys(raw).forEach(k => { if (!raw[k]) delete raw[k]; });
  if (!S.raw) S.raw = {};
  S.raw[mk] = raw;

  // Recalculate KPIs
  const kpis = calcKPIs(raw);
  if (!S.data) S.data = {};
  if (!S.data[mk]) S.data[mk] = {};
  IND.forEach(ind => {
    const v = kpis[ind.id];
    if (v !== null) S.data[mk][ind.id] = { value: parseFloat(v.toFixed(4)), confidence: 'high' };
  });
  if (S.diagCache) delete S.diagCache[mk];

  sv();
  toast('✓ Classificações salvas e KPIs recalculados!');
  lancCloseModal();
  rLancamentos();
}

// ═══════════════════════════════════════════
// DRE MODELO (Configuração)
// ═══════════════════════════════════════════
let _dreModelLines = []; // linhas carregadas do arquivo modelo

// ═══════════════════════════════════════════
// MAPPINGS EDITOR (Configuração)
// ═══════════════════════════════════════════
function rMappingsTable() {
  const wrap = document.getElementById('mappingsTableWrap');
  if (!wrap) return;
  const mappings = S.dreMappings || {};
  const entries = Object.entries(mappings).sort((a, b) => a[0].localeCompare(b[0]));

  if (!entries.length) {
    wrap.innerHTML = `<div style="font-size:11px;color:var(--mut);padding:12px 0">
      Nenhum aprendizado salvo ainda. Importe e confirme um DRE para começar.
    </div>`;
    return;
  }

  // Group by category for easier scanning
  const opts = DRE_CATS.map(c =>
    `<option value="${c.id}">${c.icon} ${c.label}</option>`
  ).join('');

  // Search box + table
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <input id="mappingsSearch" type="text" placeholder="Filtrar por nome de conta..."
        class="cfg-inp" style="flex:1;font-size:11px;padding:5px 10px"
        oninput="filterMappings(this.value)">
      <span id="mappingsCountBadge" style="font-size:10px;color:var(--mut);white-space:nowrap">${entries.length} contas</span>
    </div>
    <div style="max-height:360px;overflow-y:auto;border:1px solid var(--bdr);border-radius:10px">
      <table style="width:100%;border-collapse:collapse" id="mappingsTable">
        <thead>
          <tr style="position:sticky;top:0;background:#0a1728;z-index:1">
            <th style="font-size:9px;letter-spacing:1.5px;color:var(--mut);text-align:left;padding:8px 12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid var(--bdr)">Conta do DRE</th>
            <th style="font-size:9px;letter-spacing:1.5px;color:var(--mut);text-align:left;padding:8px 12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid var(--bdr)">Classificação</th>
            <th style="width:40px;border-bottom:1px solid var(--bdr)"></th>
          </tr>
        </thead>
        <tbody id="mappingsTbody">
          ${entries.map(([name, cat]) => _mappingRow(name, cat)).join('')}
        </tbody>
      </table>
    </div>`;
}

function _mappingRow(name, cat) {
  const catObj = DRE_CATS.find(c => c.id === cat);
  const col = catObj?.color || '#64748b';
  const opts = DRE_CATS.map(c =>
    `<option value="${c.id}"${c.id === cat ? ' selected' : ''}>${c.icon} ${c.label}</option>`
  ).join('');
  const key = name.replace(/"/g, '&quot;');
  return `<tr class="mapping-row" data-name="${key}" style="border-bottom:1px solid rgba(255,255,255,.04)">
    <td style="padding:7px 12px;font-size:11px;color:rgba(255,255,255,.7);font-family:'JetBrains Mono',monospace">${name}</td>
    <td style="padding:5px 12px">
      <select class="dre-cat-sel" style="border-color:${col}55;color:${col};font-size:11px;width:100%"
        onchange="mappingUpdate('${key}',this.value,this)">
        ${opts}
      </select>
    </td>
    <td style="padding:5px 8px;text-align:center">
      <button onclick="mappingDelete('${key}')"
        style="background:none;border:none;color:rgba(255,61,90,.4);cursor:pointer;font-size:14px;line-height:1;padding:2px 4px"
        onmouseover="this.style.color='#ff3d5a'" onmouseout="this.style.color='rgba(255,61,90,.4)'">✕</button>
    </td>
  </tr>`;
}

function filterMappings(q) {
  const rows = document.querySelectorAll('#mappingsTbody .mapping-row');
  const ql = q.toLowerCase().trim();
  let visible = 0;
  rows.forEach(r => {
    const name = r.dataset.name.toLowerCase();
    const show = !ql || name.includes(ql);
    r.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const badge = document.getElementById('mappingsCountBadge');
  if (badge) badge.textContent = visible + ' contas';
}

function mappingUpdate(name, newCat, sel) {
  if (!S.dreMappings) S.dreMappings = {};
  S.dreMappings[name] = newCat;
  sv();
  // Update select color
  const catObj = DRE_CATS.find(c => c.id === newCat);
  const col = catObj?.color || '#64748b';
  if (sel) { sel.style.borderColor = col + '55'; sel.style.color = col; }
  toast('✓ Classificação de "' + name + '" atualizada');
}

function mappingDelete(name) {
  if (!S.dreMappings || !S.dreMappings[name]) return;
  delete S.dreMappings[name];
  sv();
  // Remove row from table
  const row = document.querySelector(`[data-name="${name.replace(/"/g,'&quot;')}"]`);
  if (row) row.remove();
  // Update count
  const remaining = Object.keys(S.dreMappings).length;
  const badge = document.getElementById('mappingsCountBadge');
  if (badge) badge.textContent = remaining + ' contas';
  const mcEl = document.getElementById('mappingsCount');
  if (mcEl) mcEl.textContent = remaining > 0
    ? `${remaining} classificações de contas aprendidas para ${S.company||'esta empresa'}`
    : 'Nenhum aprendizado salvo ainda — será criado após a primeira importação';
  if (!remaining) rMappingsTable(); // show empty state
}

function dreModelRenderStatus() {
  const statusEl = document.getElementById('dreModelStatus');
  const clearBtn = document.getElementById('dreModelClearBtn');
  const reviewWrap = document.getElementById('dreModelReviewWrap');
  if (!statusEl) return;

  const model = S.dreModel || {};
  const count = Object.keys(model).length;

  if (count > 0) {
    statusEl.innerHTML = `
      <div style="background:rgba(0,240,200,.06);border:1px solid rgba(0,240,200,.2);border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:12px">
        <span style="font-size:22px">✅</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--teal)">Modelo configurado</div>
          <div style="font-size:11px;color:var(--mut);margin-top:2px">${count} contas classificadas para ${S.company||'esta empresa'}</div>
        </div>
        <button onclick="dreModelOpenReview()" style="margin-left:auto;background:none;border:1px solid rgba(0,240,200,.3);color:var(--teal);border-radius:6px;font-size:11px;padding:4px 12px;cursor:pointer;font-family:'Outfit',sans-serif">
          ✏️ Editar
        </button>
      </div>`;
    if (clearBtn) clearBtn.style.display = 'inline-block';
    if (reviewWrap) reviewWrap.style.display = 'none';
  } else {
    statusEl.innerHTML = `
      <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 16px;font-size:11px;color:var(--mut)">
        Nenhum modelo configurado. Suba um DRE para começar.
      </div>`;
    if (clearBtn) clearBtn.style.display = 'none';
    if (reviewWrap) reviewWrap.style.display = 'none';
  }
}

function dreModelHandleFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      const lines = [];
      rows.forEach(row => {
        const name = String(row[0] || '').trim();
        if (!name || name.length < 2) return;
        // Values can be zero in a model DRE — we just need the account names
        lines.push({ name, value: 0 });
      });
      if (!lines.length) { toast('⚠️ Nenhuma conta encontrada no arquivo'); return; }

      // Pre-classify using existing mappings
      const mappings = S.dreMappings || {};
      const model = S.dreModel || {};
      _dreModelLines = lines.map(l => ({
        ...l,
        category: model[l.name.toLowerCase().trim()]
                || mappings[l.name.toLowerCase().trim()]
                || 'ignorar'
      }));

      const reviewWrap = document.getElementById('dreModelReviewWrap');
      const reviewMsg = document.getElementById('dreModelReviewMsg');
      if (reviewMsg) reviewMsg.textContent = `${lines.length} contas encontradas — revise as classificações antes de salvar`;
      if (reviewWrap) reviewWrap.style.display = 'block';
      input.value = '';
      toast(`✓ ${lines.length} contas carregadas — clique em "Revisar e Salvar"`);
    } catch(err) {
      toast('❌ Erro ao ler o arquivo: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function dreModelOpenReview() {
  // If no lines loaded yet but model exists, rebuild from saved model
  if (!_dreModelLines.length && S.dreModel) {
    _dreModelLines = Object.entries(S.dreModel).map(([name, category]) => ({ name, value: 0, category }));
  }
  if (!_dreModelLines.length) { toast('⚠️ Suba um arquivo primeiro'); return; }

  const body = document.getElementById('dreModelModalBody');
  const sub = document.getElementById('dreModelModalSub');
  if (sub) sub.textContent = `${_dreModelLines.length} contas · classifique cada uma e salve`;

  const opts = DRE_CATS.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('');
  let html = `<table class="dre-tbl" style="width:100%">
    <thead><tr>
      <th>Conta do DRE</th>
      <th>Classificação</th>
    </tr></thead><tbody>`;

  _dreModelLines.forEach((line, i) => {
    const cat = DRE_CATS.find(c => c.id === line.category);
    const col = cat?.color || '#374151';
    html += `<tr class="dre-tbl-row">
      <td class="dre-td-name" title="${line.name}">${line.name}</td>
      <td style="min-width:220px;padding:6px 12px">
        <select class="dre-cat-sel" data-model-idx="${i}"
          style="border-color:${col}55;color:${col}"
          onchange="dreModelUpdateLine(${i},this.value)">
          ${DRE_CATS.map(c => `<option value="${c.id}"${c.id===line.category?' selected':''}>${c.icon} ${c.label}</option>`).join('')}
        </select>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  body.innerHTML = html;
  document.getElementById('dreModelModal').classList.add('open');
}

function dreModelUpdateLine(idx, newCat) {
  _dreModelLines[idx].category = newCat;
  const sel = document.querySelector(`[data-model-idx="${idx}"]`);
  if (sel) {
    const col = DRE_CATS.find(c => c.id === newCat)?.color || '#374151';
    sel.style.borderColor = col + '55';
    sel.style.color = col;
  }
}

function dreModelSave() {
  if (!_dreModelLines.length) return;
  // Save model: name → category (ignoring "ignorar" entries)
  if (!S.dreModel) S.dreModel = {};
  _dreModelLines.forEach(l => {
    if (l.category !== 'ignorar') {
      S.dreModel[l.name.toLowerCase().trim()] = l.category;
    }
  });
  // Also merge into dreMappings so next import benefits immediately
  if (!S.dreMappings) S.dreMappings = {};
  Object.assign(S.dreMappings, S.dreModel);

  sv();
  const count = Object.keys(S.dreModel).length;
  toast(`✓ Modelo salvo — ${count} contas classificadas`);
  dreModelCloseModal();
  dreModelRenderStatus();

  // Refresh mappings count in config
  const mcEl = document.getElementById('mappingsCount');
  if (mcEl) {
    const mc = Object.keys(S.dreMappings).length;
    mcEl.textContent = `${mc} classificações de contas aprendidas para ${S.company||'esta empresa'}`;
  }
}

function dreModelCloseModal() {
  document.getElementById('dreModelModal').classList.remove('open');
}

function dreModelClear() {
  showDelDialog(
    '🗑️ Remover Modelo de DRE',
    'Remover o modelo de DRE configurado? O aprendizado de importações anteriores será mantido.',
    () => {
      S.dreModel = {};
      _dreModelLines = [];
      sv();
      toast('✓ Modelo removido');
      dreModelRenderStatus();
    }
  );
}
