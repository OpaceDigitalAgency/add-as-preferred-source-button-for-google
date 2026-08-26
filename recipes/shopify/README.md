# Google Preferred Sources button for Shopify

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

> **Eligibility first.** Preferred Sources works for domains and subdomains only — `www.example.com` and `news.example.com` qualify, `example.com/blog` does not. Check yours in the free [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) before you paste anything.

Shopify blogs live at `/blogs/news` — a subdirectory, which is not separately eligible. That is fine: what gets preferred is your **domain** (`{{ shop.domain }}`), so the button still does its job wherever you place it.

## Install

1. In admin: **Online Store → Themes → Edit code**.
2. Under **Snippets**, create `preferred-source.liquid` and paste the contents of [`preferred-source.liquid`](preferred-source.liquid).
3. In **Layout → theme.liquid**, add the SDK script inside `<head>`:

```liquid
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

4. Render the snippet where the button should appear (article template, footer):

```liquid
{% render 'preferred-source', theme: 'light', lang: 'en' %}
```

## Fallback

The snippet includes a `<noscript>` deeplink built from `{{ shop.domain }}` — Google's documented no-JS route.

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
