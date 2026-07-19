import nodemailer from "nodemailer";

let transporter;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

// In development without SMTP configured, log instead of sending, so every
// flow that sends mail can still be exercised end-to-end without a real
// mail account.
export const sendEmail = async ({ to, subject, html, replyTo }) => {
  if (process.env.NODE_ENV !== "production" && !process.env.SMTP_USER) {
    console.log(`[DEV MODE] Email to ${to} — subject: "${subject}"\n${html}`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  });
};
