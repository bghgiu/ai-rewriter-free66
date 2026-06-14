export default async function handler(req) {
    // 仅允许POST请求
    if (req.method !== "POST") {
        return new Response("Only POST requests allowed", { status: 405 });
    }
    try {
        // 接收前端传来的改写prompt
        const { messages } = await req.json();
        // 调用DeepSeek官方接口
        const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.DEEPSEEK_KEY}`
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
