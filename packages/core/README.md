# Google Preferred Sources button — dependency-free TypeScript core

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

`@opace/preferred-source-core` is the engine behind every `@opace/preferred-source-*` package: an idempotent loader for Google's official Preferred Sources SDK, SSR guards, the documented deeplink fallback, and honest click events. Zero dependencies, ESM + CJS, fully typed.

## Install

```sh
npm i @opace/preferred-source-core
```

## Minimal example

```ts
import { loadSdk, openPreferredSourceDialog, emitPsClick } from '@opace/preferred-source-core';

// Load once, manual mode (default), with Google's two documented options.
void loadSdk({ theme: 'dark', lang: 'en' });

myButton.addEventListener('click', () => {
  emitPsClick(myButton, {
    outcome: 'pending', mode: 'manual', theme: 'dark', lang: 'en', domain: location.hostname,
  });
  void openPreferredSourceDialog({ theme: 'dark', lang: 'en' });
  // Resolves 'popup' (SDK triggered), 'deeplink' (fallback opened) or 'none'.
});
```

## API

| Export | What it does |
|---|---|
| `loadSdk(options?)` | Idempotently injects `<script async src="https://news.google.com/swg/js/v1/publisher.js">`. Manual mode (default) sets `preferred-sources-control="manual"` and queues `init({theme, lang})`; auto mode loads the plain script for `google-add-preferred-source-btn` elements. Adopts a pre-existing publisher script instead of double-loading. Resolves `{status: 'ready' \| 'blocked' \| 'unsupported', mode}` — never rejects. |
| `getSdkStatus()` | Live status: `idle`, `loading`, `ready`, `blocked` or `unsupported` (SSR). |
| `openPreferredSourceDialog(options?)` | Queues `preferredSource.addPreferredSource()` when ready; otherwise opens the deeplink in a new tab (unless `fallbackToDeeplink: false`). Resolves `'popup'`, `'deeplink'` or `'none'`. |
| `initPreferredSource(options?)` | Queues `preferredSource.init({theme, lang})` via the documented command queue. |
| `normaliseDomain(input)` | `'https://Example.com/path'` → `'example.com'`. Keeps `www.` — it is an eligible subdomain. |
| `buildDeeplink(domain?)` | `https://www.google.com/preferences/source?q=<domain>` — Google's no-JS route. |
| `applyAutoAttributes(el, options?)` | Sets `google-add-preferred-source-btn` plus `data-theme`/`data-lang` on an element. |
| `watchAutoRender(el, timeoutMs?)` | Resolves `true` when Google renders a visible child into an auto-mode element, `false` on timeout (default 4,000 ms) — drive your fallback with it. Zero-sized children (the localhost iframe) do not count. |
| `watchAutoRenderAfterLoad(el, options?)` | The complete auto-mode guard: ensures the SDK is loading, waits for it to settle, then times `options.timeoutMs` (default 4,000 ms) **from SDK load**. Resolves `'rendered'`, `'no-render'`, `'blocked'` or `'unsupported'`. Google's script loads happily on unrecognised origins and silently paints nothing — this catches that. |
| `createFallbackAnchor(options?)` | Builds the `<a target="_blank" rel="noopener noreferrer">` deeplink anchor with a `data-ps-fallback` styling hook. |
| `emitPsClick(target, detail)` | Dispatches the bubbling, composed `ps-click` CustomEvent for analytics wiring. |
| `isBrowser()` | The SSR guard every side-effectful function uses internally. |

Constants exported: `SDK_URL`, `SDK_MODULE_URL`, `AUTO_ATTRIBUTE`, `MANUAL_CONTROL_ATTRIBUTE`, `DEEPLINK_BASE`, `PS_CLICK_EVENT`, `DEFAULT_TIMEOUT_MS`, `DEFAULT_RENDER_TIMEOUT_MS`. Types exported for everything.

## SSR

Import it anywhere. In Node/SSR bundles every side-effectful function is a safe no-op: `loadSdk()` resolves `{status: 'unsupported'}`, `openPreferredSourceDialog()` resolves `'none'`, and nothing touches a global. `buildDeeplink()` needs an explicit domain on the server.

## Fallback behaviour

When the script errors or fails to load within `timeoutMs` (default 5,000 ms), status becomes `blocked` and `openPreferredSourceDialog()` opens `https://www.google.com/preferences/source?q=<domain>` — Google's documented deeplink — in a new tab. A late load after the timeout upgrades the live status, so later clicks still get the popup.

> **What "tracking" means here — and what it can't mean.** Google's SDK exposes exactly two methods (`init`, `addPreferredSource`) and **no completion callback or event**. Nothing on the page can know whether the reader finished adding your site inside Google's popup. Every event this library emits (`ps-click`) measures **clicks on the trigger**, not confirmed additions. Treat the numbers accordingly.

[Live demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) · [Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/)

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
