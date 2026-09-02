# elvira-astro-logers

Лендинг «Эльвира | Астролог», хостится на GitHub Pages под доменом `elviraastrologers.com`.

Стек: Vite + React + TypeScript + Tailwind. Заявки уходят в Supabase (таблица `leads`)
и параллельно, напрямую из браузера, в Google-таблицу через веб-приложение Apps Script.

## Локально

```
npm ci
npm run dev        # dev-сервер
npm run typecheck  # tsc
npm run build      # сборка в dist/
```

Нужен `.env` с `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` и `VITE_SHEETS_WEBHOOK_URL`
(см. `.env.example`).

## Деплой

Пуш в `main` запускает `.github/workflows/deploy.yml`: сборка и публикация `dist/` на Pages.
Переменные сборки лежат в Settings → Secrets and variables → Actions → Variables:
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SHEETS_WEBHOOK_URL`.

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

## Заявки → Google-таблица

1. В таблице: Расширения → Apps Script, вставить `doPost`, который делает
   `sheet.appendRow([data.name, data.phone, data.birth_date, data.submitted_at])`.
2. Развернуть → Новое развертывание → Веб-приложение. **Выполнять от имени: я**,
   **у кого есть доступ: все** (не «все с аккаунтом Google», иначе будет 401).
3. URL вида `https://script.google.com/macros/s/…/exec` положить в переменную Actions
   `VITE_SHEETS_WEBHOOK_URL` и передеплоить.

Проверка без браузера:

```
curl -L -X POST "$VITE_SHEETS_WEBHOOK_URL" -H 'Content-Type: text/plain' \
  -d '{"name":"ТЕСТ","phone":"+70000000000","birth_date":"","submitted_at":"2026-01-01T00:00:00Z"}'
```

Ответ `{"ok":true}` и новая строка в таблице.

Edge-функция `supabase/functions/lead-to-sheets` осталась как альтернативный путь
(нужен секрет `GOOGLE_SHEETS_WEBHOOK_URL` в Supabase), фронт её сейчас не вызывает.
