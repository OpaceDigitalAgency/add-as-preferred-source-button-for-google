# Add as Preferred Source Button for Ghost

This recipe uses Ghost code injection for the SDK and an HTML card for Google's documented automatic-mode placeholder.

> **Check eligibility first.** Google supports domains and subdomains, not individual subdirectories. `example.com` and `news.example.com` can be eligible; `example.com/blog` cannot be preferred separately. Confirm that your domain appears in Google's [source preferences tool](https://www.google.com/preferences/source) before implementation.

## Add the SDK and placement

1. In Ghost admin, open **Settings → Code injection → Site header** and add:

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

2. Add an **HTML card** to the post or page at the intended button position:

```html
<div google-add-preferred-source-btn data-theme="light"></div>
```

3. Use `data-theme="dark"` where the surrounding section needs Google's dark button.
4. For a shared post placement, add the placeholder to the relevant theme template instead of each individual HTML card.

## Expected behaviour and validation

Google's automatic mode scans the placeholder after the page loads. On a public eligible domain, inspect a published post or page to confirm the placeholder is visible and Google's button has rendered. Include a no-JavaScript link where appropriate and test it with the SDK blocked:

```html
<a
  href="https://www.google.com/preferences/source?q=example.com"
  target="_blank"
  rel="noopener noreferrer"
  >Add as a preferred source on Google</a
>
```

---

[Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
