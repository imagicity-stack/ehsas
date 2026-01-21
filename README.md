# EHSAS (Elden Heights School Alumni Society)

Premium Harvard-style alumni society website built with Next.js (App Router), Tailwind CSS, Firebase (Firestore + Auth), and Nodemailer.

## Features
- Public Harvard-inspired marketing site with registration flow.
- Alumni registration form + server-side validation.
- Admin login with Firebase Auth and role-based access.
- Admin dashboard to approve/reject requests and generate EHSAS IDs.
- Firestore data model for requests, members, and admin activity.
- Email notifications via SMTP.

## Environment Variables
Create a `.env.local` with the following values (Vercel uses the same names in Environment Variables):

### Firebase Admin SDK (Server)
Use either full JSON or individual fields:

**Option A**
```
GOOGLE_APPLICATION_CREDENTIALS_JSON="{...}"
```

**Option B**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Firebase Client SDK (Browser)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### App URL (for email links)
```
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.com
```

### SMTP (Nodemailer)
```
SMTP_HOST=...
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM="EHSAS <no-reply@eldenheights.org>"
```

## Firebase Setup
1. Create a Firebase project.
2. Enable **Authentication** (Email/Password).
3. Create **Firestore** in production or test mode.
4. Create a service account for the Admin SDK.

### Firestore Collections
- `ehsasRequests`
- `ehsasMembers`
- `adminActivity`
- `counters` (document: `ehsas`)

### Suggested Firestore Rules (tighten for production)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Admin Role Setup
Admins are verified either by a custom claim `role = "admin"` or a Firestore document in `admins/{uid}` with `role: "admin"`.

### Option A: Custom Claims (Node script)
Create a script `scripts/setAdmin.js`:
```
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccount.json")),
});

const uid = "USER_UID";
admin
  .auth()
  .setCustomUserClaims(uid, { role: "admin" })
  .then(() => console.log("Admin role set"))
  .catch(console.error);
```

### Option B: Firestore role doc
```
admins/{uid} => { role: "admin" }
```

## Approval Flow (End to End)
1. Submit `/register` form.
2. Admin logs in at `/admin/login`.
3. Admin approves a pending request, generating an EHSAS ID.
4. Applicant and admin inbox receive emails.

## Local Development
```
npm install
npm run dev
```

## Deployment
Deploy to Vercel and add all environment variables above.
