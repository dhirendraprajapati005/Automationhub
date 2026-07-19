import validator from "validator";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import { sendEmail } from "../utils/email.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @route  POST /api/newsletter/subscribe
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }

  const existing = await NewsletterSubscriber.findOne({ email });
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      await existing.save();
    }
    return res.json({ message: "You're subscribed." });
  }

  await NewsletterSubscriber.create({ email });

  await sendEmail({
    to: email,
    subject: "You're subscribed to AutomationHub",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#12151A;">You're in</h2>
        <p>Thanks for subscribing — one email a week with new tutorials, machines, and calculators. No spam.</p>
      </div>
    `,
  });

  res.status(201).json({ message: "Subscribed — check your inbox for a confirmation." });
});

export { subscribe };
