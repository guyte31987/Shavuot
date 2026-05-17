# Shavuot Dinner

Simple Next.js + Firestore sign-up app for a private Shavuot dinner.

## Tabs
- **Details** — date, time, address
- **About Shavuot** — what the holiday is
- **What to Bring** — table of everyone's contributions
- **My Profile** — name sign-in + photo, pronouns, food/drink prefs, what you're bringing
- **Attendees** — gallery of everyone
- **Schedule** — timeline of the evening
- **Admin** — password-gated host view

## Setup

1. Create a Firebase project and enable **Firestore** (in production mode).
2. Copy `.env.local.example` → `.env.local` and fill in your Firebase web app config.
3. Deploy the Firestore rules in `firestore.rules` (`firebase deploy --only firestore:rules`, or paste into the console).
4. Edit `lib/event.ts` to set the address, time, and admin password.

## Run locally
```bash
npm install
npm run dev
```

## Deploy on Vercel
1. Push the repo to GitHub and import in Vercel.
2. Add the `NEXT_PUBLIC_FIREBASE_*` environment variables in the Vercel project settings.
3. Deploy.

## Notes
- "Sign in" is just a name — stored in `localStorage` plus a random id used as the Firestore doc id.
- Photos are resized client-side (max 320px, JPEG) and stored inline as data URLs, so no Firebase Storage bucket is required.
- The admin password lives in `lib/event.ts` — it gates the admin UI client-side. Firestore rules currently allow public read/write/delete in this private invite scenario; tighten them if you want stricter control.
