# bot-tima — Ветка: news-single-user

Бот следит за **одним конкретным пользователем** в групповом чате и грубо комментирует его новости.

## Поведение

- Реагирует только на сообщения от пользователей из `TARGET_USER_IDS`
- Определяет, является ли сообщение новостью через ключевые слова и LLM-классификатор
- Отвечает грубым саркастичным комментарием с матом

## Стек

- Node.js + TypeScript
- grammY (Telegram Bot API)
- Ollama (локальная LLM)
  - `qwen2.5:3b` — классификатор новостей
  - `qwen2.5:3b` — генерация саркастичного комментария
- Docker + Docker Compose

## Установка и запуск

```bash
cp .env.example .env
# Заполнить .env
docker compose up --build -d
```

## Конфигурация (.env)

| Переменная | Описание |
|---|---|
| `BOT_TOKEN` | Токен бота от @BotFather |
| `TARGET_USER_IDS` | ID пользователей через запятую: `123,456` |
| `OLLAMA_URL` | URL Ollama (по умолчанию `http://localhost:11434/v1`) |
| `CLASSIFIER_MODEL` | Модель классификатора (по умолчанию `qwen2.5:3b`) |
| `WRITER_MODEL` | Модель для генерации (по умолчанию `qwen2.5:3b`) |

## Требования

- Отключить Privacy Mode в BotFather: `/mybots → Bot Settings → Group Privacy → Turn off`
- Узнать Telegram ID: @userinfobot
