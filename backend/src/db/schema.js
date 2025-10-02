import { 
  mysqlTable, 
  varchar, 
  text, 
  timestamp, 
  date, 
  decimal,
  int,
  tinyint,
  mysqlEnum,
  primaryKey,
  unique,
  index,
  foreignKey
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// Users table - Base authentication table
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nom: varchar('nom', { length: 100 }).notNull(),
  prenom: varchar('prenom', { length: 100 }).notNull(),
  telephone: varchar('telephone', { length: 20 }),
  dateInscription: timestamp('date_inscription').defaultNow().notNull(),
  role: mysqlEnum('role', ['etudiant', 'entreprise', 'admin']).notNull(),
  isActive: tinyint('is_active').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_email').on(table.email),
  roleIdx: index('idx_role').on(table.role),
}));

// Students table - Student-specific information
export const etudiants = mysqlTable('etudiants', {
  id: varchar('id', { length: 36 }).primaryKey(),
  matricule: varchar('matricule', { length: 50 }).notNull().unique(),
  niveau: varchar('niveau', { length: 50 }),
  filiere: varchar('filiere', { length: 100 }),
  competences: text('competences'),
  cv: varchar('cv', { length: 255 }),
  photoProfile: varchar('photo_profile', { length: 255 }),
  dateNaissance: date('date_naissance'),
}, (table) => ({
  matriculeIdx: index('idx_matricule').on(table.matricule),
  filiereIdx: index('idx_filiere').on(table.filiere),
  userFk: foreignKey({ 
    columns: [table.id], 
    foreignColumns: [users.id], 
    name: 'etudiants_ibfk_1' 
  }).onDelete('cascade'),
}));

// Companies table - Company-specific information  
export const entreprises = mysqlTable('entreprises', {
  id: varchar('id', { length: 36 }).primaryKey(),
  raisonSociale: varchar('raison_sociale', { length: 255 }).notNull(),
  secteurActivite: varchar('secteur_activite', { length: 100 }),
  adresse: text('adresse'),
  siteWeb: varchar('site_web', { length: 255 }),
  description: text('description'),
  logo: varchar('logo', { length: 255 }),
  isPartenaire: tinyint('is_partenaire').default(0),
  datePartenariat: date('date_partenariat'),
}, (table) => ({
  raisonSocialeIdx: index('idx_raison_sociale').on(table.raisonSociale),
  secteurIdx: index('idx_secteur').on(table.secteurActivite),
  userFk: foreignKey({ 
    columns: [table.id], 
    foreignColumns: [users.id], 
    name: 'entreprises_ibfk_1' 
  }).onDelete('cascade'),
}));

// Skills/Competences table
export const competences = mysqlTable('competences', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  nom: varchar('nom', { length: 100 }).notNull().unique(),
  categorie: varchar('categorie', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  nomIdx: index('idx_nom').on(table.nom),
  categorieIdx: index('idx_categorie').on(table.categorie),
}));

// Job offers table
export const offres = mysqlTable('offres', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  entrepriseId: varchar('entreprise_id', { length: 36 }).notNull(),
  titre: varchar('titre', { length: 255 }).notNull(),
  description: text('description').notNull(),
  typeOffre: mysqlEnum('type_offre', ['stage', 'emploi']).notNull(),
  localisation: varchar('localisation', { length: 255 }),
  niveauEtude: varchar('niveau_etude', { length: 100 }),
  competencesRequises: text('competences_requises'),
  datePublication: timestamp('date_publication').defaultNow().notNull(),
  dateExpiration: date('date_expiration'),
  statut: mysqlEnum('statut', ['brouillon', 'publiee', 'expiree', 'pourvue', 'archivee']).default('brouillon'),
  nombrePostes: int('nombre_postes').default(1),
  salaire: varchar('salaire', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeOffreIdx: index('idx_type_offre').on(table.typeOffre),
  statutIdx: index('idx_statut').on(table.statut),
  entrepriseIdx: index('idx_entreprise').on(table.entrepriseId),
  dateExpirationIdx: index('idx_date_expiration').on(table.dateExpiration),
  entrepriseFk: foreignKey({ 
    columns: [table.entrepriseId], 
    foreignColumns: [entreprises.id], 
    name: 'offres_ibfk_1' 
  }).onDelete('cascade'),
}));

// Internship-specific details
export const offresStage = mysqlTable('offres_stage', {
  id: varchar('id', { length: 36 }).primaryKey(),
  duree: varchar('duree', { length: 50 }),
  estRemunere: tinyint('est_remunere').default(0),
  montantRemuneration: decimal('montant_remuneration', { precision: 10, scale: 2 }),
  dateDebut: date('date_debut'),
  objectifs: text('objectifs'),
}, (table) => ({
  offreFk: foreignKey({ 
    columns: [table.id], 
    foreignColumns: [offres.id], 
    name: 'offres_stage_ibfk_1' 
  }).onDelete('cascade'),
}));

// Job-specific details
export const offresEmploi = mysqlTable('offres_emploi', {
  id: varchar('id', { length: 36 }).primaryKey(),
  typeContrat: mysqlEnum('type_contrat', ['CDI', 'CDD', 'freelance', 'temps_partiel', 'stage_pre_embauche']).notNull(),
  experienceRequise: varchar('experience_requise', { length: 100 }),
  avantages: text('avantages'),
  estNegociable: tinyint('est_negociable').default(0),
}, (table) => ({
  typeContratIdx: index('idx_type_contrat').on(table.typeContrat),
  offreFk: foreignKey({ 
    columns: [table.id], 
    foreignColumns: [offres.id], 
    name: 'offres_emploi_ibfk_1' 
  }).onDelete('cascade'),
}));

// Applications table
export const candidatures = mysqlTable('candidatures', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  offreId: varchar('offre_id', { length: 36 }).notNull(),
  etudiantId: varchar('etudiant_id', { length: 36 }).notNull(),
  dateCandidature: timestamp('date_candidature').defaultNow().notNull(),
  statut: mysqlEnum('statut', ['soumise', 'en_cours', 'acceptee', 'refusee', 'annulee']).default('soumise'),
  lettreMotivation: text('lettre_motivation'),
  cvJoint: varchar('cv_joint', { length: 255 }),
  commentaire: text('commentaire'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueCandidature: unique('unique_candidature').on(table.offreId, table.etudiantId),
  statutIdx: index('idx_statut').on(table.statut),
  offreIdx: index('idx_offre').on(table.offreId),
  etudiantIdx: index('idx_etudiant').on(table.etudiantId),
  offreFk: foreignKey({ 
    columns: [table.offreId], 
    foreignColumns: [offres.id], 
    name: 'candidatures_ibfk_1' 
  }).onDelete('cascade'),
  etudiantFk: foreignKey({ 
    columns: [table.etudiantId], 
    foreignColumns: [etudiants.id], 
    name: 'candidatures_ibfk_2' 
  }).onDelete('cascade'),
}));

// Student skills relationship
export const etudiantCompetences = mysqlTable('etudiant_competences', {
  etudiantId: varchar('etudiant_id', { length: 36 }).notNull(),
  competenceId: varchar('competence_id', { length: 36 }).notNull(),
  niveau: mysqlEnum('niveau', ['debutant', 'intermediaire', 'avance', 'expert']).default('intermediaire'),
  dateAjout: timestamp('date_ajout').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.etudiantId, table.competenceId] }),
  etudiantFk: foreignKey({ 
    columns: [table.etudiantId], 
    foreignColumns: [etudiants.id], 
    name: 'etudiant_competences_ibfk_1' 
  }).onDelete('cascade'),
  competenceFk: foreignKey({ 
    columns: [table.competenceId], 
    foreignColumns: [competences.id], 
    name: 'etudiant_competences_ibfk_2' 
  }).onDelete('cascade'),
}));

// Offer skills requirement relationship
export const offreCompetences = mysqlTable('offre_competences', {
  offreId: varchar('offre_id', { length: 36 }).notNull(),
  competenceId: varchar('competence_id', { length: 36 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.offreId, table.competenceId] }),
  offreFk: foreignKey({ 
    columns: [table.offreId], 
    foreignColumns: [offres.id], 
    name: 'offre_competences_ibfk_1' 
  }).onDelete('cascade'),
  competenceFk: foreignKey({ 
    columns: [table.competenceId], 
    foreignColumns: [competences.id], 
    name: 'offre_competences_ibfk_2' 
  }).onDelete('cascade'),
}));

// Favorites table
export const favoris = mysqlTable('favoris', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  etudiantId: varchar('etudiant_id', { length: 36 }).notNull(),
  offreId: varchar('offre_id', { length: 36 }).notNull(),
  dateAjout: timestamp('date_ajout').defaultNow().notNull(),
}, (table) => ({
  uniqueFavori: unique('unique_favori').on(table.etudiantId, table.offreId),
  etudiantIdx: index('idx_etudiant').on(table.etudiantId),
  offreIdx: index('idx_offre').on(table.offreId),
  etudiantFk: foreignKey({ 
    columns: [table.etudiantId], 
    foreignColumns: [etudiants.id], 
    name: 'favoris_ibfk_1' 
  }).onDelete('cascade'),
  offreFk: foreignKey({ 
    columns: [table.offreId], 
    foreignColumns: [offres.id], 
    name: 'favoris_ibfk_2' 
  }).onDelete('cascade'),
}));

// Evaluations table
export const evaluations = mysqlTable('evaluations', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  entrepriseId: varchar('entreprise_id', { length: 36 }).notNull(),
  etudiantId: varchar('etudiant_id', { length: 36 }).notNull(),
  candidatureId: varchar('candidature_id', { length: 36 }),
  note: int('note'), // CHECK constraint: between 1 and 5
  commentaire: text('commentaire'),
  dateEvaluation: timestamp('date_evaluation').defaultNow().notNull(),
}, (table) => ({
  entrepriseIdx: index('idx_entreprise').on(table.entrepriseId),
  etudiantIdx: index('idx_etudiant').on(table.etudiantId),
  noteIdx: index('idx_note').on(table.note),
  entrepriseFk: foreignKey({ 
    columns: [table.entrepriseId], 
    foreignColumns: [entreprises.id], 
    name: 'evaluations_ibfk_1' 
  }).onDelete('cascade'),
  etudiantFk: foreignKey({ 
    columns: [table.etudiantId], 
    foreignColumns: [etudiants.id], 
    name: 'evaluations_ibfk_2' 
  }).onDelete('cascade'),
  candidatureFk: foreignKey({ 
    columns: [table.candidatureId], 
    foreignColumns: [candidatures.id], 
    name: 'evaluations_ibfk_3' 
  }).onDelete('set null'),
}));

// Messages table
export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  expediteurId: varchar('expediteur_id', { length: 36 }).notNull(),
  destinataireId: varchar('destinataire_id', { length: 36 }).notNull(),
  contenu: text('contenu').notNull(),
  dateEnvoi: timestamp('date_envoi').defaultNow().notNull(),
  estLu: tinyint('est_lu').default(0),
}, (table) => ({
  expediteurIdx: index('idx_expediteur').on(table.expediteurId),
  destinataireIdx: index('idx_destinataire').on(table.destinataireId),
  dateEnvoiIdx: index('idx_date_envoi').on(table.dateEnvoi),
  expediteurFk: foreignKey({ 
    columns: [table.expediteurId], 
    foreignColumns: [users.id], 
    name: 'messages_ibfk_1' 
  }).onDelete('cascade'),
  destinataireFk: foreignKey({ 
    columns: [table.destinataireId], 
    foreignColumns: [users.id], 
    name: 'messages_ibfk_2' 
  }).onDelete('cascade'),
}));

// Notifications table
export const notifications = mysqlTable('notifications', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(uuid())`),
  userId: varchar('user_id', { length: 36 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  contenu: text('contenu').notNull(),
  dateEnvoi: timestamp('date_envoi').defaultNow().notNull(),
  estLue: tinyint('est_lue').default(0),
  priorite: mysqlEnum('priorite', ['basse', 'normale', 'haute', 'urgente']).default('normale'),
}, (table) => ({
  userIdx: index('idx_user_id').on(table.userId),
  estLueIdx: index('idx_est_lue').on(table.estLue),
  dateEnvoiIdx: index('idx_date_envoi').on(table.dateEnvoi),
  userFk: foreignKey({ 
    columns: [table.userId], 
    foreignColumns: [users.id], 
    name: 'notifications_ibfk_1' 
  }).onDelete('cascade'),
}));