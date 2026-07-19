import { useState, type FormEvent } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";

export const Contact = () => {
  useSEO({
    title: "Contact",
    description: "Get in touch with the AutomationHub team.",
    path: "/contact",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage(null);
    try {
      await api.post("/contact", { name, email, subject, message });
      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.response?.data?.message || "Couldn't send your message — try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Mail className="h-8 w-8 text-signal-500" strokeWidth={2.5} />
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal-500">Contact</p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Get in touch</h1>
      <p className="mt-3 text-ink-400">
        Questions, feedback, or something on the platform not working right — send a message and we'll get back to you.
      </p>

      {status === "sent" ? (
        <div className="panel-card mt-8 flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-signal-500" />
          <div>
            <p className="font-display font-semibold">Message sent</p>
            <p className="mt-1 text-sm text-ink-400">Thanks for reaching out — we'll reply as soon as we can.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {status === "error" && errorMessage && (
            <p className="rounded-[var(--radius-panel)] border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {errorMessage}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink-200">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-ink-200">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-ink-200">Subject</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-ink-200">Message</label>
            <textarea
              required
              rows={6}
              maxLength={5000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
};
