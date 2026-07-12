export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    const prompt = [
      system,
      "",
      ...messages.map(m =>
        `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`
      )
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

  const text = await response.text();

  console.log("Gemini status:", response.status);
  console.log("Gemini response:", text);

  if (!response.ok) {
  return res.status(response.status).send(text);
  }

const data = JSON.parse(text);urn res.status(500).json(data);
    }

    res.status(200).json({
      content: [
        {
          text: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        }
      ]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
