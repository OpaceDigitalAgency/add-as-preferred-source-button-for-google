# Google Preferred Sources button for Svelte / SvelteKit

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

`@opace/svelte-preferred-source` is Google's official Preferred Sources button as a single Svelte component: SDK loads in `onMount`, deeplink fallback when blocked, `ps-click` events that honestly report clicks. Written in Svelte-4 syntax, which Svelte 5 accepts.

## Install

```sh
npm i @opace/svelte-preferred-source
```

## Usage

```svelte
<script>
  import { PreferredSourceButton } from '@opace/svelte-preferred-source';
</script>
<PreferredSourceButton theme="light" variant="neutral" on:ps-click={track} />
```

## Props

| Prop | Type | Default |
|---|---|---|
| `theme` | `'light' \| 'dark'` | `'light'` |
| `lang` | `string` | browser language |
| `mode` | `'manual' \| 'auto'` | `'manual'` — `'auto'` renders the bare attributed `<div>` |
| `label` | `string` | `'Add as a preferred source on Google'` (slot overrides) |
| `variant` | `'google-default' \| 'google-colours' \| 'neutral'` | `'google-default'` |
| `domain` | `string` | current hostname |
| `hrefFallback` | `string` | computed deeplink |

Dispatches `ps-click` with a `PsClickDetail` payload.

## SSR / SvelteKit note

SvelteKit's server render outputs the button shell; the SDK loads on mount. No `browser` guard needed in your code — the component and the core handle it.

> **What "tracking" means here — and what it can't mean.** Google's SDK exposes exactly two methods (`init`, `addPreferredSource`) and **no completion callback or event**. Nothing on the page can know whether the reader finished adding your site inside Google's popup. Every event this library emits (`ps-click`) measures **clicks on the trigger**, not confirmed additions. Treat the numbers accordingly.

[Live demo](https://opacedigitalagency.github.io/preferred-source/) · [Eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) · [Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/)

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
