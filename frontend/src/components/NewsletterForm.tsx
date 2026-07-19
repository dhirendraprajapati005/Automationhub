import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const { data } = await api.post("/newsletter/subscribe", { email });
      setStatus("done");
      setMessage(data.message);
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.response?.data?.message || "Couldn't subscribe — try again.");
    }
  };

  if (status === "done") {
    return <p className="text-sm text-signal-500">{message}</p>;
  }

  return (
    <div className="w-full max-w-sm sm:w-auto">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-3 py-2.5 text-sm placeholder:text-ink-400 focus:border-signal-500 focus:outline-none"
        />
        <button type="submit" disabled={status === "loading"} className="btn-primary whitespace-nowrap">
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && message && <p className="mt-2 text-xs text-red-400">{message}</p>}
    </div>
  );
};
