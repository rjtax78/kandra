# 🚀 KANDRA Platform

**Plateforme intelligente de gestion des opportunités professionnelles et des relations d'entreprise dans l'écosystème Spray Info**

## 📋 Vue d'ensemble

KANDRA est une plateforme développée pour faciliter les interactions entre les entreprises partenaires de Spray Info et les étudiants, permettant :

- **🏢 Aux entreprises Spray Info ou partenaires** : S'inscrire et publier des offres d'emploi/stage
- **🎓 Aux étudiants Spray Info** : Consulter et postuler aux opportunités disponibles

## 🛠️ Stack Technique

- **Frontend** : React 19 + Vite + Tailwind CSS
- **Backend** : Node.js + Express.js + DrizzleORM
- **Base de données** : MySQL
- **Authentification** : JWT + bcrypt


## 🗂️ Structure du Projet

```
Projet_Kandra/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Logique métier
│   │   ├── routes/         # Points d'entrée API
│   │   ├── middlewares/    # Middleware Express
│   │   ├── migrations/     # Scripts SQL
│   │   ├── db.js          # Configuration DB
│   │   ├── app.js         # Configuration app
│   │   └── server.js      # Point d'entrée serveur
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/        # Pages de l'application
│   │   ├── services/     # Services API
│   │   └── hooks/        # Hooks personnalisés
│   └── package.json
└── README.md
```

## 🗄️ Schéma de Base de Données

### Tables Principales
- **`users`** - Comptes utilisateurs (étudiants, entreprises, admin)
- **`etudiants`** - Profils étudiants avec informations académiques
- **`entreprises`** - Profils entreprise et statut partenariat
- **`offres`** - Offres d'emploi/stage avec spécifications détaillées
- **`candidatures`** - Candidatures des étudiants aux offres

### Tables Spécialisées
- **`offres_stage`** - Détails spécifiques aux stages
- **`offres_emploi`** - Détails spécifiques aux emplois
- **`competences`** - Catalogue des compétences
- **`etudiant_competences`** - Relations étudiant-compétences
- **`offre_competences`** - Compétences requises par offre


## ⚡ Installation & Démarrage

### Prérequis
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### 1. Installation des dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configuration de la base de données

```bash
# Créer la base de données MySQL
mysql -u root -p < backend/src/migrations/kandra_db.sql
```

### 3. Configuration de l'environnement

```bash
# Backend - Vérifier et modifier .env
cd backend/src
# Modifier les variables selon votre configuration
```

### 4. Démarrage des serveurs

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

## 🔐 Authentification

### Rôles Utilisateur
- **`etudiant`** - Étudiants Spray Info
- **`entreprise`** - Entreprises et partenaires
- **`admin`** - Administrateurs de la plateforme

### Endpoints API Principaux
```
POST /api/auth/register  # Inscription
POST /api/auth/login     # Connexion
GET  /api/offres        # Liste des offres
POST /api/candidatures   # Postuler à une offre
GET  /api/profil        # Profil utilisateur
```

## 🚀 Fonctionnalités

### 👨‍🎓 Pour les Étudiants
- ✅ Inscription et création de profil
- ✅ Consultation des offres de stage/emploi
- ✅ Filtrage par type, localisation, compétences
- ✅ Postulation en ligne avec CV
- ✅ Suivi des candidatures
- ✅ Système de favoris
- ✅ Notifications personnalisées

### 🏢 Pour les Entreprises
- ✅ Inscription et validation partenaire
- ✅ Publication d'offres de stage/emploi
- ✅ Gestion des candidatures reçues
- ✅ Évaluation des candidats
- ✅ Statistiques de publication
- ✅ Messaging avec les candidats

### 👑 Pour les Administrateurs
- ✅ Gestion des utilisateurs et entreprises
- ✅ Modération des offres
- ✅ Statistiques globales de la plateforme
- ✅ Gestion du catalogue de compétences
- ✅ Système de notifications

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev      # Démarrage en mode développement
npm start        # Démarrage en production
```

### Frontend
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build
npm run lint     # Vérification ESLint
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est la propriété de **Spray Info** et destiné à un usage interne dans l'écosystème Spray Info.

## 📞 Support

Pour toute question ou support technique, contactez l'équipe de développement Spray Info.

---

**Développé avec ❤️ pour l'écosystème Spray Info**
