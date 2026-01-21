import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export type AdminContext = {
  uid: string;
  email?: string;
};

export async function requireAdmin(authorization?: string): Promise<AdminContext> {
  if (!authorization) {
    throw new Error("Missing authorization token");
  }

  const token = authorization.replace("Bearer ", "").trim();
  if (!token) {
    throw new Error("Missing authorization token");
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const isClaimAdmin = decoded.role === "admin";

  if (!isClaimAdmin) {
    const adminDoc = await adminDb.collection("admins").doc(decoded.uid).get();
    const isDocAdmin = adminDoc.exists && adminDoc.data()?.role === "admin";
    if (!isDocAdmin) {
      throw new Error("Not authorized");
    }
  }

  return {
    uid: decoded.uid,
    email: decoded.email,
  };
}
