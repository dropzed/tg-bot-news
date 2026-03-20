# bot-tima

Саркастичный Telegram-бот, который грубо комментирует новости и политику в групповых чатах. Работает на локальной LLM через Ollama — без внешних API.

## Варианты (ветки)

| Ветка | Кто | Темы | Описание |
|---|---|---|---|
| `news-single-user` | один пользователь | любые новости | Следит за конкретным юзером, комментирует всё что похоже на новость |
| `politics-all-users` | все в чате | только политика | Реагирует на политику/войну/терроризм от любого участника чата |
| `all-single-user` | один пользователь | новости + политика | Следит за конкретным юзером, комментирует и новости, и политику |

Переключиться на нужный вариант:

```bash
git checkout news-single-user
# или
git checkout politics-all-users
# или
git checkout all-single-user
```

## Стек

- **Node.js + TypeScript**
- **grammY** — фреймворк для Telegram Bot API
- **Ollama** — локальный LLM-сервер (без внешних API и оплаты)
  - `qwen2.5:3b` — классификатор новостей
  - `qwen2.5:3b` — генерация саркастичного комментария
- **Docker + Docker Compose** — для запуска всего одной командой

## Быстрый старт

```bash
# 1. Выбрать нужную ветку
git checkout news-single-user

# 2. Скопировать и заполнить .env
cp .env.example .env

# 3. Запустить (Ollama + модель скачаются автоматически)
docker compose up --build -d

# 4. Смотреть логи
docker compose logs -f bot
```

## Требования

- Docker + Docker Compose
- Telegram-бот с отключённым Privacy Mode:
  `BotFather → /mybots → Bot Settings → Group Privacy → Turn off`
- Свой Telegram ID: @userinfobot

## Железо

Протестировано на машине без дискретной GPU. Рекомендуемый минимум:

| | Минимум |
|---|---|
| RAM | 8 GB |
| Disk | 5 GB свободно (под модель) |
| CPU | Любой современный (i5/Ryzen 5+) |
