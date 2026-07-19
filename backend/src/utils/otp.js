import { sendEmail } from "./email.js";

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTPEmail = async (toEmail, otp) => {
  await sendEmail({
    to: toEmail,
    subject: "Your AutomationHub verification code",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#12151A;">Verify your email</h2>
        <p>Your one-time verification code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color:#F2A93B;">${otp}</p>
        <p style="color:#666;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};
