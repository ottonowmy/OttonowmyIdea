# Ottonowmy Idea - Setup Airtable

## 📋 Prompt à utiliser avec une IA ou manuellement

Copie-colle ce texte dans ChatGPT, Claude ou directement dans Airtable:

---

### 🎯 PROMPT POUR CRÉER LA BASE AIRTABLE

**Tu dois créer une base Airtable avec 3 tables pour l'application Ottonowmy Idea (plateforme de partage d'idées d'apps). Voici les spécifications:**

---

## TABLE 1: Users

**Colonnes à créer:**

1. **clerkId** (Type: Text)
   - Obligatoire: Oui
   - Description: L'ID unique de Clerk (lien utilisateur)

2. **email** (Type: Email)
   - Obligatoire: Oui
   - Description: Email de l'utilisateur

3. **pseudo** (Type: Text)
   - Obligatoire: Oui
   - Description: Pseudo choisi par l'utilisateur (max 30 caractères)

4. **eclairs** (Type: Number)
   - Obligatoire: Oui
   - Format: Integer
   - Par défaut: 0
   - Description: Nombre d'éclairs (monnaie virtuelle)

5. **createdAt** (Type: Date)
   - Obligatoire: Oui
   - Par défaut: Today
   - Description: Date de création du compte

6. **updatedAt** (Type: Date)
   - Obligatoire: Non
   - Description: Dernière mise à jour

---

## TABLE 2: Ideas

**Colonnes à créer:**

1. **name** (Type: Text - Clé primaire)
   - Obligatoire: Oui
   - Description: Identifiant unique de l'idée (auto-généré ou ID)

2. **title** (Type: Text)
   - Obligatoire: Oui
   - Description: Titre de l'idée d'app

3. **description** (Type: Text - Long text)
   - Obligatoire: Oui
   - Description: Description détaillée de l'idée

4. **visibility** (Type: Single select)
   - Options: 
     - Public
     - Privé
   - Par défaut: Public
   - Description: Visibilité de l'idée

5. **likes** (Type: Number)
   - Format: Integer
   - Par défaut: 0
   - Description: Nombre de likes

6. **dislikes** (Type: Number)
   - Format: Integer
   - Par défaut: 0
   - Description: Nombre de dislikes (visibles seulement en privé)

7. **createdBy** (Type: Link to another table)
   - Lier à: Table Users
   - Description: Utilisateur qui a créé l'idée

8. **createdAt** (Type: Date)
   - Obligatoire: Oui
   - Par défaut: Today
   - Description: Date de création

9. **status** (Type: Single select)
   - Options:
     - draft
     - published
     - launched
   - Par défaut: draft
   - Description: État de l'idée

---

## TABLE 3: Comments

**Colonnes à créer:**

1. **name** (Type: Text - Clé primaire)
   - Obligatoire: Oui
   - Description: Identifiant unique du commentaire (auto-généré)

2. **content** (Type: Text - Long text)
   - Obligatoire: Oui
   - Description: Contenu du commentaire

3. **pseudo** (Type: Text)
   - Obligatoire: Oui
   - Description: Pseudo de la personne qui a commenté

4. **ideaId** (Type: Link to another table)
   - Lier à: Table Ideas
   - Description: L'idée commentée

5. **userId** (Type: Link to another table)
   - Lier à: Table Users
   - Description: L'utilisateur qui a commenté

6. **createdAt** (Type: Date)
   - Obligatoire: Oui
   - Par défaut: Today
   - Description: Date du commentaire

---

## TABLE 4: Votes (Optionnel - pour tracker les votes par utilisateur)

**Colonnes à créer:**

1. **name** (Type: Text - Clé primaire)
   - Description: Identifiant unique du vote

2. **ideaId** (Type: Link to another table)
   - Lier à: Table Ideas
   - Description: L'idée votée

3. **userId** (Type: Link to another table)
   - Lier à: Table Users
   - Description: L'utilisateur qui a voté

4. **voteType** (Type: Single select)
   - Options:
     - like
     - dislike
   - Description: Type de vote

5. **createdAt** (Type: Date)
   - Par défaut: Today
   - Description: Date du vote

---

## 🔗 RELATIONS À CRÉER

1. **Ideas.createdBy** ↔ **Users.clerkId**
   - Une idée appartient à un utilisateur
   - Un utilisateur peut créer plusieurs idées

2. **Comments.ideaId** ↔ **Ideas.name**
   - Un commentaire appartient à une idée
   - Une idée peut avoir plusieurs commentaires

3. **Comments.userId** ↔ **Users.clerkId**
   - Un commentaire est écrit par un utilisateur
   - Un utilisateur peut écrire plusieurs commentaires

4. **Votes.ideaId** ↔ **Ideas.name** (Optionnel)
   - Un vote appartient à une idée
   - Une idée peut avoir plusieurs votes

5. **Votes.userId** ↔ **Users.clerkId** (Optionnel)
   - Un vote est donné par un utilisateur
   - Un utilisateur peut voter plusieurs fois

---

## 📊 ÉTAPES DE CRÉATION

### Manuelle dans Airtable:

1. Va sur https://airtable.com
2. Crée une nouvelle base appelée "Ottonowmy Idea"
3. Supprime la table par défaut
4. Crée les 3 tables (ou 4 avec Votes)
5. Ajoute les colonnes selon les spécifications ci-dessus
6. Configure les liens entre les tables
7. Copie ta **API Key** et **Base ID** pour l'app

### Automatique (IA):

Utilise Airtable Automations ou un script Node.js avec la libraire `airtable` pour créer tout automatiquement.

---

## 🔑 INFORMATIONS À RÉCUPÉRER

Une fois la base créée, tu auras besoin de:

```
AIRTABLE_API_KEY=YOUR_API_KEY
AIRTABLE_BASE_ID=YOUR_BASE_ID
AIRTABLE_TABLE_USERS=Users
AIRTABLE_TABLE_IDEAS=Ideas
AIRTABLE_TABLE_COMMENTS=Comments
AIRTABLE_TABLE_VOTES=Votes (optionnel)
```

Ajoute ces variables à ton `.env.local`

---

## 📝 DONNÉES D'EXEMPLE

Voici quelques enregistrements d'exemple pour tester:

**Users:**
- clerkId: user_123, email: dev@example.com, pseudo: DevMaster, eclairs: 2500

**Ideas:**
- title: "App de productivité IA", description: "...", visibility: Public, likes: 45, dislikes: 5, createdBy: user_123

**Comments:**
- content: "Super idée!", pseudo: "DevMaster", ideaId: (link idea), userId: (link user)

---

**Une fois les tables créées, copie le Base ID et crée ta clé API dans Airtable pour te connecter à l'app!** 🚀
