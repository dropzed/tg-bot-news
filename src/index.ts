import { Bot } from "grammy";
import { config } from "./config";
import { isTargetUser, isNewsMessage, extractNewsText } from "./filters";
import { generateSarcasticComment } from "./ai";

const bot = new Bot(config.botToken);

bot.on("message", async (ctx) => {
  const message = ctx.message;

  if (!isTargetUser(message)) return;
  if (!isNewsMessage(message)) return;

  const newsText = extractNewsText(message);
  if (!newsText) {
    console.log("[Bot] Сообщение без текста — пропускаем");
    return;
  }

  console.log(
    `[Bot] Новость от пользователя ${message.from?.id}: ${newsText.slice(0, 80)}...`
  );

  const comment = await generateSarcasticComment(newsText);
  if (!comment) return;

  await ctx.reply(comment, { reply_parameters: { message_id: message.message_id } });
});

bot.catch((err) => {
  console.error("[Bot] Необработанная ошибка:", err);
});

bot.start({
  onStart: () => console.log("[Bot] Бот запущен и слушает сообщения"),
});
