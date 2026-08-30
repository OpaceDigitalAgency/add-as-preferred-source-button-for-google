# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Eleventy reference recipe

![Preferred Sources button variants in light and dark themes](../../docs/assets/preferred-source-button-variant-gallery.png)

_Shared live component demo capture: verify the Eleventy shortcode produces this button on staging._

![Local Eleventy 3.1.2 rendering of the Preferred Sources shortcode placeholder](../../docs/assets/recipes/add-as-preferred-source-button-popup-google-eleventy-local-recipe-rendering-1280x240.png)

_Local Eleventy 3.1.2 recipe rendering: the checked-in shortcode emitted the dark, English placeholder at article placement. The Google SDK is intentionally not loaded on localhost._

This reference recipe registers a shortcode that returns Google's documented automatic-mode placeholder.

## Why this matters for publishers

Google says fresh and relevant content from a reader's selected source is more likely to appear in that reader's **Top Stories** and may receive a preferred badge in **AI Mode** and **AI Overviews**. Google also reports roughly twice the click-through after a user selects a source.

This is personalisation for that reader, not a site-wide ranking factor or a guarantee of traffic, inclusion or AI citations. The recipe creates the opt-in path; Google still decides which content appears. [Read Google's publisher guidance](https://developers.google.com/search/docs/appearance/preferred-sources).

> **Check eligibility first.** Google supports domains and subdomains, not individual subdirectories. `example.com` and `news.example.com` can be eligible; `example.com/blog` cannot be preferred separately. Confirm that your domain appears in Google's [source preferences tool](https://www.google.com/preferences/source) before implementation.

## Add the shortcode

1. Copy [`preferred-source-shortcode.js`](preferred-source-shortcode.js) into your project and register it:

```js
// .eleventy.js
const preferredSource = require("./preferred-source-shortcode.js");
module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("preferredSource", preferredSource);
};
```

2. Add the SDK once in the base layout's `<head>`:

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

3. Place the shortcode in the template where readers should see the button:

```njk
{% preferredSource "dark", "en" %}
```

## Expected behaviour and validation

Google's automatic mode scans for the generated `google-add-preferred-source-btn` element. On a public eligible domain, inspect the deployed page to confirm the placeholder is visible and Google's button has rendered. Test the matching fallback link with JavaScript disabled or the SDK blocked.

```html
<a
  href="https://www.google.com/preferences/source?q=example.com"
  target="_blank"
  rel="noopener noreferrer"
  >Add as a preferred source on Google</a
>
```

## Scope, privacy and troubleshooting

This is a reference recipe, not a recorded Eleventy deployment test. It loads Google's publisher script and does not send data to Opace. If the button does not appear, keep the fallback link and check the built page contains the SDK once, then review your CSP, consent rule and eligible public domain.

---

[Product hub](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-checker/) · [Install the Chrome Site Checker](https://chromewebstore.google.com/detail/add-as-preferred-source-b/dnifhlampnjpfigeniaoihblbdegijgp) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
