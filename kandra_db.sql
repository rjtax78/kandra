-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 03 oct. 2025 à 22:09
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `candidatures`
--

INSERT INTO `candidatures` (`id`, `offre_id`, `etudiant_id`, `date_candidature`, `statut`, `lettre_motivation`, `cv_joint`, `commentaire`, `created_at`, `updated_at`) VALUES
('8c392816-a08f-11f0-a049-00ffd2a149ee', 'd04c6e0e-a088-11f0-a049-00ffd2a149ee', '7fb938dc-a02d-11f0-8c02-00ffd2a149ee', '2025-10-03 19:31:24', 'soumise', 'Lorem ipsum dolor sit amet.', 'resume-1759519883849-797717448.docx', NULL, '2025-10-03 19:31:24', '2025-10-03 19:31:24');

-- --------------------------------------------------------

--
-- Structure de la table `competences`
--

CREATE TABLE `competences` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `nom` varchar(100) NOT NULL,
  `categorie` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `competences`
--

INSERT INTO `competences` (`id`, `nom`, `categorie`, `created_at`) VALUES
('6d4949d4-9fba-11f0-ab3f-00ffd2a149ee', 'JavaScript', 'Programmation', '2025-10-02 18:05:49'),
('6d5678b1-9fba-11f0-ab3f-00ffd2a149ee', 'TypeScript', 'Programmation', '2025-10-02 18:05:49'),
('6d6b2828-9fba-11f0-ab3f-00ffd2a149ee', 'Python', 'Programmation', '2025-10-02 18:05:49'),
('6d6f31e3-9fba-11f0-ab3f-00ffd2a149ee', 'Java', 'Programmation', '2025-10-02 18:05:49'),
('6d72fc9d-9fba-11f0-ab3f-00ffd2a149ee', 'C#', 'Programmation', '2025-10-02 18:05:49'),
('6d76d5df-9fba-11f0-ab3f-00ffd2a149ee', 'PHP', 'Programmation', '2025-10-02 18:05:49'),
('6d7df625-9fba-11f0-ab3f-00ffd2a149ee', 'Go', 'Programmation', '2025-10-02 18:05:49'),
('6d839232-9fba-11f0-ab3f-00ffd2a149ee', 'React', 'Frontend', '2025-10-02 18:05:49'),
('6d8b2033-9fba-11f0-ab3f-00ffd2a149ee', 'Vue.js', 'Frontend', '2025-10-02 18:05:49'),
('6d8f092b-9fba-11f0-ab3f-00ffd2a149ee', 'Angular', 'Frontend', '2025-10-02 18:05:49'),
('6d97d499-9fba-11f0-ab3f-00ffd2a149ee', 'HTML/CSS', 'Frontend', '2025-10-02 18:05:49'),
('6da0d0c0-9fba-11f0-ab3f-00ffd2a149ee', 'Tailwind CSS', 'Frontend', '2025-10-02 18:05:50'),
('6da71416-9fba-11f0-ab3f-00ffd2a149ee', 'SASS/SCSS', 'Frontend', '2025-10-02 18:05:50'),
('6daaf7a8-9fba-11f0-ab3f-00ffd2a149ee', 'Node.js', 'Backend', '2025-10-02 18:05:50'),
('6daeb89f-9fba-11f0-ab3f-00ffd2a149ee', 'Express.js', 'Backend', '2025-10-02 18:05:50'),
('6db29e57-9fba-11f0-ab3f-00ffd2a149ee', 'Django', 'Backend', '2025-10-02 18:05:50'),
('6db6595b-9fba-11f0-ab3f-00ffd2a149ee', 'Spring Boot', 'Backend', '2025-10-02 18:05:50'),
('6dba3979-9fba-11f0-ab3f-00ffd2a149ee', 'Laravel', 'Backend', '2025-10-02 18:05:50'),
('6dbdfc0a-9fba-11f0-ab3f-00ffd2a149ee', 'MySQL', 'Base de données', '2025-10-02 18:05:50'),
('6dc51d81-9fba-11f0-ab3f-00ffd2a149ee', 'PostgreSQL', 'Base de données', '2025-10-02 18:05:50'),
('6dc82c62-9fba-11f0-ab3f-00ffd2a149ee', 'MongoDB', 'Base de données', '2025-10-02 18:05:50'),
('6dddc77d-9fba-11f0-ab3f-00ffd2a149ee', 'Redis', 'Base de données', '2025-10-02 18:05:50'),
('6de7706f-9fba-11f0-ab3f-00ffd2a149ee', 'Docker', 'DevOps', '2025-10-02 18:05:50'),
('6dea7de2-9fba-11f0-ab3f-00ffd2a149ee', 'Kubernetes', 'DevOps', '2025-10-02 18:05:50'),
('6dee6037-9fba-11f0-ab3f-00ffd2a149ee', 'AWS', 'DevOps', '2025-10-02 18:05:50'),
('6df220ab-9fba-11f0-ab3f-00ffd2a149ee', 'Azure', 'DevOps', '2025-10-02 18:05:50'),
('6df601a3-9fba-11f0-ab3f-00ffd2a149ee', 'Git', 'DevOps', '2025-10-02 18:05:50'),
('6df9cbc5-9fba-11f0-ab3f-00ffd2a149ee', 'Communication', 'Soft Skills', '2025-10-02 18:05:50'),
('6dfdabf5-9fba-11f0-ab3f-00ffd2a149ee', 'Travail en équipe', 'Soft Skills', '2025-10-02 18:05:50'),
('6e0163b4-9fba-11f0-ab3f-00ffd2a149ee', 'Leadership', 'Soft Skills', '2025-10-02 18:05:50'),
('6e0543d9-9fba-11f0-ab3f-00ffd2a149ee', 'Gestion de projet', 'Management', '2025-10-02 18:05:50'),
('6e090995-9fba-11f0-ab3f-00ffd2a149ee', 'Méthodes Agiles', 'Management', '2025-10-02 18:05:50');

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
  `is_partenaire` tinyint(4) DEFAULT 0,
  `date_partenariat` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`id`, `raison_sociale`, `secteur_activite`, `adresse`, `site_web`, `description`, `logo`, `is_partenaire`, `date_partenariat`) VALUES
('6e5e3979-9fba-11f0-ab3f-00ffd2a149ee', 'Sonatel SA', 'Télécommunications', 'Avenue Léopold Sédar Senghor, Dakar, Sénégal', 'https://www.sonatel.sn', 'Leader des télécommunications au Sénégal, Sonatel propose des solutions innovantes en téléphonie, internet et services numériques.', NULL, 1, '2020-01-15'),
('6e6cc641-9fba-11f0-ab3f-00ffd2a149ee', 'Orange Sénégal', 'Télécommunications', 'Rue 2 x Corniche Ouest, Dakar, Sénégal', 'https://www.orange.sn', 'Opérateur de télécommunications offrant des services mobiles, internet et solutions d\'entreprise.', NULL, 1, '2020-03-10'),
('6e8364f4-9fba-11f0-ab3f-00ffd2a149ee', 'Wave Sénégal', 'FinTech', 'Almadies, Dakar, Sénégal', 'https://www.wave.com', 'Solution de paiement mobile révolutionnaire, Wave démocratise l\'accès aux services financiers.', NULL, 1, '2021-06-20'),
('6e8847ac-9fba-11f0-ab3f-00ffd2a149ee', 'Expresso Sénégal', 'Télécommunications', 'Immeuble Khadim Rassoul, Dakar, Sénégal', 'https://www.expresso.sn', 'Opérateur télécom proposant des services innovants en téléphonie mobile et internet.', NULL, 0, NULL),
('dcdb74e0-a02c-11f0-8c02-00ffd2a149ee', 'Test Company Inc', NULL, NULL, NULL, NULL, NULL, 0, NULL),
('f727acd3-a032-11f0-8c02-00ffd2a149ee', 'Webs Herianiaina Company', NULL, NULL, NULL, NULL, NULL, 0, NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etudiants`
--

INSERT INTO `etudiants` (`id`, `matricule`, `niveau`, `filiere`, `competences`, `cv`, `photo_profile`, `date_naissance`) VALUES
('6e4db517-9fba-11f0-ab3f-00ffd2a149ee', 'ET2024001', 'Master 2', 'Informatique - Développement Web', NULL, NULL, NULL, '2000-05-15'),
('6e5195ea-9fba-11f0-ab3f-00ffd2a149ee', 'ET2024002', 'Master 1', 'Informatique - Data Science', NULL, NULL, NULL, '2001-03-22'),
('6e55562f-9fba-11f0-ab3f-00ffd2a149ee', 'ET2024003', 'Licence 3', 'Télécommunications', NULL, NULL, NULL, '2002-08-10'),
('6e5a7d66-9fba-11f0-ab3f-00ffd2a149ee', 'ET2024004', 'Master 2', 'Génie Logiciel', NULL, NULL, NULL, '1999-12-05'),
('6f1ef94c-a02c-11f0-8c02-00ffd2a149ee', 'TEST123', NULL, NULL, NULL, NULL, NULL, NULL),
('7fb938dc-a02d-11f0-8c02-00ffd2a149ee', 'rjtax', NULL, NULL, NULL, NULL, NULL, NULL),
('c7445924-a02c-11f0-8c02-00ffd2a149ee', 'STU1759477462282', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `etudiant_competences`
--

CREATE TABLE `etudiant_competences` (
  `etudiant_id` varchar(36) NOT NULL,
  `competence_id` varchar(36) NOT NULL,
  `niveau` enum('debutant','intermediaire','avance','expert') DEFAULT 'intermediaire',
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etudiant_competences`
--

INSERT INTO `etudiant_competences` (`etudiant_id`, `competence_id`, `niveau`, `date_ajout`) VALUES
('6e4db517-9fba-11f0-ab3f-00ffd2a149ee', '6d4949d4-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:52'),
('6e4db517-9fba-11f0-ab3f-00ffd2a149ee', '6d839232-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:52'),
('6e4db517-9fba-11f0-ab3f-00ffd2a149ee', '6d97d499-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:52'),
('6e4db517-9fba-11f0-ab3f-00ffd2a149ee', '6daaf7a8-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:53'),
('6e4db517-9fba-11f0-ab3f-00ffd2a149ee', '6dbdfc0a-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:53'),
('6e5195ea-9fba-11f0-ab3f-00ffd2a149ee', '6d4949d4-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e5195ea-9fba-11f0-ab3f-00ffd2a149ee', '6d6b2828-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e5195ea-9fba-11f0-ab3f-00ffd2a149ee', '6dbdfc0a-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e5195ea-9fba-11f0-ab3f-00ffd2a149ee', '6dc82c62-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e55562f-9fba-11f0-ab3f-00ffd2a149ee', '6d6b2828-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e55562f-9fba-11f0-ab3f-00ffd2a149ee', '6d6f31e3-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e55562f-9fba-11f0-ab3f-00ffd2a149ee', '6df9cbc5-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e55562f-9fba-11f0-ab3f-00ffd2a149ee', '6e0543d9-9fba-11f0-ab3f-00ffd2a149ee', 'intermediaire', '2025-10-02 18:05:53'),
('6e5a7d66-9fba-11f0-ab3f-00ffd2a149ee', '6d6f31e3-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:53'),
('6e5a7d66-9fba-11f0-ab3f-00ffd2a149ee', '6db6595b-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:53'),
('6e5a7d66-9fba-11f0-ab3f-00ffd2a149ee', '6de7706f-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:53'),
('6e5a7d66-9fba-11f0-ab3f-00ffd2a149ee', '6df601a3-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:53'),
('6e5a7d66-9fba-11f0-ab3f-00ffd2a149ee', '6e090995-9fba-11f0-ab3f-00ffd2a149ee', 'avance', '2025-10-02 18:05:53');

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `entreprise_id` varchar(36) NOT NULL,
  `etudiant_id` varchar(36) NOT NULL,
  `candidature_id` varchar(36) DEFAULT NULL,
  `note` int(11) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `date_evaluation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `favoris`
--

CREATE TABLE `favoris` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `etudiant_id` varchar(36) NOT NULL,
  `offre_id` varchar(36) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favoris`
--

INSERT INTO `favoris` (`id`, `etudiant_id`, `offre_id`, `date_ajout`) VALUES
('70bc9107-9fba-11f0-ab3f-00ffd2a149ee', '6e4db517-9fba-11f0-ab3f-00ffd2a149ee', '6ff1fa90-9fba-11f0-ab3f-00ffd2a149ee', '2025-10-02 18:05:55'),
('70d780bc-9fba-11f0-ab3f-00ffd2a149ee', '6e4db517-9fba-11f0-ab3f-00ffd2a149ee', '702aa693-9fba-11f0-ab3f-00ffd2a149ee', '2025-10-02 18:05:55'),
('70ec3720-9fba-11f0-ab3f-00ffd2a149ee', '6e55562f-9fba-11f0-ab3f-00ffd2a149ee', '70257aa5-9fba-11f0-ab3f-00ffd2a149ee', '2025-10-02 18:05:55');

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
  `est_lu` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `est_lue` tinyint(4) DEFAULT 0,
  `priorite` enum('basse','normale','haute','urgente') DEFAULT 'normale'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `date_envoi`, `est_lue`, `priorite`) VALUES
('70fc98a5-9fba-11f0-ab3f-00ffd2a149ee', '6e4db517-9fba-11f0-ab3f-00ffd2a149ee', 'candidature', 'Votre candidature pour le poste \"Stage Développeur Full Stack\" chez Sonatel a été reçue.', '2025-10-02 18:05:55', 0, 'normale'),
('71130fb4-9fba-11f0-ab3f-00ffd2a149ee', '6e5195ea-9fba-11f0-ab3f-00ffd2a149ee', 'acceptation', 'Félicitations ! Votre candidature pour le stage chez Wave a été acceptée.', '2025-10-02 18:05:55', 0, 'haute'),
('711bb84b-9fba-11f0-ab3f-00ffd2a149ee', '6e5e3979-9fba-11f0-ab3f-00ffd2a149ee', 'nouvelle_candidature', 'Nouvelle candidature reçue pour votre offre \"Stage Développeur Full Stack\".', '2025-10-02 18:05:55', 0, 'normale'),
('711ec045-9fba-11f0-ab3f-00ffd2a149ee', '6e55562f-9fba-11f0-ab3f-00ffd2a149ee', 'nouvelle_offre', 'Une nouvelle offre correspondant à votre profil a été publiée : \"Chef de Projet Digital\".', '2025-10-02 18:05:55', 0, 'normale');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offres`
--

INSERT INTO `offres` (`id`, `entreprise_id`, `titre`, `description`, `type_offre`, `localisation`, `niveau_etude`, `competences_requises`, `date_publication`, `date_expiration`, `statut`, `nombre_postes`, `salaire`, `created_at`, `updated_at`) VALUES
('6fc0107e-9fba-11f0-ab3f-00ffd2a149ee', '6e5e3979-9fba-11f0-ab3f-00ffd2a149ee', 'Stage Développeur Full Stack', 'Rejoignez notre équipe de développement pour contribuer à la modernisation de nos plateformes digitales. Vous travaillerez sur des projets React/Node.js et participerez à l\'amélioration de l\'expérience utilisateur.', 'stage', 'Dakar, Sénégal', 'Master 1/2', 'JavaScript, React, Node.js, MySQL', '2025-10-02 18:05:53', '2025-03-30', 'publiee', 2, '150 000 - 200 000 FCFA/mois', '2025-10-02 18:05:53', '2025-10-02 18:05:53'),
('6ff1fa90-9fba-11f0-ab3f-00ffd2a149ee', '6e6cc641-9fba-11f0-ab3f-00ffd2a149ee', 'Développeur Backend Senior', 'Nous recherchons un développeur backend expérimenté pour renforcer notre équipe technique. Vous serez responsable du développement et de la maintenance de nos APIs et microservices.', 'emploi', 'Dakar, Sénégal', 'Master 2 ou équivalent', 'Java, Spring Boot, Docker, Kubernetes, PostgreSQL', '2025-10-02 18:05:53', '2025-04-15', 'publiee', 1, '800 000 - 1 200 000 FCFA/mois', '2025-10-02 18:05:53', '2025-10-02 18:05:53'),
('701c7420-9fba-11f0-ab3f-00ffd2a149ee', '6e8364f4-9fba-11f0-ab3f-00ffd2a149ee', 'Stage Data Analyst', 'Opportunité unique de rejoindre l\'équipe data de Wave pour analyser les tendances de paiement mobile et contribuer à l\'amélioration de nos algorithmes de recommandation.', 'stage', 'Dakar, Sénégal', 'Master 1/2', 'Python, SQL, Machine Learning, Data Visualization', '2025-10-02 18:05:54', '2025-05-20', 'publiee', 1, '180 000 FCFA/mois', '2025-10-02 18:05:54', '2025-10-02 18:05:54'),
('70257aa5-9fba-11f0-ab3f-00ffd2a149ee', '6e8847ac-9fba-11f0-ab3f-00ffd2a149ee', 'Chef de Projet Digital', 'Poste de chef de projet pour piloter la transformation digitale d\'Expresso. Vous coordonnerez les équipes techniques et business pour livrer des solutions innovantes.', 'emploi', 'Dakar, Sénégal', 'Master 2', 'Gestion de projet, Méthodes Agiles, Leadership, Communication', '2025-10-02 18:05:54', '2025-06-30', 'publiee', 1, '1 000 000 - 1 500 000 FCFA/mois', '2025-10-02 18:05:54', '2025-10-02 18:05:54'),
('702aa693-9fba-11f0-ab3f-00ffd2a149ee', '6e6cc641-9fba-11f0-ab3f-00ffd2a149ee', 'Stage DevOps Engineer', 'Stage en ingénierie DevOps pour automatiser nos processus de déploiement et améliorer notre infrastructure cloud.', 'stage', 'Dakar, Sénégal', 'Master 1/2', 'Docker, Kubernetes, AWS, Git, Linux', '2025-10-02 18:05:54', '2025-04-30', 'publiee', 1, '200 000 FCFA/mois', '2025-10-02 18:05:54', '2025-10-02 18:05:54'),
('d04c6e0e-a088-11f0-a049-00ffd2a149ee', 'f727acd3-a032-11f0-8c02-00ffd2a149ee', 'Stage Développeur Full Stack', 'Rejoignez notre équipe de développement pour contr...', 'emploi', 'Dakar, Sénégal', 'Master 1/2', 'JavaScript, React, Node.js, MySQL', '2025-10-03 18:43:11', '2025-10-20', 'publiee', 1, '100-200 $./mois', '2025-10-03 18:43:11', '2025-10-03 19:03:56');

-- --------------------------------------------------------

--
-- Structure de la table `offres_emploi`
--

CREATE TABLE `offres_emploi` (
  `id` varchar(36) NOT NULL,
  `type_contrat` enum('CDI','CDD','freelance','temps_partiel','stage_pre_embauche') NOT NULL,
  `experience_requise` varchar(100) DEFAULT NULL,
  `avantages` text DEFAULT NULL,
  `est_negociable` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offres_emploi`
--

INSERT INTO `offres_emploi` (`id`, `type_contrat`, `experience_requise`, `avantages`, `est_negociable`) VALUES
('6ff1fa90-9fba-11f0-ab3f-00ffd2a149ee', 'CDI', '3-5 ans', 'Assurance santé, tickets restaurant, formation continue, télétravail partiel', 1),
('70257aa5-9fba-11f0-ab3f-00ffd2a149ee', 'CDI', '5+ ans', 'Package complet, voiture de fonction, bonus performance, formation leadership', 1),
('d04c6e0e-a088-11f0-a049-00ffd2a149ee', 'CDI', '3-6 years', '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `offres_stage`
--

CREATE TABLE `offres_stage` (
  `id` varchar(36) NOT NULL,
  `duree` varchar(50) DEFAULT NULL,
  `est_remunere` tinyint(4) DEFAULT 0,
  `montant_remuneration` decimal(10,2) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `objectifs` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offres_stage`
--

INSERT INTO `offres_stage` (`id`, `duree`, `est_remunere`, `montant_remuneration`, `date_debut`, `objectifs`) VALUES
('6fc0107e-9fba-11f0-ab3f-00ffd2a149ee', '6 mois', 1, 175000.00, '2025-02-01', 'Développer des compétences en développement full stack, participer à des projets concrets, découvrir l\'environnement professionnel des télécoms.'),
('701c7420-9fba-11f0-ab3f-00ffd2a149ee', '4 mois', 1, 180000.00, '2025-03-01', 'Maîtriser les outils d\'analyse de données, comprendre les enjeux du paiement mobile, contribuer à l\'amélioration des algorithmes.'),
('702aa693-9fba-11f0-ab3f-00ffd2a149ee', '6 mois', 1, 200000.00, '2025-02-15', 'Acquérir une expertise en DevOps, automatiser les processus, gérer l\'infrastructure cloud.');

-- --------------------------------------------------------

--
-- Structure de la table `offre_competences`
--

CREATE TABLE `offre_competences` (
  `offre_id` varchar(36) NOT NULL,
  `competence_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `is_active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `nom`, `prenom`, `telephone`, `date_inscription`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
('6e468943-9fba-11f0-ab3f-00ffd2a149ee', 'admin@sprayinfo.com', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Admin', 'System', '+221771234567', '2025-10-02 18:05:51', 'admin', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e4db517-9fba-11f0-ab3f-00ffd2a149ee', 'marie.diop@etudiant.sprayinfo.com', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Diop', 'Marie', '+221771234568', '2025-10-02 18:05:51', 'etudiant', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e5195ea-9fba-11f0-ab3f-00ffd2a149ee', 'amadou.kane@etudiant.sprayinfo.com', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Kane', 'Amadou', '+221771234569', '2025-10-02 18:05:51', 'etudiant', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e55562f-9fba-11f0-ab3f-00ffd2a149ee', 'fatou.sall@etudiant.sprayinfo.com', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Sall', 'Fatou', '+221771234570', '2025-10-02 18:05:51', 'etudiant', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e5a7d66-9fba-11f0-ab3f-00ffd2a149ee', 'ibrahima.ndiaye@etudiant.sprayinfo.com', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Ndiaye', 'Ibrahima', '+221771234571', '2025-10-02 18:05:51', 'etudiant', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e5e3979-9fba-11f0-ab3f-00ffd2a149ee', 'rh@sonatel.sn', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Diallo', 'Aminata', '+221338901234', '2025-10-02 18:05:51', 'entreprise', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e6cc641-9fba-11f0-ab3f-00ffd2a149ee', 'recrutement@orange.sn', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Fall', 'Moussa', '+221338901235', '2025-10-02 18:05:51', 'entreprise', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e8364f4-9fba-11f0-ab3f-00ffd2a149ee', 'jobs@wavecom.sn', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Mbaye', 'Khady', '+221338901236', '2025-10-02 18:05:51', 'entreprise', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6e8847ac-9fba-11f0-ab3f-00ffd2a149ee', 'carriere@expresso.sn', '$2b$10$xMI52ZsmdvXm/mUXy3CyaubKKRuW3aSEeBPnmMa/2GaWBYhAYV6r.', 'Ba', 'Oumar', '+221338901237', '2025-10-02 18:05:51', 'entreprise', 1, '2025-10-02 18:05:51', '2025-10-02 18:05:51'),
('6f1ef94c-a02c-11f0-8c02-00ffd2a149ee', 'test@example.com', '$2b$10$zhBZiRAdKEpq.Sx9BAG/k.nV3jpeHG4TKFA7yTLCKCtVl1uMooJpq', 'Doe', 'John', NULL, '2025-10-03 07:41:55', 'etudiant', 1, '2025-10-03 07:41:55', '2025-10-03 07:41:55'),
('7fb938dc-a02d-11f0-8c02-00ffd2a149ee', 'rjtax3466@gmail.com', '$2b$10$R0qTfWG3Ms/mz6UchzN5Euxplk29PYjcm5tJl41LJd.Z/5bpR1s3S', 'Tahina', 'Jean', NULL, '2025-10-03 07:49:32', 'etudiant', 1, '2025-10-03 07:49:32', '2025-10-03 07:49:32'),
('c7445924-a02c-11f0-8c02-00ffd2a149ee', 'student1759477462282@test.com', '$2b$10$S9dfDQzX/ani5Cjr5onYFuMozJTerOM0BrGt4jC77a4E9tQNgd8bW', 'Doe', 'John', NULL, '2025-10-03 07:44:23', 'etudiant', 1, '2025-10-03 07:44:23', '2025-10-03 07:44:23'),
('dcdb74e0-a02c-11f0-8c02-00ffd2a149ee', 'company1759477498591@test.com', '$2b$10$L0TtG10UwfE7pCvJaKQwx.MVCYOzpn3zVrGgFqwOXwgYcpmP2F5cm', 'Smith', 'Jane', NULL, '2025-10-03 07:44:59', 'entreprise', 1, '2025-10-03 07:44:59', '2025-10-03 07:44:59'),
('f727acd3-a032-11f0-8c02-00ffd2a149ee', 'sparay.info@gmail.com', '$2b$10$fkSEBMtYalGnGnG5iPEoV.VV0xYwHmumODMmMaJJK4MU6FG8XIDwC', 'Herianiaina', 'Webs', NULL, '2025-10-03 08:28:40', 'entreprise', 1, '2025-10-03 08:28:40', '2025-10-03 08:28:40');

-- --------------------------------------------------------

--
-- Structure de la table `__drizzle_migrations`
--

CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hash` text NOT NULL,
  `created_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `__drizzle_migrations`
--

INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES
(1, '65abdf535eebfdfe0e2f74dcace5c948657abba88602104063da6ea7c77b04d9', 1759427003446);

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
  ADD UNIQUE KEY `competences_nom_unique` (`nom`),
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
  ADD UNIQUE KEY `etudiants_matricule_unique` (`matricule`),
  ADD KEY `idx_matricule` (`matricule`),
  ADD KEY `idx_filiere` (`filiere`);

--
-- Index pour la table `etudiant_competences`
--
ALTER TABLE `etudiant_competences`
  ADD PRIMARY KEY (`etudiant_id`,`competence_id`),
  ADD KEY `etudiant_competences_ibfk_2` (`competence_id`);

--
-- Index pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluations_ibfk_3` (`candidature_id`),
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
  ADD KEY `offre_competences_ibfk_2` (`competence_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Index pour la table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD CONSTRAINT `candidatures_ibfk_1` FOREIGN KEY (`offre_id`) REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `candidatures_ibfk_2` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD CONSTRAINT `entreprises_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `etudiants_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `etudiant_competences`
--
ALTER TABLE `etudiant_competences`
  ADD CONSTRAINT `etudiant_competences_ibfk_1` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `etudiant_competences_ibfk_2` FOREIGN KEY (`competence_id`) REFERENCES `competences` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `evaluations_ibfk_3` FOREIGN KEY (`candidature_id`) REFERENCES `candidatures` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Contraintes pour la table `favoris`
--
ALTER TABLE `favoris`
  ADD CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`offre_id`) REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`expediteur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`destinataire_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `offres`
--
ALTER TABLE `offres`
  ADD CONSTRAINT `offres_ibfk_1` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `offres_emploi`
--
ALTER TABLE `offres_emploi`
  ADD CONSTRAINT `offres_emploi_ibfk_1` FOREIGN KEY (`id`) REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `offres_stage`
--
ALTER TABLE `offres_stage`
  ADD CONSTRAINT `offres_stage_ibfk_1` FOREIGN KEY (`id`) REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `offre_competences`
--
ALTER TABLE `offre_competences`
  ADD CONSTRAINT `offre_competences_ibfk_1` FOREIGN KEY (`offre_id`) REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `offre_competences_ibfk_2` FOREIGN KEY (`competence_id`) REFERENCES `competences` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
