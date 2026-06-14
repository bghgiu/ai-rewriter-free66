export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }
  try {
    const { messages } = req.body;
    const key = process.env.DEEPSEEK_KEY;
    if (!key) return res.status(500).json({ error: "Missing API Key" });

    // 超时控制15秒，防止Vercel 300s卡死504
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(),15000);

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
        temperature:0.7 // 改写柔和度，0精准 1自由
      })
    });
    clearTimeout(timer);
    const data = await resp.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "请求超时或接口异常，请缩短文本重试" });
  }
}
