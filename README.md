# elvira-astro-logers

Лендинг «Эльвира | Астролог», хостится на GitHub Pages под доменом `elviraastrologers.com`.

Стек: Vite + React + TypeScript + Tailwind. Заявки уходят в Supabase (таблица `leads`),
после чего фронт дёргает edge-функцию `notify-lead`, а та дописывает строку
в Google-таблицу (через веб-приложение Apps Script) и шлёт уведомление в Telegram.

## Локально

```
npm ci
npm run dev        # dev-сервер
npm run typecheck  # tsc
npm run build      # сборка в dist/
```

Нужен `.env` с `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` (см. `.env.example`).

## Деплой

Пуш в `main` запускает `.github/workflows/deploy.yml`: сборка и публикация `dist/` на Pages.
Переменные сборки лежат в Settings → Secrets and variables → Actions → Variables:
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

`public/CNAME` задаёт домен, `public/.nojekyll` отключает Jekyll.

## DNS

У регистратора (Timeweb) для `elviraastrologers.com`:

| Тип | Имя | Значение         |
|-----|-----|------------------|
| A   | @   | 185.199.108.153  |
| A   | @   | 185.199.109.153  |
| A   | @   | 185.199.110.153  |
| A   | @   | 185.199.111.153  |
| A   | www | те же четыре     |

После выпуска сертификата включить Settings → Pages → Enforce HTTPS.

## Уведомления о заявках: таблица и Telegram

Фронт после записи в `leads` вызывает `POST {VITE_SUPABASE_URL}/functions/v1/notify-lead`
с `name`, `phone`, `birth_date`. Функция лежит в `supabase/functions/notify-lead`, работает
без JWT (`supabase/config.toml`) и делает две вещи, обе best-effort: строка в таблицу и
сообщение в Telegram. Ошибки видны в Supabase → Edge Functions → notify-lead → Logs.

Секреты функции лежат в GitHub → Settings → Secrets and variables → Actions → Secrets;
workflow деплоя передаёт их в Supabase при каждом запуске:

| Секрет                     | Что это                                              |
| -------------------------- | ---------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN`    | Supabase → Account → Access Tokens, для деплоя       |
| `GOOGLE_SHEETS_WEBHOOK_URL`| URL веб-приложения Apps Script, см. ниже             |
| `TELEGRAM_BOT_TOKEN`       | токен бота из @BotFather                             |
| `TELEGRAM_CHAT_IDS`        | chat ID получателей через запятую, группа с `-`      |

Каждый получатель должен сначала написать боту `/start`, иначе бот не может написать
первым (Telegram отвечает 403). Свой chat ID можно узнать у @userinfobot. После смены
секрета нужно перезапустить workflow (Actions → Deploy Supabase functions → Run workflow).

### Деплой функции

Пуш в `main` с изменениями в `supabase/functions/**` запускает
`.github/workflows/supabase-functions.yml`. Вручную:

```
npx supabase login
npx supabase functions deploy notify-lead --project-ref ajatzcxtvtjwvbtodrrw
npx supabase secrets set --project-ref ajatzcxtvtjwvbtodrrw \
  GOOGLE_SHEETS_WEBHOOK_URL=… TELEGRAM_BOT_TOKEN=… TELEGRAM_CHAT_IDS=…
```

Проверка без браузера:

```
curl -X POST "$VITE_SUPABASE_URL/functions/v1/notify-lead" -H 'Content-Type: application/json' \
  -d '{"name":"ТЕСТ","phone":"+70000000000","birth_date":"1990-01-01"}'
```

Ответ вида `{"success":true,"sheets":"ok","telegram":"2/2 sent"}`; в `sheets` и `telegram`
причина, если что-то пропущено или упало.

### Google-таблица

1. В таблице: Расширения → Apps Script, вставить содержимое
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Лист с заявками должен
   называться `Заявки` (иначе скрипт пишет в первый лист).
2. Развернуть → Новое развертывание → Веб-приложение. **Выполнять от имени: я**,
   **у кого есть доступ: все** (не «все с аккаунтом Google», иначе будет 401).
3. URL вида `https://script.google.com/macros/s/…/exec` положить в секрет функции
   `GOOGLE_SHEETS_WEBHOOK_URL`.

После любого изменения кода скрипта нужно Развернуть → Управление развертываниями →
карандаш → Версия: новая, иначе по старому URL работает старая версия.
