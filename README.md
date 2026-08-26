# Add as Preferred Source Button, Popup & Analytics for Google (SEO & AI Overviews)

Google's official Preferred Sources button SDK wrapped for every major framework — React, Next.js, Vue, Svelte, Astro, a web component for everything else.

> Free companion tools: [button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/). Built by [Opace](https://www.opace.agency/).

Every framework. One core. Google's official Preferred Sources button, done properly.

[![CI](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/actions/workflows/ci.yml/badge.svg)](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/actions/workflows/ci.yml)
[![npm — core](https://img.shields.io/npm/v/%40opace%2Fpreferred-source-core?label=core)](https://www.npmjs.com/package/@opace/preferred-source-core)
[![npm — element](https://img.shields.io/npm/v/%40opace%2Fpreferred-source-element?label=element)](https://www.npmjs.com/package/@opace/preferred-source-element)
[![npm — react](https://img.shields.io/npm/v/%40opace%2Freact-preferred-source?label=react)](https://www.npmjs.com/package/@opace/react-preferred-source)
[![npm — vue](https://img.shields.io/npm/v/%40opace%2Fvue-preferred-source?label=vue)](https://www.npmjs.com/package/@opace/vue-preferred-source)
[![npm — svelte](https://img.shields.io/npm/v/%40opace%2Fsvelte-preferred-source?label=svelte)](https://www.npmjs.com/package/@opace/svelte-preferred-source)
[![npm — astro](https://img.shields.io/npm/v/%40opace%2Fastro-preferred-source?label=astro)](https://www.npmjs.com/package/@opace/astro-preferred-source)
[![MIT licence](https://img.shields.io/badge/licence-MIT-blue)](LICENSE)

## Framework coverage

| Framework | Package / recipe | Install |
|---|---|---|
| Vanilla / any CMS | [`@opace/preferred-source-element`](packages/element/) | `npm i @opace/preferred-source-element` |
| Low-level TS core | [`@opace/preferred-source-core`](packages/core/) | `npm i @opace/preferred-source-core` |
| React / Next.js | [`@opace/react-preferred-source`](packages/react/) | `npm i @opace/react-preferred-source` |
| Vue / Nuxt | [`@opace/vue-preferred-source`](packages/vue/) | `npm i @opace/vue-preferred-source` |
| Svelte / SvelteKit | [`@opace/svelte-preferred-source`](packages/svelte/) | `npm i @opace/svelte-preferred-source` |
| Astro | [`@opace/astro-preferred-source`](packages/astro/) | `npm i @opace/astro-preferred-source` |
| Angular / anything else | the web component | `npm i @opace/preferred-source-element` |
| Hugo · Jekyll · Eleventy · Ghost · Webflow · Framer · Shopify | [`recipes/`](recipes/) | copy-paste |

## 30-second quick start

```html
<script type="module" src="https://unpkg.com/@opace/preferred-source-element/dist/register.js"></script>

<preferred-source-button></preferred-source-button>
```

That is the whole integration: the component loads Google's SDK once, renders a styled trigger, opens Google's popup on click, and swaps itself for the documented deeplink when the SDK is blocked.

## What Preferred Sources is

Google's Preferred Sources feature lets a Search user mark your publication as a source they want to see more of; selected sites appear more often in Top Stories with a "preferred" badge, and since mid-2026 the preference also carries into AI Overviews and AI Mode. More than 600,000 unique sources have been selected so far, and Google reports that users who select a source click through to it roughly twice as often. The implementation surface is small: one script, one attribute, two methods and a deeplink — [Google's documentation](https://developers.google.com/search/docs/appearance/preferred-sources) covers it in a page.

> **Eligibility warning.** Domains and subdomains only. `www.example.com` and `news.example.com` qualify; `example.com/blog` does not. Your site must already resolve in Google's [source preferences tool](https://www.google.com/preferences/source) — check it in seconds with the free [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/).

> **What "tracking" means here — and what it can't mean.** Google's SDK exposes exactly two methods (`init`, `addPreferredSource`) and **no completion callback or event**. Nothing on the page can know whether the reader finished adding your site inside Google's popup. Every event this library emits (`ps-click`) measures **clicks on the trigger**, not confirmed additions. Treat the numbers accordingly.

## Why one core plus thin wrappers

- The SDK surface is two methods and one attribute. There is exactly one correct way to load it idempotently, guard SSR and fall back to the deeplink — written once in a dependency-free core, inherited by every wrapper.
- The wrappers are each under 150 lines. A patch to core fixes all of them at once.
- The web component covers Angular and every framework without a dedicated wrapper.
- The click-event API is honest by design: `ps-click` reports a click, never a "conversion", because the SDK cannot report one.

## Links

- **Live demo:** [opacedigitalagency.github.io/add-as-preferred-source-button-for-google](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/)
- **Button generator:** [opace.agency/tools/seo/google-preferred-source-button-generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/)
- **Eligibility checker:** [opace.agency/tools/seo/google-preferred-source-checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/)
- **Using WordPress?** Install the [Add as Preferred Source Button, Popup & Analytics for Google (SEO & AI Overviews) plugin](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) instead — it wraps the same SDK with an admin UI.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: `pnpm install && pnpm build && pnpm test`, add a changeset, keep the honesty rules.

## Licence

[MIT](LICENSE) © Opace Ltd. Independently developed by Opace Digital Agency and not affiliated with, endorsed by or sponsored by Google.

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) ·
[Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/).
