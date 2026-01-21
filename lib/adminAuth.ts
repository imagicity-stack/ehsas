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
    const email = decoded.email?.toLowerCase();
    if (!email) {
      throw new Error("Not authorized");
    }

    const adminSnapshot = await adminDb
      .collection("user")
      .where("email", "==", email)
      .limit(1)
      .get();
    const adminRecord = adminSnapshot.docs[0]?.data();
    const isDocAdmin = adminRecord?.role === "admin";
    if (!isDocAdmin) {
      throw new Error("Not authorized");
    }
  }

  return {
    uid: decoded.uid,
    email: decoded.email,
  };
}
