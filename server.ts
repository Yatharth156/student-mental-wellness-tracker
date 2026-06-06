import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it to your secrets or check environment variables.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Mira Chat API Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, mood, triggers, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGenAI();

    const systemPrompt = `You are Mira, a warm and empathetic wellness companion for Indian students preparing for high-pressure exams like NEET, JEE, CUET, CAT, GATE, UPSC, and board exams. You are NOT a therapist. Speak in a calm, friendly, slightly conversational tone — like a kind senior who has been through it. Never give generic advice. Reference the student's selected mood and stress triggers in your responses. Avoid phrases like 'I understand your pain' (feels clinical). Instead use natural language: 'That sounds really exhausting', 'It makes complete sense you'd feel that way'. Offer one small, actionable coping suggestion per response. If the student expresses hopelessness or mentions self-harm, gently and clearly suggest they speak to iCall India (9152987821) or Vandrevala Foundation (1860-2662-345) or NIMHANS helpline (080-46110007). Keep responses under 120 words unless the student asks for more.

Context:
- Current mood of the student: ${mood || "Not shared yet"}
- Stress triggers causing anxiety: ${triggers && triggers.length > 0 ? triggers.join(", ") : "None highlighted yet"}
`;

    // Process and convert history to standard Gemini structure
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
        contents.push({
          role,
          parts: [{ text: msg.content || msg.text || "" }]
        });
      });
    }

    // Append latest user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm here for you. Take a breath and let's talk.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while speaking to Mira.",
      details: "Ensure your GEMINI_API_KEY is configured in Settings > Secrets." 
    });
  }
});

// Serve static assets or mount Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
