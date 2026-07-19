import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Shield } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const content = `**Last updated:** [insert launch date]

This Privacy Policy explains what information AutomationHub collects, how it's used, and the choices available to you. AutomationHub is a free industrial automation learning platform.

## Information we collect

**Account information.** When you register, we collect your name, email address, and a hashed password (or, if you sign in with Google, your name, email, and profile picture from your Google account — we never see or store your Google password).

**Content you create.** Community posts, comments, uploaded images, and any files you submit through the platform.

**Usage data.** Pages visited, lessons completed, calculator usage, and similar interaction data, used to improve the platform.

**Cookies and local storage.** A session cookie keeps you logged in (see Cookies below). We do not use third-party advertising trackers.

## How we use your information

- To provide and maintain your account and the features tied to it (saved progress, community posts, download history)
- To send you account-related email (email verification codes, and — only if you opt in — a newsletter)
- To moderate community content and enforce our Terms of Service
- To understand aggregate usage patterns and improve the platform

We do not sell your personal information to third parties.

## Third-party services

- **Google** — if you use "Sign in with Google," Google processes your authentication; see Google's own privacy policy for how they handle that data.
- **Email delivery provider** — used to send verification codes and any email you'd expect from an account on this platform.
- **AI Assistant** — if you use the AI Assistant, your questions are sent to Anthropic's API to generate a response. Anthropic's own privacy policy governs how they process that data.

## Cookies

We use a single essential cookie to keep your login session active. This cookie is required for the site to function if you're logged in and is not used for advertising or cross-site tracking.

## Data retention

Account data is retained as long as your account is active. You can request deletion of your account and associated personal data at any time by contacting us (see the Contact page) — some content you've posted publicly to the Community Forum (e.g. a question others have replied to) may be retained in anonymized form to preserve the usefulness of those discussions for other users.

## Your rights

Depending on your location, you may have rights to access, correct, or delete your personal data, and to object to certain processing. Contact us to exercise any of these rights.

## Children's privacy

AutomationHub is not directed at children under 13, and we do not knowingly collect personal information from children under 13.

## Changes to this policy

We may update this policy from time to time. Material changes will be noted with an updated "Last updated" date above.

## Contact

Questions about this policy can be sent through the Contact page.

---

*This is a template privacy policy provided as a starting point. It has not been reviewed by a lawyer and should be reviewed by qualified legal counsel before this platform is used to process real user data in production, particularly to confirm compliance with applicable regulations (e.g. GDPR, India's DPDP Act) for your specific jurisdiction and user base.*`;

export const Privacy = () => {
  useSEO({
    title: "Privacy Policy",
    description: "How AutomationHub collects, uses, and protects your data.",
    path: "/privacy",
  });

  return (
  <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
    <Shield className="h-8 w-8 text-signal-500" strokeWidth={2.5} />
    <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal-500">Legal</p>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
    <div className="lesson-content mt-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  </div>
  );
};
