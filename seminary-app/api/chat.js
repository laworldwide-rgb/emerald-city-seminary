export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    const { messages, system, sermonMode, conversationSummary } = body;

    const HISTORY_WINDOW = 16;

    // Prune history to window
    let prunedMessages = Array.isArray(messages) && messages.length > HISTORY_WINDOW
      ? messages.slice(-HISTORY_WINDOW)
      : messages;

    // Prepend summary to system prompt if present
    let finalSystem = system || "";
    if (conversationSummary) {
      finalSystem = finalSystem + "\n\nEARLIER CONVERSATION SUMMARY:\n" + conversationSummary;
    }

    // Build request body
    const requestBody = {
      model: "claude-sonnet-4-20250514",
      max_tokens: sermonMode ? 4096 : 1200,
      system: [
        {
          type: "text",
          text: finalSystem,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: prunedMessages
    };

    // Enable extended thinking for sermon prep sessions
    if (sermonMode) {
      requestBody.thinking = {
        type: "enabled",
        budget_tokens: 6000
      };
    }

    // Build beta header — always include caching, add thinking when sermon mode
    const betaHeader = sermonMode
      ? "prompt-caching-2024-07-31,interleaved-thinking-2025-05-14"
      : "prompt-caching-2024-07-31";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": betaHeader
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // If Anthropic returned an error, send it back so we can see it
    if (!response.ok || data.error) {
      console.error("Anthropic error:", JSON.stringify(data));
      return res.status(200).json({
        content: [{ type: "text", text: "Anthropic error: " + JSON.stringify(data) }]
      });
    }

    // Strip thinking blocks — return only text content to client
    if (data.content) {
      data.content = data.content.filter(block => block.type === "text");
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
