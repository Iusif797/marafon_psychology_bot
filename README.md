# Marafon Bot + Admin

Telegram-бот трансформационного марафона Теоны + веб-админка для редактирования контента.

```
┌─────────────────────┐         ┌─────────────────────┐
│   Telegram User     │         │   Теона / Admin     │
└──────────┬──────────┘         └──────────┬──────────┘
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  Bot (Render)       │         │  Admin (Vercel)     │
│  aiogram 3 + Python │         │  Next.js 15 + React │
└──────────┬──────────┘         └──────────┬──────────┘
           └──────────────┬────────────────┘
                          ▼
              ┌──────────────────────┐
              │  Neon Postgres       │
              │  • тексты приветствия │
              │  • шаги марафона      │
              │  • участники          │
              └──────────────────────┘
```

## Структура

```
marafon_bot/
├── app/                  # Python бот (Render)
├── admin/                # Next.js админка (Vercel)
├── content/              # JSON-сиды
├── scripts/seed.py       # JSON → Postgres
├── render.yaml
└── README.md
```

---

## Запуск с нуля (5 шагов)

### 1. Создай Neon Postgres (3 минуты, бесплатно)

1. [neon.tech](https://neon.tech) → войти через GitHub
2. **Create Project** → имя `marafon` → регион Frankfurt (или ближайший)
3. На дашборде нажми **Connection string** → скопируй URL вида:
   ```
   postgresql://neondb_owner:xxx@ep-cool-name.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Настрой бот локально

```bash
cd marafon_bot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Открой `.env` и заполни:
- `BOT_TOKEN` — токен из `@BotFather`
- `ADMIN_IDS` — твой Telegram ID (узнать у [@userinfobot](https://t.me/userinfobot))
- `DATABASE_URL` — то, что скопировал из Neon

### 3. Залей начальный контент в БД

```bash
python -m scripts.seed teona@example.com TvoyParol2026 "Теона"
```

Скрипт:
- создаст таблицы
- зальёт `content/welcome.json` и `content/marathon.json` в Postgres
- создаст админ-аккаунт для входа в админку (последние 3 аргумента — email, пароль, имя)

### 4. Запусти бота

```bash
python -m app.main
```

Открой бота в Telegram → `/start` → пройди марафон. Проверь `/admin`, `/stats`.

### 5. Настрой админку локально

```bash
cd admin
npm install
cp .env.example .env.local
```

Открой `.env.local`:
- `DATABASE_URL` — тот же, что у бота
- `AUTH_SECRET` — сгенерируй: `openssl rand -base64 32`
- `BOT_TOKEN` — тот же, что у бота (для рассылок)

Запусти:

```bash
npm run dev
```

Открой `http://localhost:3000`, войди под email/паролем, которые задал в `seed.py`.

---

## Деплой

### Бот → Render

1. Залей репозиторий на GitHub.
2. [render.com](https://render.com) → **New +** → **Blueprint** → выбери репо.
3. Render подхватит `render.yaml`.
4. В **Environment** заполни секреты:
   - `BOT_TOKEN`
   - `ADMIN_IDS`
   - `DATABASE_URL` — тот же URL из Neon
   - `WEBHOOK_URL` — публичный URL сервиса (Render покажет после первого деплоя), вида `https://marafon-bot-xxxx.onrender.com`
5. **Manual Deploy** ещё раз — бот сам зарегистрирует webhook.

> Free tier Render засыпает после 15 мин простоя. Первое сообщение после простоя дойдёт с задержкой ~30 сек. Для премиум-опыта апгрейд до Starter ($7/мес).

### Админка → Vercel

1. На [vercel.com](https://vercel.com) → **Add New Project** → выбери репо.
2. **Root Directory** → `admin` (важно!).
3. **Framework Preset** → Next.js (автоматически).
4. В **Environment Variables** добавь:
   - `DATABASE_URL` — тот же URL из Neon
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_TRUST_HOST` → `true`
   - `BOT_TOKEN` → токен бота
5. **Deploy** — через 1-2 минуты админка доступна на `https://marafon-admin-xxxx.vercel.app`.

---

## Что уже работает в админке

- **Логин** по email/паролю
- **Дашборд** — кол-во участников, завершившие, конверсия, шагов в марафоне
- **Приветствие** — 4 редактируемых блока (greeting, what_inside, after_marathon, cta) с Telegram-превью в реальном времени
- **Шаги марафона**:
  - список с drag-and-drop переупорядочиванием
  - добавление, редактирование, удаление
  - Telegram-превью при редактировании
  - HTML-форматирование (`<b>`, `<i>`, `<a>` и т.д.)

Все изменения подхватываются ботом автоматически в течение 30 секунд (через `CONTENT_CACHE_TTL`).

## Что появится в следующих итерациях

- **Дашборд участников**: карточки участников, фильтры, графики прогресса
- **Рассылки**: composer + сегментация (все / активные / застрявшие / завершившие)
- **Запланированные сообщения**: Vercel Cron, отправка в нужное время
- **Audit log** изменений текстов

---

## Команды бота

Доступны только пользователям из `ADMIN_IDS`:

- `/admin` — список команд
- `/stats` — статистика
- `/broadcast` — рассылка через Telegram
- `/reload` — сбросить кеш контента (если нужно увидеть изменения мгновенно)

---

## Стек

| Слой | Технология |
|---|---|
| Бот | Python 3.11, aiogram 3.13, asyncpg, APScheduler |
| Админка | Next.js 15, React 19, TypeScript, Tailwind, shadcn-style UI |
| БД | Neon Postgres (serverless) |
| ORM | Drizzle (admin) + asyncpg raw (bot) |
| Auth | NextAuth v5 (Credentials) |
| Хостинг бота | Render (Web Service, free tier) |
| Хостинг админки | Vercel (free tier) |
