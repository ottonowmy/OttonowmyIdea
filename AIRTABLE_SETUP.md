# Configuration Airtable - Ottonowmy Idea

## 🎯 Créer les 4 tables

### 1️⃣ Table: Users

Clé primaire: `clerkId`

| Champ | Type | Propriétés |
|-------|------|-----------|
| clerkId | Text | Unique, Required |
| email | Email | Required |
| pseudo | Text | Unique, Required |
| eclairs | Number | Integer, Default: 0 |
| createdAt | Date | Required |

### 2️⃣ Table: Ideas

| Champ | Type | Propriétés |
|-------|------|-----------|
| title | Text | Required |
| description | Text | (Long text) |
| visibility | Single Select | Options: "Public", "Privé" |
| createdBy | Text | Required (stocke l'ID Airtable du User) |
| likes | Number | Integer, Default: 0 |
| dislikes | Number | Integer, Default: 0 |
| status | Single Select | Options: "draft", "published", "launched" |
| createdAt | Date | Required |

### 3️⃣ Table: Comments

| Champ | Type | Propriétés |
|-------|------|-----------|
| content | Text | (Long text), Required |
| pseudo | Text | Required |
| ideaId | Text | Required (ID Airtable) |
| userId | Text | Required (clerkId) |
| createdAt | Date | Required |

### 4️⃣ Table: Votes

| Champ | Type | Propriétés |
|-------|------|-----------|
| ideaId | Text | Required (ID Airtable) |
| userId | Text | Required (clerkId) |
| voteType | Single Select | Options: "like", "dislike" |
| createdAt | Date | Required |

## 🔑 Récupérer les clés d'accès

### Base ID
1. Ouvre ta base Airtable
2. URL ressemble à: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. La partie `appXXXXXXXXXXXXXX` est ton Base ID

### API Key
1. Clique sur ton profil (en haut à droite)
2. Sélectionne "Tokens d'accès personnels"
3. Clique "Create new token"
4. Donne-lui un nom: "Ottonowmy Idea App"
5. Ajoute les scopes:
   - `data.records:read` (lire les données)
   - `data.records:write` (écrire les données)
6. Sélectionne ta base
7. Crée le token et copie-le

## 📝 Données de test (optionnel)

Tu peux ajouter manuellement des données pour tester:

**Users:**
```
clerkId: user_123abc
email: test@example.com
pseudo: TestUser
eclairs: 5000
createdAt: 2024-05-26
```

**Ideas:**
```
title: App de productivité IA
description: Une application intelligente...
visibility: Public
createdBy: recXXXXXXXXXXXXXX (ID du record User)
likes: 0
dislikes: 0
status: draft
createdAt: 2024-05-26
```

## ⚠️ Important - Structure des données

**Ne JAMAIS utiliser "Link to another table"**

Utiliser du `Text` pour:
- `Ideas.createdBy` → Stocke l'ID Airtable du User record
- `Comments.ideaId` → Stocke l'ID Airtable de l'idée
- `Comments.userId` → Stocke le clerkId (pas un lien!)
- `Votes.ideaId` → Stocke l'ID Airtable
- `Votes.userId` → Stocke le clerkId

C'est plus simple à gérer dans les APIs et évite les problèmes de relations.

## 🧪 Tester la connexion

```bash
# Tester l'API de vérification de pseudo
curl "http://localhost:3000/api/airtable/users/check-pseudo?pseudo=TestUser"

# Tu dois voir:
# {"available":true,"pseudo":"TestUser"}
```

Si tu vois une erreur, vérifier:
1. Les clés dans `.env.local`
2. Que la base Airtable existe
3. Que les tables existent

---

**C'est bon? On lance!** 🚀
