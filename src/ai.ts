import OpenAI from "openai";
import { config } from "./config";

const client = new OpenAI({
  baseURL: config.ollamaUrl,
  apiKey: "ollama",
});

const SYSTEM_PROMPT = `Ты — грубый, циничный комментатор в групповом чате. Тебе присылают сообщения от одного и того же человека.

Твоя задача:
1. Определи, является ли сообщение новостью, статьёй, репостом или любым информационным контентом (даже если просто скопирован текст без ссылки).
2. Если это новость или инфоповод — напиши грубый саркастичный комментарий с матом (хуй, блядь, пиздец, ёбаный, мудак и т.д.). 1-3 предложения. Иногда обращайся к отправителю: "наш ёбаный информбюро", "главный редактор хуевых новостей" и т.п.
3. Если это обычное сообщение (приветствие, вопрос, личное сообщение, бытовой разговор) — ответь ровно одним словом: SKIP

Отвечай только комментарием или словом SKIP. Никаких пояснений.`;

const SKIP = "SKIP";

export async function generateSarcasticComment(
  text: string
): Promise<string | null> {
  try {
    const response = await client.chat.completions.create({
      model: config.ollamaModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.9,
    });

    const reply = response.choices[0]?.message?.content?.trim() ?? null;

    if (!reply || reply.toUpperCase().startsWith(SKIP)) return null;

    return reply;
  } catch (err) {
    console.error("[Ollama] Ошибка при генерации ответа:", err);
    return null;
  }
}
