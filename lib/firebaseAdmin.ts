import admin from "firebase-admin";

type FirebaseAdminApp = admin.app.App;

const getPrivateKey = () => {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return undefined;
  return raw.replace(/\\n/g, "\n");
};

const initializeAdmin = (): FirebaseAdminApp => {
  if (admin.apps.length) {
    return admin.app();
  }

  const jsonCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (jsonCredentials) {
    const parsed = JSON.parse(jsonCredentials);
    return admin.initializeApp({
      credential: admin.credential.cert(parsed),
    });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
};

export const adminApp = initializeAdmin();
export const adminAuth = admin.auth(adminApp);
export const adminDb = admin.firestore(adminApp);
export const adminTimestamp = admin.firestore.FieldValue.serverTimestamp;
