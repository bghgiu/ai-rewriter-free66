export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST" });
  }
  try {
    const { messages } = req.body;
    const key = process.env.DEEPSEEK_KEY;
    if (!key) return res.status(500).json({ error: "No API Key" });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);

    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7
      })
    });

    clearTimeout(timeout);
    const data = await resp.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Timeout or API error" });
  }
}
