import { Bot } from "grammy";
import { config } from "./config";
import { isTargetUser, hasText, extractText } from "./filters";
import { generateSarcasticComment } from "./ai";

const bot = new Bot(config.botToken);

bot.on("message", async (ctx) => {
  const message = ctx.message;

  if (!isTargetUser(message)) return;
  if (!hasText(message)) return;

  const newsText = extractText(message);

  console.log(
    `[Bot] Сообщение от ${message.from?.id}: ${newsText.slice(0, 80)}...`
  );

  const comment = await generateSarcasticComment(newsText);
  if (!comment) {
    console.log("[Bot] Модель решила пропустить сообщение (SKIP)");
    return;
  }

  await ctx.reply(comment, { reply_parameters: { message_id: message.message_id } });
});

bot.catch((err) => {
  console.error("[Bot] Необработанная ошибка:", err);
});

bot.start({
  onStart: () => console.log("[Bot] Бот запущен и слушает сообщения"),
});
