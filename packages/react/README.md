# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — React and Next.js

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](assets/add-as-preferred-source-button-popup-google-hero.png)

![Named Add as Preferred Source Button and Popup for Google logo](assets/preferred-source-button-popup-logo.png)

![Shared live demo capture showing the Preferred Sources button and suite status](assets/preferred-source-button-popup-live-demo-1905x871.png)

_Shared live component demo capture: React and Next.js use the same trigger and fallback behaviour._

`@opace/react-preferred-source` supplies a typed `PreferredSourceButton` and `usePreferredSource()` hook. Both load the SDK after mount and provide a deeplink fallback.

**Status:** built and tested in this repository, but **not published to npm**. The future command is `npm i @opace/react-preferred-source`; use the workspace first.

## Use from this repository

```sh
pnpm install
pnpm --filter @opace/react-preferred-source build
```

```tsx
import { PreferredSourceButton } from "@opace/react-preferred-source";

export default function Footer() {
  return (
    <PreferredSourceButton
      theme="dark"
      variant="google-colours"
      onPsClick={(detail) =>
        window.gtag?.("event", "preferred_source_click", detail)
      }
    />
  );
}
```

```tsx
"use client";
import { usePreferredSource } from "@opace/react-preferred-source";

export function CustomCta() {
  const { status, open, deeplink } = usePreferredSource({
    theme: "light",
    lang: "en",
  });
  if (status === "blocked") return <a href={deeplink}>Prefer us on Google</a>;
  return <button onClick={() => void open()}>Prefer us on Google</button>;
}
```

## Requirements and limits

- React and React DOM 18+; Node.js 18+ for development.
- The package is a client component. Next.js App Router and Pages Router are supported by the source tests; SDK work starts after hydration.
- `mode="auto"` creates static attributed markup. Manual mode is the default for dynamic UI.
- `onPsClick` measures your trigger click only. `open()` resolves `popup`, `deeplink` or `none`; `popup` does not prove the reader completed Google's flow.

| Prop                           | Default                                     | Notes                                                                           |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------- |
| `theme`, `lang`, `domain`      | `light`, browser language, current hostname | Documented SDK configuration and fallback hostname.                             |
| `mode`                         | `manual`                                    | `auto` renders the attributed static target.                                    |
| `label`, `children`, `variant` | Standard label, none, `google-default`      | `children` replaces the label; variants include `google-colours` and `neutral`. |
| `hrefFallback`                 | Computed deeplink                           | Overrides the fallback target.                                                  |
| `renderTimeoutMs`              | `4000` ms                                   | Auto-mode time allowed after SDK load before fallback.                          |
| `onPsClick`, `onPsFallback`    | None                                        | Receives trigger-click detail or a `blocked`/`no-render` fallback reason.       |

The hook returns `{ status, open, deeplink }`. Standard button attributes pass through to the component.

> **Limitation.** Google's SDK has no completion callback or event. `ps-click` measures a trigger click, not a confirmed addition.

## External service and troubleshooting

Browser use loads Google's publisher script after mount. The package does not send `onPsClick` anywhere or store event records; your application decides what to do with the callback. If the hook remains `blocked` or the button uses its deeplink, check consent, CSP, client-only rendering and the eligible domain before retrying the popup.

See the [root README](../../README.md) for consent, CSP, eligibility and fallback guidance.

---

Source: [suite repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · Support: [GitHub issues](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/issues) · [Live demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [MIT licence](LICENSE)
