# Ottonowmy Idea - Modern App with Beautiful UI

A complete, production-ready Next.js app with:
- Beautiful modern design (no emojis, SVG icons only)
- Clerk authentication
- Airtable integration
- Pseudo selection during signup
- Responsive UI
- Account settings in navbar

## Setup (5 minutes)

### 1. Clerk Setup
1. Go to https://clerk.com
2. Create a Next.js project
3. Copy these to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/setup
   ```

### 2. Airtable Setup
1. Go to https://airtable.com
2. Create a base "Ottonowmy"
3. Create 4 tables: Users, Ideas, Comments, Votes
4. Get credentials:
   - API Key: https://airtable.com/account/tokens
   - Base ID: From your base URL

Add to `.env.local`:
```
AIRTABLE_API_KEY=key...
AIRTABLE_BASE_ID=app...
```

### 3. Run
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

✓ Landing page with beautiful design
✓ Sign up & Sign in (Clerk)
✓ Pseudo selection page
✓ User creation in Airtable
✓ Dashboard with navigation
✓ Eclairs system display
✓ Account settings button in navbar
✓ Responsive design
✓ SVG icons everywhere (no emojis)
✓ Modern color scheme
✓ TypeScript

## Structure

```
app/
├── page.tsx                     # Landing page
├── layout.tsx                   # Root layout with Navbar
├── auth/
│   ├── sign-in/
│   ├── sign-up/
│   └── setup/                  # Pseudo selection
├── api/airtable/
│   ├── check-pseudo/
│   └── create-user/
└── dashboard/

components/
├── Navbar.tsx                   # Nav with account settings
└── Icons.tsx                    # SVG icons

lib/
└── airtable.ts                  # Airtable REST API

styles/
└── globals.css                  # Beautiful modern styles
```

## Highlights

- No external Airtable package (uses REST API)
- All SVG icons, no emojis
- Beautiful modern design
- Account settings integrated in navbar
- Fully responsive
- Production ready
- Well documented code

## Deployment

Push to GitHub and deploy on Vercel with env variables. That's it!

---

Made with ❤️ | Next.js | Clerk | Airtable
