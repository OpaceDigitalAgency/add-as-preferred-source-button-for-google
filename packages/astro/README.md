# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Astro integration

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](assets/add-as-preferred-source-button-popup-google-hero.png)

![Named Add as Preferred Source Button and Popup for Google logo](assets/preferred-source-button-popup-logo.png)

![Shared live demo capture showing the Preferred Sources button and suite status](assets/preferred-source-button-popup-live-demo-1905x871.png)

_Shared live component demo capture: the Astro integration uses the same rendered button and deeplink fallback._

`@opace/astro-preferred-source` injects the publisher script for static sites and provides server-rendered button and deeplink components backed by the shared core.

**Status:** built and tested in this repository, but **not published to npm**. The future command is `npm i @opace/astro-preferred-source`; use the workspace first.

## Use from this repository

```sh
pnpm install
pnpm --filter @opace/astro-preferred-source typecheck
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import preferredSource from "@opace/astro-preferred-source";

export default defineConfig({
  integrations: [preferredSource({ theme: "dark", lang: "en" })],
});
```

```astro
---
import { PreferredSourceButton, PreferredSourceLink } from '@opace/astro-preferred-source/components';
---

<PreferredSourceButton />
<PreferredSourceButton mode="manual" variant="google-colours" />
<PreferredSourceLink />
```

## Requirements and limits

- Astro 4 or 5 and Node.js 18+ for development.
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
