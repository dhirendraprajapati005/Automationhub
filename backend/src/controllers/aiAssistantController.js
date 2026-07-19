import { asyncHandler } from "../middleware/errorHandler.js";

const SYSTEM_PROMPT = `You are the AutomationHub AI Assistant, embedded in a free industrial automation learning platform.
Answer questions about PLC programming (ladder logic, function blocks, structured text), HMI design, SCADA,
VFD parameters and troubleshooting, servo systems, sensors, pneumatics, and industrial networking.
Give practical, technically accurate answers a working automation engineer would trust. When relevant, mention
concrete parameter names, instruction names, or wiring details rather than staying abstract. If a question is
outside industrial automation, say so briefly and redirect to what you can help with. Keep answers focused —
a few paragraphs or a short list, not an essay, unless the person clearly wants depth.`;

// @route  POST /api/ai-assistant/ask
// @desc   Proxies a chat message to the Anthropic API with a domain-scoped
//         system prompt, keeping the API key server-side only.
const ask = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "A message is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      message:
        "The AI Assistant isn't configured yet. Set ANTHROPIC_API_KEY in the backend .env to enable it (see README).",
    });
  }

  // history is an optional array of { role: "user"|"assistant", content: string }
  // from the current conversation, capped here to keep requests small.
  const priorMessages = Array.isArray(history) ? history.slice(-10) : [];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      // Configurable so this keeps working as model names change — check
      // https://docs.claude.com for the current recommended model string.
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [...priorMessages, { role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Anthropic API error:", response.status, errBody);
    return res.status(502).json({ message: "The AI Assistant is temporarily unavailable. Try again shortly." });
  }

  const data = await response.json();
  const reply = data.content?.find((block) => block.type === "text")?.text || "";

  res.json({ reply });
});

export { ask };
