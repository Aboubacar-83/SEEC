# 🏢 SEEC - Système d'Électrification et d'Économie de Consommation

[![PHP](https://img.shields.io/badge/PHP-7.4+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

> **Application web moderne de gestion intelligente de la consommation électrique dans un bâtiment**

## 📋 Table des Matières

- [🎯 Vue d'Ensemble](#-vue-densemble)
- [🚀 Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture Technique](#️-architecture-technique)
- [🔐 Sécurité](#-sécurité)
- [📊 Système de Données](#-système-de-données)
- [⚡ Installation](#-installation)
- [🎮 Utilisation](#-utilisation)
- [🔧 API Documentation](#-api-documentation)
- [📈 Évolutions Futures](#-évolutions-futures)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## 🎯 Vue d'Ensemble

**SEEC** est une solution complète de gestion de la consommation électrique qui permet de surveiller, contrôler et optimiser l'utilisation de l'électricité par salle et par appareil dans un bâtiment. L'application offre une interface moderne et intuitive pour une gestion granulaire de l'énergie.

### ✨ Points Clés

- 🔌 **Contrôle Granulaire** : Gestion au niveau salle ET appareil
- 📊 **Statistiques en Temps Réel** : Consommation et métriques live
- 🎨 **Interface Moderne** : Design responsive et intuitif
- 🔒 **Sécurisé** : Validation et sanitisation des données
- 📱 **Multi-Plateforme** : Compatible desktop et mobile

---

## 🚀 Fonctionnalités

### 🏠 Gestion des Salles
- ✅ **CRUD Complet** : Ajout, modification, suppression de salles
- ✅ **Types de Salles** : Bureau, Salle de réunion, Laboratoire, Salle de classe, Amphithéâtre
- ✅ **Attributs Détaillés** : Nom, Type, Étage, Superficie, Statut d'alimentation
- ✅ **Contrôle Électrique** : Allumage/Extinction par salle
- ✅ **Statistiques Live** : Nombre d'appareils, appareils actifs, consommation

### 💻 Gestion des Appareils
- ✅ **CRUD Complet** : Ajout, modification, suppression d'appareils
- ✅ **Types d'Appareils** : Climatiseur, Éclairage, Ordinateur, Projecteur, Imprimante, Ventilateur, Chauffage
- ✅ **Attribution Intelligente** : Chaque appareil assigné à une salle spécifique
- ✅ **Contrôle Individuel** : Allumage/Extinction par appareil
- ✅ **Suivi de Consommation** : Estimation en temps réel (2.5 kWh par appareil actif)

### 🎛️ Interface de Gestion Avancée
- ✅ **Modal de Détails** : Vue complète de chaque salle avec tous ses appareils
- ✅ **Gestion Granulaire** : Contrôle au niveau salle ET appareil
- ✅ **Ajout Contextuel** : Ajout d'appareils directement depuis le modal de salle
- ✅ **Statistiques Visuelles** : Barres de progression, compteurs, indicateurs
- ✅ **Interface Responsive** : Adaptation parfaite mobile/desktop

### 📊 Tableau de Bord Analytique
- ✅ **Vue d'Ensemble** : Statistiques globales du bâtiment
- ✅ **Graphiques Interactifs** : Évolution de la consommation avec Chart.js
- ✅ **Top 5 des Salles** : Consommation par salle
- ✅ **Métriques Clés** : Total salles, appareils, consommation actuelle

---

## 🏗️ Architecture Technique

### Stack Technologique
```
Frontend:
├── HTML5 (Structure sémantique)
├── CSS3 (Styles modernes avec Grid/Flexbox)
├── JavaScript ES6+ (Logique interactive)
└── Chart.js (Visualisation des données)

Backend:
├── PHP 7.4+ (API RESTful)
├── JSON (Stockage des données)
└── PHP Built-in Server (Développement)

Sécurité:
├── Validation côté client
├── Sanitisation PHP
├── Gestion d'erreurs robuste
└── Protection contre les injections
```

### Structure du Projet
```
📁 SEEC-main/
├── 📄 index.html              # Page d'accueil
├── 📄 gestion.html            # Interface de gestion
├── 📄 dashboard.html          # Tableau de bord
├── 📁 api/
│   └── 📄 data_handler.php    # API CRUD RESTful
├── 📁 data/
│   ├── 📄 salles.json         # Données des salles
│   ├── 📄 appareils.json      # Données des appareils
│   ├── 📄 types_salle.json    # Types de salles
│   ├── 📄 types_appareil.json # Types d'appareils
│   └── 📄 consommation.json   # Historique de consommation
├── 📁 style/
│   └── 📄 style.css           # Styles modernes
├── 📁 script/
│   ├── 📄 script.js           # Logique principale
│   ├── 📄 gestion.js          # Gestion des salles/appareils
│   └── 📄 dashboard.js        # Tableau de bord
└── 📁 image/
    └── 📄 logo.png            # Logo du projet
```

---

## 🔐 Sécurité

### Validation des Données
```javascript
// Validation côté client
const appareilData = {
    nom: formData.get('nom').trim(),
    type_id: parseInt(formData.get('type')),
    salle_id: parseInt(formData.get('salle')),
    date_installation: formData.get('date'),
    statut_alimentation: true
};

// Vérifications de sécurité
if (!appareilData.nom || appareilData.nom.length < 2) {
    alert('Le nom doit contenir au moins 2 caractères');
    return;
}
```

### Sanitisation PHP
```php
// data_handler.php - Sanitisation des entrées
$action = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING);
$file = filter_input(INPUT_GET, 'file', FILTER_SANITIZE_STRING);
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

// Validation des types de fichiers autorisés
$allowedFiles = ['salles', 'appareils', 'types_salle', 'types_appareil', 'consommation'];
if (!in_array($file, $allowedFiles)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Fichier non autorisé']);
    exit;
}
```

### Mesures de Sécurité Implémentées
- ✅ **Validation des Types** : Conversion et vérification des types de données
- ✅ **Échappement des Caractères** : Protection contre XSS
- ✅ **Limitation des Opérations** : Seules les opérations CRUD autorisées
- ✅ **Vérification des Permissions** : Contrôle d'accès aux fichiers
- ✅ **Gestion d'Erreurs Robuste** : Messages d'erreur sécurisés

---

## 📊 Système de Données

### Identification Unique des Appareils
Chaque appareil possède un **ID unique** qui permet de le différencier :

```json
{
  "id": 41,
  "nom": "Climatiseur Principal",
  "type_id": 1,
  "salle_id": 11,
  "date_installation": "2024-01-15",
  "statut_alimentation": true
}
```

### Architecture de Récupération des Données

#### API RESTful
```bash
# Endpoints disponibles
GET  /api/data_handler.php?action=get&file=appareils     # Liste tous les appareils
GET  /api/data_handler.php?action=getById&file=appareils&id=41  # Appareil spécifique
POST /api/data_handler.php?action=add&file=appareils     # Ajouter un appareil
PUT  /api/data_handler.php?action=update&file=appareils&id=41   # Modifier un appareil
DELETE /api/data_handler.php?action=delete&file=appareils&id=41 # Supprimer un appareil
```

#### Récupération par Salle
```javascript
// Filtrer les appareils par salle
const appareilsSalle = appareilsData.filter(a => a.salle_id === salleId);

// Calculer la consommation de la salle
const consommation = appareilsSalle
    .filter(a => a.statut_alimentation)
    .reduce((total, appareil) => total + 2.5, 0);
```

### Structure de Données Hiérarchique
```
🏢 Bâtiment
├── 🏠 Salle 11 (Bureau Principal)
│   ├── 💻 Appareil 39 (Ordinateur) - 2.5 kWh
│   ├── 💡 Appareil 40 (Éclairage) - 2.5 kWh
│   └── ❄️ Appareil 41 (Climatiseur) - 2.5 kWh
├── 🏠 Salle 7 (Salle de Réunion)
│   ├── 📽️ Appareil 35 (Projecteur) - 2.5 kWh
│   └── 💻 Appareil 36 (Ordinateur) - 2.5 kWh
└── 🏠 Salle 8 (Laboratoire)
    ├── 🖨️ Appareil 37 (Imprimante) - 2.5 kWh
    └── 💻 Appareil 38 (Ordinateur) - 2.5 kWh
```

---

## ⚡ Installation

### Prérequis
- **PHP 7.4** ou supérieur
- **Serveur web** (Apache/Nginx) ou PHP Built-in Server
- **Navigateur moderne** (Chrome, Firefox, Safari, Edge)

### Installation Rapide

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/SEEC.git
cd SEEC
```

2. **Démarrer le serveur PHP**
```bash
php -S localhost:8000
```

3. **Accéder à l'application**
```
http://localhost:8000
```

### Installation avec Apache/Nginx

1. **Copier les fichiers** dans le répertoire web
```bash
sudo cp -r SEEC /var/www/html/
```

2. **Configurer les permissions**
```bash
sudo chmod -R 755 /var/www/html/SEEC
sudo chmod -R 777 /var/www/html/SEEC/data
```

3. **Accéder à l'application**
```
http://votre-domaine.com/SEEC
```

---

## 🎮 Utilisation

### Navigation Principale

1. **Page d'Accueil** (`index.html`)
   - Vue d'ensemble du projet
   - Navigation vers les différentes sections
   - Design moderne et responsive

2. **Interface de Gestion** (`gestion.html`)
   - Gestion complète des salles et appareils
   - Modal de détails pour chaque salle
   - Contrôles granulaires

3. **Tableau de Bord** (`dashboard.html`)
   - Statistiques globales
   - Graphiques de consommation
   - Top 5 des salles

### Gestion des Salles

1. **Ajouter une Salle**
   - Cliquer sur "Ajouter une Salle"
   - Remplir le formulaire (nom, type, étage, superficie)
   - Valider l'ajout

2. **Gérer une Salle**
   - Cliquer sur une salle pour ouvrir le modal de détails
   - Voir tous les appareils de la salle
   - Contrôler l'alimentation de la salle entière

3. **Modifier/Supprimer**
   - Utiliser les boutons d'action sur chaque carte de salle
   - Confirmation avant suppression

### Gestion des Appareils

1. **Ajouter un Appareil**
   - Depuis la page de gestion ou le modal de salle
   - Sélectionner le type et la salle d'attribution
   - Définir la date d'installation

2. **Contrôler un Appareil**
   - Allumer/éteindre individuellement
   - Voir la consommation en temps réel
   - Modifier les paramètres

3. **Supprimer un Appareil**
   - Bouton de suppression avec confirmation
   - Mise à jour automatique des statistiques

---

## 🔧 API Documentation

### Endpoints Principaux

#### GET - Récupérer toutes les données
```http
GET /api/data_handler.php?action=get&file=salles
GET /api/data_handler.php?action=get&file=appareils
GET /api/data_handler.php?action=get&file=types_salle
GET /api/data_handler.php?action=get&file=types_appareil
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "Bureau Principal",
      "type_id": 1,
      "etage": 1,
      "superficie": 25,
      "statut_alimentation": true
    }
  ]
}
```

#### GET - Récupérer un élément par ID
```http
GET /api/data_handler.php?action=getById&file=salles&id=1
GET /api/data_handler.php?action=getById&file=appareils&id=39
```

#### POST - Ajouter un nouvel élément
```http
POST /api/data_handler.php?action=add&file=salles
Content-Type: application/json

{
  "nom": "Nouvelle Salle",
  "type_id": 1,
  "etage": 2,
  "superficie": 30,
  "statut_alimentation": false
}
```

#### PUT - Modifier un élément
```http
PUT /api/data_handler.php?action=update&file=salles&id=1
Content-Type: application/json

{
  "statut_alimentation": true
}
```

#### DELETE - Supprimer un élément
```http
DELETE /api/data_handler.php?action=delete&file=salles&id=1
```

### Codes de Réponse
- `200` : Succès
- `400` : Erreur de requête (paramètres manquants/invalides)
- `404` : Ressource non trouvée
- `500` : Erreur serveur

---

## 📈 Évolutions Futures

### 🚀 Fonctionnalités Planifiées

#### 1. Intégration IoT
- **Capteurs Réels** : Intégration de capteurs de consommation physique
- **API de Communication** : Communication directe avec les appareils
- **Données en Temps Réel** : Récupération depuis les compteurs électriques

#### 2. Intelligence Artificielle
- **Prédiction de Consommation** : Algorithmes ML basés sur l'historique
- **Optimisation Automatique** : Suggestion d'horaires optimaux
- **Détection d'Anomalies** : Alertes intelligentes pour surconsommation

#### 3. Notifications et Alertes
- **Système d'Alertes** : Notifications pour surconsommation
- **Notifications Push** : Alertes en temps réel
- **Rapports Automatiques** : Génération et envoi de rapports par email

#### 4. Multi-utilisateurs
- **Système d'Authentification** : Gestion des utilisateurs avec rôles
- **Permissions Granulaires** : Contrôle d'accès par salle/étage
- **Historique des Actions** : Traçabilité des modifications par utilisateur

#### 5. Base de Données Avancée
- **Migration MySQL/PostgreSQL** : Pour les environnements de production
- **Sauvegarde Automatique** : Système de backup des données
- **Optimisation des Performances** : Indexation et requêtes optimisées

---

## 🤝 Contribution

### Comment Contribuer

1. **Fork le projet**
2. **Créer une branche** pour votre fonctionnalité
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```
3. **Commit vos changements**
   ```bash
   git commit -m 'Ajout: nouvelle fonctionnalité'
   ```
4. **Push vers la branche**
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```
5. **Ouvrir une Pull Request**

### Standards de Code

- **JavaScript** : ES6+, commentaires JSDoc
- **PHP** : PSR-12, commentaires PHPDoc
- **CSS** : BEM methodology, variables CSS
- **HTML** : Sémantique, accessibilité

### Tests

```bash
# Tests manuels recommandés
- Test de toutes les fonctionnalités CRUD
- Test de la responsivité sur différents écrans
- Test de la sécurité (validation des entrées)
- Test des performances avec de gros volumes de données
```

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Auteurs

- **Votre Nom** - *Développement initial* - [Votre GitHub](https://github.com/votre-username)

### Remerciements

- **Chart.js** pour les graphiques interactifs
- **Heroicons** pour les icônes SVG
- **PHP** pour le backend robuste

---

## 📞 Support

Pour toute question ou problème :

- 📧 **Email** : votre-email@example.com
- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-username/SEEC/issues)
- 📖 **Documentation** : Ce README

---

<div align="center">

**⭐ N'oubliez pas de donner une étoile au projet si vous l'aimez ! ⭐**

*Fait avec ❤️ pour une gestion intelligente de l'énergie*

</div> 