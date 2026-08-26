# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Eleventy reference recipe

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](../../.github/assets/add-as-preferred-source-button-popup-google-hero.png)

![Shared live demo capture showing the Preferred Sources button and suite status](../../docs/assets/preferred-source-button-popup-live-demo-1905x871.png)

_Shared live component demo capture: verify the Eleventy shortcode produces this button on staging._

![Local Eleventy 3.1.2 rendering of the Preferred Sources shortcode placeholder](../../docs/assets/recipes/add-as-preferred-source-button-popup-google-eleventy-local-recipe-rendering-1280x800.png)

_Local Eleventy 3.1.2 recipe rendering: the checked-in shortcode emitted the dark, English placeholder at article placement. The Google SDK is intentionally not loaded on localhost._

This reference recipe registers a shortcode that returns Google's documented automatic-mode placeholder.

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

[Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
