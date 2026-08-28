# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Astro integration

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](assets/add-as-preferred-source-button-popup-google-hero.png)

![Preferred Sources button variants in light and dark themes](assets/preferred-source-button-variant-gallery.png)

_Variant gallery: the Astro integration supports the same rendered buttons and deeplink fallback._

`@opacedev/astro-preferred-source` injects the publisher script for static sites and provides server-rendered button and deeplink components backed by the shared core.

Install from npm with `npm i @opacedev/astro-preferred-source`.

## Why publishers use Preferred Sources

The button gives a reader a direct route to choose the publication in Google. Google says fresh and relevant content from a selected source is more likely to appear in that reader's **Top Stories** and may receive a preferred badge in **AI Mode** and **AI Overviews**. Google also reports roughly twice the click-through after a user selects a source.

That is personalisation for the individual reader, not a site-wide ranking factor or a guarantee of traffic, inclusion or AI citations. [Read Google's guidance](https://developers.google.com/search/docs/appearance/preferred-sources) and [click-through finding](https://blog.google/products-and-platforms/products/search/preferred-sources-language-expansion/).

## Use from this repository

```sh
pnpm install
pnpm --filter @opacedev/astro-preferred-source typecheck
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import preferredSource from "@opacedev/astro-preferred-source";

export default defineConfig({
  integrations: [preferredSource({ theme: "dark", lang: "en" })],
});
```

```astro
---
import { PreferredSourceButton, PreferredSourceLink } from '@opacedev/astro-preferred-source/components';
---

<PreferredSourceButton />
<PreferredSourceButton mode="manual" variant="google-colours" />
<PreferredSourceLink />
```

## Requirements and limits

- Astro 4, 5, 6 or 7 and Node.js 18+ for development.
- Auto mode is the default because Astro can deliver the attributed markup before the head script. Manual mode provides a styled trigger and fallback.
- `injectScript: false` defers loading until a component needs it. `theme` and `lang` are the supported SDK configuration values.
- The `ps-click` event reports a trigger click, not a completed Google preference action.

| Integration option | Default          | Use                                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| `theme`            | `light`          | Preferred popup and button theme.                                                  |
| `lang`             | Browser language | ISO language code passed to the SDK.                                               |
| `mode`             | `auto`           | Auto mode suits pre-rendered Astro markup; manual mode renders the styled trigger. |
| `injectScript`     | `true`           | Set `false` only when a component should load the SDK itself.                      |

`<PreferredSourceButton />` provides the popup path and fallback. `<PreferredSourceLink />` is a pure deeplink for no-JavaScript or explicit-link use. In auto mode, the button includes a noscript link; in manual mode it emits `ps-click` before it triggers the flow.

> **Limitation.** Google's SDK has no completion callback or event. `ps-click` measures a trigger click, not a confirmed addition.

## External service and troubleshooting

Browser use loads Google's publisher script. This integration does not send `ps-click` anywhere or store event records; decide whether your site listens for the event. If the trigger falls back to a link, check your consent and CSP rules for Google's script, then confirm the configured domain is eligible before treating the popup as available.

The package includes `astro-integration` metadata for its future npm listing. See the [root README](../../README.md) for consent, CSP, eligibility and fallback guidance.

---

Source: [suite repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · Support: [GitHub issues](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/issues) · [Live demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [MIT licence](LICENSE)
