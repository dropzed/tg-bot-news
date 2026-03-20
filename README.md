# bot-tima

Саркастичный Telegram-бот, который комментирует новости от конкретного пользователя в групповом чате.

## Требования

- Node.js 18+
- Telegram-бот с отключённым Privacy Mode (через BotFather → Bot Settings → Group Privacy → Turn off)

## Установка

```bash
npm install
```

## Конфигурация

Скопируй `.env.example` в `.env` и заполни переменные:

```bash
cp .env.example .env
```

| Переменная | Описание |
|---|---|
| `BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `OPENAI_API_KEY` | API-ключ OpenAI |
| `TARGET_USER_ID` | Числовой Telegram ID пользователя, на которого реагирует бот |

> Узнать свой Telegram ID можно через [@userinfobot](https://t.me/userinfobot).

## Запуск

### Режим разработки

```bash
npm run dev
```

### Продакшн

```bash
npm run build
npm start
```

## Как это работает

1. Бот добавляется в групповой чат
2. Отслеживает сообщения только от указанного `TARGET_USER_ID`
3. Реагирует, если сообщение — это пересланный пост из канала или содержит ссылку `t.me/`
4. Отправляет текст новости в GPT-4o и постит саркастичный reply в чат
