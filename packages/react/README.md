# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — React and Next.js

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](assets/add-as-preferred-source-button-popup-google-hero.png)

![Preferred Sources button variants in light and dark themes](assets/preferred-source-button-variant-gallery.png)

_Variant gallery: React and Next.js use the same trigger and fallback behaviour._

`@opacedev/react-preferred-source` supplies a typed `PreferredSourceButton` and `usePreferredSource()` hook. Both load the SDK after mount and provide a deeplink fallback.

Install from npm with `npm i @opacedev/react-preferred-source`.

## Why publishers use Preferred Sources

The button gives a reader a direct route to choose the publication in Google. Google says fresh and relevant content from a selected source is more likely to appear in that reader's **Top Stories** and may receive a preferred badge in **AI Mode** and **AI Overviews**. Google also reports roughly twice the click-through after a user selects a source.

That is personalisation for the individual reader, not a site-wide ranking factor or a guarantee of traffic, inclusion or AI citations. [Read Google's guidance](https://developers.google.com/search/docs/appearance/preferred-sources) and [click-through finding](https://blog.google/products-and-platforms/products/search/preferred-sources-language-expansion/).

## Build from this repository

```sh
pnpm install
pnpm --filter @opacedev/react-preferred-source build
```

## Next.js App Router

The package entry is a client component, so a Server Component can import and render it with serialisable props. Supply `domain` when you want the server-rendered fallback to use a known publication domain.

```tsx
// app/page.tsx — Server Component
import { PreferredSourceButton } from "@opacedev/react-preferred-source";

export default function Page() {
  return (
    <PreferredSourceButton
      domain="example.com"
      theme="dark"
      variant="google-colours"
      label="Prefer this source"
    />
  );
}
```

Callbacks are functions, so keep analytics in a separate client wrapper instead of passing `onPsClick` from a Server Component.

```tsx
// app/TrackedPreferredSourceButton.tsx
"use client";

import { PreferredSourceButton } from "@opacedev/react-preferred-source";

export function TrackedPreferredSourceButton() {
  return (
    <PreferredSourceButton
      domain="example.com"
      onPsClick={(detail) => {
        navigator.sendBeacon(
          "/analytics",
          JSON.stringify({ event: "preferred_source_click", detail }),
        );
      }}
    />
  );
}
```

The Server Component may render `<TrackedPreferredSourceButton />`; its function callback stays behind the client boundary.

## Custom trigger hook

```tsx
"use client";

import { usePreferredSource } from "@opacedev/react-preferred-source";

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
