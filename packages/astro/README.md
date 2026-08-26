# Google Preferred Sources button for Astro — integration + components

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

`@opace/astro-preferred-source` is a proper Astro integration for Google's official Preferred Sources button: site-wide script auto-injection, server-rendered components, a no-JS deeplink component, automatic blocked-SDK fallback, i18n via `lang`, config-level defaults, and honest `ps-click` analytics events — all on the same battle-tested core as the React, Vue, Svelte and web-component packages.

## Install

```sh
npm i @opace/astro-preferred-source
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import preferredSource from '@opace/astro-preferred-source';

export default defineConfig({
  integrations: [preferredSource({ theme: 'dark', lang: 'en' })],
});
```

```astro
---
import { PreferredSourceButton } from '@opace/astro-preferred-source/components';
---
<PreferredSourceButton />                                 <!-- Google's own button -->
<PreferredSourceButton mode="manual" variant="google-colours" />
```

## Integration options

| Option | Type | Default | Notes |
|---|---|---|---|
| `theme` | `'light' \| 'dark'` | `'light'` | Site-wide default |
| `lang` | `string` | browser language | ISO code |
| `mode` | `'auto' \| 'manual'` | `'auto'` | A site-wide script suits static sites |
| `injectScript` | `boolean` | `true` | `false` = only load when a component mounts |

The head-inline snippet marks its script tag `data-opace-ps` and checks for an existing publisher script first; the core's adoption scan does the same, so mixing the integration with components never double-loads the SDK.

## Components

**`<PreferredSourceButton />`** — `mode="auto"` (default) server-renders the attributed `<div>` so Google's documented scan finds it in the HTML, plus a `<noscript>` deeplink. `mode="manual"` server-renders a styled trigger (three variants) wired to the core: click → `ps-click` event → popup, with an automatic swap to the deeplink anchor when the SDK is blocked.

**`<PreferredSourceLink />`** — a pure deeplink anchor, no JavaScript at all. Props: `domain`, `label`, `variant`, `class`. Honest about being a link.

Component props (both accept the shared set): `theme`, `lang`, `mode`, `label`, `variant` (`google-default` | `google-colours` | `neutral`), `domain`, `hrefFallback`, `class`.

## Astro versions

Astro 4 and 5. The package ships raw `.ts` and `.astro` source — Astro compiles it in your build, the convention for Astro packages.

> **What "tracking" means here — and what it can't mean.** Google's SDK exposes exactly two methods (`init`, `addPreferredSource`) and **no completion callback or event**. Nothing on the page can know whether the reader finished adding your site inside Google's popup. Every event this library emits (`ps-click`) measures **clicks on the trigger**, not confirmed additions. Treat the numbers accordingly.

[Live demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) · [Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/)

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
