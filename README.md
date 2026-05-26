# Ottonowmy Idea - Next.js App

Une plateforme pour explorer, créer et partager des idées d'applications brillantes avec un système de votes et une recherche IA.

## 🎯 Stack

- **Next.js 14** (App Router)
- **Clerk** (Authentification)
- **Airtable** (Base de données)
- **OpenAI** (Recherche IA)
- **TypeScript**
- **CSS Modules**

## ✨ Fonctionnalités

- ✅ Authentification Clerk avec pseudo unique
- ✅ Dashboard avec éclairs (monnaie virtuelle)
- ✅ Explorer les idées publiques (comme YouTube)
- ✅ Système de Like/Dislike
  - Public: likes visibles, dislikes cachés
  - Privé: likes ET dislikes avec statistiques
- ✅ Commentaires publics sur les idées
- ✅ Créer une idée d'app (coût: 700 éclairs)
- ✅ Mes projets: voir tous ses projets (publics + privés)
- ✅ Recherche IA: filtrer et suggérer des idées
- ✅ Mode privé: visible seulement au créateur
- ✅ Mode public: visible à tous
- ✅ Interface sans émojis (icons SVG)

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env.local
# Voir ci-dessous pour les variables

# 3. Lancer le serveur
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration (.env.local)

```env
# CLERK Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/setup
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/setup

# AIRTABLE Configuration
AIRTABLE_API_KEY=YOUR_API_KEY
AIRTABLE_BASE_ID=YOUR_BASE_ID

# OPENAI Configuration (pour la recherche IA)
OPENAI_API_KEY=YOUR_OPENAI_KEY
```

## 📁 Structure App

```
app/
├── page.tsx                          # Landing page publique
├── auth/
│   ├── sign-in/                     # Connexion Clerk
│   ├── sign-up/                     # Inscription Clerk
│   └── setup/                       # Choix du pseudo unique
├── api/
│   ├── airtable/
│   │   ├── ideas/                   # GET/POST idées
│   │   ├── users/                   # GET/POST/CREATE users
│   │   ├── comments/                # POST commentaires
│   │   └── votes/                   # POST votes
│   └── openai/
│       ├── suggestions/             # Générer idées IA
│       └── filter/                  # Filtrer avec IA
└── dashboard/
    ├── page.tsx                     # Accueil (stats)
    ├── layout.tsx                   # Navbar + éclairs
    ├── ideas/                       # Explorer avec recherche IA
    ├── ideas/[id]/                  # Détail idée + votes + commentaires
    ├── create/                      # Créer une idée (centré)
    └── my-projects/                 # Mes projets (publics + privés)
```

## 🎮 Flows Principaux

### 1. Inscription & Pseudo
- `/auth/sign-up` → Inscription Clerk
- `/auth/setup` → Choix du pseudo (unique)
- Création utilisateur dans Airtable avec 0 éclairs
- Redirection vers `/dashboard`

### 2. Explorer les idées
- `/dashboard/ideas` → Listing des idées
- Recherche IA: décrivez ce que vous cherchez
- Filtres: publiques + vos privées
- Clic → détail d'une idée

### 3. Détail d'une idée
- `/dashboard/ideas/[id]` → Détail complète
- **Public**: Like visibles, pas de dislike
- **Privé**: Like ET Dislike avec stats
- Commentaires visibles pour tous
- TODO: Ajouter +15 éclairs par commentaire

### 4. Créer une idée
- `/dashboard/create` → Formulaire centré
- Coût: 700 éclairs (déduits immédiatement)
- Choix: Public/Privé
- Création dans Airtable
- Redirection vers `/dashboard/my-projects`

### 5. Mes projets
- `/dashboard/my-projects` → Tous vos projets
- Filtre: Tous / Public / Privé
- Affiche status: draft, published, launched
- Edit/delete: TODO

## 💾 Base Airtable

### 4 Tables liées:

**Users:**
- clerkId (Text, unique)
- email (Email)
- pseudo (Text, unique)
- eclairs (Number, default: 0)
- createdAt (Date)

**Ideas:**
- title (Text)
- description (Text)
- visibility (Select: Public/Privé)
- createdBy (Link to Users)
- likes (Number, default: 0)
- dislikes (Number, default: 0)
- status (Select: draft/published/launched)
- createdAt (Date)

**Comments:**
- content (Text)
- pseudo (Text)
- ideaId (Link to Ideas)
- userId (Text)
- createdAt (Date)

**Votes:**
- ideaId (Link to Ideas)
- userId (Text)
- voteType (Select: like/dislike)
- createdAt (Date)

## 💰 Système d'Éclairs

- **Affichage**: Navbar avec icon éclair
- **Dépense**: 700 éclairs pour créer une idée
- **Gain**: +15 éclairs par commentaire (TODO)
- **Stockage**: Airtable (table Users)

## 🤖 Recherche IA

- **OpenAI API**: gpt-3.5-turbo
- **Suggestions**: Générer 3-5 idées basé sur prompt utilisateur
- **Filtrage**: Trier les projets existants selon requête
- **Format**: JSON pour intégration facile

## 🎨 Design

- Sans émojis - Icons SVG uniquement
- Minimaliste et épuré
- Responsive design
- Border radius: 12-16px
- Colors: noir (#1a1a1a), blanc, gris (#e5e5e5, #999, #666)

## 📝 Commandes

```bash
npm run dev    # Développement
npm run build  # Build production
npm start      # Lancer production
npm run lint   # Linter
```

## 🌐 Déploiement

**Vercel (recommandé):**
```bash
npm i -g vercel
vercel
```

## 🚧 À faire

- [ ] Ajouter +15 éclairs par commentaire
- [ ] Edit/Delete idées
- [ ] Système de notifications
- [ ] Upload d'images pour les idées
- [ ] Statistiques avancées (analytics)
- [ ] Système de trending

## 🐛 Troubleshooting

**Problème Clerk?**
- Vérifiez `.env.local` avec les bonnes clés
- Vérifiez les URLs de redirection dans Clerk Dashboard
- Redémarrez le serveur

**Problème Airtable?**
- Vérifiez API Key et Base ID
- Vérifiez les tables existent (Users, Ideas, Comments, Votes)
- Vérifiez les relations entre tables
- Testez la connexion avec Airtable API tester

**Problème OpenAI?**
- Vérifiez la clé API OpenAI
- Vérifiez le quota/plan
- Testez avec curl: `curl https://api.openai.com/v1/models`

---

**Questions?** Consulte les fichiers SETUP.md et AIRTABLE_SETUP.md 🚀
