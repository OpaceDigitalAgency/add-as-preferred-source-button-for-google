# Google Preferred Sources button for Ghost

> Free companion tools: [button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/). Built by [Opace](https://www.opace.agency/).

> **Eligibility first.** Preferred Sources works for domains and subdomains only — `www.example.com` and `news.example.com` qualify, `example.com/blog` does not. Check yours in the free [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) before you paste anything.

## Install

1. In Ghost admin go to **Settings → Code injection → Site header** and paste:

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

2. In any post or page, add an **HTML card** where the button should appear and paste:

```html
<div google-add-preferred-source-btn data-theme="light"></div>
```

3. Running a dark theme (Casper dark mode, Solo, Ease dark)? Pair it: `data-theme="dark"`.
4. Publish. Google renders its button into the div.

To show it on every post rather than per-post, put the div in your theme's `post.hbs` instead of an HTML card.

## Fallback

For newsletters and no-JS contexts, use the documented deeplink as a plain link:

```html
<a href="https://www.google.com/preferences/source?q=example.com" target="_blank" rel="noopener noreferrer">Add as a preferred source on Google</a>
```

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) ·
[Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/).
