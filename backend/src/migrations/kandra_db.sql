-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 02 oct. 2025 à 18:56
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `kandra_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `candidatures`
--

CREATE TABLE `candidatures` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `offre_id` varchar(36) NOT NULL,
  `etudiant_id` varchar(36) NOT NULL,
  `date_candidature` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` enum('soumise','en_cours','acceptee','refusee','annulee') DEFAULT 'soumise',
  `lettre_motivation` text DEFAULT NULL,
  `cv_joint` varchar(255) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `competences`
--

CREATE TABLE `competences` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `nom` varchar(100) NOT NULL,
  `categorie` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `competences`
--

INSERT INTO `competences` (`id`, `nom`, `categorie`, `created_at`) VALUES
('8b186e72-9fb0-11f0-ab3f-00ffd2a149ee', 'JavaScript', 'Programmation', '2025-10-02 16:55:04'),
('8b1879ae-9fb0-11f0-ab3f-00ffd2a149ee', 'React', 'Framework', '2025-10-02 16:55:04'),
('8b187bc5-9fb0-11f0-ab3f-00ffd2a149ee', 'Node.js', 'Backend', '2025-10-02 16:55:04'),
('8b187cc4-9fb0-11f0-ab3f-00ffd2a149ee', 'MySQL', 'Base de données', '2025-10-02 16:55:04'),
('8b187d37-9fb0-11f0-ab3f-00ffd2a149ee', 'Communication', 'Soft Skills', '2025-10-02 16:55:04'),
('8b187dab-9fb0-11f0-ab3f-00ffd2a149ee', 'Travail en équipe', 'Soft Skills', '2025-10-02 16:55:04'),
('8b187e7e-9fb0-11f0-ab3f-00ffd2a149ee', 'Gestion de projet', 'Management', '2025-10-02 16:55:04'),
('8b187f8d-9fb0-11f0-ab3f-00ffd2a149ee', 'Python', 'Programmation', '2025-10-02 16:55:04'),
('8b188073-9fb0-11f0-ab3f-00ffd2a149ee', 'Java', 'Programmation', '2025-10-02 16:55:04'),
('8b188144-9fb0-11f0-ab3f-00ffd2a149ee', 'HTML/CSS', 'Frontend', '2025-10-02 16:55:04');

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` varchar(36) NOT NULL,
  `raison_sociale` varchar(255) NOT NULL,
  `secteur_activite` varchar(100) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `site_web` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `is_partenaire` tinyint(1) DEFAULT 0,
  `date_partenariat` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `etudiants`
--

CREATE TABLE `etudiants` (
  `id` varchar(36) NOT NULL,
  `matricule` varchar(50) NOT NULL,
  `niveau` varchar(50) DEFAULT NULL,
  `filiere` varchar(100) DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `cv` varchar(255) DEFAULT NULL,
  `photo_profile` varchar(255) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `etudiant_competences`
--

CREATE TABLE `etudiant_competences` (
  `etudiant_id` varchar(36) NOT NULL,
  `competence_id` varchar(36) NOT NULL,
  `niveau` enum('debutant','intermediaire','avance','expert') DEFAULT 'intermediaire',
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `entreprise_id` varchar(36) NOT NULL,
  `etudiant_id` varchar(36) NOT NULL,
  `candidature_id` varchar(36) DEFAULT NULL,
  `note` int(11) DEFAULT NULL CHECK (`note` between 1 and 5),
  `commentaire` text DEFAULT NULL,
  `date_evaluation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `favoris`
--

CREATE TABLE `favoris` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `etudiant_id` varchar(36) NOT NULL,
  `offre_id` varchar(36) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `expediteur_id` varchar(36) NOT NULL,
  `destinataire_id` varchar(36) NOT NULL,
  `contenu` text NOT NULL,
  `date_envoi` timestamp NOT NULL DEFAULT current_timestamp(),
  `est_lu` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `user_id` varchar(36) NOT NULL,
  `type` varchar(50) NOT NULL,
  `contenu` text NOT NULL,
  `date_envoi` timestamp NOT NULL DEFAULT current_timestamp(),
  `est_lue` tinyint(1) DEFAULT 0,
  `priorite` enum('basse','normale','haute','urgente') DEFAULT 'normale'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offres`
--

CREATE TABLE `offres` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `entreprise_id` varchar(36) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type_offre` enum('stage','emploi') NOT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `niveau_etude` varchar(100) DEFAULT NULL,
  `competences_requises` text DEFAULT NULL,
  `date_publication` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_expiration` date DEFAULT NULL,
  `statut` enum('brouillon','publiee','expiree','pourvue','archivee') DEFAULT 'brouillon',
  `nombre_postes` int(11) DEFAULT 1,
  `salaire` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offres_emploi`
--

CREATE TABLE `offres_emploi` (
  `id` varchar(36) NOT NULL,
  `type_contrat` enum('CDI','CDD','freelance','temps_partiel','stage_pre_embauche') NOT NULL,
  `experience_requise` varchar(100) DEFAULT NULL,
  `avantages` text DEFAULT NULL,
  `est_negociable` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offres_stage`
--

CREATE TABLE `offres_stage` (
  `id` varchar(36) NOT NULL,
  `duree` varchar(50) DEFAULT NULL,
  `est_remunere` tinyint(1) DEFAULT 0,
  `montant_remuneration` decimal(10,2) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `objectifs` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offre_competences`
--

CREATE TABLE `offre_competences` (
  `offre_id` varchar(36) NOT NULL,
  `competence_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('etudiant','entreprise','admin') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_candidature` (`offre_id`,`etudiant_id`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_offre` (`offre_id`),
  ADD KEY `idx_etudiant` (`etudiant_id`);

--
-- Index pour la table `competences`
--
ALTER TABLE `competences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`),
  ADD KEY `idx_nom` (`nom`),
  ADD KEY `idx_categorie` (`categorie`);

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_raison_sociale` (`raison_sociale`),
  ADD KEY `idx_secteur` (`secteur_activite`);

--
-- Index pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricule` (`matricule`),
  ADD KEY `idx_matricule` (`matricule`),
  ADD KEY `idx_filiere` (`filiere`);

--
-- Index pour la table `etudiant_competences`
--
ALTER TABLE `etudiant_competences`
  ADD PRIMARY KEY (`etudiant_id`,`competence_id`),
  ADD KEY `competence_id` (`competence_id`);

--
-- Index pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidature_id` (`candidature_id`),
  ADD KEY `idx_entreprise` (`entreprise_id`),
  ADD KEY `idx_etudiant` (`etudiant_id`),
  ADD KEY `idx_note` (`note`);

--
-- Index pour la table `favoris`
--
ALTER TABLE `favoris`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favori` (`etudiant_id`,`offre_id`),
  ADD KEY `idx_etudiant` (`etudiant_id`),
  ADD KEY `idx_offre` (`offre_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_expediteur` (`expediteur_id`),
  ADD KEY `idx_destinataire` (`destinataire_id`),
  ADD KEY `idx_date_envoi` (`date_envoi`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_est_lue` (`est_lue`),
  ADD KEY `idx_date_envoi` (`date_envoi`);

--
-- Index pour la table `offres`
--
ALTER TABLE `offres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type_offre` (`type_offre`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_entreprise` (`entreprise_id`),
  ADD KEY `idx_date_expiration` (`date_expiration`);
ALTER TABLE `offres` ADD FULLTEXT KEY `idx_titre_description` (`titre`,`description`);

--
-- Index pour la table `offres_emploi`
--
ALTER TABLE `offres_emploi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type_contrat` (`type_contrat`);

--
-- Index pour la table `offres_stage`
--
ALTER TABLE `offres_stage`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `offre_competences`
--
ALTER TABLE `offre_competences`
  ADD PRIMARY KEY (`offre_id`,`competence_id`),
  ADD KEY `competence_id` (`competence_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD CONSTRAINT `candidatures_ibfk_1` FOREIGN KEY (`offre_id`) REFERENCES `offres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidatures_ibfk_2` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD CONSTRAINT `entreprises_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `etudiants_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `etudiant_competences`
--
ALTER TABLE `etudiant_competences`
  ADD CONSTRAINT `etudiant_competences_ibfk_1` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `etudiant_competences_ibfk_2` FOREIGN KEY (`competence_id`) REFERENCES `competences` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_3` FOREIGN KEY (`candidature_id`) REFERENCES `candidatures` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `favoris`
--
ALTER TABLE `favoris`
  ADD CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`offre_id`) REFERENCES `offres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`expediteur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`destinataire_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `offres`
--
ALTER TABLE `offres`
  ADD CONSTRAINT `offres_ibfk_1` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `offres_emploi`
--
ALTER TABLE `offres_emploi`
  ADD CONSTRAINT `offres_emploi_ibfk_1` FOREIGN KEY (`id`) REFERENCES `offres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `offres_stage`
--
ALTER TABLE `offres_stage`
  ADD CONSTRAINT `offres_stage_ibfk_1` FOREIGN KEY (`id`) REFERENCES `offres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `offre_competences`
--
ALTER TABLE `offre_competences`
  ADD CONSTRAINT `offre_competences_ibfk_1` FOREIGN KEY (`offre_id`) REFERENCES `offres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offre_competences_ibfk_2` FOREIGN KEY (`competence_id`) REFERENCES `competences` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
