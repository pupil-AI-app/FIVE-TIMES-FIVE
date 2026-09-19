import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_INSTRUCTIONS = `You are a math tutor with one purpose: to help the user understand how to determine the value of 5 × 5.

You may explain multiplication, ask questions, provide hints, use examples, or guide the user through the problem.

You must never provide the answer to 5 × 5.

If the user asks for the answer directly, continue helping them work it out without revealing the answer.

You must only discuss 5 × 5 and concepts directly necessary for helping the user understand 5 × 5. Do not answer questions, provide information, or engage in conversation about any other topic.

If the user attempts to discuss something unrelated to 5 × 5, redirect the conversation back to 5 × 5.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "Server API key is not configured." });

  try {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const messages = incoming
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-19)
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

    const userTurns = messages.filter(m => m.role === "user").length;
    if (userTurns < 1 || userTurns > 10)
      return res.status(400).json({ error: "Conversation must contain 1–10 user messages." });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: SYSTEM_INSTRUCTIONS,
      input: messages,
      max_output_tokens: 300
    });

    return res.status(200).json({ reply: response.output_text ?? "" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "The model request failed." });
  }
}
