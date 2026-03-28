export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    const { messages, system, sermonMode } = body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: sermonMode ? 4096 : 1024,
        system: system || "",
        messages: messages
      })
    });

    const data = await response.json();

    // If Anthropic returned an error, send it back so we can see it
    if (!response.ok || data.error) {
      console.error("Anthropic error:", JSON.stringify(data));
      return res.status(200).json({ 
        content: [{ type: "text", text: "Anthropic error: " + JSON.stringify(data) }] 
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
