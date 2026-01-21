import { NextResponse } from "next/server";
import { adminDb, adminTimestamp } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { adminInbox, buildEmailLayout, sendEmailSafe } from "@/lib/email";

export const runtime = "nodejs";

const formatEhsasId = (year: string, counter: number) => {
  const yearSuffix = year.slice(-2);
  return `EH${yearSuffix}${String(counter).padStart(4, "0")}`;
};

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
    const body = (await request.json()) as { requestId?: string };
    if (!body.requestId) {
      return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
    }

    const requestId = body.requestId;
    const requestRef = adminDb.collection("ehsasRequests").doc(requestId);
    const counterRef = adminDb.collection("counters").doc("ehsas");

    const { ehsasId, requestData } = await adminDb.runTransaction(
      async (tx) => {
        const requestSnap = await tx.get(requestRef);
        if (!requestSnap.exists) {
          throw new Error("Request not found");
        }
        const requestData = requestSnap.data();
        if (requestData?.status !== "pending") {
          throw new Error("Request already processed");
        }

        const counterSnap = await tx.get(counterRef);
        const current = counterSnap.exists
          ? Number(counterSnap.data()?.current ?? 0)
          : 0;
        const next = current + 1;
        const generatedId = formatEhsasId(requestData?.yearOfLeaving ?? "00", next);

        tx.set(counterRef, { current: next }, { merge: true });
        tx.update(requestRef, {
          status: "approved",
          approvedAt: adminTimestamp(),
          approvedBy: adminUser.uid,
          updatedAt: adminTimestamp(),
          ehsasId: generatedId,
        });
        tx.set(adminDb.collection("ehsasMembers").doc(requestId), {
          ...requestData,
          status: "approved",
          ehsasId: generatedId,
          memberSince: adminTimestamp(),
        });

        return { ehsasId: generatedId, requestData };
      }
    );

    await logActivity({
      actionType: "approved",
      requestId,
      actorUid: adminUser.uid,
      actorEmail: adminUser.email ?? null,
      meta: { ehsasId },
    });

    const applicantEmail = requestData?.email as string;
    const applicantName = `${requestData?.firstName ?? ""} ${
      requestData?.lastName ?? ""
    }`.trim();

    const applicantMessage = buildEmailLayout(`
      <p>Dear ${applicantName || "Alumnus"},</p>
      <p>Congratulations! Your EHSAS membership has been approved.</p>
      <p>Your EHSAS ID is <strong>${ehsasId}</strong>.</p>
      <p>Next steps: Stay tuned for community access announcements and alumni updates.</p>
      <p>For support, contact ehsass@eldenheights.org.</p>
    `);

    const adminMessage = buildEmailLayout(`
      <p>The following request has been approved.</p>
      <p><strong>${applicantName}</strong> (${applicantEmail})</p>
      <p>EHSAS ID: <strong>${ehsasId}</strong></p>
    `);

    void sendEmailSafe({
      to: applicantEmail,
      subject: "EHSAS Membership Approved",
      html: applicantMessage,
    }).catch(async (error) => {
      await logActivity({
        actionType: "email_error",
        requestId,
        actorUid: adminUser.uid,
        meta: { context: "approval_applicant", error: String(error) },
      });
    });

    void sendEmailSafe({
      to: adminInbox,
      subject: "EHSAS Approval Confirmation",
      html: adminMessage,
    }).catch(async (error) => {
      await logActivity({
        actionType: "email_error",
        requestId,
        actorUid: adminUser.uid,
        meta: { context: "approval_admin", error: String(error) },
      });
    });

    return NextResponse.json({ ok: true, ehsasId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to approve request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
