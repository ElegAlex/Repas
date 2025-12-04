# Cahier des Charges Fonctionnel et Technique

## Application de Gestion du Repas d'Équipe - DRSM Île-de-France

**Version :** 1.0  
**Date :** 04 décembre 2024  
**Client :** Équipe Informatique DRSM Île-de-France  
**Agent de développement cible :** Claude Code

---

## 1. Introduction

### 1.1 Contexte

L'équipe informatique de la DRSM Île-de-France organise son repas de fin d'année. Cet événement revêt une importance symbolique particulière : il s'agit du **dernier repas d'équipe avant la Transformation de l'Assurance Maladie (TAM)**, qui verra l'absorption des DRSM par les CPAM. Ce moment de convivialité marque ainsi la clôture d'une ère.

Le format retenu est un repas partagé où chaque participant apporte une contribution culinaire. Pour coordonner efficacement les apports et éviter les doublons, une application web simple et conviviale est nécessaire.

### 1.2 Objectifs

|ID|Objectif|Indicateur de succès|
|---|---|---|
|OBJ-01|Permettre aux membres de l'équipe de confirmer leur présence|100% des participants inscrits avant l'événement|
|OBJ-02|Coordonner les contributions culinaires|Équilibre visible entre catégories (entrées, plats, desserts, boissons)|
|OBJ-03|Offrir une visibilité en temps réel|Mise à jour instantanée sans rechargement|
|OBJ-04|Créer une expérience festive|Design évoquant la célébration et la convivialité|

### 1.3 Périmètre

**Inclus :**

- Inscription des participants (RSVP)
- Déclaration et gestion des contributions culinaires
- Visualisation temps réel des inscriptions et contributions
- Interface responsive (desktop et mobile)

**Exclus :**

- Authentification (contexte de confiance interne)
- Gestion de paiements
- Envoi de notifications email/SMS
- Historique des événements passés

### 1.4 Parties prenantes

|Rôle|Description|Besoins principaux|
|---|---|---|
|Participant|Membre de l'équipe (~15-25 personnes)|S'inscrire facilement, déclarer sa contribution|
|Organisateur|Responsable de l'événement|Voir la liste complète, s'assurer de l'équilibre des apports|
|Développeur|Claude Code|Spécifications claires, code maintenable|

---

## 2. Exigences Fonctionnelles

### 2.1 Module RSVP (Confirmation de présence)

#### EF-001 : Confirmer sa présence

|Champ|Valeur|
|---|---|
|**En tant que**|Membre de l'équipe|
|**Je veux**|Confirmer ma présence au repas|
|**Afin de**|Que les organisateurs connaissent le nombre de participants|
|**Priorité**|MUST HAVE|

**Critères d'acceptance :**

- [ ] Je peux saisir mon prénom (obligatoire, 2-50 caractères)
- [ ] Je peux saisir mon nom (obligatoire, 2-50 caractères)
- [ ] Je peux optionnellement ajouter un commentaire (allergies, régime alimentaire)
- [ ] Ma confirmation apparaît immédiatement dans la liste des participants
- [ ] Un compteur affiche le nombre total de participants confirmés

#### EF-002 : Modifier ma confirmation

|Champ|Valeur|
|---|---|
|**En tant que**|Participant inscrit|
|**Je veux**|Modifier mes informations ou me désinscrire|
|**Afin de**|Corriger une erreur ou annuler ma venue|
|**Priorité**|MUST HAVE|

**Critères d'acceptance :**

- [ ] Je peux retrouver mon inscription via mon nom/prénom
- [ ] Je peux modifier mon commentaire
- [ ] Je peux supprimer mon inscription
- [ ] La liste se met à jour instantanément après modification

### 2.2 Module Contributions

#### EF-003 : Ajouter une contribution

|Champ|Valeur|
|---|---|
|**En tant que**|Participant confirmé|
|**Je veux**|Déclarer ce que j'apporte au repas|
|**Afin de**|Que mes collègues sachent ce qui sera disponible|
|**Priorité**|MUST HAVE|

**Critères d'acceptance :**

- [ ] Je peux sélectionner mon nom dans la liste des participants inscrits
- [ ] Je peux choisir une catégorie parmi : Entrée, Plat principal, Dessert, Boisson, Pain/Accompagnement
- [ ] Je peux décrire ce que j'apporte (champ texte, 3-200 caractères)
- [ ] Je peux indiquer le nombre de parts/personnes (1-50)
- [ ] Je peux ajouter plusieurs contributions
- [ ] Ma contribution apparaît immédiatement dans la liste globale

#### EF-004 : Modifier une contribution

|Champ|Valeur|
|---|---|
|**En tant que**|Participant ayant déclaré une contribution|
|**Je veux**|Modifier ou supprimer ma contribution|
|**Afin de**|Corriger une erreur ou changer d'avis|
|**Priorité**|MUST HAVE|

**Critères d'acceptance :**

- [ ] Je peux modifier la catégorie, la description ou la quantité
- [ ] Je peux supprimer ma contribution
- [ ] Les modifications sont visibles instantanément

### 2.3 Module Visualisation

#### EF-005 : Voir toutes les contributions

|Champ|Valeur|
|---|---|
|**En tant que**|Visiteur de l'application|
|**Je veux**|Voir l'ensemble des contributions prévues|
|**Afin de**|Savoir ce qui sera disponible et éviter les doublons|
|**Priorité**|MUST HAVE|

**Critères d'acceptance :**

- [ ] Les contributions sont affichées groupées par catégorie
- [ ] Chaque contribution affiche : contributeur, description, nombre de parts
- [ ] Un résumé visuel montre la répartition par catégorie (compteurs ou graphique simple)
- [ ] Le nombre total de parts estimées est affiché
- [ ] La liste se met à jour en temps réel (sans rechargement manuel)

#### EF-006 : Voir la liste des participants

|Champ|Valeur|
|---|---|
|**En tant que**|Visiteur de l'application|
|**Je veux**|Voir qui participe au repas|
|**Afin de**|Connaître les collègues présents|
|**Priorité**|SHOULD HAVE|

**Critères d'acceptance :**

- [ ] La liste affiche prénom et nom de chaque participant
- [ ] Les commentaires (allergies) sont visibles si renseignés
- [ ] Le compteur total est mis en évidence

---

## 3. Exigences Non-Fonctionnelles

### 3.1 Performance

|ID|Description|Mesure|
|---|---|---|
|ENF-001|L'application doit charger en moins de 3 secondes sur connexion 4G|Lighthouse Performance Score > 80|
|ENF-002|Les mises à jour temps réel doivent apparaître en moins de 500ms|Latence mesurée < 500ms|
|ENF-003|L'application doit supporter 30 utilisateurs simultanés|Test de charge réussi|

### 3.2 Sécurité

|ID|Description|Mesure|
|---|---|---|
|ENF-004|Protection contre les injections XSS|Échappement de tous les inputs utilisateur|
|ENF-005|Validation des données côté serveur|Rejet des données malformées avec code 400|
|ENF-006|Rate limiting basique|Max 60 requêtes/minute par IP|

### 3.3 Expérience Utilisateur (UX)

|ID|Description|Mesure|
|---|---|---|
|ENF-007|Design festif et chaleureux|Palette de couleurs chaudes, éléments visuels de célébration|
|ENF-008|Interface intuitive sans formation|Tâche principale réalisable en < 30 secondes|
|ENF-009|Feedback visuel sur les actions|Confirmation visuelle après chaque action (toast/notification)|
|ENF-010|Messages d'erreur clairs et en français|Aucun message technique exposé à l'utilisateur|

### 3.4 Accessibilité

|ID|Description|Mesure|
|---|---|---|
|ENF-011|Contraste suffisant pour la lisibilité|Ratio de contraste WCAG AA (4.5:1)|
|ENF-012|Navigation au clavier fonctionnelle|Tous les éléments interactifs accessibles au Tab|
|ENF-013|Labels explicites sur les formulaires|Attributs aria-label présents|

### 3.5 Compatibilité

|ID|Description|Mesure|
|---|---|---|
|ENF-014|Responsive design|Affichage correct de 320px à 1920px|
|ENF-015|Support navigateurs modernes|Chrome, Firefox, Safari, Edge (2 dernières versions)|
|ENF-016|Fonctionnel sur mobile|Touch-friendly, pas de hover obligatoire|

### 3.6 Maintenabilité

|ID|Description|Mesure|
|---|---|---|
|ENF-017|Code commenté et structuré|README complet, fonctions documentées|
|ENF-018|Séparation claire frontend/backend|Architecture découplée|
|ENF-019|Variables d'environnement pour la configuration|Aucun secret dans le code|

---

## 4. Architecture Technique

### 4.1 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (Hébergé sur Vercel)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React + Vite                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │   │
│  │  │  RSVP    │  │ Contrib  │  │   Dashboard          │  │   │
│  │  │  Form    │  │  Form    │  │   (Liste + Stats)    │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (HTTPS)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                    (Hébergé sur Render)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Node.js + Express                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ /api/guests  │  │ /api/contribs│  │ /api/stats   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SQLite (fichier)                      │   │
│  │            Base de données embarquée                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Stack Technologique Recommandée

|Couche|Technologie|Justification|
|---|---|---|
|**Frontend**|React 18 + Vite|Rapidité de développement, écosystème riche, bundler moderne|
|**Styling**|Tailwind CSS|Utility-first, design system intégré, responsive natif|
|**State Management**|React Query (TanStack Query)|Gestion du cache, refetch automatique, temps réel simplifié|
|**Backend**|Node.js + Express|Simplicité, large adoption, déploiement facile|
|**Base de données**|SQLite|Zéro configuration, fichier unique, suffisant pour 30 users|
|**ORM**|Drizzle ORM|Léger, type-safe, migrations simples|
|**Validation**|Zod|Schémas partagés frontend/backend|

### 4.3 Options d'Hébergement Gratuit

|Service|Usage|Tier gratuit|
|---|---|---|
|**Vercel**|Frontend|Illimité pour projets personnels|
|**Render**|Backend + BDD|750h/mois (suffisant)|
|**Alternative : Railway**|Backend + BDD|500h/mois + 1GB storage|

**Recommandation :** Vercel (frontend) + Render (backend) pour la simplicité de déploiement et la fiabilité.

### 4.4 Temps Réel

Pour les mises à jour en temps réel sans WebSocket (simplicité) :

- **Polling intelligent** via React Query avec `refetchInterval: 5000` (5 secondes)
- Alternative : Server-Sent Events (SSE) si le polling s'avère insuffisant

---

## 5. Modèle de Données

### 5.1 Schéma Entités-Relations

```
┌──────────────────────┐         ┌──────────────────────────┐
│       GUESTS         │         │     CONTRIBUTIONS        │
├──────────────────────┤         ├──────────────────────────┤
│ id (PK)              │───┐     │ id (PK)                  │
│ firstName            │   │     │ guestId (FK)             │◄──┘
│ lastName             │   │     │ category                 │
│ comment              │   └────►│ description              │
│ createdAt            │         │ servings                 │
│ updatedAt            │         │ createdAt                │
└──────────────────────┘         │ updatedAt                │
                                 └──────────────────────────┘
```

### 5.2 Définition des Tables

#### Table `guests`

|Colonne|Type|Contraintes|Description|
|---|---|---|---|
|id|INTEGER|PRIMARY KEY, AUTOINCREMENT|Identifiant unique|
|firstName|TEXT|NOT NULL, 2-50 chars|Prénom du participant|
|lastName|TEXT|NOT NULL, 2-50 chars|Nom du participant|
|comment|TEXT|NULLABLE, max 500 chars|Commentaire (allergies, régime)|
|createdAt|DATETIME|DEFAULT CURRENT_TIMESTAMP|Date de création|
|updatedAt|DATETIME|DEFAULT CURRENT_TIMESTAMP|Date de modification|

**Index :** `UNIQUE(firstName, lastName)` pour éviter les doublons

#### Table `contributions`

|Colonne|Type|Contraintes|Description|
|---|---|---|---|
|id|INTEGER|PRIMARY KEY, AUTOINCREMENT|Identifiant unique|
|guestId|INTEGER|FOREIGN KEY → guests(id) ON DELETE CASCADE|Référence au participant|
|category|TEXT|NOT NULL, ENUM|Catégorie du plat|
|description|TEXT|NOT NULL, 3-200 chars|Description de l'apport|
|servings|INTEGER|NOT NULL, 1-50|Nombre de parts|
|createdAt|DATETIME|DEFAULT CURRENT_TIMESTAMP|Date de création|
|updatedAt|DATETIME|DEFAULT CURRENT_TIMESTAMP|Date de modification|

**Valeurs ENUM pour `category` :**

- `STARTER` (Entrée)
- `MAIN` (Plat principal)
- `DESSERT` (Dessert)
- `DRINK` (Boisson)
- `SIDE` (Pain/Accompagnement)

### 5.3 Schéma Drizzle ORM (TypeScript)

```typescript
// schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const guests = sqliteTable('guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  comment: text('comment'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const contributions = sqliteTable('contributions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').references(() => guests.id, { onDelete: 'cascade' }).notNull(),
  category: text('category', { enum: ['STARTER', 'MAIN', 'DESSERT', 'DRINK', 'SIDE'] }).notNull(),
  description: text('description').notNull(),
  servings: integer('servings').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
```

---

## 6. Spécification API

### 6.1 Base URL

```
Production : https://api-repas-drsm.onrender.com
Développement : http://localhost:3001
```

### 6.2 Endpoints Participants (Guests)

#### GET /api/guests

Récupère la liste de tous les participants.

**Réponse 200 :**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "Jean",
      "lastName": "Dupont",
      "comment": "Végétarien",
      "createdAt": "2024-12-01T10:00:00Z",
      "contributions": [
        {
          "id": 1,
          "category": "DESSERT",
          "description": "Tarte aux pommes maison",
          "servings": 8
        }
      ]
    }
  ],
  "total": 1
}
```

#### POST /api/guests

Inscrit un nouveau participant.

**Payload :**

```json
{
  "firstName": "Marie",
  "lastName": "Martin",
  "comment": "Allergique aux fruits à coque"
}
```

**Validation (Zod) :**

```typescript
const createGuestSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  comment: z.string().max(500).optional(),
});
```

**Réponse 201 :**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "firstName": "Marie",
    "lastName": "Martin",
    "comment": "Allergique aux fruits à coque",
    "createdAt": "2024-12-04T14:30:00Z"
  }
}
```

**Réponse 400 (Validation error) :**

```json
{
  "success": false,
  "error": "Données invalides",
  "details": [
    { "field": "firstName", "message": "Le prénom doit contenir au moins 2 caractères" }
  ]
}
```

**Réponse 409 (Duplicate) :**

```json
{
  "success": false,
  "error": "Un participant avec ce nom existe déjà"
}
```

#### PUT /api/guests/:id

Modifie un participant existant.

**Payload :**

```json
{
  "comment": "Plus d'allergie !"
}
```

**Réponse 200 :**

```json
{
  "success": true,
  "data": { ... }
}
```

#### DELETE /api/guests/:id

Supprime un participant (et ses contributions en cascade).

**Réponse 200 :**

```json
{
  "success": true,
  "message": "Participant supprimé avec succès"
}
```

### 6.3 Endpoints Contributions

#### GET /api/contributions

Récupère toutes les contributions, groupées par catégorie.

**Query params (optionnels) :**

- `category` : Filtrer par catégorie

**Réponse 200 :**

```json
{
  "success": true,
  "data": {
    "STARTER": [
      {
        "id": 1,
        "description": "Salade composée",
        "servings": 10,
        "guest": { "id": 1, "firstName": "Jean", "lastName": "Dupont" }
      }
    ],
    "MAIN": [],
    "DESSERT": [...],
    "DRINK": [...],
    "SIDE": [...]
  },
  "stats": {
    "totalContributions": 5,
    "totalServings": 45,
    "byCategory": {
      "STARTER": { "count": 1, "servings": 10 },
      "MAIN": { "count": 0, "servings": 0 },
      ...
    }
  }
}
```

#### POST /api/contributions

Ajoute une nouvelle contribution.

**Payload :**

```json
{
  "guestId": 1,
  "category": "DESSERT",
  "description": "Mousse au chocolat",
  "servings": 12
}
```

**Validation (Zod) :**

```typescript
const createContributionSchema = z.object({
  guestId: z.number().positive(),
  category: z.enum(['STARTER', 'MAIN', 'DESSERT', 'DRINK', 'SIDE']),
  description: z.string().min(3).max(200),
  servings: z.number().min(1).max(50),
});
```

**Réponse 201 :**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "guestId": 1,
    "category": "DESSERT",
    "description": "Mousse au chocolat",
    "servings": 12,
    "createdAt": "2024-12-04T15:00:00Z"
  }
}
```

#### PUT /api/contributions/:id

Modifie une contribution existante.

#### DELETE /api/contributions/:id

Supprime une contribution.

### 6.4 Endpoints Statistiques

#### GET /api/stats

Récupère les statistiques globales.

**Réponse 200 :**

```json
{
  "success": true,
  "data": {
    "guestsCount": 18,
    "contributionsCount": 12,
    "totalServings": 85,
    "servingsPerGuest": 4.7,
    "categoryCoverage": {
      "STARTER": true,
      "MAIN": true,
      "DESSERT": true,
      "DRINK": true,
      "SIDE": false
    },
    "alerts": [
      { "type": "warning", "message": "Aucun pain/accompagnement prévu" }
    ]
  }
}
```

---

## 7. Maquettes Conceptuelles

### 7.1 Page d'Accueil / Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎄 Repas d'Équipe DRSM IDF - Fin d'Année 2024 🎄                  │
│  [Banner festif avec couleurs chaudes]                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  📋 INSCRIPTION     │  │  🍽️ CONTRIBUTIONS                   │  │
│  │                     │  │                                     │  │
│  │  18 participants    │  │  [Barre de progression par          │  │
│  │  confirmés          │  │   catégorie - colorée]              │  │
│  │                     │  │                                     │  │
│  │  [Bouton: Je        │  │  🥗 Entrées: 3 (24 parts)           │  │
│  │   m'inscris !]      │  │  🍖 Plats: 2 (16 parts)             │  │
│  │                     │  │  🍰 Desserts: 4 (32 parts)          │  │
│  └─────────────────────┘  │  🥤 Boissons: 2 (20L)               │  │
│                           │  🥖 Accomp.: 1 (10 parts)            │  │
│                           │                                     │  │
│                           │  [Bouton: J'apporte quelque chose]  │  │
│                           └─────────────────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    📊 DÉTAIL DES CONTRIBUTIONS                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Tabs: Entrées | Plats | Desserts | Boissons | Accompagnements]   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🥗 ENTRÉES                                                     │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ • Salade composée (10 parts) — Jean D.          [✏️] [🗑️]    │ │
│  │ • Houmous maison (8 parts) — Marie M.           [✏️] [🗑️]    │ │
│  │ • Cake salé (6 parts) — Pierre L.               [✏️] [🗑️]    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                       👥 QUI VIENT ?                                │
├─────────────────────────────────────────────────────────────────────┤
│  Jean Dupont · Marie Martin · Pierre Lefebvre · Sophie Bernard ·   │
│  [+14 autres]                [Voir tous]                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Modal Inscription (RSVP)

```
┌───────────────────────────────────────────────┐
│         🎉 Je participe au repas !            │
├───────────────────────────────────────────────┤
│                                               │
│  Prénom *                                     │
│  ┌─────────────────────────────────────────┐  │
│  │ Marie                                   │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Nom *                                        │
│  ┌─────────────────────────────────────────┐  │
│  │ Martin                                  │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Commentaire (allergies, régime...)           │
│  ┌─────────────────────────────────────────┐  │
│  │ Végétarienne                            │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌───────────────┐  ┌─────────────────────┐  │
│  │   Annuler     │  │  ✓ Je m'inscris     │  │
│  └───────────────┘  └─────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
```

### 7.3 Modal Contribution

```
┌───────────────────────────────────────────────┐
│         🍽️ J'apporte quelque chose            │
├───────────────────────────────────────────────┤
│                                               │
│  Qui êtes-vous ? *                            │
│  ┌─────────────────────────────────────────┐  │
│  │ ▼ Marie Martin                          │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Catégorie *                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │🥗   │ │🍖   │ │🍰   │ │🥤   │ │🥖   │    │
│  │Entrée│ │Plat │ │Desst│ │Boiss│ │Accom│    │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘    │
│                                               │
│  Description *                                │
│  ┌─────────────────────────────────────────┐  │
│  │ Tarte aux pommes maison                 │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Nombre de parts *                            │
│  ┌─────────────────────────────────────────┐  │
│  │  [−]         8          [+]             │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌───────────────┐  ┌─────────────────────┐  │
│  │   Annuler     │  │  ✓ Ajouter          │  │
│  └───────────────┘  └─────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
```

### 7.4 Charte Graphique

|Élément|Valeur|Usage|
|---|---|---|
|**Couleur primaire**|`#B91C1C` (Rouge chaleureux)|Boutons principaux, accents|
|**Couleur secondaire**|`#15803D` (Vert sapin)|Badges catégories, succès|
|**Background**|`#FEF3C7` (Crème chaud)|Fond de page|
|**Cards**|`#FFFFFF` avec ombre douce|Conteneurs|
|**Texte principal**|`#1F2937`|Contenu|
|**Texte secondaire**|`#6B7280`|Labels, aide|
|**Police**|Inter ou système|Corps de texte|
|**Police titre**|Playfair Display (optionnel)|Titres festifs|
|**Border radius**|`12px`|Arrondi généreux|
|**Emojis**|🎄 🎉 🥗 🍖 🍰 🥤 🥖|Visuels catégories|

---

## 8. Plan de Tests

### 8.1 Tests Unitaires (Backend)

|ID|Fonction|Scénario|Résultat attendu|
|---|---|---|---|
|TU-001|createGuest|Données valides|Guest créé, ID retourné|
|TU-002|createGuest|Prénom trop court|Erreur 400, message explicite|
|TU-003|createGuest|Doublon nom/prénom|Erreur 409, message explicite|
|TU-004|createContribution|Guest inexistant|Erreur 404|
|TU-005|createContribution|Catégorie invalide|Erreur 400|
|TU-006|deleteGuest|Avec contributions|Suppression cascade OK|

### 8.2 Tests d'Intégration (API)

|ID|Endpoint|Scénario|Résultat attendu|
|---|---|---|---|
|TI-001|GET /api/guests|Liste vide|`{ data: [], total: 0 }`|
|TI-002|POST → GET|Création puis lecture|Guest présent dans liste|
|TI-003|POST → PUT → GET|Modif puis lecture|Données modifiées visibles|
|TI-004|POST → DELETE → GET|Suppression|Guest absent de la liste|

### 8.3 Tests E2E (Frontend)

|ID|Parcours|Actions|Vérification|
|---|---|---|---|
|TE-001|Inscription complète|Remplir form → Submit|Toast succès, nom dans liste|
|TE-002|Ajout contribution|Sélectionner guest → Remplir → Submit|Contribution visible|
|TE-003|Modification|Clic éditer → Modifier → Save|Données mises à jour|
|TE-004|Suppression|Clic supprimer → Confirmer|Élément disparu|
|TE-005|Responsive|Resize 320px|Layout mobile OK|

### 8.4 Tests de Performance

|ID|Test|Outil|Seuil|
|---|---|---|---|
|TP-001|Lighthouse Performance|Lighthouse|Score > 80|
|TP-002|First Contentful Paint|Lighthouse|< 1.5s|
|TP-003|Time to Interactive|Lighthouse|< 3s|
|TP-004|API Response Time|Artillery|p95 < 200ms|

### 8.5 Critères d'Acceptance Globaux

- [ ] Toutes les User Stories ont leurs critères d'acceptance validés
- [ ] Aucune erreur console en production
- [ ] Score Lighthouse > 80 sur les 4 métriques
- [ ] Application fonctionnelle sur Chrome, Firefox, Safari mobile
- [ ] Temps de réponse API < 200ms en p95

---

## 9. Planning Indicatif

### 9.1 Découpage en Sprints (pour Claude Code)

#### Sprint 0 : Setup (1-2h)

|Tâche|Description|Livrable|
|---|---|---|
|T0-01|Initialiser projet Vite + React + TypeScript|Structure projet frontend|
|T0-02|Configurer Tailwind CSS|Config fonctionnelle|
|T0-03|Initialiser projet Express + TypeScript|Structure projet backend|
|T0-04|Configurer Drizzle + SQLite|BDD initialisée avec schéma|
|T0-05|Créer structure de dossiers|Architecture claire|

#### Sprint 1 : Backend Core (2-3h)

|Tâche|Description|Livrable|
|---|---|---|
|T1-01|Implémenter CRUD Guests|Endpoints fonctionnels|
|T1-02|Implémenter CRUD Contributions|Endpoints fonctionnels|
|T1-03|Implémenter endpoint Stats|Statistiques calculées|
|T1-04|Ajouter validation Zod|Schémas partagés|
|T1-05|Écrire tests unitaires|Coverage > 80%|

#### Sprint 2 : Frontend Core (3-4h)

|Tâche|Description|Livrable|
|---|---|---|
|T2-01|Créer layout principal + header festif|Structure visuelle|
|T2-02|Implémenter composant Dashboard|Stats + résumé|
|T2-03|Implémenter modal Inscription|Form RSVP fonctionnel|
|T2-04|Implémenter modal Contribution|Form contribution fonctionnel|
|T2-05|Implémenter liste contributions par catégorie|Affichage groupé|
|T2-06|Implémenter liste participants|Liste avec compteur|

#### Sprint 3 : Interactions (2-3h)

|Tâche|Description|Livrable|
|---|---|---|
|T3-01|Intégrer React Query|Fetching optimisé|
|T3-02|Ajouter polling temps réel|MAJ auto toutes les 5s|
|T3-03|Implémenter modification/suppression|Actions CRUD UI|
|T3-04|Ajouter toasts de feedback|Notifications visuelles|
|T3-05|Gérer les états de chargement|Skeletons, loaders|

#### Sprint 4 : Polish & Deploy (2-3h)

|Tâche|Description|Livrable|
|---|---|---|
|T4-01|Responsive design mobile|Breakpoints OK|
|T4-02|Animations et micro-interactions|Transitions fluides|
|T4-03|Optimisation Lighthouse|Score > 80|
|T4-04|Déployer backend sur Render|URL production backend|
|T4-05|Déployer frontend sur Vercel|URL production frontend|
|T4-06|Tests finaux cross-browser|Validation complète|

### 9.2 Estimation Totale

|Phase|Durée estimée|
|---|---|
|Setup|1-2h|
|Backend|2-3h|
|Frontend|3-4h|
|Interactions|2-3h|
|Polish & Deploy|2-3h|
|**TOTAL**|**10-15h**|

### 9.3 Dépendances

```
T0-* → T1-* (Backend dépend du setup)
T0-* → T2-* (Frontend dépend du setup)
T1-* → T3-* (Interactions dépendent de l'API)
T2-* → T3-* (Interactions dépendent des composants)
T3-* → T4-* (Polish après fonctionnalités)
```

---

## Annexes

### A. Checklist de Démarrage pour Claude Code

```bash
# 1. Cloner/créer le projet
mkdir repas-equipe-drsm && cd repas-equipe-drsm

# 2. Initialiser le frontend
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install tailwindcss postcss autoprefixer @tanstack/react-query zod
npx tailwindcss init -p

# 3. Initialiser le backend
cd .. && mkdir backend && cd backend
npm init -y
npm install express cors drizzle-orm better-sqlite3 zod
npm install -D typescript @types/express @types/cors @types/better-sqlite3 tsx drizzle-kit

# 4. Structure recommandée
repas-equipe-drsm/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── db/
│   │   └── index.ts
│   └── package.json
└── README.md
```

### B. Variables d'Environnement

**Frontend (.env)**

```
VITE_API_URL=https://api-repas-drsm.onrender.com
```

**Backend (.env)**

```
PORT=3001
DATABASE_URL=./data/repas.db
CORS_ORIGIN=https://repas-drsm.vercel.app
```

### C. Labels Français des Catégories

```typescript
export const CATEGORY_LABELS: Record<Category, string> = {
  STARTER: 'Entrée',
  MAIN: 'Plat principal',
  DESSERT: 'Dessert',
  DRINK: 'Boisson',
  SIDE: 'Pain/Accompagnement',
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  STARTER: '🥗',
  MAIN: '🍖',
  DESSERT: '🍰',
  DRINK: '🥤',
  SIDE: '🥖',
};
```

---

**Fin du Cahier des Charges**

_Document rédigé pour exploitation par Claude Code._ _Toute question d'implémentation peut être résolue en se référant aux spécifications ci-dessus._