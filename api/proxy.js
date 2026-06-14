export default async function handler(req) {
    // 仅允许POST请求
    if (req.method !== "POST") {
        return new Response("Only POST requests allowed", { status: 405 });
    }
    try {
        const { messages } = await req.json();
        // 密钥从Vercel环境变量读取，不会暴露给前端
        const DEEPSEEK_KEY = process.env.DEEPSEEK_KEY;
        if (!DEEPSEEK_KEY) {
            return Response.json({ error: "API Key not configured" }, { status: 500 });
        }
        const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages
            })
        });
        const data = await res.json();
        return Response.json(data);
    } catch (err) {
        return Response.json({ error: "API request failed" }, { status: 500 });
    }
}
