# Add as Preferred Source Button & Popup for Google (SEO & AI Overviews) — Hugo reference recipe

![Add as Preferred Source Button & Popup for Google (SEO & AI Overviews)](../../.github/assets/add-as-preferred-source-button-popup-google-hero.png)

![Shared live demo capture showing the Preferred Sources button and suite status](../../docs/assets/preferred-source-button-popup-live-demo-1905x871.png)

_Shared live component demo capture: verify the Hugo partial renders this trigger on staging._

This partial outputs Google's documented automatic-mode placeholder and its no-JavaScript deeplink.

> **Check eligibility first.** Google supports domains and subdomains, not individual subdirectories. `example.com` and `news.example.com` can be eligible; `example.com/blog` cannot be preferred separately. Confirm that your domain appears in Google's [source preferences tool](https://www.google.com/preferences/source) before implementation.

## Add the partial

1. Copy [`preferred-source.html`](preferred-source.html) into `layouts/partials/`.
2. Call it at the intended button position, for example in an article template or footer:

```go-html-template
{{ partial "preferred-source.html" (dict "theme" "dark" "lang" "en" "ctx" .) }}
```

3. Pass `"ctx" .` when using the partial so its page store emits the SDK script once. Without `ctx`, the partial still outputs the script for each call.

## Expected behaviour and validation

The partial adds the SDK and a `google-add-preferred-source-btn` element. On a public eligible domain, inspect the generated page to confirm the placeholder is visible and Google's button has rendered. The `<noscript>` fallback derives its query value from the configured site URL; check that it resolves to the intended domain before release.

If the fallback shows the wrong host, check `baseURL` in `hugo.toml` or the equivalent site configuration. Run this check against the Hugo release pinned by your project; this reference does not claim a separately tested Hugo version.

## Scope, privacy and troubleshooting

This is a reference recipe, not a recorded Hugo deployment test. It loads Google's publisher script and does not send data to Opace. If the popup does not appear, keep the fallback link and check the generated HTML contains the SDK once, then review CSP, consent and the public eligible domain.

---

[Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
