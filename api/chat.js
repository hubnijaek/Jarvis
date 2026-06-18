import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export default async function handler(req, res) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const messages = req.body.messages || [];

    const prompt = messages
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return res.status(200).json({
      reply: response
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}
