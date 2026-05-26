# Ottonowmy Idea - Guide Complet de Configuration

## 🚀 Étapes de Configuration

### 1️⃣ Cloner/Télécharger le projet

```bash
unzip ottonowmy-idea-nextjs.zip
cd ottonowmy-idea-nextjs
npm install
```

### 2️⃣ Clerk (Authentification) - IMPORTANT!

1. Aller sur [clerk.com](https://clerk.com)
2. Créer un nouveau projet
3. Sélectionner "Next.js"
4. Récupérer les clés:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

**⚠️ IMPORTANT - Configure les URLs dans Clerk Dashboard:**

Dans "User & Authentication" → "Paths":
- Sign in URL: `/auth/sign-in`
- Sign up URL: `/auth/sign-up`
- **After sign in URL: `/auth/setup`** ← CRÉER LE PSEUDO
- **After sign up URL: `/auth/setup`** ← CRÉER LE PSEUDO

Ceci est CRUCIAL! Sans ça, l'utilisateur ne sera pas redirigé pour créer son pseudo.

### 3️⃣ Airtable (Base de données) - IMPORTANT!

**Créer les 4 tables:**

#### Table 1: Users
Colonnes:
- `clerkId` (Text, unique)
- `email` (Email)
- `pseudo` (Text, unique)
- `eclairs` (Number, default: 0)
- `createdAt` (Date)

#### Table 2: Ideas
Colonnes:
- `title` (Text)
- `description` (Text)
- `visibility` (Single select: "Public", "Privé")
- `createdBy` (Text) - Stocke l'ID Airtable du User
- `likes` (Number, default: 0)
- `dislikes` (Number, default: 0)
- `status` (Single select: "draft", "published", "launched")
- `createdAt` (Date)

#### Table 3: Comments
Colonnes:
- `content` (Text)
- `pseudo` (Text)
- `ideaId` (Text) - ID Airtable de l'idée
- `userId` (Text) - clerkId de l'user
- `createdAt` (Date)

#### Table 4: Votes
Colonnes:
- `ideaId` (Text) - ID Airtable
- `userId` (Text) - clerkId
- `voteType` (Single select: "like", "dislike")
- `createdAt` (Date)

**Récupérer:**
1. Base ID: visible dans l'URL de Airtable
2. API Key: Compte → "Tokens d'accès personnels"
   - Créer nouveau token
   - Sélectionner: `data.records:read`, `data.records:write`

### 4️⃣ OpenAI (Recherche IA)

1. Aller sur [platform.openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Copier la clé

### 5️⃣ Fichier .env.local

Créer `.env.local` à la racine du projet:

```env
# CLERK - Copier vos clés depuis Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/setup
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/setup

# AIRTABLE - Copier depuis Airtable
AIRTABLE_API_KEY=pat_YOUR_API_KEY
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# OPENAI - Copier depuis OpenAI Dashboard
OPENAI_API_KEY=sk_YOUR_OPENAI_KEY
```

### 6️⃣ Lancer le projet

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## ✅ Checklist

- [ ] Compte Clerk créé
- [ ] Clés Clerk dans `.env.local`
- [ ] **URLs de redirection configurées dans Clerk** (IMPORTANT!)
- [ ] Base Airtable créée avec 4 tables
- [ ] Clés Airtable dans `.env.local`
- [ ] Token OpenAI créé dans `.env.local`
- [ ] `npm install` lancé
- [ ] `npm run dev` fonctionne
- [ ] Inscription fonctionne
- [ ] Création du pseudo fonctionne
- [ ] Redirection vers `/dashboard` OK

## 🧪 Test du flux complet

1. Ouvre http://localhost:3000
2. Clique "S'inscrire"
3. Remplis les champs
4. **Tu dois être redirigé à `/auth/setup`** (création du pseudo)
5. Entre un pseudo unique
6. Tu dois être redirigé à `/dashboard`
7. Voir les éclairs (0 au départ)
8. Créer une idée → déduction 700 éclairs

## 🐛 Troubleshooting

### "Utilisateur non trouvé" après création du pseudo

**Cause:** L'utilisateur n'a pas été créé dans Airtable.

**Solution:**
1. Vérifier que tu es bien redirigé à `/auth/setup` après l'inscription
2. Vérifier que Clerk URLs sont bien configurées:
   - After sign up URL: `/auth/setup`
   - After sign in URL: `/auth/setup`
3. Vérifier que AIRTABLE_API_KEY et AIRTABLE_BASE_ID sont corrects
4. Ouvrir la console du navigateur (F12) et voir les erreurs
5. Ouvrir http://localhost:3000/api/airtable/users/check-pseudo?pseudo=test pour tester l'API

### "Ce pseudo est déjà pris" mais je viens de le créer

Attendre quelques secondes. Airtable peut avoir du délai de propagation.

### Création d'idée ne fonctionne pas

Vérifier:
1. Qu'on a créé le pseudo (sinon l'user n'existe pas)
2. Que les éclairs s'affichent dans la navbar
3. Que tu as au moins 700 éclairs

## 📚 Structure Airtable - Important!

**Ne pas utiliser de liens (Link to another table) mais du Text pour:**
- `Ideas.createdBy` → stocke l'ID Airtable du User (pas un lien!)
- `Comments.ideaId` → stocke l'ID Airtable (pas un lien!)
- `Votes.ideaId` → stocke l'ID Airtable (pas un lien!)

Pourquoi? Parce que c'est plus simple à gérer dans l'API et pas de problèmes de relations bidirectionnelles.

## 🚀 Déploiement Vercel

```bash
npm i -g vercel
vercel
```

Ajouter les variables d'environnement dans Vercel Dashboard.

---

**Prêt? C'est parti!** 🎉
