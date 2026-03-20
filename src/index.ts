import { Bot } from "grammy";
import { config } from "./config";
import { isTargetUser, hasText, extractText } from "./filters";
import { generateSarcasticComment } from "./ai";

const bot = new Bot(config.botToken);

bot.on("message", async (ctx) => {
  const message = ctx.message;

  if (!isTargetUser(message)) return;
  if (!hasText(message)) return;

  const text = extractText(message);
  console.log(`[Bot] Сообщение от userId=${message.from?.id}: "${text.slice(0, 80)}"`);
  console.log(`[Bot] Отправляем на классификацию...`);

  const comment = await generateSarcasticComment(text);
  if (!comment) return;

  await ctx.reply(comment, { reply_parameters: { message_id: message.message_id } });
});

bot.catch((err) => {
  console.error("[Bot] Необработанная ошибка:", err);
});

bot.start({
  onStart: () => console.log("[Bot] Бот запущен — реагирует на всё от целевых пользователей"),
});
