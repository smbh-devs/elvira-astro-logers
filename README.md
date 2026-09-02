# elvira-astro-logers

Лендинг «Эльвира | Астролог», хостится на GitHub Pages под доменом `elviraastrologers.com`.

Стек: Vite + React + TypeScript + Tailwind. Заявки уходят в Supabase (таблица `leads`),
оттуда edge-функция `lead-to-sheets` пересылает их в Google-таблицу.

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

## Заявки → Google-таблица

1. В таблице: Расширения → Apps Script, вставить `doPost` (см. `supabase/functions/lead-to-sheets`),
   Развернуть → Веб-приложение, доступ «Все», скопировать URL.
2. В Supabase: Edge Functions → `lead-to-sheets` → Secrets → `GOOGLE_SHEETS_WEBHOOK_URL` = этот URL.
