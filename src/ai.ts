import OpenAI from "openai";
import { config } from "./config";

const client = new OpenAI({
  baseURL: config.ollamaUrl,
  apiKey: "ollama",
});

const WRITER_PROMPT = `Ты — грубый, циничный политический комментатор в групповом чате. Тебе присылают политические сообщения, новости о войне, терроризме или международных событиях.

Напиши короткий саркастичный комментарий с матом (хуй, блядь, пиздец, ёбаный и т.п.). 1-3 предложения. Отвечай по теме сообщения — про войну, страны, политиков, теракты.

Отвечай только комментарием, без вводных слов.`;

export async function generateSarcasticComment(
  text: string
): Promise<string | null> {
  try {
    const response = await client.chat.completions.create({
      model: config.writerModel,
      messages: [
        { role: "system", content: WRITER_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.9,
    });

    return response.choices[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    console.error("[Ollama] Ошибка:", err);
    return null;
  }
}
