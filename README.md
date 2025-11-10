# Декларации за фирма без дейност (PWA)

## Как да стартирате локално
- Отворете `index.html` с Live Server (или директно с `file://`).
- Попълнете формата и натиснете „Напред“.

## Настройка на n8n
- Задайте `window.N8N_WEBHOOK_URL` в `assets/config.js`.
- Webhook-ът връща JSON като пример:

```json
{
  "decl11PdfUrl": "https://.../decl11.pdf",
  "decl38PdfUrl": "https://.../decl38.pdf",
  "adviceHtml": "<p>Съвети...</p>",
  "sampleEmail": "Текст на имейл..."
}
```

## PWA
- Има `manifest.webmanifest` + `sw.js` (cache-first на статичните ресурси).
- Service Worker се регистрира автоматично при зареждане.

## Публикуване в GitHub Pages
1. Създайте ново публично GitHub репо (напр. `declarations-no-activity`).
2. Качете съдържанието на този проект в root на репото (без поддиректория).
3. В GitHub: Settings → Pages → Build and deployment:
   - Source: `Deploy from a branch`.
   - Branch: `main` и `/(root)`.
4. Изчакайте няколко минути. Сайтът ще е достъпен на `https://<user>.github.io/<repo>/`.

Забележка: Service Worker и ресурсите са с относителни пътища, така че работят коректно и в под-път на GitHub Pages.

