# Google Preferred Sources button for Eleventy

> Free companion tools: [button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/). Built by [Opace](https://www.opace.agency/).

> **Eligibility first.** Preferred Sources works for domains and subdomains only — `www.example.com` and `news.example.com` qualify, `example.com/blog` does not. Check yours in the free [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) before you paste anything.

## Install

1. Copy [`preferred-source-shortcode.js`](preferred-source-shortcode.js) into your project and register it:

```js
// .eleventy.js
const preferredSource = require('./preferred-source-shortcode.js');
module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode('preferredSource', preferredSource);
};
```

2. Add the SDK script once, in your base layout's `<head>`:

```html
<script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
```

3. Use the shortcode in any template:

```njk
{% preferredSource "dark", "en" %}
```

## Fallback

Add the documented no-JS deeplink wherever it suits (an email footer, a plain link):

```html
<a href="https://www.google.com/preferences/source?q=example.com" target="_blank" rel="noopener noreferrer">Add as a preferred source on Google</a>
```

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) ·
[Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/).
