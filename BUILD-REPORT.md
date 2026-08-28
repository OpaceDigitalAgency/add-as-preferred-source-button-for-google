# Build report — OpaceDigitalAgency/add-as-preferred-source-button-for-google monorepo

Built 26 August 2026 against `specs/03-oss-packages-spec.md`, `BRAND-STYLE.md` and `research/official-docs.md`. Toolchain: pnpm 11.24.0, Node 24.2.0 (packages target Node ≥18; CI runs Node 20).

## What was built

**Packages (all six):**

| Package | Contents | Build output |
|---|---|---|
| `@opacedev/preferred-source-core` | constants, types (incl. `GooglePreferredSource` limited to `init`/`addPreferredSource`), `isBrowser`, `normaliseDomain`/`buildDeeplink`, idempotent `loadSdk` with script adoption + timeout + blocked state, `initPreferredSource`/`openPreferredSourceDialog`, `applyAutoAttributes`/`watchAutoRender`, `createFallbackAnchor`, `emitPsClick` | tsup: ESM + CJS + d.ts |
| `@opacedev/preferred-source-element` | `<preferred-source-button>` — manual/auto modes, three variants, light-DOM slotted auto div, deeplink fallback state, `ps-click`/`ps-ready`/`ps-fallback` events, 15 CSS custom properties, `::part` hooks, reduced-motion support; `register.ts` side-effect entry | tsup: ESM + CJS + d.ts; `register.js` bundles core (self-contained for CDN/docs) |
| `@opacedev/react-preferred-source` | `PreferredSourceButton` (client component, `'use client'` in output) + `usePreferredSource` hook | tsup: ESM + CJS + d.ts |
| `@opacedev/vue-preferred-source` | SFC component, `usePreferredSource` composable, `PreferredSourcePlugin` | Vite lib mode + vue-tsc declarations |
| `@opacedev/svelte-preferred-source` | `PreferredSourceButton.svelte` (Svelte 4 syntax, Svelte 4/5 peer range) | svelte-package (`dist/` .svelte + .js + .d.ts) |
| `@opacedev/astro-preferred-source` | Integration (head-inline script injection with dedupe + manual-mode warning), `PreferredSourceButton.astro` (auto SSR div + noscript deeplink; manual trigger + processed script), `PreferredSourceLink.astro` (no-JS) | No build — ships raw `src` per Astro convention |

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
- `npm pack --dry-run` — packs cleanly in all six package directories. After the 28 August README artwork update: core 13 files, element 19, react 13, vue 14, svelte 12 and astro 12. Note: `workspace:^` ranges are rewritten to real semver by `changeset publish`/pnpm at actual publish time, not by a raw `npm publish`.

## Post-build fixes (26 August 2026, second pass)

1. **Auto-mode render timeout (silent non-render fix).** Google's SDK loads successfully on unrecognised origins (localhost, GitHub Pages) but silently declines to paint — in practice it injects a **zero-width iframe**, so auto-mode boxes sat empty and the old load-failure check never fired. Core now exports `watchAutoRenderAfterLoad(el, {timeoutMs})` (plus `DEFAULT_RENDER_TIMEOUT_MS = 4000` and the `AutoRenderOutcome` type): it ensures the auto-mode load, waits for the script to settle, then gives Google `timeoutMs` **after load** to inject a *visibly sized* element child (zero-sized children do not count; one final visibility re-check runs at the deadline). Outcomes: `rendered` / `no-render` / `blocked` / `unsupported`. `watchAutoRender` keeps its signature but now defaults to 4,000 ms and requires a visible child.
2. **Wired through every wrapper that renders auto mode.** Element: new `render-timeout` attribute/property (default 4000); on `no-render` or `blocked` the attributed div is removed, the deeplink fallback anchor renders, and `ps-fallback` fires with the matching reason. React: `renderTimeoutMs` + `onPsFallback` props, auto div watched via ref, swaps to the fallback anchor (also fixed: auto mode previously loaded the SDK in *manual* mode via the hook, which suppresses Google's auto render — `usePreferredSource` now accepts `mode`). Vue and Svelte: `renderTimeoutMs` prop, `ps-fallback` emit, anchor swap. Astro: auto markup now carries `data-opace-ps-auto`/`data-deeplink`/`data-label`/`data-render-timeout` and a processed client script performs the same watch-and-swap.
3. **Tests** — 12 added (70 total): core `watchAutoRender` visibility/zero-size/deadline-recheck/4000-default cases and all four `watchAutoRenderAfterLoad` outcomes (vitest fake timers; the SDK script is pre-inserted so happy-dom's synchronous script-error quirk stays out of the way), plus four element auto-mode tests (`no-render` swap, rendered leave-alone, `render-timeout` attribute, `blocked`).
4. **Docs demo hardened.** Auto-mode section uses `render-timeout="4000"`, explains the no-render fallback, and the copy no longer implies the box can sit empty. The two google-default gallery cards gained pure-CSS static mock buttons labelled "preview" (plus a `preferred-source-button:not(:defined)` guard), so every card shows a visible button even with the element script or Google SDK blocked. Verified in a real Chrome against a local server: all six gallery cards show visible buttons, the auto section swaps to the deeplink fallback at +4 s, the event console logs `ps-fallback {"reason":"no-render"}`, zero console errors.
5. **Links corrected pre-publication.** All `opace-agency` GitHub/Pages references repo-wide (docs, READMEs, package.json `repository`/`bugs`/`homepage`, changesets config) now point at `github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google` and `opacedigitalagency.github.io/add-as-preferred-source-button-for-google/`. Every external href on the docs page checked: the two opace.agency tool pages, `www.opace.agency` and Google's source-preferences page all return 200; the GitHub links await the repo's creation by design.
6. **READMEs** — core and element READMEs document `watchAutoRenderAfterLoad`, `DEFAULT_RENDER_TIMEOUT_MS`, the `render-timeout` attribute and the two `ps-fallback` reasons.

Re-verified after the pass: `pnpm build`, `pnpm typecheck`, `pnpm lint` all clean; `pnpm test` 70/70.

## Repo rename and rebrand sweep (26 August 2026, third pass)

- **Repo URLs**: every `github.com/OpaceDigitalAgency/preferred-source` reference is now `github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google` (all six package.json `repository`/`homepage`/`bugs`, all READMEs, docs hrefs, `.changeset/config.json` changelog repo). Workflows, CONTRIBUTING and issue templates contained no absolute repo URLs to change.
- **Pages URLs**: every `opacedigitalagency.github.io/preferred-source` reference is now `opacedigitalagency.github.io/add-as-preferred-source-button-for-google` (docs canonical, `og:url`, JSON-LD, README demo links). The docs site uses only relative asset paths (`styles.css`, `vendor/preferred-source-element.js`, `demo.js`), so the base-path change needs no further edits.
- **Branding**: the umbrella product name is now "Add as Preferred Source Button, Popup & Analytics for Google (SEO & AI Overviews)" in the root README H1, the docs `<title>`/H1/`og:title`/JSON-LD name and a new root package.json `description`, each with the developer-facing subtitle retained beneath. The root README's WordPress plugin mention uses the same display name. npm package names (`@opacedev/preferred-source-*`) and all code APIs are untouched.
- Verified: `pnpm build` clean, `pnpm test` 70/70 (12 files), grep confirms zero remaining `OpaceDigitalAgency/preferred-source` or `github.io/preferred-source` references, docs hero renders the new name in a real browser with zero console errors.

## npm release preflight (28 August 2026, fourth pass)

- The Astro peer range now supports `^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0`. Fresh scratch projects installed the locally packed core and Astro packages and completed production builds on Astro 4.16.19, 5.18.2, 6.4.8 and 7.2.9.
- The initial Changeset uses a major bump for all six unpublished `0.1.0` manifests. `changeset status` resolves every package to exactly `1.0.0`, matching the existing public GitHub release, without applying the version changes locally.
- `pnpm install --frozen-lockfile`, build, 70 tests, typecheck and lint passed. All six `npm pack --dry-run --json` checks returned exit 0 with the intended README, licence, artwork and build/source files.
- At this preflight point, publication remained owner-gated: local npm authentication was invalid, the originally assumed package scope was unverified, and GitHub Actions was prohibited from creating the Changesets version pull request. No package was published. The package scope was later corrected to the established `@opacedev` publisher identity in the sixth pass.

## Manual Version Packages branch (28 August 2026, fifth pass)

- Prepared branch `codex/version-packages-1.0.0` from public `main` commit `b0dc463` because the repository currently prevents GitHub Actions from creating the automatic Changesets pull request.
- Consumed `.changeset/initial-release.md` and set all six package manifests to exactly `1.0.0`. The normal GitHub changelog lookup requires a token locally, so the version step ran with that lookup temporarily disabled; `.changeset/config.json` was restored unchanged afterwards.
- Added a package-specific `CHANGELOG.md` to every package and included it in each published file set.
- Fresh verification on the versioned branch passes: frozen install, all six builds, 12 test files / 70 tests, typecheck, lint and six package dry-runs. Dry-runs report 1.0.0 and include the changelog: core 14 files, element 20, React 14, Vue 15, Svelte 13 and Astro 13.
- The branch is open as [Version Packages PR #1](https://github.com/OpaceDigitalAgency/add-as-preferred-source-button-for-google/pull/1). Its GitHub `CI / ci` check succeeded and GitHub reports it ready to merge.
- Repository Settings → Actions now allows GitHub Actions to create and approve pull requests. The earlier Changesets permission failure is resolved for future releases; the manually prepared PR remains the reviewed 1.0.0 path.
- Repository Actions secrets currently contains no repository or environment secrets and no `NPM_TOKEN`. The signed-in Chrome profile also receives `ERR_BLOCKED_BY_CLIENT` from `www.npmjs.com`, while the local npm credential returns E401. David must restore npm account access and create/configure the first-publish credential before the PR can be merged safely.
- This branch is a reviewable release checkpoint only. Do not merge it until David has authenticated npm, confirmed publish authority for the established `@opacedev` scope, approved the irreversible first publication and supplied the release workflow with an appropriate credential or trusted-publishing setup.

## npm scope, release-facing copy and canonical homepage pass (28 August 2026, sixth pass)

- Corrected all six package names from the previously proposed scope to Opace's established `@opacedev` publisher scope. Public registry evidence confirms `@opacedev/astro-visual-editor@0.1.0-beta.2` exists; all six proposed Preferred Sources names return E404 and therefore have no public collision.
- Migrated the package graph consistently: manifests, five internal core dependencies, source imports, tests, bundler external rules, Astro integration name/warning, lockfile importers, changelog headings, workflow filter, issue template, root/package/demo documentation, generator snippets and governing specification now use `@opacedev`.
- Removed dated pre-publication warnings from the root README and all six package READMEs. The package-facing documentation now gives normal npm install commands; unpublished/authentication state remains in the internal handover documents instead of becoming stale registry copy.
- Replaced conditional “only after submission” wording for the WordPress and Chrome destinations with evergreen repository and directory-listing descriptions.
- Updated all six package `homepage` values, the root README, docs demo and recipe links to `https://opace.agency/tools/suite/add-as-preferred-source-button-for-google/button-generator/`; the live route returned HTTP 200 during this pass.
- Re-ran the complete package baseline on local branch `codex/version-packages-1.0.0`: frozen install with the migrated lockfile, all six builds, 12 test files / 70 tests, typecheck and lint passed. The docs-workflow filter builds the renamed core and element packages. Test stderr still includes expected happy-dom notices because external script loading is disabled in the unit-test environment; the suite exits 0.
- All six `npm pack --dry-run --json` checks exit 0 at version 1.0.0 under `@opacedev` and contain the expected file counts: core 14, element 20, React 14, Vue 15, Svelte 13 and Astro 13. The web generator's renamed snippets also retain its 134/134 test pass.
- These corrections are local only. They are not committed, pushed or included in PR #1, and no npm publish or account action has run.
- The release gate remains explicit: restore valid npm authentication for the established `@opacedev` publisher identity, confirm publish authority, obtain David's first-publication approval and configure a workflow credential or trusted publisher before merging the version PR.

## Next.js 16 App Router proof (28 August 2026)

- Packed the current `@opacedev/preferred-source-core` and `@opacedev/react-preferred-source` version 1.0.0 tarballs; the packed React dependency resolved from `workspace:^` to `@opacedev/preferred-source-core` `^1.0.0`.
- Installed both tarballs into a fresh Next.js 16.3.3 App Router project with React 19.2.8.
- Verified a Server Component importing `PreferredSourceButton` with serialisable props and a separate `"use client"` analytics wrapper for the function callback.
- The production build compiled, passed TypeScript and generated 3/3 static pages. Explicit TypeScript and ESLint checks also passed.
- A production Playwright check rendered both buttons, observed the analytics detail and SDK command, and reported zero console or page errors.
- The React README now separates serialisable Server Component usage from the client analytics boundary. A separate Next-specific package is not required because the React entry already supplies the client boundary advised for library components.

## Deviations and deferrals

1. **`ps-fallback` reason `'timeout'`** — the loader reports `blocked` for both script-error and timeout, so the element emits `reason: 'blocked'` in both cases (`'no-render'` is emitted distinctly for auto mode). Distinguishing would need extra loader state; deferred as cosmetic.
2. **Browser/network acceptance items (§9.4 #6–#13, #16)** — single-script dedupe in a live page, blocked-network fallback timing, visual variant check, fresh Next.js/Nuxt/SvelteKit scratch apps, and cross-browser docs QA remain on the launch checklist. Fresh Astro production builds now pass on majors 4, 5, 6 and 7.
3. **Publish-time items** — npm authentication, `@opacedev` publish authority, the publish credential and Astro catalogue verification (`npm view … keywords`) remain owner/account gates.
4. **`packageManager`** pinned to the installed `pnpm@11.24.0` (spec floor was 9+; spec instructs resolving to latest compatible).
5. **Element dist bundles core** (`noExternal`, `splitting: false`) so the unpkg/docs `register.js` snippet works without bare-specifier resolution; core stays a real dependency for npm consumers' metadata but its ~3 KB is inlined in element output.
6. **Astro types** are minimal structural interfaces (no `astro` devDependency needed to typecheck); the integration object matches the Astro 4–7 hook shape and `astro` remains a peerDependency.

## Publish-readiness checklist

| Item | Status |
|---|---|
| §9.4 #1 install + build clean | Pass (this environment; CI re-checks on Node 22) |
| #2 tests + core coverage ≥90 % | Pass — 70/70, 99.16 % lines from the coverage run |
| #3 typecheck + lint | Pass |
| #4 dist ESM+CJS+d.ts, publish dry-run | Pass (svelte/astro per their conventions) |
| #5 bare-Node import safety | Pass for core/element/react/vue; svelte/astro N/A by packaging convention |
| #6–#13 live-browser and scratch-app checks | Astro 4–7 scratch builds pass; remaining framework/browser checks stay on launch QA |
| #14 astro keywords incl. `astro-integration` | Present in package.json; `npm view` check possible after publish |
| #15 limitation note + footer + homepage in every README/package | Pass (verified by grep) |
| #16 docs deploy cross-browser | Workflow written; deferred until repo exists |
| #17 no names beginning "google"; descriptive first mentions | Pass |
| Changeset for initial release | Consumed on `codex/version-packages-1.0.0`; all six manifests and changelogs now resolve to 1.0.0 under `@opacedev` |
| Secrets/manual steps | Valid npm authentication and `@opacedev` publish authority; publish credential; allow GitHub Actions to create the Changesets pull request |
