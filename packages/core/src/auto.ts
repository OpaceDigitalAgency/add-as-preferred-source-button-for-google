import { AUTO_ATTRIBUTE, DEFAULT_RENDER_TIMEOUT_MS } from './constants';
import { isBrowser } from './environment';
import { loadSdk } from './loader';
import type { AutoRenderOutcome, PreferredSourceInitOptions, WatchAutoRenderAfterLoadOptions } from './types';

/**
 * Mark an element for Google's auto renderer: sets the
 * google-add-preferred-source-btn attribute plus data-theme / data-lang.
 * Omitted options remove the corresponding data attribute (Google's defaults
 * apply). SSR-safe only in the sense that it operates on any Element you give
 * it (usable with server DOM implementations); it touches nothing global.
 *
 * NOTE (unverified SDK behaviour): Google documents auto mode as scanning the
 * DOM when the script runs. Whether elements attributed AFTER script execution
 * are picked up is undocumented. For dynamically-mounted UIs prefer manual
 * mode. If you use auto mode, attribute the element before calling
 * loadSdk({ mode: 'auto' }).
 */
export function applyAutoAttributes(el: Element, options: PreferredSourceInitOptions = {}): void {
  el.setAttribute(AUTO_ATTRIBUTE, '');
  if (options.theme !== undefined) {
    el.setAttribute('data-theme', options.theme);
  } else {
    el.removeAttribute('data-theme');
  }
  if (options.lang !== undefined) {
    el.setAttribute('data-lang', options.lang);
  } else {
    el.removeAttribute('data-lang');
  }
}

/**
 * True once the SDK has injected VISIBLE markup. On unrecognised origins
 * (localhost, GitHub Pages) Google's SDK injects a zero-width iframe and
 * paints nothing, so a bare child-count check is not enough: at least one
 * element child must have real dimensions.
 */
function hasRenderedChild(el: Element): boolean {
  for (const child of Array.from(el.children)) {
    const rect = child.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return true;
  }
  return false;
}

/**
 * Watch an auto-mode element to see whether Google actually rendered a button
 * into it. Resolves true as soon as the element gains a VISIBLY sized element
 * child (Google injects its iframe/button markup; stray text nodes and
 * zero-sized children do not count), false if none appears within timeoutMs
 * (default 4000) — with one final visibility re-check at the deadline, since a
 * child injected early may only be laid out later. Uses MutationObserver;
 * disconnects on settle. Resolves true immediately if the element already has
 * a visible element child. SSR: resolves false. Use this to drive a deeplink
 * fallback for auto mode. NOTE: the clock starts when you call it — to time out
 * relative to SDK load (the useful measure, since the SDK loads fine on
 * unrecognised origins and then silently declines to render), use
 * watchAutoRenderAfterLoad().
 */
export function watchAutoRender(el: Element, timeoutMs: number = DEFAULT_RENDER_TIMEOUT_MS): Promise<boolean> {
  if (!isBrowser()) return Promise.resolve(false);
  if (hasRenderedChild(el)) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const observer = new MutationObserver(() => {
      if (hasRenderedChild(el)) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(true);
      }
    });
    observer.observe(el, { childList: true });
    const timer = setTimeout(() => {
      observer.disconnect();
      // Final re-check: a child may have been injected earlier and only
      // gained its layout size afterwards, with no further mutations.
      resolve(hasRenderedChild(el));
    }, timeoutMs);
  });
}

/**
 * The complete auto-mode guard: ensures the SDK is loading (idempotent
 * loadSdk({ mode: 'auto' })), waits for it to settle, then gives Google
 * timeoutMs (default 4000) AFTER a successful load to inject markup into el.
 *
 * Outcomes:
 * - 'rendered'    — Google injected a child; leave the element alone.
 * - 'no-render'   — the script loaded but painted nothing within the timeout
 *                   (unrecognised origin, ineligible site): swap in a deeplink
 *                   fallback and emit your fallback event with this reason.
 * - 'blocked'     — the script itself failed or timed out (ad blocker,
 *                   offline): fall back with reason 'blocked'.
 * - 'unsupported' — SSR / non-browser environment; do nothing.
 */
export async function watchAutoRenderAfterLoad(
  el: Element,
  options: WatchAutoRenderAfterLoadOptions = {},
): Promise<AutoRenderOutcome> {
  if (!isBrowser()) return 'unsupported';
  const result = await loadSdk({ mode: 'auto' });
  if (result.status === 'unsupported') return 'unsupported';
  if (result.status === 'blocked') return 'blocked';
  const rendered = await watchAutoRender(el, options.timeoutMs ?? DEFAULT_RENDER_TIMEOUT_MS);
  return rendered ? 'rendered' : 'no-render';
}
