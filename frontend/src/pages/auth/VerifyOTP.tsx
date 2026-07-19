import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export const VerifyOTP = () => {
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = (location.state as { userId?: string } | null)?.userId;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  if (!userId) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-200">No pending verification found. Please register again.</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await verifyOTP(userId, otp);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid code, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    setResendMessage(null);
    try {
      await api.post("/auth/resend-otp", { userId });
      setResendMessage("A new code has been sent to your email.");
    } catch {
      setResendMessage("Couldn't resend right now, try again shortly.");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20">
      <h1 className="font-display text-2xl font-bold">Verify your email</h1>
      <p className="mt-1 text-sm text-ink-400">Enter the 6-digit code we sent to your inbox.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded-[var(--radius-panel)] border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-3 py-3 text-center font-mono text-lg tracking-[0.5em] focus:border-signal-500 focus:outline-none"
        />
        <button type="submit" disabled={isSubmitting || otp.length !== 6} className="btn-primary w-full">
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <button onClick={resend} className="mt-4 text-sm text-signal-500 hover:text-signal-400">
        Resend code
      </button>
      {resendMessage && <p className="mt-2 text-sm text-ink-400">{resendMessage}</p>}
    </div>
  );
};
