# Ottonowmy Idea - Guide Complet de Configuration

## 🚀 Étapes de Configuration

### 1️⃣ Cloner/Télécharger le projet

```bash
# Extraire le ZIP
unzip ottonowmy-idea-nextjs.zip
cd ottonowmy-idea-nextjs

# Installer les dépendances
npm install
```

### 2️⃣ Clerk (Authentification)

1. Aller sur [clerk.com](https://clerk.com)
2. Créer un nouveau projet
3. Sélectionner "Next.js"
4. Récupérer les clés:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

**Configure les URLs dans Clerk Dashboard:**
- Sign in URL: `/auth/sign-in`
- Sign up URL: `/auth/sign-up`
- After sign in: `/auth/setup` (création du pseudo)
- After sign up: `/auth/setup` (création du pseudo)

### 3️⃣ Airtable (Base de données)

1. Aller sur [airtable.com](https://airtable.com)
2. Créer une base appelée "Ottonowmy Idea"
3. Créer les 4 tables (voir AIRTABLE_SETUP.md)
4. Récupérer:
   - **Base ID**: visible dans l'URL
   - **API Key**: Compte → Tokens d'accès personnels

**Créer un token d'accès:**
1. Compte (en haut à droite) → Tokens d'accès personnels
2. Créer un nouveau token
3. Sélectionner les scopes: `data.records:read`, `data.records:write`, `schema.bases:read`

### 4️⃣ OpenAI (Recherche IA)

1. Aller sur [openai.com](https://platform.openai.com)
2. Créer un compte / Se connecter
3. API Keys → Create new secret key
4. Copier la clé (`sk_...`)

### 5️⃣ Fichier .env.local

Créer un fichier `.env.local` à la racine:

```env
# CLERK
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/setup
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/setup

# AIRTABLE
AIRTABLE_API_KEY=pat_YOUR_API_KEY
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# OPENAI
OPENAI_API_KEY=sk_YOUR_OPENAI_KEY
```

### 6️⃣ Lancer le serveur

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## ✅ Checklist

- [ ] Compte Clerk créé
- [ ] Clés Clerk dans `.env.local`
- [ ] Base Airtable créée avec 4 tables
- [ ] Clés Airtable dans `.env.local`
- [ ] Token OpenAI créé dans `.env.local`
- [ ] `npm install` lancé
- [ ] `npm run dev` fonctionne
- [ ] Page `/dashboard` accessible
- [ ] Créer un pseudo unique fonctionne
- [ ] Créer un projet fonctionne (avec 700 éclairs déduits)

## 📊 Structure Airtable à créer

**Voir AIRTABLE_SETUP.md pour les détails complets**

Tables:
1. **Users** - Utilisateurs (clerkId, email, pseudo, eclairs)
2. **Ideas** - Projets (title, description, visibility, createdBy, likes, dislikes, status)
3. **Comments** - Commentaires (content, pseudo, ideaId, userId, createdAt)
4. **Votes** - Votes (ideaId, userId, voteType, createdAt)

Relations:
- Ideas.createdBy → Users.id
- Comments.ideaId → Ideas.id
- Votes.ideaId → Ideas.id

## 🔗 Endpoints API

### Users
- `GET /api/airtable/users/[id]` - Récupérer user par clerkId
- `POST /api/airtable/users/create` - Créer user
- `GET /api/airtable/users/check-pseudo?pseudo=XXX` - Vérifier disponibilité pseudo

### Ideas
- `GET /api/airtable/ideas?userId=XXX` - Récupérer idées (publiques + les siennes)
- `GET /api/airtable/ideas/[id]?userId=XXX` - Récupérer une idée (avec permission)
- `POST /api/airtable/ideas/create` - Créer une idée

### Votes
- `POST /api/airtable/votes` - Voter (like/dislike)

### Comments
- `POST /api/airtable/comments` - Ajouter un commentaire

### OpenAI
- `POST /api/openai/suggestions` - Générer des idées IA
- `POST /api/openai/filter` - Filtrer avec IA

## 🚀 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter les variables d'environnement dans Vercel Dashboard
```

### Variables d'environnement à ajouter:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `OPENAI_API_KEY`

## 📚 Ressources

- [Clerk Docs](https://clerk.com/docs)
- [Airtable API](https://airtable.com/developers/web)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 🆘 Support

Si vous rencontrez des problèmes:
1. Vérifiez les clés dans `.env.local`
2. Vérifiez la structure Airtable
3. Vérifiez les URLs de redirection Clerk
4. Consultez les logs du serveur (`npm run dev`)

---

**Prêt? Commençons!** 🎉
