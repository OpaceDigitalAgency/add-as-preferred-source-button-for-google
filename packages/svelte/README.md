# Preferred Sources button for Svelte and SvelteKit

`@opace/svelte-preferred-source` is a Svelte component that loads the SDK in `onMount`, emits `ps-click`, and switches to the documented deeplink if the SDK is unavailable.

**Status:** built and tested in this repository, but **not published to npm**. The future command is `npm i @opace/svelte-preferred-source`; use the workspace first.

## Use from this repository

```sh
pnpm install
pnpm --filter @opace/svelte-preferred-source build
```

```svelte
<script>
  import { PreferredSourceButton } from '@opace/svelte-preferred-source';
</script>

<PreferredSourceButton theme="light" variant="neutral" on:ps-click={track} />
```

## Requirements and limits

- Svelte 4 or 5 and Node.js 18+ for development.
- SvelteKit renders the button shell on the server; SDK work begins on mount.
- Props include `theme`, `lang`, `mode`, `label`, `variant`, `domain` and `hrefFallback`.
- Auto mode is best for static markup; manual mode is the default for dynamic UI.

| Prop / event                     | Default                                     | Notes                                                                         |
| -------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| `theme`, `lang`, `domain`        | `light`, browser language, current hostname | SDK configuration and fallback hostname.                                      |
| `mode`                           | `manual`                                    | `auto` renders the attributed static target.                                  |
| `label`, slot, `variant`         | Standard label, none, `google-default`      | The slot replaces the label; variants include `google-colours` and `neutral`. |
| `hrefFallback`                   | Computed deeplink                           | Overrides the fallback target.                                                |
| `renderTimeoutMs`                | `4000` ms                                   | Auto-mode time allowed after SDK load before fallback.                        |
| `on:ps-click` / `on:ps-fallback` | None                                        | Receives click detail or a `blocked`/`no-render` fallback reason.             |

> **Limitation.** Google's SDK has no completion callback or event. `ps-click` measures a trigger click, not a confirmed addition.

See the [root README](../../README.md) for consent, CSP, eligibility and fallback guidance.

---

Source: [suite repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · Support: [GitHub issues](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/issues) · [Live demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [MIT licence](../../LICENSE)
