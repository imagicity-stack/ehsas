import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM;

export const adminInbox = "ehsass@eldenheights.org";

export const mailTransporter = () => {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
    throw new Error("Missing SMTP configuration.");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

export const buildEmailLayout = (content: string) => `
  <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #2b2b2b;">
    <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #8b1f2d;">EHSAS</h2>
    <div>${content}</div>
    <p style="margin-top: 24px; font-size: 12px; color: #6b6b6b;">Elden Heights School Alumni Society</p>
  </div>
`;

export const sendEmailSafe = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = mailTransporter();
  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject,
    html,
  });
};
