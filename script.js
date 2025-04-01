/**
 * Cartão Fidelidade Academia - CRUD System
 * Este script gerencia as operações CRUD para o cartão fidelidade
 */

// Configurações
const TOTAL_CHECKINS = 10;
const STORAGE_KEY = 'powerFitData';

// Estado da aplicação
let appState = {
    memberInfo: {
        name: 'Carlos Santos',
        plan: 'Premium',
        id: 'A2025-04-125'
    },
    checkins: [],
    adminMode: false
};

// Elementos DOM
const elements = {
    checkinsContainer: document.getElementById('checkinsContainer'),
    statusMessage: document.getElementById('statusMessage'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    toggleAdminModeBtn: document.getElementById('toggleAdminModeBtn'),
    updateMemberInfoBtn: document.getElementById('updateMemberInfoBtn'),
    memberNameInput: document.getElementById('memberNameInput'),
    memberPlanInput: document.getElementById('memberPlanInput'),
    memberIdInput: document.getElementById('memberIdInput'),
    memberNameDisplay: document.getElementById('memberName'),
    memberPlanDisplay: document.getElementById('memberPlan'),
    memberIdDisplay: document.getElementById('memberId')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderCheckins();
    updateMemberInfoDisplay();
    setupEventListeners();
});

/**
 * Configurar os event listeners
 */
function setupEventListeners() {
    // Botões Admin
    elements.resetAllBtn.addEventListener('click', resetAllCheckins);
    elements.toggleAdminModeBtn.addEventListener('click', toggleAdminMode);
    elements.updateMemberInfoBtn.addEventListener('click', updateMemberInfo);
}

/**
 * Gerar os elementos de check-in
 */
function renderCheckins() {
    // Limpar container
    elements.checkinsContainer.innerHTML = '';
    
    // Gerar check-ins
    for (let i = 1; i <= TOTAL_CHECKINS; i++) {
        const isActive = appState.checkins.includes(i);
        const checkinElement = createCheckinElement(i, isActive);
        elements.checkinsContainer.appendChild(checkinElement);
    }
}

/**
 * Criar um elemento de check-in individual
 */
function createCheckinElement(number, isActive) {
    const checkin = document.createElement('div');
    checkin.className = `checkin ${isActive ? 'active' : ''}`;
    checkin.setAttribute('data-number', number);
    checkin.textContent = isActive ? '✓' : number;
    
    // Adicionar botão de remover para admin mode
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Evitar que o clique propague para o check-in
        removeCheckin(number);
    });
    
    // Adicionar evento de clique para registrar check-in
    checkin.addEventListener('click', function() {
        if (!isActive) {
            registerCheckin(number);
        }
    });
    
    // Adicionar botão de remover para modo admin
    if (isActive) {
        checkin.appendChild(removeBtn);
    }
    
    return checkin;
}

/**
 * Registrar um novo check-in
 */
function registerCheckin(number) {
    if (!appState.checkins.includes(number)) {
        appState.checkins.push(number);
        appState.checkins.sort((a, b) => a - b); // Manter ordenado
        saveData();
        renderCheckins();
        showStatusMessage(`Check-in #${number} registrado com sucesso!`);
    }
}

/**
 * Remover um check-in existente
 */
function removeCheckin(number) {
    if (appState.adminMode) {
        appState.checkins = appState.checkins.filter(n => n !== number);
        saveData();
        renderCheckins();
        showStatusMessage(`Check-in #${number} removido!`);
    }
}

/**
 * Resetar todos os check-ins
 */
function resetAllCheckins() {
    if (confirm('Tem certeza que deseja resetar todos os check-ins?')) {
        appState.checkins = [];
        saveData();
        renderCheckins();
        showStatusMessage('Todos os check-ins foram resetados!');
    }
}

/**
 * Alternar modo administrador
 */
function toggleAdminMode() {
    appState.adminMode = !appState.adminMode;
    elements.toggleAdminModeBtn.textContent = appState.adminMode ? 'Modo Normal' : 'Modo Admin';
    
    // Alternar classe para o container
    document.body.classList.toggle('admin-mode', appState.adminMode);
    
    showStatusMessage(appState.adminMode ? 
        'Modo Administrador ativado! Agora você pode remover check-ins.' : 
        'Modo normal ativado.');
    
    renderCheckins();
}

/**
 * Atualizar informações do membro
 */
function updateMemberInfo() {
    const newName = elements.memberNameInput.value.trim();
    const newPlan = elements.memberPlanInput.value;
    const newId = elements.memberIdInput.value.trim();
    
    if (newName) {
        appState.memberInfo.name = newName;
    }
    
    if (newPlan) {
        appState.memberInfo.plan = newPlan;
    }
    
    if (newId) {
        appState.memberInfo.id = newId;
    }
    
    updateMemberInfoDisplay();
    saveData();
    showStatusMessage('Informações do membro atualizadas!');
    
    // Limpar campos
    elements.memberNameInput.value = '';
    elements.memberIdInput.value = '';
}

/**
 * Atualizar as informações exibidas do membro
 */
function updateMemberInfoDisplay() {
    elements.memberNameDisplay.textContent = appState.memberInfo.name;
    elements.memberPlanDisplay.textContent = appState.memberInfo.plan;
    elements.memberIdDisplay.textContent = appState.memberInfo.id;
}

/**
 * Exibir mensagem de status temporária
 */
function showStatusMessage(message, duration = 3000) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.style.display = 'block';
    
    setTimeout(() => {
        elements.statusMessage.style.display = 'none';
    }, duration);
}

/**
 * Salvar dados no localStorage
 */
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        memberInfo: appState.memberInfo,
        checkins: appState.checkins
    }));
}

/**
 * Carregar dados do localStorage
 */
function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Carregar check-ins
        if (parsedData.checkins && Array.isArray(parsedData.checkins)) {
            appState.checkins = parsedData.checkins;
        }
        
        // Carregar informações do membro
        if (parsedData.memberInfo) {
            appState.memberInfo = {
                ...appState.memberInfo,
                ...parsedData.memberInfo
            };
        }
    }
}