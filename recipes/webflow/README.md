# Google Preferred Sources button for Webflow

> Free companion tools: [button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/). Built by [Opace](https://www.opace.agency/).

> **Eligibility first.** Preferred Sources works for domains and subdomains only — `www.example.com` and `news.example.com` qualify, `example.com/blog` does not. Check yours in the free [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) before you paste anything.

Note: your site must be on a connected custom domain (a subdomain of `webflow.io` is Google's domain, not yours).

## Install

1. **Site Settings → Custom Code → Head Code**, paste and save:

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

2. In the Designer, drag an **Embed** element where the button should appear and paste:

```html
<div google-add-preferred-source-btn data-theme="light"></div>
```

3. Publish. The snippet is 55 characters, nowhere near Webflow's 50,000-character embed limit.
4. Dark section? Use `data-theme="dark"`.

## Fallback

Add a normal Webflow link block pointing at the documented deeplink for no-JS visitors:

```text
https://www.google.com/preferences/source?q=example.com
```

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) ·
[Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/).
