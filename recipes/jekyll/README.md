# Google Preferred Sources button for Jekyll

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

> **Eligibility first.** Preferred Sources works for domains and subdomains only — `www.example.com` and `news.example.com` qualify, `example.com/blog` does not. Check yours in the free [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) before you paste anything.

## Install

1. Copy [`preferred-source.html`](preferred-source.html) into `_includes/`.
2. Add the SDK script once, in your head include (`_includes/head.html` or your theme's equivalent):

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

3. Place the button wherever you want it:

```liquid
{% include preferred-source.html theme="dark" lang="en" %}
```

4. If you cannot edit the head, pass `include_script=true` to the include instead — the SDK loads exactly once either way.

## Fallback

The include renders a `<noscript>` deeplink built from `site.url`. Hard-code the domain in the `q` parameter if your `site.url` is unusual.

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
