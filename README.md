# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — framework packages

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](.github/assets/add-as-preferred-source-button-popup-google-hero.png)

![Shared live demo capture showing the Preferred Sources button and suite status](docs/assets/preferred-source-button-popup-live-demo-1905x871.png)

_Shared live component demo capture: the suite's button trigger on the public GitHub Pages demo._

An open-source TypeScript suite for adding Google's Preferred Sources button to publisher sites, with SSR-safe framework bindings and a deeplink fallback when the external SDK cannot render.

**Release status, 26 August 2026:** GitHub release **v1.0.0** is public. The six `@opace` packages have been built and tested (**70/70 tests**) but are **not published to npm yet**. Use this repository and its pnpm workspace today; the npm commands below are labelled for after publication.

[Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Live component demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Opace SEO services](https://opace.agency/services/seo/)

[![CI](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/actions/workflows/ci.yml/badge.svg)](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/actions/workflows/ci.yml) [![MIT licence](https://img.shields.io/badge/licence-MIT-blue)](LICENSE)

## Framework coverage

| Use case                                                   | Source workspace                        | npm command after publication           |
| ---------------------------------------------------------- | --------------------------------------- | --------------------------------------- |
| Low-level TypeScript                                       | [`packages/core`](packages/core/)       | `npm i @opace/preferred-source-core`    |
| Web component, vanilla JS or Angular                       | [`packages/element`](packages/element/) | `npm i @opace/preferred-source-element` |
| React and Next.js                                          | [`packages/react`](packages/react/)     | `npm i @opace/react-preferred-source`   |
| Vue 3 and Nuxt                                             | [`packages/vue`](packages/vue/)         | `npm i @opace/vue-preferred-source`     |
| Svelte and SvelteKit                                       | [`packages/svelte`](packages/svelte/)   | `npm i @opace/svelte-preferred-source`  |
| Astro integration and components                           | [`packages/astro`](packages/astro/)     | `npm i @opace/astro-preferred-source`   |
| Hugo, Jekyll, Eleventy, Ghost, Webflow, Framer and Shopify | [`recipes/`](recipes/)                  | No package planned                      |

Angular and other frameworks can use the web component. The recipes are reference implementations, not platform-certified integrations.

## Use the source workspace now

```sh
git clone https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google.git
cd add-as-preferred-source-button-for-google
pnpm install
pnpm build
pnpm test
```

Import a workspace package from an application in this monorepo, or use a recipe. Do not use `npm install @opace/...` or unpkg until the packages have been published.

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

- Node.js 18 or later; CI runs Node 20.
- React 18+, Vue 3.3+, Svelte 4 or 5, and Astro 4 or 5, as declared by the individual package metadata.
- Browser rendering is required for the popup. SSR imports are safe, but server-only pages use an explicit deeplink if required.
- A recognised, eligible hostname is required for Google's own UI to render. Localhost and staging are useful for integration checks but cannot prove eligibility.

## Troubleshooting and FAQ

### Why do I see a link instead of the popup button?

The SDK may be blocked, unavailable, or unable to render for the current hostname. Test the generated deeplink, inspect CSP and consent controls, then confirm eligibility on the live domain.

### Can this confirm that a reader added my site?

No. Google exposes no completion signal. Record only your own click event and describe it as a click.

### When can I install from npm or unpkg?

After the six packages have been published. Until then, use the workspace instructions above. The maintained npm package names are shown in the coverage table so the publication substitution is mechanical.

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
