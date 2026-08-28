# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — framework packages

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](.github/assets/add-as-preferred-source-button-popup-google-hero.png)

![Shared live demo capture showing the Preferred Sources button and suite status](docs/assets/preferred-source-button-popup-live-demo-1905x871.png)

_Shared live component demo capture: the suite's button trigger on the public GitHub Pages demo._

An open-source TypeScript suite for adding Google's Preferred Sources button to publisher sites, with SSR-safe framework bindings and a deeplink fallback when the external SDK cannot render.

**Need WordPress or a site audit instead?** Use the [full WordPress plugin](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google-wordpress-plugin) for placements, triggers, analytics, multisite and consent controls, or the [Chrome Site Checker](https://github.com/OpaceDigitalAgency/preferred-source-checker-for-google-chrome-extension) to audit an existing implementation. This repository is the developer framework and reference-recipe layer.

[WordPress plugin](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google-wordpress-plugin) · [Chrome Site Checker](https://github.com/OpaceDigitalAgency/preferred-source-checker-for-google-chrome-extension) · [Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Live component demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/)

[CI workflow](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/actions/workflows/ci.yml) · [![MIT licence](https://img.shields.io/badge/licence-MIT-blue)](LICENSE)

## What the Preferred Sources button changes in Google

The button gives a reader a direct route to choose your domain as a Preferred Source. Google says fresh and relevant content from a selected source is more likely to appear in that reader's **Top Stories** and may receive a Preferred Sources badge in **AI Mode** and **AI Overviews**. Google has also reported that users who select a source are about twice as likely to click through to it.

This is personalisation for that reader, not a general ranking factor or a guarantee of traffic, inclusion, AI citations or higher positions for everyone. The implementation value is a clear opt-in path at the point a reader already trusts your publication, with an honest fallback when Google's popup cannot render.

[Google's publisher guidance](https://developers.google.com/search/docs/appearance/preferred-sources) · [Google's click-through finding](https://blog.google/products-and-platforms/products/search/preferred-sources-language-expansion/) · [Google's source preferences tool](https://www.google.com/preferences/source)

## Button variants

![Preferred Sources button variant gallery in light and dark themes](docs/assets/preferred-source-button-variant-gallery.png)

_Six tested presentation examples: Google-default, Google-colours and neutral variants in light and dark contexts. Copyable snippets are available in the live demo._

## Framework coverage

| Use case                                                   | Source                                  | Install                                 |
| ---------------------------------------------------------- | --------------------------------------- | --------------------------------------- |
| Low-level TypeScript                                       | [`packages/core`](packages/core/)       | `npm i @opacedev/preferred-source-core`    |
| Web component, vanilla JS or Angular                       | [`packages/element`](packages/element/) | `npm i @opacedev/preferred-source-element` |
| React and Next.js                                          | [`packages/react`](packages/react/)     | `npm i @opacedev/react-preferred-source`   |
| Vue 3 and Nuxt                                             | [`packages/vue`](packages/vue/)         | `npm i @opacedev/vue-preferred-source`     |
| Svelte and SvelteKit                                       | [`packages/svelte`](packages/svelte/)   | `npm i @opacedev/svelte-preferred-source`  |
| Astro integration and components                           | [`packages/astro`](packages/astro/)     | `npm i @opacedev/astro-preferred-source`   |
| Hugo, Jekyll, Eleventy, Ghost, Webflow, Framer and Shopify | [`recipes/`](recipes/)                  | No package planned                      |

Angular and other frameworks can use the web component. The recipes are reference implementations, not platform-certified integrations.

## Packages, recipes and publishing destinations

| Surface | What it is | Where it goes |
| --- | --- | --- |
| Framework package | Versioned TypeScript/component source with tests, types and a package contract. | Install from npm; source, issues and release history stay in this monorepo. |
| Reference recipe | A checked-in copy-and-adapt snippet for a platform without a maintained package. | Public GitHub documentation inside [`recipes/`](recipes/); copied into the publisher's own theme or project. |
| WordPress plugin | The managed WordPress product with placements, triggers, analytics, consent and agency controls. | Its [separate GitHub repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google-wordpress-plugin) and WordPress.org listing. |
| Chrome Site Checker | A local browser audit companion; it does not install the button. | Its [separate GitHub repository](https://github.com/OpaceDigitalAgency/preferred-source-checker-for-google-chrome-extension) and Chrome Web Store listing. |

Recipes do not become separate sites or npm packages. Their local screenshots prove that the checked-in snippet renders the documented placeholder; final Google behaviour must still be checked on an eligible public domain.

## Develop from source

```sh
git clone https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google.git
cd add-as-preferred-source-button-for-google
pnpm install
pnpm build
pnpm test
```

Install a package from npm using the command in the coverage table. Use this workspace when contributing to the packages or testing changes across the complete suite.

## How it works

The dependency-free core loads the documented Preferred Sources SDK once, protects server renders from browser-only work, and provides the official `https://www.google.com/preferences/source?q=<domain>` link as a fallback. The element and framework packages are thin bindings over that core.

The SDK has only two documented methods: `init({ theme, lang })` and `addPreferredSource()`. Static markup can use auto mode with `google-add-preferred-source-btn`; dynamic interfaces use manual mode by default because Google's later-DOM scan behaviour is undocumented.

> **Eligibility.** Preferred Sources applies to domains and subdomains, not subdirectories. Check that the precise hostname appears in Google's [source preferences tool](https://www.google.com/preferences/source) before adding a button. `example.com/blog` is not separately eligible.

> **What “tracking” means here.** Google's SDK has no completion callback or event. `ps-click` measures a click on your trigger, never a confirmed addition inside Google's popup.

## Architecture and fallbacks

| Layer              | Responsibility                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Core               | SDK loading and adoption, SSR guards, domain normalisation, auto attributes, deeplink fallback and `ps-click` |
| Element            | `<preferred-source-button>` for any HTML-capable framework, with fallback and accessible native controls      |
| Framework packages | React hook/component, Vue component/composable/plugin, Svelte component, Astro integration/components         |
| Recipes            | Short copy-paste patterns for platforms without a package                                                     |

If the SDK errors, times out, is blocked by consent tooling or does not render an auto-mode button, supported bindings provide or switch to the deeplink. A late SDK load can still make later clicks open the popup.

## Privacy, external SDK and accessibility

The suite does not include an event-collection backend or send application data to Opace. It loads Google's publisher SDK only after the relevant client-side component connects or is configured. Your site controls consent, CSP and any listener attached to `ps-click`.

The element uses native buttons or links, a visible focus style and reduced-motion handling. When you override its colours, validate contrast in your own theme. Google controls the popup and its availability.

## Compatibility

- Node.js 18 or later; CI runs Node 22.
- React 18+, Vue 3.3+, Svelte 4 or 5, and Astro 4, 5, 6 or 7, as declared by the individual package metadata.
- Browser rendering is required for the popup. SSR imports are safe, but server-only pages use an explicit deeplink if required.
- A recognised, eligible hostname is required for Google's own UI to render. Localhost and staging are useful for integration checks but cannot prove eligibility.

## Troubleshooting and FAQ

### Why do I see a link instead of the popup button?

The SDK may be blocked, unavailable, or unable to render for the current hostname. Test the generated deeplink, inspect CSP and consent controls, then confirm eligibility on the live domain.

### Can this confirm that a reader added my site?

No. Google exposes no completion signal. Record only your own click event and describe it as a click.

### Which package should I install?

Choose the framework-specific package in the coverage table. Use `@opacedev/preferred-source-element` for plain HTML, Angular or another framework that supports web components, and `@opacedev/preferred-source-core` for a custom integration.

## Related Opace products

- [Preferred Sources product hub](https://opace.agency/add-as-preferred-source-button-for-google/)
- [WordPress plugin repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google-wordpress-plugin)
- [Chrome extension repository](https://github.com/OpaceDigitalAgency/preferred-source-checker-for-google-chrome-extension)
- [Opace Digital Agency on GitHub](https://github.com/OpaceDigitalAgency)

## Support, security and contributing

Use [GitHub issues](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/issues) for reproducible bugs and feature requests. Report security-sensitive issues privately to Opace rather than opening a public issue. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a change; run `pnpm build`, `pnpm test`, `pnpm typecheck` and `pnpm lint`.

## Licence

[MIT](LICENSE) © Opace Ltd. This project is independently developed by Opace Digital Agency and is not affiliated with, endorsed by or sponsored by Google.

---

Source: [OpaceDigitalAgency/add-as-preferred-source-button-for-google](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · Support: [GitHub issues](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/issues) · Built by [Opace](https://opace.agency/), a UK digital agency.
