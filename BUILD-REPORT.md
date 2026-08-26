# Build report — OpaceDigitalAgency/preferred-source monorepo

Built 26 August 2026 against `specs/03-oss-packages-spec.md`, `BRAND-STYLE.md` and `research/official-docs.md`. Toolchain: pnpm 11.24.0, Node 24.2.0 (packages target Node ≥18; CI runs Node 20).

## What was built

**Packages (all six):**

| Package | Contents | Build output |
|---|---|---|
| `@opace/preferred-source-core` | constants, types (incl. `GooglePreferredSource` limited to `init`/`addPreferredSource`), `isBrowser`, `normaliseDomain`/`buildDeeplink`, idempotent `loadSdk` with script adoption + timeout + blocked state, `initPreferredSource`/`openPreferredSourceDialog`, `applyAutoAttributes`/`watchAutoRender`, `createFallbackAnchor`, `emitPsClick` | tsup: ESM + CJS + d.ts |
| `@opace/preferred-source-element` | `<preferred-source-button>` — manual/auto modes, three variants, light-DOM slotted auto div, deeplink fallback state, `ps-click`/`ps-ready`/`ps-fallback` events, 15 CSS custom properties, `::part` hooks, reduced-motion support; `register.ts` side-effect entry | tsup: ESM + CJS + d.ts; `register.js` bundles core (self-contained for CDN/docs) |
| `@opace/react-preferred-source` | `PreferredSourceButton` (client component, `'use client'` in output) + `usePreferredSource` hook | tsup: ESM + CJS + d.ts |
| `@opace/vue-preferred-source` | SFC component, `usePreferredSource` composable, `PreferredSourcePlugin` | Vite lib mode + vue-tsc declarations |
| `@opace/svelte-preferred-source` | `PreferredSourceButton.svelte` (Svelte 4 syntax, Svelte 4/5 peer range) | svelte-package (`dist/` .svelte + .js + .d.ts) |
| `@opace/astro-preferred-source` | Integration (head-inline script injection with dedupe + manual-mode warning), `PreferredSourceButton.astro` (auto SSR div + noscript deeplink; manual trigger + processed script), `PreferredSourceLink.astro` (no-JS) | No build — ships raw `src` per Astro convention |

**Repo furniture:** pnpm workspace, `tsconfig.base.json`, Changesets config + initial-release changeset, `vitest.workspace.ts` (six projects — astro added beyond spec with integration unit tests), eslint flat config, `.npmrc` (engine-strict), MIT `LICENSE` (Opace Ltd), `CONTRIBUTING.md`, issue templates, three GitHub Actions workflows (`ci.yml`, `release.yml` with Changesets + `NPM_TOKEN`, `docs.yml` deploying `docs/` to Pages with the element bundle copied to `docs/vendor/`).

**Docs demo site (`docs/`):** static `index.html` + `styles.css` + `demo.js` — hero with live element, variant gallery (3 × light/dark with snippets), auto-mode demo, forced-fallback demo, event console, five framework install tabs, eligibility + limitation notes, WebPage JSON-LD, OG tags, dark-mode aware, Opace footer links.

**Recipes (`recipes/`):** index plus Hugo (partial), Jekyll (include), Eleventy (shortcode), Ghost, Webflow, Framer (self-contained code component), Shopify (Liquid snippet) — each with eligibility warning, auto-mode two-liner, deeplink fallback and the Opace footer.

**READMEs:** root (keyword H1, header tool links, badges, coverage table, 30-second quick start, eligibility warning, verbatim limitation note, WordPress cross-link) and per-package READMEs with props/API tables, SSR notes, the verbatim §3.10 limitation note and the verbatim §7.3 footer. British English; banned-word scan of all `.md`/`.html` returned zero hits.

## Verification results (verbatim summaries)

- `pnpm install` — clean (`Done in 1.6s using pnpm v11.24.0`; esbuild/sharp build scripts approved via `allowBuilds` in `pnpm-workspace.yaml`).
- `pnpm build` — all 6 packages succeed (`tsup` ×3, Vite+vue-tsc, svelte-package, astro no-op).
- `pnpm test` — `Test Files  12 passed (12)` / `Tests  70 passed (70)` (58 originally; 12 added with the render-timeout work below).
- Core coverage (`vitest run --coverage`, v8): `All files | 99.16 % Stmts | 90 % Branch | 100 % Funcs | 99.16 % Lines` — above the ≥90 % lines gate.
- `pnpm typecheck` — all packages pass (tsc, vue-tsc, svelte-check).
- `pnpm lint` — clean.
- SSR safety (bare Node imports of built output): core ESM + CJS ok, element `index.js` + `register.js` ok, react ok, vue ok. Svelte's `dist/index.js` re-exports a `.svelte` file, so bare Node cannot import it — by design of svelte-package (SvelteKit compiles it server-side); same applies to Astro's raw `.astro` source.
- `npm publish --dry-run` — packs cleanly in all six package directories (core 8 files, element 14, react 8, vue 9, svelte 7, astro 7). Note: `workspace:^` ranges are rewritten to real semver by `changeset publish`/pnpm at actual publish time, not by a raw `npm publish`.

## Post-build fixes (26 August 2026, second pass)

1. **Auto-mode render timeout (silent non-render fix).** Google's SDK loads successfully on unrecognised origins (localhost, GitHub Pages) but silently declines to paint — in practice it injects a **zero-width iframe**, so auto-mode boxes sat empty and the old load-failure check never fired. Core now exports `watchAutoRenderAfterLoad(el, {timeoutMs})` (plus `DEFAULT_RENDER_TIMEOUT_MS = 4000` and the `AutoRenderOutcome` type): it ensures the auto-mode load, waits for the script to settle, then gives Google `timeoutMs` **after load** to inject a *visibly sized* element child (zero-sized children do not count; one final visibility re-check runs at the deadline). Outcomes: `rendered` / `no-render` / `blocked` / `unsupported`. `watchAutoRender` keeps its signature but now defaults to 4,000 ms and requires a visible child.
2. **Wired through every wrapper that renders auto mode.** Element: new `render-timeout` attribute/property (default 4000); on `no-render` or `blocked` the attributed div is removed, the deeplink fallback anchor renders, and `ps-fallback` fires with the matching reason. React: `renderTimeoutMs` + `onPsFallback` props, auto div watched via ref, swaps to the fallback anchor (also fixed: auto mode previously loaded the SDK in *manual* mode via the hook, which suppresses Google's auto render — `usePreferredSource` now accepts `mode`). Vue and Svelte: `renderTimeoutMs` prop, `ps-fallback` emit, anchor swap. Astro: auto markup now carries `data-opace-ps-auto`/`data-deeplink`/`data-label`/`data-render-timeout` and a processed client script performs the same watch-and-swap.
3. **Tests** — 12 added (70 total): core `watchAutoRender` visibility/zero-size/deadline-recheck/4000-default cases and all four `watchAutoRenderAfterLoad` outcomes (vitest fake timers; the SDK script is pre-inserted so happy-dom's synchronous script-error quirk stays out of the way), plus four element auto-mode tests (`no-render` swap, rendered leave-alone, `render-timeout` attribute, `blocked`).
4. **Docs demo hardened.** Auto-mode section uses `render-timeout="4000"`, explains the no-render fallback, and the copy no longer implies the box can sit empty. The two google-default gallery cards gained pure-CSS static mock buttons labelled "preview" (plus a `preferred-source-button:not(:defined)` guard), so every card shows a visible button even with the element script or Google SDK blocked. Verified in a real Chrome against a local server: all six gallery cards show visible buttons, the auto section swaps to the deeplink fallback at +4 s, the event console logs `ps-fallback {"reason":"no-render"}`, zero console errors.
5. **Links corrected pre-publication.** All `opace-agency` GitHub/Pages references repo-wide (docs, READMEs, package.json `repository`/`bugs`/`homepage`, changesets config) now point at `github.com/OpaceDigitalAgency/preferred-source` and `opacedigitalagency.github.io/preferred-source/`. Every external href on the docs page checked: the two opace.agency tool pages, `www.opace.agency` and Google's source-preferences page all return 200; the GitHub links await the repo's creation by design.
6. **READMEs** — core and element READMEs document `watchAutoRenderAfterLoad`, `DEFAULT_RENDER_TIMEOUT_MS`, the `render-timeout` attribute and the two `ps-fallback` reasons.

Re-verified after the pass: `pnpm build`, `pnpm typecheck`, `pnpm lint` all clean; `pnpm test` 70/70.

## Deviations and deferrals

1. **`ps-fallback` reason `'timeout'`** — the loader reports `blocked` for both script-error and timeout, so the element emits `reason: 'blocked'` in both cases (`'no-render'` is emitted distinctly for auto mode). Distinguishing would need extra loader state; deferred as cosmetic.
2. **Browser/network acceptance items (§9.4 #6–#13, #16)** — single-script dedupe in a live page, blocked-network fallback timing, visual variant check, fresh Next.js/Nuxt/SvelteKit/Astro scratch apps, and cross-browser docs QA need real browsers/scaffolds and were not run in this environment. The behaviours are unit-tested equivalents (dedupe, blocked → fallback, events) but the live checks remain on the launch checklist.
3. **Publish-time items** — npm org/`NPM_TOKEN`, GitHub repo creation with website/topics, Pages enablement, Astro catalogue verification (`npm view … keywords`) require accounts and a pushed repo.
4. **`packageManager`** pinned to the installed `pnpm@11.24.0` (spec floor was 9+; spec instructs resolving to latest compatible).
5. **Element dist bundles core** (`noExternal`, `splitting: false`) so the unpkg/docs `register.js` snippet works without bare-specifier resolution; core stays a real dependency for npm consumers' metadata but its ~3 KB is inlined in element output.
6. **Astro types** are minimal structural interfaces (no `astro` devDependency needed to typecheck); the integration object matches the Astro 4/5 hook shape and `astro` remains a peerDependency.

## Publish-readiness checklist

| Item | Status |
|---|---|
| §9.4 #1 install + build clean | Pass (this environment; CI re-checks on Node 20) |
| #2 tests + core coverage ≥90 % | Pass — 58/58, 99.09 % lines |
| #3 typecheck + lint | Pass |
| #4 dist ESM+CJS+d.ts, publish dry-run | Pass (svelte/astro per their conventions) |
| #5 bare-Node import safety | Pass for core/element/react/vue; svelte/astro N/A by packaging convention |
| #6–#13 live-browser and scratch-app checks | Deferred to launch QA (needs browser/scaffolds) |
| #14 astro keywords incl. `astro-integration` | Present in package.json; `npm view` check possible after publish |
| #15 limitation note + footer + homepage in every README/package | Pass (verified by grep) |
| #16 docs deploy cross-browser | Workflow written; deferred until repo exists |
| #17 no names beginning "google"; descriptive first mentions | Pass |
| Changeset for initial release | Added (`.changeset/initial-release.md`, minor across all six) |
| Secrets/manual steps | `NPM_TOKEN` repo secret, GitHub repo website/topics, Pages source = Actions |
