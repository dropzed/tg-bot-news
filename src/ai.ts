import OpenAI from "openai";
import { config } from "./config";

const client = new OpenAI({
  baseURL: config.ollamaUrl,
  apiKey: "ollama",
});

const CLASSIFIER_PROMPT = `Ты определяешь, является ли сообщение новостью, статьёй или инфоповодом.
Ответь ровно одним словом: YES или NO.
YES — если это новость, заголовок, репост, событие, анонс.
NO — если это личное сообщение, вопрос, приветствие, бытовой разговор.`;

const WRITER_PROMPT = `Ты — грубый, циничный комментатор в групповом чате. Тебе присылают новости, которые один и тот же мудак скидывает в чат.

Напиши короткий саркастичный комментарий с матом (хуй, блядь, пиздец, ёбаный и т.п.). 1-3 предложения. Иногда обращайся к отправителю: "наш ёбаный информбюро", "главный редактор хуевых новостей" и т.п.

Отвечай только комментарием, без вводных слов.`;

export async function isNews(text: string): Promise<boolean> {
  const response = await client.chat.completions.create({
    model: config.classifierModel,
    messages: [
      { role: "system", content: CLASSIFIER_PROMPT },
      { role: "user", content: text },
    ],
    temperature: 0,
    max_tokens: 5,
  });

  const answer = response.choices[0]?.message?.content?.trim().toUpperCase() ?? "";
  return answer.startsWith("YES");
}

export async function generateSarcasticComment(
  text: string
): Promise<string | null> {
  try {
    const news = await isNews(text);
    if (!news) {
      console.log("[Bot] Классификатор: не новость — пропускаем");
      return null;
    }

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
