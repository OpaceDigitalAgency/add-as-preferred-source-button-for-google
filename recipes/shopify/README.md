# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Shopify reference recipe

![Preferred Sources button variants in light and dark themes](../../docs/assets/preferred-source-button-variant-gallery.png)

_Shared live component demo capture: verify the Shopify snippet renders this trigger on staging._

![Local Shopify Liquid rendering of the Preferred Sources snippet placeholder](../../docs/assets/recipes/add-as-preferred-source-button-popup-google-shopify-local-recipe-rendering-1280x240.png)

_Local Shopify Liquid recipe rendering: the checked-in snippet emitted the light, English placeholder at article placement. The Google SDK is intentionally not loaded on localhost._

This Liquid snippet outputs Google's documented automatic-mode placeholder and a no-JavaScript deeplink.

> **Audit a live implementation.** [Install the free Preferred Source Checker for Chrome](https://chromewebstore.google.com/detail/add-as-preferred-source-b/dnifhlampnjpfigeniaoihblbdegijgp).

## Why this matters for publishers

Google says fresh and relevant content from a reader's selected source is more likely to appear in that reader's **Top Stories** and may receive a preferred badge in **AI Mode** and **AI Overviews**. Google also reports roughly twice the click-through after a user selects a source.

This is personalisation for that reader, not a site-wide ranking factor or a guarantee of traffic, inclusion or AI citations. The recipe creates the opt-in path; Google still decides which content appears. [Read Google's publisher guidance](https://developers.google.com/search/docs/appearance/preferred-sources).

> **Check eligibility first.** Google supports domains and subdomains, not individual subdirectories. `example.com` and `news.example.com` can be eligible; `example.com/blog` cannot be preferred separately. Shopify blog paths such as `/blogs/news` are not separate sources; the snippet uses your shop domain.

## Add the snippet

1. In Shopify admin, open **Online Store → Themes → Edit code**.
2. Under **Snippets**, create `preferred-source.liquid` and paste [`preferred-source.liquid`](preferred-source.liquid).
3. In **Layout → theme.liquid**, add the SDK inside `<head>`:

```liquid
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

4. Render the snippet at the intended position, for example in an article template or footer:

```liquid
{% render 'preferred-source', theme: 'light', lang: 'en' %}
```

## Expected behaviour and validation

Google's automatic mode scans the snippet's `google-add-preferred-source-btn` element. On a public eligible shop domain, inspect the published page to confirm the placeholder is visible and Google's button has rendered. The fallback uses `{{ shop.domain }}`; verify that it is the domain you confirmed in Google's source preferences tool.

Test in an unpublished theme preview first, then repeat the check on the public shop domain. Keep the snippet and `theme.liquid` change in your theme source or migration notes so a theme replacement does not silently remove them.

## Scope, privacy and troubleshooting

This is a reference recipe, not a recorded Shopify deployment test. It loads Google's publisher script and does not send data to Opace. If no button renders, keep the fallback link and check the active theme, `theme.liquid`, CSP, consent and the public eligible shop domain.

---

[Product hub](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-checker/) · [Install the Chrome Site Checker](https://chromewebstore.google.com/detail/add-as-preferred-source-b/dnifhlampnjpfigeniaoihblbdegijgp) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
