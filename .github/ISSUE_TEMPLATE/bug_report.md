---
name: Bug report
about: Something is broken in one of the packages
labels: bug
---

**Package and version**
e.g. @opace/preferred-source-core 0.1.0

**What happened**
A clear description of the fault, including any console output.

**Steps to reproduce**
1.
2.
3.

**Expected behaviour**

**Environment**
- Framework and version (React 18, Nuxt 3, SvelteKit 2, Astro 5 …):
- Browser:
- Ad blocker or consent tool present? (the SDK is often blocked by these)

**Note on "the popup never confirms the add"**
Google's SDK exposes no completion callback. If your report is that no event fires after the user finishes the flow, that is a documented SDK limitation, not a bug in these packages.
