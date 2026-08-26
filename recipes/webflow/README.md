# Add as Preferred Source Button for Webflow

This recipe uses Webflow custom code for the SDK and an Embed element for Google's documented automatic-mode placeholder.

> **Check eligibility first.** Google supports domains and subdomains, not individual subdirectories. `example.com` and `news.example.com` can be eligible; `example.com/blog` cannot be preferred separately. A `webflow.io` subdomain is not your publication domain.

## Add the SDK and placement

1. Open **Site Settings → Custom Code → Head Code** and add:

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

2. In Designer, place an **Embed** element at the intended button position and add:

```html
<div google-add-preferred-source-btn data-theme="light"></div>
```

3. Use `data-theme="dark"` where the surrounding section needs Google's dark button.
4. Publish to the connected custom domain.

## Expected behaviour and validation

Google's automatic mode scans the Embed element after the page loads. On a public eligible domain, inspect the deployed page to confirm the placeholder is visible and Google's button has rendered. Add a regular link for no-JavaScript visitors and confirm that its `q` value is the same eligible domain:

```text
https://www.google.com/preferences/source?q=example.com
```

---

[Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
