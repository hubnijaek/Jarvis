export default async function handler(req, res) {
  try {
    console.log("API key exists:", !!process.env.ANTHROPIC_API_KEY);
    console.log("Request body:", req.body);

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
    console.log("Anthropic response:", data);

    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
