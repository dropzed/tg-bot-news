import { Bot } from "grammy";
import { config } from "./config";
import { hasText, extractText, isPolitical } from "./filters";
import { generateSarcasticComment } from "./ai";

const bot = new Bot(config.botToken);

bot.on("message", async (ctx) => {
  const message = ctx.message;

  if (!hasText(message)) return;

  const text = extractText(message);

  if (!isPolitical(text)) {
    console.log(`[Bot] ❌ Пропускаем userId=${message.from?.id} — нет политических ключевых слов`);
    return;
  }

  console.log(`[Bot] ✅ Политика от userId=${message.from?.id}: "${text.slice(0, 80)}"`);
  console.log(`[Writer] Генерируем комментарий...`);

  const comment = await generateSarcasticComment(text);
  if (!comment) return;

  console.log(`[Writer] ✅ Комментарий готов: "${comment.slice(0, 80)}"`);
  await ctx.reply(comment, { reply_parameters: { message_id: message.message_id } });
});

bot.catch((err) => {
  console.error("[Bot] Необработанная ошибка:", err);
});

bot.start({
  onStart: () => console.log("[Bot] Бот запущен — реагирует на политику от всех пользователей"),
});
