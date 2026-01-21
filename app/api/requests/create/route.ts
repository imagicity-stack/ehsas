import { NextResponse } from "next/server";
import { adminDb, adminTimestamp } from "@/lib/firebaseAdmin";
import { adminInbox, buildEmailLayout, sendEmailSafe } from "@/lib/email";
import { sanitize, validateRegistration } from "@/lib/validators";

export const runtime = "nodejs";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

const buildAdminEmail = (payload: Record<string, string>, requestId: string) => {
  const entries = Object.entries(payload)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 8px; font-weight:600;">${key}</td><td style="padding:4px 8px;">${value}</td></tr>`
    )
    .join("");

  return buildEmailLayout(`
    <p>A new alumni registration request has been submitted.</p>
    <table style="border-collapse:collapse; margin-top:16px;">${entries}</table>
    <p style="margin-top:16px;">Request ID: <strong>${requestId}</strong></p>
    <p>Review in the admin panel: <a href="${siteUrl}/admin">Open Admin Dashboard</a></p>
  `);
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;

    const payload = {
      firstName: sanitize(body.firstName ?? ""),
      lastName: sanitize(body.lastName ?? ""),
      email: sanitize(body.email ?? "").toLowerCase(),
      mobile: sanitize(body.mobile ?? ""),
      yearOfJoining: sanitize(body.yearOfJoining ?? ""),
      yearOfLeaving: sanitize(body.yearOfLeaving ?? ""),
      classOfJoining: sanitize(body.classOfJoining ?? ""),
      lastClassStudied: sanitize(body.lastClassStudied ?? ""),
      lastHouse: sanitize(body.lastHouse ?? ""),
      addressFull: sanitize(body.addressFull ?? ""),
      city: sanitize(body.city ?? ""),
      pincode: sanitize(body.pincode ?? ""),
      state: sanitize(body.state ?? ""),
      country: sanitize(body.country ?? ""),
    };

    const errors = validateRegistration(payload);
    if (errors.length) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    const existing = await adminDb
      .collection("ehsasRequests")
      .where("email", "==", payload.email)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: "Request already submitted and pending." },
        { status: 409 }
      );
    }

    const docRef = await adminDb.collection("ehsasRequests").add({
      ...payload,
      status: "pending",
      createdAt: adminTimestamp(),
      updatedAt: adminTimestamp(),
    });

    const adminEmail = buildAdminEmail(payload, docRef.id);

    void sendEmailSafe({
      to: adminInbox,
      subject: "New EHSAS Registration Request",
      html: adminEmail,
    }).catch((error) => {
      console.error("Email send failed", error);
    });

    return NextResponse.json({ ok: true, requestId: docRef.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to submit request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
