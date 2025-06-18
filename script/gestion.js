const API_URL = 'api/data_handler.php';

document.addEventListener('DOMContentLoaded', function() {
    loadAppareils();
    loadTypesSalle();
    loadTypesAppareil();
    loadSallesForSelect();
    setupEventListeners();
    initConsommationChart();
    
    // Gestion du menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
});

async function loadSalles() {
    try {
        const response = await fetch(`${API_URL}?action=get&file=salles`);
        const result = await response.json();
        
        if (result.success) {
            // Stocker les données dans la variable globale
            sallesData = result.data;
            
            const sallesGrid = document.getElementById('salles-grid');
            sallesGrid.innerHTML = '';
            
            result.data.forEach(salle => {
                const salleCard = createSalleCard(salle);
                sallesGrid.appendChild(salleCard);
            });
        } else {
            console.error('Erreur lors du chargement des salles:', result.error);
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
    }
}

// Fonction pour recharger les salles sans recharger les appareils
function reloadSallesOnly() {
    const sallesGrid = document.getElementById('salles-grid');
    sallesGrid.innerHTML = '';
    
    sallesData.forEach(salle => {
        const salleCard = createSalleCard(salle);
        sallesGrid.appendChild(salleCard);
    });
}

function createSalleCard(salle) {
    const card = document.createElement('div');
    card.className = 'card hover:shadow-lg transition-all duration-300';
    
    // Calculer le nombre d'appareils dans cette salle
    const appareilsSalle = appareilsData.filter(a => a.salle_id === salle.id);
    const appareilsActifs = appareilsSalle.filter(a => a.statut_alimentation).length;
    const totalAppareils = appareilsSalle.length;
    
    // Obtenir le type de salle
    const typeSalle = getTypeSalleName(salle.type_id);
    
    // Calculer la consommation simulée
    const consommation = appareilsActifs * 2.5; // 2.5 kWh par appareil actif
    
    // Déterminer l'icône selon le type de salle
    const icon = getSalleIcon(salle.type_id);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="flex items-center gap-3">
                <div class="text-accent text-2xl">
                    ${icon}
                </div>
                <div class="flex-1">
                    <h3 class="card-title">${salle.nom}</h3>
                    <p class="card-subtitle">${typeSalle} • Étage ${salle.etage} • ${salle.superficie}m²</p>
                </div>
            </div>
            <div class="badge ${salle.statut_alimentation ? 'badge-success' : 'badge-danger'}">
                ${salle.statut_alimentation ? 'Allumé' : 'Éteint'}
            </div>
        </div>
        <div class="card-content">
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center p-3 bg-primary/10 rounded-lg">
                    <div class="text-2xl font-bold text-primary">${totalAppareils}</div>
                    <div class="text-sm text-gray-400">Appareils</div>
                </div>
                <div class="text-center p-3 bg-accent/10 rounded-lg">
                    <div class="text-2xl font-bold text-accent">${appareilsActifs}</div>
                    <div class="text-sm text-gray-400">Actifs</div>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-400">Consommation actuelle:</span>
                    <span class="text-lg font-bold text-primary">${consommation.toFixed(1)} kWh</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300" 
                         style="width: ${totalAppareils > 0 ? (appareilsActifs / totalAppareils) * 100 : 0}%"></div>
                </div>
                <div class="text-xs text-gray-500 text-center">
                    ${appareilsActifs}/${totalAppareils} appareils actifs
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="flex gap-2">
                <button onclick="toggleSalleAlimentation(${salle.id})" 
                        class="btn ${salle.statut_alimentation ? 'btn-danger' : 'btn-success'} btn-sm flex-1">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="${salle.statut_alimentation ? 'M6 18L18 6M6 6l12 12' : 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'}"/>
                    </svg>
                    ${salle.statut_alimentation ? 'Éteindre' : 'Allumer'}
                </button>
                <button onclick="viewSalleDetails(${salle.id})" 
                        class="btn btn-outline btn-sm">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    return card;
}

async function loadAppareils() {
    try {
        const response = await fetch(`${API_URL}?action=get&file=appareils`);
        const result = await response.json();
        
        if (result.success) {
            // Stocker les données dans la variable globale
            appareilsData = result.data;
            
            const appareilsGrid = document.getElementById('appareils-grid');
            appareilsGrid.innerHTML = '';
            
            result.data.forEach(appareil => {
                const appareilCard = createAppareilCard(appareil);
                appareilsGrid.appendChild(appareilCard);
            });
            
            // Charger les salles après les appareils
            loadSalles();
        } else {
            console.error('Erreur lors du chargement des appareils:', result.error);
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
    }
}

function createAppareilCard(appareil) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Obtenir le nom de la salle
    const salleName = getSalleName(appareil.salle_id);
    
    card.innerHTML = `
        <div class="card-header">
            <div>
                <h3 class="card-title">${appareil.nom}</h3>
                <p class="card-subtitle">Installé le ${appareil.date_installation}</p>
            </div>
            <div class="badge ${appareil.statut_alimentation ? 'badge-success' : 'badge-danger'}">
                ${appareil.statut_alimentation ? 'Allumé' : 'Éteint'}
            </div>
        </div>
        <div class="card-content">
            <p class="text-muted mb-4">Salle: <span class="text-primary">${salleName}</span></p>
        </div>
        <div class="card-footer">
            <button onclick="toggleAppareilAlimentation(${appareil.id})" 
                    class="btn ${appareil.statut_alimentation ? 'btn-danger' : 'btn-success'} btn-sm">
                ${appareil.statut_alimentation ? 'Éteindre' : 'Allumer'}
            </button>
            <span class="text-sm text-muted">ID: ${appareil.id}</span>
        </div>
    `;
    return card;
}

// Variable globale pour stocker les salles
let sallesData = [];

// Variable globale pour stocker les appareils
let appareilsData = [];

// Variable globale pour stocker la salle actuellement sélectionnée
let currentSalleId = null;

// Fonction pour obtenir le nom de la salle
function getSalleName(salleId) {
    const salle = sallesData.find(s => s.id === salleId);
    return salle ? salle.nom : `Salle ID ${salleId}`;
}

// Fonction pour obtenir le nom du type de salle
function getTypeSalleName(typeId) {
    const typesSalle = [
        { id: 1, nom: "Bureau" },
        { id: 2, nom: "Salle de réunion" },
        { id: 3, nom: "Laboratoire" },
        { id: 4, nom: "Salle de classe" },
        { id: 5, nom: "Amphithéâtre" }
    ];
    const type = typesSalle.find(t => t.id === typeId);
    return type ? type.nom : "Type inconnu";
}

// Fonction pour obtenir l'icône selon le type de salle
function getSalleIcon(typeId) {
    const icons = {
        1: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
        2: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
        3: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
        4: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
        5: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>'
    };
    return icons[typeId] || icons[1]; // Retourne l'icône bureau par défaut
}

// Fonction pour voir les détails d'une salle
function viewSalleDetails(salleId) {
    currentSalleId = salleId;
    const salle = sallesData.find(s => s.id === salleId);
    const appareilsSalle = appareilsData.filter(a => a.salle_id === salleId);
    
    if (salle) {
        // Remplir les informations de la salle
        document.getElementById('salle-details-title').textContent = `Détails de ${salle.nom}`;
        document.getElementById('salle-details-nom').textContent = salle.nom;
        document.getElementById('salle-details-type').textContent = getTypeSalleName(salle.type_id);
        document.getElementById('salle-details-etage').textContent = salle.etage;
        document.getElementById('salle-details-superficie').textContent = `${salle.superficie}m²`;
        
        // Mettre à jour le statut
        const statutElement = document.getElementById('salle-details-statut');
        statutElement.textContent = salle.statut_alimentation ? 'Allumée' : 'Éteinte';
        statutElement.className = `badge ${salle.statut_alimentation ? 'badge-success' : 'badge-danger'}`;
        
        // Mettre à jour les statistiques
        const totalAppareils = appareilsSalle.length;
        const appareilsActifs = appareilsSalle.filter(a => a.statut_alimentation).length;
        const consommation = appareilsActifs * 2.5;
        
        document.getElementById('salle-details-total-appareils').textContent = totalAppareils;
        document.getElementById('salle-details-appareils-actifs').textContent = appareilsActifs;
        document.getElementById('salle-details-consommation').textContent = `${consommation.toFixed(1)} kWh`;
        
        // Mettre à jour la barre de progression
        const progressElement = document.getElementById('salle-details-progress');
        const progressWidth = totalAppareils > 0 ? (appareilsActifs / totalAppareils) * 100 : 0;
        progressElement.style.width = `${progressWidth}%`;
        
        // Mettre à jour le bouton de toggle
        const toggleBtn = document.getElementById('salle-details-toggle-btn');
        toggleBtn.textContent = salle.statut_alimentation ? 'Éteindre la Salle' : 'Allumer la Salle';
        toggleBtn.className = `btn ${salle.statut_alimentation ? 'btn-danger' : 'btn-success'} w-full`;
        toggleBtn.onclick = () => toggleSalleAlimentation(salleId);
        
        // Afficher la liste des appareils
        displaySalleAppareils(appareilsSalle);
        
        // Ouvrir le modal
        showModal('salle-details-modal');
    }
}

// Fonction pour afficher les appareils d'une salle
function displaySalleAppareils(appareils) {
    const container = document.getElementById('salle-appareils-list');
    container.innerHTML = '';
    
    if (appareils.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mx-auto mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
                <p>Aucun appareil dans cette salle</p>
                <button onclick="showModal('appareil-modal')" class="btn btn-primary btn-sm mt-4">
                    Ajouter le premier appareil
                </button>
            </div>
        `;
        return;
    }
    
    appareils.forEach(appareil => {
        const appareilCard = createSalleAppareilCard(appareil);
        container.appendChild(appareilCard);
    });
}

// Fonction pour créer une carte d'appareil dans le modal de salle
function createSalleAppareilCard(appareil) {
    const card = document.createElement('div');
    card.className = 'card hover:shadow-md transition-all duration-200';
    
    // Obtenir le type d'appareil
    const typeAppareil = getTypeAppareilName(appareil.type_id);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="flex items-center gap-3">
                <div class="text-accent">
                    ${getAppareilIcon(appareil.type_id)}
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-white">${appareil.nom}</h4>
                    <p class="text-sm text-gray-400">${typeAppareil} • Installé le ${appareil.date_installation}</p>
                </div>
            </div>
            <div class="badge ${appareil.statut_alimentation ? 'badge-success' : 'badge-danger'}">
                ${appareil.statut_alimentation ? 'Allumé' : 'Éteint'}
            </div>
        </div>
        <div class="card-content">
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-400">
                    Consommation: <span class="text-primary font-semibold">${appareil.statut_alimentation ? '2.5' : '0'} kWh</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="toggleAppareilAlimentation(${appareil.id})" 
                            class="btn ${appareil.statut_alimentation ? 'btn-danger' : 'btn-success'} btn-sm">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-1">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="${appareil.statut_alimentation ? 'M6 18L18 6M6 6l12 12' : 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'}"/>
                        </svg>
                        ${appareil.statut_alimentation ? 'Éteindre' : 'Allumer'}
                    </button>
                    <button onclick="deleteAppareil(${appareil.id})" 
                            class="btn btn-outline btn-sm text-red-400 hover:text-red-300">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Fonction pour obtenir le nom du type d'appareil
function getTypeAppareilName(typeId) {
    const typesAppareil = [
        { id: 1, nom: "Climatiseur" },
        { id: 2, nom: "Éclairage" },
        { id: 3, nom: "Ordinateur" },
        { id: 4, nom: "Projecteur" },
        { id: 5, nom: "Imprimante" },
        { id: 6, nom: "Ventilateur" },
        { id: 7, nom: "Chauffage" }
    ];
    const type = typesAppareil.find(t => t.id === typeId);
    return type ? type.nom : "Type inconnu";
}

// Fonction pour obtenir l'icône selon le type d'appareil
function getAppareilIcon(typeId) {
    const icons = {
        1: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>',
        2: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
        3: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
        4: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
        5: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>',
        6: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
        7: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
    };
    return icons[typeId] || icons[3]; // Retourne l'icône ordinateur par défaut
}

// Fonction pour basculer tous les appareils d'une salle
async function toggleAllAppareilsInSalle() {
    if (!currentSalleId) return;
    
    const appareilsSalle = appareilsData.filter(a => a.salle_id === currentSalleId);
    const salle = sallesData.find(s => s.id === currentSalleId);
    
    if (!salle || appareilsSalle.length === 0) return;
    
    const newStatus = !salle.statut_alimentation;
    
    try {
        // Mettre à jour la salle
        await fetch(`${API_URL}?action=update&file=salles&id=${currentSalleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut_alimentation: newStatus })
        });
        
        // Mettre à jour tous les appareils de la salle
        const updatePromises = appareilsSalle.map(appareil => 
            fetch(`${API_URL}?action=update&file=appareils&id=${appareil.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ statut_alimentation: newStatus })
            })
        );
        
        await Promise.all(updatePromises);
        
        // Mettre à jour les données locales
        salle.statut_alimentation = newStatus;
        appareilsSalle.forEach(appareil => {
            appareil.statut_alimentation = newStatus;
        });
        
        // Recharger l'affichage
        reloadSallesOnly();
        reloadAppareilsOnly();
        viewSalleDetails(currentSalleId); // Recharger le modal
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour des appareils');
    }
}

// Fonction pour supprimer un appareil
async function deleteAppareil(appareilId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) return;
    
    try {
        const response = await fetch(`${API_URL}?action=delete&file=appareils&id=${appareilId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            // Supprimer de la liste locale
            appareilsData = appareilsData.filter(a => a.id !== appareilId);
            
            // Recharger l'affichage
            reloadSallesOnly();
            reloadAppareilsOnly();
            
            // Si on est dans le modal d'une salle, recharger le modal
            if (currentSalleId) {
                viewSalleDetails(currentSalleId);
            }
            
            alert('Appareil supprimé avec succès!');
        } else {
            alert('Erreur lors de la suppression: ' + result.error);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'appareil');
    }
}

async function loadTypesSalle() {
    try {
        const response = await fetch(`${API_URL}?action=get&file=types_salle`);
        const result = await response.json();
        
        if (result.success) {
            const select = document.getElementById('salle-type');
            select.innerHTML = '<option value="">Sélectionner un type</option>';
            
            result.data.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.nom;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des types de salle:', error);
    }
}

async function loadTypesAppareil() {
    try {
        const response = await fetch(`${API_URL}?action=get&file=types_appareil`);
        const result = await response.json();
        
        if (result.success) {
            const select = document.getElementById('appareil-type');
            select.innerHTML = '<option value="">Sélectionner un type</option>';
            
            result.data.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.nom;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des types d\'appareil:', error);
    }
}

function setupEventListeners() {
    // Formulaire d'ajout de salle
    const salleForm = document.getElementById('salle-form');
    if (salleForm) {
        salleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(salleForm);
            const salleData = {
                nom: formData.get('nom'),
                type_id: parseInt(formData.get('type')),
                etage: parseInt(formData.get('etage')),
                superficie: parseFloat(formData.get('superficie')),
                statut_alimentation: true
            };
            
            try {
                const response = await fetch(`${API_URL}?action=add&file=salles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(salleData)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('Salle ajoutée avec succès!');
                    salleForm.reset();
                    hideModal('salle-modal');
                    loadSalles();
                    loadSallesForSelect();
                } else {
                    alert('Erreur lors de l\'ajout de la salle: ' + result.error);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'ajout de la salle');
            }
        });
    }
    
    // Formulaire d'ajout d'appareil
    const appareilForm = document.getElementById('appareil-form');
    if (appareilForm) {
        appareilForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(appareilForm);
            const appareilData = {
                nom: formData.get('nom'),
                type_id: parseInt(formData.get('type')),
                salle_id: parseInt(formData.get('salle')),
                date_installation: formData.get('date'),
                statut_alimentation: true
            };
            
            try {
                const response = await fetch(`${API_URL}?action=add&file=appareils`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appareilData)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('Appareil ajouté avec succès!');
                    appareilForm.reset();
                    hideModal('appareil-modal');
                    loadAppareils();
                    
                    // Si on est dans le modal de détails d'une salle et que l'appareil a été ajouté à cette salle, recharger le modal
                    if (currentSalleId && appareilData.salle_id === currentSalleId) {
                        viewSalleDetails(currentSalleId);
                    }
                } else {
                    alert('Erreur lors de l\'ajout de l\'appareil: ' + result.error);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'ajout de l\'appareil');
            }
        });
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

async function toggleSalleAlimentation(salleId) {
    try {
        const response = await fetch(`${API_URL}?action=getById&file=salles&id=${salleId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const salle = result.data;
            const newStatus = !salle.statut_alimentation;
            
            const updateResponse = await fetch(`${API_URL}?action=update&file=salles&id=${salleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ statut_alimentation: newStatus })
            });
            
            const updateResult = await updateResponse.json();
            if (updateResult.success) {
                // Mettre à jour les données locales
                const salleIndex = sallesData.findIndex(s => s.id === salleId);
                if (salleIndex !== -1) {
                    sallesData[salleIndex].statut_alimentation = newStatus;
                }
                reloadSallesOnly();
                
                // Si on est dans le modal de détails de cette salle, recharger le modal
                if (currentSalleId === salleId) {
                    viewSalleDetails(salleId);
                }
            } else {
                alert('Erreur lors de la mise à jour du statut');
            }
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du statut');
    }
}

async function toggleAppareilAlimentation(appareilId) {
    try {
        const response = await fetch(`${API_URL}?action=getById&file=appareils&id=${appareilId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const appareil = result.data;
            const newStatus = !appareil.statut_alimentation;
            
            const updateResponse = await fetch(`${API_URL}?action=update&file=appareils&id=${appareilId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ statut_alimentation: newStatus })
            });
            
            const updateResult = await updateResponse.json();
            if (updateResult.success) {
                // Mettre à jour les données locales
                const appareilIndex = appareilsData.findIndex(a => a.id === appareilId);
                if (appareilIndex !== -1) {
                    appareilsData[appareilIndex].statut_alimentation = newStatus;
                }
                reloadAppareilsOnly();
                reloadSallesOnly(); // Recharger les salles pour mettre à jour les statistiques
                
                // Si on est dans le modal de détails d'une salle, recharger le modal
                if (currentSalleId && appareil.salle_id === currentSalleId) {
                    viewSalleDetails(currentSalleId);
                }
            } else {
                alert('Erreur lors de la mise à jour du statut');
            }
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du statut');
    }
}

// Fonction pour recharger les appareils sans recharger les salles
function reloadAppareilsOnly() {
    const appareilsGrid = document.getElementById('appareils-grid');
    appareilsGrid.innerHTML = '';
    
    appareilsData.forEach(appareil => {
        const appareilCard = createAppareilCard(appareil);
        appareilsGrid.appendChild(appareilCard);
    });
}

function initConsommationChart() {
    const ctx = document.getElementById('consommation-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Consommation (kWh)',
                data: [],
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#E5E7EB'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#E5E7EB'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#E5E7EB'
                    }
                }
            }
        }
    });
    
    // Mettre à jour le graphique toutes les 5 minutes
    setInterval(() => {
        updateConsommationChart(chart);
    }, 300000);
    
    // Mise à jour initiale
    updateConsommationChart(chart);
}

async function updateConsommationChart(chart) {
    try {
        const response = await fetch(`${API_URL}?action=get&file=salles`);
        const result = await response.json();
        
        if (result.success) {
            const labels = result.data.map(salle => salle.nom);
            const data = result.data.map(salle => Math.random() * 50); // Données simulées
            
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.update();
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du graphique:', error);
    }
}

async function loadSallesForSelect() {
    try {
        const response = await fetch(`${API_URL}?action=get&file=salles`);
        const result = await response.json();
        
        if (result.success) {
            const select = document.getElementById('appareil-salle');
            select.innerHTML = '<option value="">Sélectionner une salle</option>';
            
            result.data.forEach(salle => {
                const option = document.createElement('option');
                option.value = salle.id;
                option.textContent = `${salle.nom} (Étage ${salle.etage})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des salles pour le select:', error);
    }
}