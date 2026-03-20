import OpenAI from "openai";
import { config } from "./config";
import { isForceNews } from "./filters";

const client = new OpenAI({
  baseURL: config.ollamaUrl,
  apiKey: "ollama",
});

const CLASSIFIER_PROMPT = `Определи, содержит ли сообщение новость, инфоповод или факт о мире. Ответь ровно одним словом YES или NO.

Правила:
- YES если в сообщении ЕСТЬ новость, даже если вместе с ней идёт шутка или комментарий
- YES для любой политики, законов, действий властей — всегда
- NO только если в сообщении вообще нет никакого информационного содержания
- Если сомневаешься — YES

Примеры YES:
"Клещевым энцефалитом можно заразиться даже без укуса. Вирус передаётся через сырое молоко."
"⚡️Скончался актёр Чак Норрис — ему было 86 лет, — СМИ."
"Китайские бизнесмены выучили русский язык, почти…"
"В сети показали, сколько стоят подержанные иномарки в Грузии. Только рожая женщина может понять ту боль, которую испытывает мужик глядя на цена автомобилей за границей."
"Моряк случайно слил местоположение французского авианосца «Шарль де Голль», опубликовав в Strava свои пробежки по палубе. Умные мысли часто преследовали его, но он бегал по палубе от них."
"21% YouTube уже забит странными AI-видео для детей."
"Госдуму обошло замедление Telegram. Через думский Wi-Fi мессенджер работает без ограничений."
"Студентам начали занижать оценки, если у них нет Max."
"Лудоманов в России стало больше, чем алкоголиков и наркоманов."
"Недосып превращает любую еду в жир."
"В метро москвичка докопалась до немой девушки за разговоры."

Примеры NO:
"Как дела?"
"Пойдём выпьем"
"Ха-ха смешно"
"Окей"
"Доброе утро"
"Спасибо"
"👍"`;

const WRITER_PROMPT = `Ты — грубый, циничный комментатор в групповом чате. Тебе присылают новости, которые один и тот же мудак скидывает в чат.

Напиши короткий саркастичный комментарий с матом (хуй, блядь, пиздец, ёбаный и т.п.). 1-3 предложения. Иногда обращайся к отправителю: "наш ёбаный информбюро", "главный редактор хуевых новостей" и т.п.

Отвечай только комментарием, без вводных слов.`;

export async function isNews(text: string): Promise<boolean> {
  if (isForceNews(text)) {
    console.log(`[Classifier] ✅ Keyword match → тема определена (политика/терроризм)`);
    return true;
  }

  const response = await client.chat.completions.create({
    model: config.classifierModel,
    messages: [
      { role: "system", content: CLASSIFIER_PROMPT },
      { role: "user", content: text },
    ],
    temperature: 0,
    max_tokens: 5,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "";
  const result = raw.toUpperCase().startsWith("YES");

  if (result) {
    console.log(`[Classifier] ✅ LLM ответил "${raw}" → тема определена (новость)`);
  } else {
    console.log(`[Classifier] ❌ LLM ответил "${raw}" → тема не определена, пропускаем`);
  }

  return result;
}

export async function generateSarcasticComment(
  text: string
): Promise<string | null> {
  try {
    const news = await isNews(text);
    if (!news) return null;

    console.log(`[Writer] Генерируем комментарий...`);
    const response = await client.chat.completions.create({
      model: config.writerModel,
      messages: [
        { role: "system", content: WRITER_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.9,
    });

    const comment = response.choices[0]?.message?.content?.trim() ?? null;
    if (comment) {
      console.log(`[Writer] ✅ Комментарий готов: "${comment.slice(0, 80)}"`);
    }
    return comment;
  } catch (err) {
    console.error("[Ollama] ❌ Ошибка:", err);
    return null;
  }
}
