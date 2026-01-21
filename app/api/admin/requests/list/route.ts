import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAdmin(request.headers.get("authorization") ?? undefined);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "pending";

    let query = adminDb.collection("ehsasRequests").orderBy("createdAt", "desc");
    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.limit(200).get();
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.()?.toISOString?.() ?? null;
      const fullData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          if (value?.toDate) {
            return [key, value.toDate().toISOString()];
          }
          if (value === null || value === undefined) {
            return [key, ""];
          }
          if (typeof value === "string" || typeof value === "number") {
            return [key, String(value)];
          }
          return [key, JSON.stringify(value)];
        })
      );
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        yearOfLeaving: data.yearOfLeaving,
        city: data.city,
        lastHouse: data.lastHouse,
        status: data.status,
        createdAt,
        ehsasId: data.ehsasId ?? null,
        fullData,
      };
    });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Not authorized";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
