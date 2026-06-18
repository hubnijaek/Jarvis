export default async function handler(req, res) {
  console.log("API key exists:", !!process.env.ANTHROPIC_API_KEY);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    console.log("Anthropic status:", response.status);
    console.log("Anthropic Response:" data);

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
