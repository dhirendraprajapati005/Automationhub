import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { askAssistant, type ChatMessage } from "@/lib/ai-assistant-api";

export const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const reply = await askAssistant(userMessage.content, messages);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "The AI Assistant is unavailable right now.");
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Bot className="mx-auto h-8 w-8 text-signal-500" />
        <h1 className="mt-4 font-display text-2xl font-bold">AI Automation Assistant</h1>
        <p className="mt-2 text-ink-400">Ask PLC, HMI, VFD, and troubleshooting questions and get instant, focused answers.</p>
        <Link to="/login" className="btn-primary mt-6 inline-flex">
          Log in to start
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="shrink-0">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-500">AI Assistant</p>
        <h1 className="mt-1 font-display text-xl font-bold">Ask a PLC, HMI, VFD, or troubleshooting question</h1>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-400">
            Try: "Why would a VFD trip on overcurrent during acceleration?"
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="mt-1 shrink-0 rounded-full bg-panel-800 p-1.5">
                <Bot className="h-4 w-4 text-signal-500" />
              </div>
            )}
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-[var(--radius-panel)] bg-signal-500 px-4 py-2.5 text-sm text-panel-950"
                  : "max-w-[85%] rounded-[var(--radius-panel)] border border-panel-700 bg-panel-900 px-4 py-2.5 text-sm text-ink-200 whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="mt-1 shrink-0 rounded-full bg-panel-800 p-1.5">
                <UserIcon className="h-4 w-4 text-ink-400" />
              </div>
            )}
          </div>
        ))}
        {isSending && <p className="text-sm text-ink-400">Thinking...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex shrink-0 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about PLC, HMI, VFD, wiring..."
          className="flex-1 rounded-[var(--radius-panel)] border border-panel-600 bg-panel-900 px-4 py-2.5 text-sm focus:border-signal-500 focus:outline-none"
        />
        <button type="submit" disabled={isSending} className="btn-primary">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
