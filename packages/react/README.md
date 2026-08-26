# Google Preferred Sources button for React / Next.js

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

`@opace/react-preferred-source` gives you Google's official Preferred Sources button as a typed React component and hook: SDK loaded once on mount, popup on click, deeplink fallback when the SDK is blocked, and a `ps-click` event that honestly reports clicks.

## Install

```sh
npm i @opace/react-preferred-source
```

## Component

```tsx
// Next.js App Router (any server or client boundary)
import { PreferredSourceButton } from '@opace/react-preferred-source';

export default function Footer() {
  return <PreferredSourceButton theme="dark" variant="google-colours"
           onPsClick={(d) => window.gtag?.('event', 'preferred_source_click', d)} />;
}
```

## Hook, custom UI

```tsx
'use client';
import { usePreferredSource } from '@opace/react-preferred-source';

export function CustomCta() {
  const { status, open, deeplink } = usePreferredSource({ theme: 'light', lang: 'en' });
  if (status === 'blocked') return <a href={deeplink} target="_blank" rel="noopener noreferrer">Prefer us on Google</a>;
  return <button onClick={() => open()}>Prefer us on Google</button>;
}
```

## Props

| Prop | Type | Default |
|---|---|---|
| `theme` | `'light' \| 'dark'` | `'light'` |
| `lang` | `string` | browser language |
| `mode` | `'manual' \| 'auto'` | `'manual'` — `'auto'` renders a bare attributed `<div>` for Google's own renderer |
| `label` | `string` | `'Add as a preferred source on Google'` (children override) |
| `variant` | `'google-default' \| 'google-colours' \| 'neutral'` | `'google-default'` |
| `domain` | `string` | current hostname |
| `hrefFallback` | `string` | computed deeplink |
| `onPsClick` | `(detail: PsClickDetail) => void` | — |

Plus standard `ButtonHTMLAttributes` pass-through. The hook returns `{ status, open, deeplink }` where `status` is the live SDK status (`'unsupported'` during SSR render) and `open()` resolves `'popup'`, `'deeplink'` or `'none'`.

## SSR / Next.js notes

The component is a client component (`'use client'` is baked into the build), so App Router users can drop it straight into server components; Pages Router works untouched. Nothing runs on the server: the first paint shows the styled button, and the SDK loads after hydration. No `next/script` needed — the core injects and dedupes the script itself.

> **What "tracking" means here — and what it can't mean.** Google's SDK exposes exactly two methods (`init`, `addPreferredSource`) and **no completion callback or event**. Nothing on the page can know whether the reader finished adding your site inside Google's popup. Every event this library emits (`ps-click`) measures **clicks on the trigger**, not confirmed additions. Treat the numbers accordingly.

[Live demo](https://opacedigitalagency.github.io/preferred-source/) · [Eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) · [Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/)

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
