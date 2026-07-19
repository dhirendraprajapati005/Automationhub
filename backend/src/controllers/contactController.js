import validator from "validator";
import { sendEmail } from "../utils/email.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @route  POST /api/contact
// @desc   Send a contact form submission to the platform's contact email
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Name, email, subject, and message are all required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }
  if (message.length > 5000) {
    return res.status(400).json({ message: "Message is too long (5000 characters max)" });
  }

  const contactEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL;
  if (!contactEmail) {
    return res.status(503).json({ message: "The contact form isn't configured yet. Set CONTACT_EMAIL in the backend .env." });
  }

  // Escape user input before interpolating into HTML, since this content
  // comes straight from an unauthenticated public form.
  const escape = (str) => validator.escape(str);

  await sendEmail({
    to: contactEmail,
    replyTo: email,
    subject: `[AutomationHub Contact] ${escape(subject)}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: auto;">
        <h2 style="color:#12151A;">New contact form submission</h2>
        <p><strong>From:</strong> ${escape(name)} (${escape(email)})</p>
        <p><strong>Subject:</strong> ${escape(subject)}</p>
        <p style="white-space: pre-wrap; border-left: 3px solid #F2A93B; padding-left: 12px;">${escape(message)}</p>
      </div>
    `,
  });

  res.json({ message: "Message sent — we'll get back to you soon." });
});

export { submitContactForm };
