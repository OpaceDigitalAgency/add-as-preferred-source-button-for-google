# Google Preferred Sources button for Framer

> Free companion tools: [button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/). Built by [Opace](https://www.opace.agency/).

> **Eligibility first.** Preferred Sources works for domains and subdomains only — `www.example.com` and `news.example.com` qualify, `example.com/blog` does not. Check yours in the free [eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) before you paste anything.

Note: the button only works on a published site with a custom domain, not inside the Framer canvas preview.

## Install

1. In Framer, open **Assets → Code → Create code file**, name it `PreferredSourceButton.tsx`, and paste the contents of [`PreferredSourceButton.tsx`](PreferredSourceButton.tsx).
2. Drag the new component onto your page.
3. Configure **Theme**, **Language**, **Label**, **Variant** and **Domain** in the properties panel.
4. Publish. The component loads Google's SDK once (deduped), renders your styled trigger, and falls back to the documented deeplink when the SDK is blocked.

The component is self-contained — no npm dependency inside Framer.

---
Built by [Opace](https://www.opace.agency/) — a UK digital agency. Free tools:
[Preferred Source eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) ·
[Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/).
