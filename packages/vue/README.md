# Google Preferred Sources button for Vue 3 / Nuxt

> Free companion tools: [button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/). Built by [Opace](https://www.opace.agency/).

`@opace/vue-preferred-source` wraps Google's official Preferred Sources button for Vue 3: an SFC component, a composable, and a plugin. SDK loads in `onMounted`, deeplink fallback when blocked, `ps-click` events that honestly report clicks.

## Install

```sh
npm i @opace/vue-preferred-source
```

## Component

```vue
<script setup>
import { PreferredSourceButton } from '@opace/vue-preferred-source';
</script>
<template>
  <PreferredSourceButton theme="dark" variant="google-colours" @ps-click="onClick" />
</template>
```

Or register globally: `app.use(PreferredSourcePlugin)`.

## Composable

```vue
<script setup>
import { usePreferredSource } from '@opace/vue-preferred-source';
const { status, open, deeplink } = usePreferredSource({ theme: 'light', lang: 'en' });
</script>
```

## Props

| Prop | Type | Default |
|---|---|---|
| `theme` | `'light' \| 'dark'` | `'light'` |
| `lang` | `string` | browser language |
| `mode` | `'manual' \| 'auto'` | `'manual'` — `'auto'` renders the bare attributed `<div>` |
| `label` | `string` | `'Add as a preferred source on Google'` (slot overrides) |
| `variant` | `'google-default' \| 'google-colours' \| 'neutral'` | `'google-default'` |
| `domain` | `string` | current hostname |
| `hrefFallback` | `string` | computed deeplink |

Emits `ps-click` with a `PsClickDetail` payload.

## SSR / Nuxt note

Works in Nuxt 3 with zero config — no `<ClientOnly>` needed. The server renders the static button shell; the client hydrates and loads the SDK inside `onMounted`, so `window is not defined` never happens.

> **What "tracking" means here — and what it can't mean.** Google's SDK exposes exactly two methods (`init`, `addPreferredSource`) and **no completion callback or event**. Nothing on the page can know whether the reader finished adding your site inside Google's popup. Every event this library emits (`ps-click`) measures **clicks on the trigger**, not confirmed additions. Treat the numbers accordingly.

[Live demo](https://opacedigitalagency.github.io/add-as-preferred-source-button-for-google/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/)

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) ·
[Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/).
