# Google Preferred Sources button for Hugo

> Free companion tools: [button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/) · [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/). Built by [Opace](https://www.opace.agency/).

> **Eligibility first.** Preferred Sources works for domains and subdomains only — `www.example.com` and `news.example.com` qualify, `example.com/blog` does not. Check yours in the free [eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) before you paste anything.

## Install

1. Copy [`preferred-source.html`](preferred-source.html) into `layouts/partials/`.
2. Call it where the button should appear (a footer, an article template):

```go-html-template
{{ partial "preferred-source.html" (dict "theme" "dark" "lang" "en" "ctx" .) }}
```

3. Pass `"ctx" .` so the partial emits the SDK `<script>` only once per page even when the partial is used twice. Without it, the script is emitted per call (harmless — the SDK is idempotent — but untidy).
4. Rebuild. The button renders wherever the partial is placed.

## Fallback

The partial includes a `<noscript>` deeplink to `https://www.google.com/preferences/source?q=<your-domain>`, which is Google's documented no-JS route. Replace the `q` value with a hard-coded domain if your `baseURL` includes a path.

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/tools/seo/google-preferred-source-checker/) ·
[Button generator](https://opace.agency/tools/seo/google-preferred-source-button-generator/).
