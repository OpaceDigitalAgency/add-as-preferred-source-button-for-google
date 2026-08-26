# Add as Preferred Source Button for Jekyll

This include outputs Google's documented automatic-mode placeholder and a no-JavaScript deeplink.

> **Check eligibility first.** Google supports domains and subdomains, not individual subdirectories. `example.com` and `news.example.com` can be eligible; `example.com/blog` cannot be preferred separately. Confirm that your domain appears in Google's [source preferences tool](https://www.google.com/preferences/source) before implementation.

## Add the include

1. Copy [`preferred-source.html`](preferred-source.html) into `_includes/`.
2. Add the SDK once in `_includes/head.html` or the theme's equivalent:

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

3. Add the include at the intended button position:

```liquid
{% include preferred-source.html theme="dark" lang="en" %}
```

4. If the head cannot be edited, set `include_script=true` on the include.

## Expected behaviour and validation

Google's automatic mode scans the included `google-add-preferred-source-btn` element. On a public eligible domain, inspect the deployed page to confirm the placeholder is visible and Google's button has rendered. The fallback derives its query from `site.url`; verify that it contains the intended domain and test the link with JavaScript disabled.

The include uses built-in Liquid syntax and needs no custom Jekyll plugin, so it suits GitHub Pages builds. A remote theme may control the head include; use that theme's documented override point and confirm the SDK appears only once in the generated HTML.

---

[Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
