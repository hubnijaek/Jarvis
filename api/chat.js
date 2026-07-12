module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    const { messages = [], system = "" } = req.body;

    const prompt = [
      system,
      "",
      ...messages.map(m =>
        `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`
      ),
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json({
      content: [
        {
          text: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        }
      ]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
};
