import OpenAI from "openai";
import { config } from "./config";

const client = new OpenAI({
  baseURL: config.ollamaUrl,
  apiKey: "ollama", // Ollama не требует ключ, но поле обязательно
});

const SYSTEM_PROMPT = `Ты — грубый, циничный комментатор новостей в групповом чате. Тебе присылают текст новости, которую один и тот же мудак в очередной раз скинул в чат.

Стиль: грубый русский мат, жёсткий сарказм, чёрный юмор, абсурдные выводы. Матерись свободно — хуй, блядь, пиздец, ёбаный, мудак и т.д. Иногда обращайся к отправителю прозвищами с матом: "наш ёбаный информбюро", "главный редактор хуевых новостей", "эта блядь с новостями" и т.п.

1-3 предложения максимум. Отвечай только комментарием, без вводных слов.`;

export async function generateSarcasticComment(
  newsText: string
): Promise<string | null> {
  try {
    const response = await client.chat.completions.create({
      model: config.ollamaModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: newsText },
      ],
      temperature: 0.9,
    });

    return response.choices[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[Ollama] Ошибка при генерации ответа:", err);
    return null;
  }
}
