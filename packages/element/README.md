# Google Preferred Sources button as a web component — works everywhere

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

`<preferred-source-button>` wraps Google's official Preferred Sources SDK in a single custom element: styled trigger, popup on click, deeplink fallback when the SDK is blocked, and analytics events that honestly report clicks. Use it in plain HTML, Angular, or any framework without a dedicated wrapper.

## Install

```html
<script type="module" src="https://unpkg.com/@opace/preferred-source-element/dist/register.js"></script>
```

or via npm:

```sh
npm i @opace/preferred-source-element
```

```js
import '@opace/preferred-source-element/register'; // defines the element
// or: import { PreferredSourceButton } from '@opace/preferred-source-element'; customElements.define(...)
```

## Usage

```html
<preferred-source-button></preferred-source-button>

<preferred-source-button theme="dark" lang="de" variant="google-colours"
  label="Bei Google als bevorzugte Quelle hinzufügen"></preferred-source-button>

<preferred-source-button variant="neutral"
  style="--ps-bg:#111; --ps-colour:#fff; --ps-radius:8px;"></preferred-source-button>

<script>
  document.querySelector('preferred-source-button')
    .addEventListener('ps-click', (e) => gtag?.('event', 'preferred_source_click', e.detail));
</script>
```

## Attributes

| Attribute | Values | Default | Notes |
|---|---|---|---|
| `theme` | `light` \| `dark` | `light` | Passed to Google's `init()` / `data-theme` |
| `lang` | ISO code | browser language | Passed to `init()` / `data-lang` |
| `mode` | `manual` \| `auto` | `manual` | `auto` hosts Google's own rendered button |
| `label` | string | `Add as a preferred source on Google` | Visible text and accessible name |
| `variant` | `google-default` \| `google-colours` \| `neutral` | `google-default` | `google-colours` is the blue → green hover-lift style; `neutral` is themed via custom properties |
| `domain` | hostname | `location.hostname` | Used for the deeplink and event detail |
| `href-fallback` | URL | computed deeplink | Used verbatim — e.g. to force the apex domain |
| `disabled` | boolean attribute | absent | Clicks ignored |
| `render-timeout` | ms | `4000` | Auto mode: how long Google gets **after the SDK loads** to paint into the container before the deeplink fallback takes over (`ps-fallback` with `reason: 'no-render'`) |

## Events

| Event | Detail | Fires |
|---|---|---|
| `ps-click` | `{outcome, mode, theme, lang, domain}` | On activation, before fulfilment |
| `ps-ready` | `{mode}` | SDK loaded |
| `ps-fallback` | `{reason}` | Component switched to the deeplink anchor — `reason` is `'blocked'` (script failed/timed out) or `'no-render'` (script loaded but painted nothing within `render-timeout`) |

All bubble and cross the shadow boundary. They are authored by this component — the Google SDK emits no events.

## Styling

Fifteen CSS custom properties (`--ps-bg`, `--ps-colour`, `--ps-radius`, `--ps-font-family`, `--ps-hover-bg`, `--ps-lift`, `--ps-focus-ring` …) plus `::part(button)`, `::part(fallback)` and `::part(container)` for full override. The default variants meet WCAG AA at the default 0.875rem/500 label size; if you override colours, contrast is your responsibility. `prefers-reduced-motion: reduce` disables the hover lift.

## SSR

The class file touches no globals at import time and `register.js` no-ops outside the browser, so importing in SSR bundles is safe. Servers render `<preferred-source-button>` as an unknown inline element until hydration.

> **What "tracking" means here — and what it can't mean.** Google's SDK exposes exactly two methods (`init`, `addPreferredSource`) and **no completion callback or event**. Nothing on the page can know whether the reader finished adding your site inside Google's popup. Every event this library emits (`ps-click`) measures **clicks on the trigger**, not confirmed additions. Treat the numbers accordingly.

[Live demo](https://opacedigitalagency.github.io/preferred-source/) · [Eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) · [Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/)

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
