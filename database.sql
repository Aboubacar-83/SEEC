-- Création de la base de données
CREATE DATABASE IF NOT EXISTS seec_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE seec_db;

-- Table des utilisateurs
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des types de consommation
CREATE TABLE types_consommation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    unite VARCHAR(20) NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des consommations
CREATE TABLE consommations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type_id INT NOT NULL,
    valeur DECIMAL(10,2) NOT NULL,
    date_consommation DATE NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES types_consommation(id) ON DELETE CASCADE
);

-- Table des factures
CREATE TABLE factures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date_facture DATE NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_attente', 'payee', 'annulee') DEFAULT 'en_attente',
    date_paiement DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des détails de facture
CREATE TABLE details_facture (
    id INT PRIMARY KEY AUTO_INCREMENT,
    facture_id INT NOT NULL,
    type_id INT NOT NULL,
    quantite DECIMAL(10,2) NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES types_consommation(id) ON DELETE CASCADE
);

-- Table des paiements
CREATE TABLE paiements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    facture_id INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    mode_paiement ENUM('espece', 'carte', 'mobile_money') NOT NULL,
    reference_paiement VARCHAR(100),
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE
);

-- Table des notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'alerte', 'succes') DEFAULT 'info',
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des paramètres système
CREATE TABLE parametres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cle VARCHAR(50) NOT NULL UNIQUE,
    valeur TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des types de consommation par défaut
INSERT INTO types_consommation (nom, unite, prix_unitaire, description) VALUES
('Eau', 'm³', 655.957, 'Consommation d''eau en mètres cubes'),
('Électricité', 'kWh', 187.416, 'Consommation d''électricité en kilowattheures');

-- Insertion des paramètres système par défaut
INSERT INTO parametres (cle, valeur, description) VALUES
('taux_tva', '18', 'Taux de TVA en pourcentage'),
('seuil_alerte_consommation', '150', 'Seuil d''alerte pour la consommation élevée'),
('delai_paiement', '15', 'Délai de paiement en jours');

-- Création des index pour optimiser les performances
CREATE INDEX idx_consommations_date ON consommations(date_consommation);
CREATE INDEX idx_factures_date ON factures(date_facture);
CREATE INDEX idx_notifications_user ON notifications(user_id, lu); 