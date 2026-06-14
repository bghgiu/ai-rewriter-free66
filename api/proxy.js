export default async function handler(req, res) {
  // 只允许POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }
  try {
    const { messages } = req.body;
    const key = process.env.DEEPSEEK_KEY;
    if (!key) {
      return res.status(500).json({ error: "Missing API Key" });
    }

    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages
      })
    });

    const data = await resp.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Request timeout or failed" });
  }
}
