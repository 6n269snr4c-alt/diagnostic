// ═══════════════════════════════════════════
// MÓDULO DE PROJETOS
// ═══════════════════════════════════════════

// Estado temporário do projeto sendo editado
let _editingProject = null;

// ═══════════════════════════════════════════
// RENDERIZAÇÃO DA LISTA DE PROJETOS
// ═══════════════════════════════════════════
function rProjects() {
  if (!S.projects) S.projects = [];
  
  const cont = document.getElementById('projectsList');
  if (!cont) return;
  
  // Se não há projetos, mostra tela vazia
  if (S.projects.length === 0) {
    cont.innerHTML = `
      <div style="text-align:center;padding:80px 20px;color:var(--mut)">
        <div style="font-size:64px;margin-bottom:16px">📂</div>
        <div style="font-size:18px;font-weight:600;margin-bottom:8px;color:var(--fg)">Nenhum projeto cadastrado</div>
        <div style="font-size:14px;margin-bottom:24px">Crie seu primeiro projeto para agrupar planos de ação e acompanhar o progresso</div>
        <button class="btn" onclick="newProject()">➕ Criar Primeiro Projeto</button>
      </div>
    `;
    return;
  }
  
  // Renderiza lista de projetos
  let html = '';
  
  S.projects.forEach((proj, idx) => {
    const progress = calcProjectProgress(proj);
    const status = getProjectStatus(proj);
    const actionCount = proj.actionIds?.length || 0;
    const doneCount = (proj.actionIds || []).filter(aid => {
      const act = S.actions.find(a => a.id === aid);
      return act && act.status === 'done';
    }).length;
    
    // Calcular dias restantes
    const today = new Date();
    const deadline = new Date(proj.deadline);
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    let deadlineText = '';
    let deadlineClass = '';
    if (daysLeft < 0) {
      deadlineText = `${Math.abs(daysLeft)} dias atrasado`;
      deadlineClass = 'status-overdue';
    } else if (daysLeft === 0) {
      deadlineText = 'Vence hoje';
      deadlineClass = 'status-urgent';
    } else if (daysLeft <= 7) {
      deadlineText = `${daysLeft} dias restantes`;
      deadlineClass = 'status-urgent';
    } else if (daysLeft <= 30) {
      deadlineText = `${daysLeft} dias restantes`;
      deadlineClass = 'status-warning';
    } else {
      deadlineText = `${daysLeft} dias restantes`;
      deadlineClass = '';
    }
    
    html += `
      <div class="project-card" onclick="viewProject(${idx})">
        <div class="project-header">
          <div>
            <div class="project-title">${proj.name}</div>
            <div class="project-objective">${proj.objective || ''}</div>
          </div>
          <div class="project-actions-btn">
            <button class="btn-icon" onclick="event.stopPropagation();editProject(${idx})" title="Editar">✏️</button>
            <button class="btn-icon" onclick="event.stopPropagation();deleteProject(${idx})" title="Excluir">🗑️</button>
          </div>
        </div>
        
        <div class="project-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width:${progress}%"></div>
          </div>
          <div class="progress-text">${progress}%</div>
        </div>
        
        <div class="project-stats">
          <div class="stat-item">
            <span class="stat-icon">📋</span>
            <span class="stat-text">${doneCount}/${actionCount} ações concluídas</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📅</span>
            <span class="stat-text">${formatDate(proj.deadline)}</span>
          </div>
          <div class="stat-item ${deadlineClass}">
            <span class="stat-icon">⏱️</span>
            <span class="stat-text">${deadlineText}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  cont.innerHTML = html;
}

// ═══════════════════════════════════════════
// CÁLCULO DE PROGRESSO
// ═══════════════════════════════════════════
function calcProjectProgress(proj) {
  if (!proj.actionIds || proj.actionIds.length === 0) return 0;
  
  const doneCount = proj.actionIds.filter(aid => {
    const act = S.actions.find(a => a.id === aid);
    return act && act.status === 'done';
  }).length;
  
  return Math.round((doneCount / proj.actionIds.length) * 100);
}

// ═══════════════════════════════════════════
// STATUS DO PROJETO
// ═══════════════════════════════════════════
function getProjectStatus(proj) {
  const progress = calcProjectProgress(proj);
  const today = new Date();
  const deadline = new Date(proj.deadline);
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  if (progress === 100) return { label: 'Concluído', class: 'status-done', icon: '✅' };
  if (daysLeft < 0) return { label: 'Atrasado', class: 'status-overdue', icon: '⚠️' };
  if (daysLeft <= 7) return { label: 'Urgente', class: 'status-urgent', icon: '🔥' };
  if (daysLeft <= 30) return { label: 'Atenção', class: 'status-warning', icon: '⏰' };
  return { label: 'No prazo', class: 'status-ok', icon: '✓' };
}

// ═══════════════════════════════════════════
// NOVO PROJETO
// ═══════════════════════════════════════════
function newProject() {
  _editingProject = null;
  showProjectModal();
}

// ═══════════════════════════════════════════
// EDITAR PROJETO
// ═══════════════════════════════════════════
function editProject(idx) {
  _editingProject = idx;
  showProjectModal(S.projects[idx]);
}

// ═══════════════════════════════════════════
// VISUALIZAR PROJETO
// ═══════════════════════════════════════════
function viewProject(idx) {
  const proj = S.projects[idx];
  if (!proj) return;
  
  const progress = calcProjectProgress(proj);
  const status = getProjectStatus(proj);
  const actionCount = proj.actionIds?.length || 0;
  const doneCount = (proj.actionIds || []).filter(aid => {
    const act = S.actions.find(a => a.id === aid);
    return act && act.status === 'done';
  }).length;
  
  // Listar ações do projeto
  let actionsHTML = '';
  if (!proj.actionIds || proj.actionIds.length === 0) {
    actionsHTML = '<div style="text-align:center;padding:40px;color:var(--mut)">Nenhuma ação vinculada a este projeto</div>';
  } else {
    proj.actionIds.forEach(aid => {
      const act = S.actions.find(a => a.id === aid);
      if (!act) return;
      
      const statusIcon = act.status === 'done' ? '✅' : act.status === 'cancelled' ? '❌' : '⏳';
      const statusText = act.status === 'done' ? 'Concluído' : act.status === 'cancelled' ? 'Cancelado' : 'Em aberto';
      
      actionsHTML += `
        <div class="action-item">
          <div class="action-checkbox">
            <input type="checkbox" ${act.status === 'done' ? 'checked' : ''} 
                   onchange="toggleActionFromProject('${act.id}', this.checked)">
          </div>
          <div class="action-content">
            <div class="action-title">${act.title}</div>
            <div class="action-meta">
              <span>${statusIcon} ${statusText}</span>
              ${act.responsible ? `<span>👤 ${act.responsible}</span>` : ''}
              ${act.deadline ? `<span>📅 ${formatDate(act.deadline)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    });
  }
  
  // Criar modal de visualização
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:800px">
      <div class="modal-header">
        <div>
          <div style="font-size:24px;font-weight:600;margin-bottom:8px">${proj.name}</div>
          <div style="color:var(--mut);font-size:14px">${proj.objective || ''}</div>
        </div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px">
          <div class="info-card">
            <div class="info-label">Progresso</div>
            <div class="info-value">${progress}%</div>
            <div class="progress-bar-container" style="margin-top:8px">
              <div class="progress-bar-fill" style="width:${progress}%"></div>
            </div>
          </div>
          
          <div class="info-card">
            <div class="info-label">Status</div>
            <div class="info-value ${status.class}">${status.icon} ${status.label}</div>
          </div>
          
          <div class="info-card">
            <div class="info-label">Prazo</div>
            <div class="info-value">${formatDate(proj.deadline)}</div>
          </div>
          
          <div class="info-card">
            <div class="info-label">Ações</div>
            <div class="info-value">${doneCount}/${actionCount}</div>
          </div>
        </div>
        
        <div style="margin-bottom:16px">
          <div style="font-weight:600;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
            <span>📋 Planos de Ação</span>
            <button class="btn-sm" onclick="linkActionsToProject(${idx})">➕ Vincular Ações</button>
          </div>
          <div class="actions-list">
            ${actionsHTML}
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn" onclick="editProject(${idx});this.closest('.modal-overlay').remove()">✏️ Editar Projeto</button>
        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Fechar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════════
// TOGGLE AÇÃO DO PROJETO
// ═══════════════════════════════════════════
function toggleActionFromProject(actionId, checked) {
  const act = S.actions.find(a => a.id === actionId);
  if (!act) return;
  
  act.status = checked ? 'done' : 'open';
  sv();
  
  // Atualizar UI
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    const idx = S.projects.findIndex(p => p.actionIds?.includes(actionId));
    if (idx >= 0) {
      modal.remove();
      viewProject(idx);
    }
  }
}

// ═══════════════════════════════════════════
// VINCULAR AÇÕES AO PROJETO
// ═══════════════════════════════════════════
function linkActionsToProject(projIdx) {
  const proj = S.projects[projIdx];
  if (!proj) return;
  
  // Fechar modal atual
  document.querySelector('.modal-overlay')?.remove();
  
  // Listar ações disponíveis (que não estão canceladas)
  const availableActions = S.actions.filter(a => a.status !== 'cancelled');
  
  if (availableActions.length === 0) {
    toast('⚠️ Nenhuma ação disponível para vincular');
    viewProject(projIdx);
    return;
  }
  
  let actionsHTML = '';
  availableActions.forEach(act => {
    const isLinked = proj.actionIds?.includes(act.id);
    actionsHTML += `
      <div class="action-item">
        <div class="action-checkbox">
          <input type="checkbox" ${isLinked ? 'checked' : ''} 
                 data-action-id="${act.id}">
        </div>
        <div class="action-content">
          <div class="action-title">${act.title}</div>
          <div class="action-meta">
            ${act.responsible ? `<span>👤 ${act.responsible}</span>` : ''}
            ${act.deadline ? `<span>📅 ${formatDate(act.deadline)}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  });
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:600px">
      <div class="modal-header">
        <div style="font-size:18px;font-weight:600">Vincular Ações ao Projeto</div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove();viewProject(${projIdx})">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="actions-list">
          ${actionsHTML}
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn" onclick="saveLinkedActions(${projIdx})">💾 Salvar</button>
        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove();viewProject(${projIdx})">Cancelar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════════
// SALVAR AÇÕES VINCULADAS
// ═══════════════════════════════════════════
function saveLinkedActions(projIdx) {
  const proj = S.projects[projIdx];
  if (!proj) return;
  
  const checkboxes = document.querySelectorAll('.modal-overlay input[type="checkbox"][data-action-id]');
  const linkedIds = [];
  
  checkboxes.forEach(cb => {
    if (cb.checked) {
      linkedIds.push(cb.dataset.actionId);
    }
  });
  
  proj.actionIds = linkedIds;
  sv();
  
  toast('✓ Ações vinculadas ao projeto');
  document.querySelector('.modal-overlay').remove();
  viewProject(projIdx);
}

// ═══════════════════════════════════════════
// MODAL DE CRIAÇÃO/EDIÇÃO
// ═══════════════════════════════════════════
function showProjectModal(proj = null) {
  const isEdit = proj !== null;
  const title = isEdit ? 'Editar Projeto' : 'Novo Projeto';
  
  // Data padrão: 3 meses a partir de hoje
  const defaultDeadline = new Date();
  defaultDeadline.setMonth(defaultDeadline.getMonth() + 3);
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:600px">
      <div class="modal-header">
        <div style="font-size:18px;font-weight:600">${title}</div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Nome do Projeto *</label>
          <input type="text" id="projName" class="form-input" 
                 value="${proj?.name || ''}" 
                 placeholder="Ex: Reduzir custos em 15%">
        </div>
        
        <div class="form-group">
          <label>Objetivo</label>
          <textarea id="projObjective" class="form-input" rows="3" 
                    placeholder="Ex: Melhorar margem operacional através da redução de custos fixos">${proj?.objective || ''}</textarea>
        </div>
        
        <div class="form-group">
          <label>Prazo Final *</label>
          <input type="date" id="projDeadline" class="form-input" 
                 value="${proj?.deadline || defaultDeadline.toISOString().split('T')[0]}">
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn" onclick="saveProject()">${isEdit ? '💾 Salvar' : '➕ Criar Projeto'}</button>
        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('projName').focus();
}

// ═══════════════════════════════════════════
// SALVAR PROJETO
// ═══════════════════════════════════════════
function saveProject() {
  const name = document.getElementById('projName').value.trim();
  const objective = document.getElementById('projObjective').value.trim();
  const deadline = document.getElementById('projDeadline').value;
  
  if (!name) {
    toast('⚠️ Preencha o nome do projeto');
    return;
  }
  
  if (!deadline) {
    toast('⚠️ Defina um prazo para o projeto');
    return;
  }
  
  const projectData = {
    id: _editingProject !== null ? S.projects[_editingProject].id : 'proj_' + Date.now(),
    name,
    objective,
    deadline,
    actionIds: _editingProject !== null ? S.projects[_editingProject].actionIds || [] : [],
    createdAt: _editingProject !== null ? S.projects[_editingProject].createdAt : new Date().toISOString()
  };
  
  if (_editingProject !== null) {
    // Editar existente
    S.projects[_editingProject] = projectData;
    toast('✓ Projeto atualizado');
  } else {
    // Criar novo
    if (!S.projects) S.projects = [];
    S.projects.push(projectData);
    toast('✓ Projeto criado');
  }
  
  sv();
  document.querySelector('.modal-overlay').remove();
  rProjects();
}

// ═══════════════════════════════════════════
// EXCLUIR PROJETO
// ═══════════════════════════════════════════
function deleteProject(idx) {
  const proj = S.projects[idx];
  if (!proj) return;
  
  showDelDialog(
    '🗑️ Excluir Projeto',
    `Tem certeza que deseja excluir o projeto "${proj.name}"? As ações vinculadas não serão excluídas.`,
    () => {
      S.projects.splice(idx, 1);
      sv();
      toast('✓ Projeto excluído');
      rProjects();
    }
  );
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00'); // Force noon to avoid timezone issues
  return d.toLocaleDateString('pt-BR');
}
