import { NextResponse } from "next/server";
import { adminDb, adminTimestamp } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { adminInbox, buildEmailLayout, sendEmailSafe } from "@/lib/email";

export const runtime = "nodejs";

const logActivity = async (data: Record<string, unknown>) => {
  await adminDb.collection("adminActivity").add({
    ...data,
    timestamp: adminTimestamp(),
  });
};

export async function POST(request: Request) {
  try {
    const adminUser = await requireAdmin(
      request.headers.get("authorization") ?? undefined
    );
    const body = (await request.json()) as {
      requestId?: string;
      reason?: string;
    };

    if (!body.requestId) {
      return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
    }

    const requestRef = adminDb.collection("ehsasRequests").doc(body.requestId);
    const snapshot = await requestRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const requestData = snapshot.data();
    if (requestData?.status !== "pending") {
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 409 }
      );
    }

    await requestRef.update({
      status: "rejected",
      rejectedAt: adminTimestamp(),
      rejectedBy: adminUser.uid,
      rejectionReason: body.reason ?? "",
      updatedAt: adminTimestamp(),
    });

    await logActivity({
      actionType: "rejected",
      requestId: body.requestId,
      actorUid: adminUser.uid,
      actorEmail: adminUser.email ?? null,
      meta: { reason: body.reason ?? null },
    });

    const applicantEmail = requestData?.email as string;
    const applicantName = `${requestData?.firstName ?? ""} ${
      requestData?.lastName ?? ""
    }`.trim();

    const applicantMessage = buildEmailLayout(`
      <p>Dear ${applicantName || "Alumnus"},</p>
      <p>Thank you for your interest in EHSAS. After review, we are unable to approve your request at this time.</p>
      <p>${body.reason ? `Reason: ${body.reason}` : ""}</p>
      <p>If you believe this is an error, contact ehsass@eldenheights.org.</p>
    `);

    const adminMessage = buildEmailLayout(`
      <p>A request has been rejected.</p>
      <p><strong>${applicantName}</strong> (${applicantEmail})</p>
      <p>Reason: ${body.reason ?? "Not provided"}</p>
    `);

    void sendEmailSafe({
      to: applicantEmail,
      subject: "EHSAS Membership Update",
      html: applicantMessage,
    }).catch(async (error) => {
      await logActivity({
        actionType: "email_error",
        requestId: body.requestId,
        actorUid: adminUser.uid,
        meta: { context: "rejection_applicant", error: String(error) },
      });
    });

    void sendEmailSafe({
      to: adminInbox,
      subject: "EHSAS Rejection Summary",
      html: adminMessage,
    }).catch(async (error) => {
      await logActivity({
        actionType: "email_error",
        requestId: body.requestId,
        actorUid: adminUser.uid,
        meta: { context: "rejection_admin", error: String(error) },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reject request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
