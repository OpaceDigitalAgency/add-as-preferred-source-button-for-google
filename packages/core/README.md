# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — TypeScript core

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](assets/add-as-preferred-source-button-popup-google-hero.png)

![Preferred Sources button variants in light and dark themes](assets/preferred-source-button-variant-gallery.png)

_Variant gallery: the core loads the SDK and supplies the fallback used by every visible trigger._

`@opace/preferred-source-core` is the dependency-free base for the suite: idempotent SDK loading, SSR guards, auto-mode attributes, deeplink fallback and honest `ps-click` events.

**Status:** built and covered by the repository's 70/70 test run, but **not published to npm**. Use the source workspace below; `npm i @opace/preferred-source-core` is for after publication.

## Why publishers use Preferred Sources

The button gives a reader a direct route to choose the publication in Google. Google says fresh and relevant content from a selected source is more likely to appear in that reader's **Top Stories** and may receive a preferred badge in **AI Mode** and **AI Overviews**. Google also reports roughly twice the click-through after a user selects a source.

That is personalisation for the individual reader, not a site-wide ranking factor or a guarantee of traffic, inclusion or AI citations. [Read Google's guidance](https://developers.google.com/search/docs/appearance/preferred-sources) and [click-through finding](https://blog.google/products-and-platforms/products/search/preferred-sources-language-expansion/).

## Use from this repository

```sh
pnpm install
pnpm --filter @opace/preferred-source-core build
```

```ts
import {
  emitPsClick,
  loadSdk,
  openPreferredSourceDialog,
} from "@opace/preferred-source-core";

void loadSdk({ theme: "dark", lang: "en" });
myButton.addEventListener("click", () => {
  emitPsClick(myButton, {
    outcome: "pending",
    mode: "manual",
    theme: "dark",
    lang: "en",
    domain: location.hostname,
  });
  void openPreferredSourceDialog({ theme: "dark", lang: "en" });
});
```

## Requirements and behaviour

- Node.js 18+ for development; browsers for popup rendering.
- `loadSdk()` is idempotent and adopts an existing publisher script.
- `initPreferredSource()` only passes `theme` and `lang`; `openPreferredSourceDialog()` triggers the documented popup method.
- `buildDeeplink()` creates Google's no-JavaScript fallback for a domain.
- `applyAutoAttributes()` marks static elements for Google's auto renderer. For dynamically mounted UI, prefer manual mode.
- Imports are SSR-safe. In SSR, `loadSdk()` resolves as unsupported and `buildDeeplink()` needs an explicit domain.

## Public API

| Export                                             | Use                                                                                                                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `loadSdk(options?)`                                | Loads or adopts the publisher script once. `mode` is `manual` by default; `theme`, `lang`, `timeoutMs` and `nonce` are supported. |
| `getSdkStatus()`                                   | Returns `idle`, `loading`, `ready`, `blocked` or `unsupported`.                                                                   |
| `initPreferredSource(options?)`                    | Queues the documented `init({ theme, lang })` call.                                                                               |
| `openPreferredSourceDialog(options?)`              | Triggers the popup or opens the deeplink fallback. Resolves `popup`, `deeplink` or `none`.                                        |
| `normaliseDomain()` / `buildDeeplink()`            | Normalises a hostname and creates the documented source-preferences URL.                                                          |
| `applyAutoAttributes()`                            | Marks a static element with the documented auto-mode attributes.                                                                  |
| `watchAutoRender()` / `watchAutoRenderAfterLoad()` | Detects whether auto mode rendered, including a blocked or no-render result.                                                      |
| `createFallbackAnchor()`                           | Creates a safe `target="_blank"` deeplink anchor.                                                                                 |
| `emitPsClick()`                                    | Dispatches the bubbling, composed `ps-click` event for consumer instrumentation.                                                  |

`loadSdk()` never rejects. If the script fails or times out, `openPreferredSourceDialog()` opens the deeplink by default. If Google's script loads after that timeout, later clicks can use the popup again.

> **Limitation.** Google's SDK has no completion callback or event. `ps-click` measures a trigger click, not a confirmed addition.

## External service and troubleshooting

Browser use loads Google's publisher script. The core does not send `ps-click` anywhere or store event records; consumers choose whether to listen. If `getSdkStatus()` is `blocked` or `unsupported`, preserve the deeplink fallback, then check consent, CSP and the domain supplied to `buildDeeplink()`.

See the [root README](../../README.md) for compatibility, privacy, CSP/consent considerations and troubleshooting.

---

Source: [suite repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · Support: [GitHub issues](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/issues) · [Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [MIT licence](LICENSE)
