# Add as Preferred Source Button for Framer

This self-contained Framer code component uses Google's documented manual mode. It has no package dependency.

> **Check eligibility first.** Google supports domains and subdomains, not individual subdirectories. `example.com` and `news.example.com` can be eligible; `example.com/blog` cannot be preferred separately. Confirm that your domain appears in Google's [source preferences tool](https://www.google.com/preferences/source) before implementation.

## Add the component

1. In Framer, open **Assets → Code → Create code file**.
2. Name the file `PreferredSourceButton.tsx` and paste in [`PreferredSourceButton.tsx`](PreferredSourceButton.tsx).
3. Drag the component to the intended page position.
4. Set the Theme, Language, Label, Variant and Domain properties. Leave Domain blank to use the published page hostname.
5. Publish the site.

## Expected behaviour and validation

The component loads the SDK in manual mode and calls Google's documented `init({ theme, lang })` and `addPreferredSource()` methods when its trigger is clicked. If the SDK cannot load, it uses the configured-domain deeplink. Validate on a public eligible domain, not only in the editor preview or localhost: check the visible trigger, click it, and test the fallback path with the SDK blocked.

---

[Product hub](https://opace.agency/add-as-preferred-source-button-for-google/) · [Button generator](https://opace.agency/add-as-preferred-source-button-for-google/button-generator/) · [Eligibility checker](https://opace.agency/add-as-preferred-source-button-for-google/button-checker/) · [Google implementation guide](https://developers.google.com/search/docs/appearance/preferred-sources) · [Source repository](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google) · [Opace SEO services](https://opace.agency/services/seo/) · [Opace on GitHub](https://github.com/OpaceDigitalAgency) · [Opace support](https://opace.agency/add-as-preferred-source-button-for-google/) · [MIT licence](../../LICENSE)
