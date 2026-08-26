import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AUTO_ATTRIBUTE,
  DEFAULT_RENDER_TIMEOUT_MS,
  applyAutoAttributes,
  resetSdkLoaderForTests,
  watchAutoRender,
  watchAutoRenderAfterLoad,
} from '../src/index';

function sdkScript(): HTMLScriptElement | null {
  return document.querySelector('script[src^="https://news.google.com/swg/js/v1/publisher"]');
}

/**
 * Pre-insert the publisher script so loadSdk adopts it instead of injecting.
 * happy-dom (JS file loading disabled) fires a synchronous error on append;
 * doing it here, before any listener exists, keeps load/error under manual
 * control in the tests below.
 */
function preinstallSdkScript(): HTMLScriptElement {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://news.google.com/swg/js/v1/publisher.js';
  document.head.appendChild(script);
  return script;
}

/** happy-dom has no layout: give a child a real size so it counts as rendered. */
function visibleChild(tag = 'span'): HTMLElement {
  const child = document.createElement(tag);
  child.getBoundingClientRect = () =>
    ({ width: 120, height: 32, top: 0, left: 0, right: 120, bottom: 32, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  return child;
}

afterEach(() => {
  vi.useRealTimers();
  resetSdkLoaderForTests();
  document.body.innerHTML = '';
  sdkScript()?.remove();
});

describe('applyAutoAttributes', () => {
  it('sets the auto attribute plus data-theme and data-lang', () => {
    const el = document.createElement('div');
    applyAutoAttributes(el, { theme: 'dark', lang: 'en' });
    expect(el.hasAttribute(AUTO_ATTRIBUTE)).toBe(true);
    expect(el.getAttribute('data-theme')).toBe('dark');
    expect(el.getAttribute('data-lang')).toBe('en');
  });

  it('re-applying with no options removes the data attributes but keeps the auto attribute', () => {
    const el = document.createElement('div');
    applyAutoAttributes(el, { theme: 'dark', lang: 'en' });
    applyAutoAttributes(el, {});
    expect(el.hasAttribute(AUTO_ATTRIBUTE)).toBe(true);
    expect(el.hasAttribute('data-theme')).toBe(false);
    expect(el.hasAttribute('data-lang')).toBe(false);
  });
});

describe('watchAutoRender', () => {
  it('resolves true when a child is appended', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const promise = watchAutoRender(el, 1000);
    el.appendChild(visibleChild());
    await expect(promise).resolves.toBe(true);
    el.remove();
  });

  it('resolves true immediately when children pre-exist', async () => {
    const el = document.createElement('div');
    el.appendChild(visibleChild());
    await expect(watchAutoRender(el, 1000)).resolves.toBe(true);
  });

  it('resolves false on timeout and disconnects the observer', async () => {
    vi.useFakeTimers();
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const el = document.createElement('div');
    const promise = watchAutoRender(el, 500);
    vi.advanceTimersByTime(501);
    await expect(promise).resolves.toBe(false);
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });

  it('treats a zero-sized injected child as not rendered (the localhost iframe case)', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    el.appendChild(document.createElement('iframe')); // happy-dom rect: 0x0
    const promise = watchAutoRender(el, 500);
    vi.advanceTimersByTime(501);
    await expect(promise).resolves.toBe(false);
  });

  it('resolves true at the deadline when an early child gains size only later', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    const child = document.createElement('iframe');
    el.appendChild(child); // zero-sized for now
    const promise = watchAutoRender(el, 500);
    // The child is laid out later, with no further DOM mutations.
    child.getBoundingClientRect = () =>
      ({ width: 120, height: 32, top: 0, left: 0, right: 120, bottom: 32, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    vi.advanceTimersByTime(501);
    await expect(promise).resolves.toBe(true);
  });

  it('ignores text nodes: only an element child counts as rendered', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    el.appendChild(document.createTextNode('   '));
    const promise = watchAutoRender(el, 500);
    vi.advanceTimersByTime(501);
    await expect(promise).resolves.toBe(false);
  });

  it('defaults its timeout to DEFAULT_RENDER_TIMEOUT_MS (4000)', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    const promise = watchAutoRender(el);
    vi.advanceTimersByTime(DEFAULT_RENDER_TIMEOUT_MS - 1);
    let settled = false;
    void promise.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);
    vi.advanceTimersByTime(2);
    await expect(promise).resolves.toBe(false);
  });
});

describe('watchAutoRenderAfterLoad', () => {
  it("resolves 'no-render' when the script loads but nothing is painted within the render timeout", async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    preinstallSdkScript();
    const promise = watchAutoRenderAfterLoad(el);
    sdkScript()!.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(DEFAULT_RENDER_TIMEOUT_MS + 1);
    await expect(promise).resolves.toBe('no-render');
  });

  it("resolves 'rendered' when the SDK injects an element child after load", async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    preinstallSdkScript();
    const promise = watchAutoRenderAfterLoad(el);
    // Google paints promptly: the child exists by the time the watch starts
    // (happy-dom's MutationObserver does not deliver under fake timers, so
    // the pre-check path carries this test).
    el.appendChild(visibleChild('iframe'));
    sdkScript()!.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(10000);
    await expect(promise).resolves.toBe('rendered');
  });

  it("resolves 'blocked' when the script itself fails to load", async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    preinstallSdkScript();
    const promise = watchAutoRenderAfterLoad(el);
    sdkScript()!.dispatchEvent(new Event('error'));
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBe('blocked');
  });

  it('honours a custom render timeout, timed from SDK load', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    preinstallSdkScript();
    const promise = watchAutoRenderAfterLoad(el, { timeoutMs: 1000 });
    // The clock must not start before the script has loaded.
    await vi.advanceTimersByTimeAsync(2000);
    sdkScript()!.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(999);
    let settled = false;
    void promise.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    await expect(promise).resolves.toBe('no-render');
  });
});
