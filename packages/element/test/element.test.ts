import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetSdkLoaderForTests } from '@opacedev/preferred-source-core';
import type { PsClickDetail } from '@opacedev/preferred-source-core';
import '../src/register';
import '../src/register'; // second import must not throw (idempotent define)
import type { PreferredSourceButton } from '../src/index';

function sdkScript(): HTMLScriptElement | null {
  return document.querySelector('script[src^="https://news.google.com/swg/js/v1/publisher"]');
}

/**
 * Pre-insert the publisher script so loadSdk adopts it instead of injecting.
 * happy-dom (JS file loading disabled) fires a synchronous error on append;
 * doing it here, before any listener exists, keeps load/error under manual
 * control in the auto-mode tests below.
 */
function preinstallSdkScript(): HTMLScriptElement {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://news.google.com/swg/js/v1/publisher.js';
  document.head.appendChild(script);
  return script;
}

/** happy-dom has no layout: give a child a real size so it counts as rendered. */
function visibleChild(tag = 'iframe'): HTMLElement {
  const child = document.createElement(tag);
  child.getBoundingClientRect = () =>
    ({ width: 120, height: 32, top: 0, left: 0, right: 120, bottom: 32, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  return child;
}

function mount(attrs: Record<string, string> = {}): PreferredSourceButton {
  const el = document.createElement('preferred-source-button');
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  document.body.appendChild(el);
  return el;
}

async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  resetSdkLoaderForTests();
  sdkScript()?.remove();
  delete window.PREFERRED_SOURCE;
});

describe('<preferred-source-button>', () => {
  it('registers idempotently', () => {
    expect(customElements.get('preferred-source-button')).toBeDefined();
  });

  it('renders a shadow button with the default label and an aria-hidden icon', () => {
    const el = mount();
    const button = el.shadowRoot!.querySelector('button[part="button"]');
    expect(button).not.toBeNull();
    expect(el.shadowRoot!.textContent).toContain('Add as a preferred source on Google');
    const icon = el.shadowRoot!.querySelector('svg.icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('reflects the variant attribute into the trigger class', () => {
    const el = mount({ variant: 'google-colours' });
    const button = el.shadowRoot!.querySelector('button');
    expect(button?.classList.contains('variant-google-colours')).toBe(true);
  });

  it('ignores clicks when disabled', () => {
    const el = mount({ disabled: '' });
    const clicks: Event[] = [];
    el.addEventListener('ps-click', (event) => clicks.push(event));
    el.shadowRoot!.querySelector('button')!.dispatchEvent(new Event('click', { bubbles: true }));
    expect(clicks).toHaveLength(0);
  });

  it('dispatches a composed, bubbling ps-click with a PsClickDetail shape', () => {
    const el = mount({ domain: 'example.com' });
    let received: CustomEvent<PsClickDetail> | null = null;
    el.addEventListener('ps-click', (event) => {
      received = event as CustomEvent<PsClickDetail>;
    });
    el.shadowRoot!.querySelector('button')!.dispatchEvent(new Event('click', { bubbles: true }));

    expect(received).not.toBeNull();
    const event = received as unknown as CustomEvent<PsClickDetail>;
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(event.detail.outcome).toBe('pending');
    expect(event.detail.mode).toBe('manual');
    expect(event.detail.theme).toBe('light');
    expect(event.detail.domain).toBe('example.com');
  });

  it('renders the deeplink fallback and emits ps-fallback when the SDK is blocked', async () => {
    const fallbacks: CustomEvent[] = [];
    const el = mount({ domain: 'example.com' });
    el.addEventListener('ps-fallback', (event) => fallbacks.push(event as CustomEvent));

    sdkScript()!.dispatchEvent(new Event('error'));
    await settle();

    const anchor = el.shadowRoot!.querySelector<HTMLAnchorElement>('a[part="fallback"]');
    expect(anchor).not.toBeNull();
    expect(anchor!.getAttribute('href')).toBe('https://www.google.com/preferences/source?q=example.com');
    expect(fallbacks).toHaveLength(1);
    expect((fallbacks[0]!.detail as { reason: string }).reason).toBe('blocked');
  });

  it('auto mode: swaps to the deeplink fallback with reason no-render when the SDK loads but paints nothing', async () => {
    vi.useFakeTimers();
    try {
      const fallbacks: CustomEvent[] = [];
      preinstallSdkScript();
      const el = mount({ mode: 'auto', domain: 'example.com' });
      el.addEventListener('ps-fallback', (event) => fallbacks.push(event as CustomEvent));

      // The attributed light-DOM div exists while waiting.
      expect(el.querySelector('[google-add-preferred-source-btn]')).not.toBeNull();

      sdkScript()!.dispatchEvent(new Event('load'));
      await vi.advanceTimersByTimeAsync(4001);

      const anchor = el.shadowRoot!.querySelector<HTMLAnchorElement>('a[part="fallback"]');
      expect(anchor).not.toBeNull();
      expect(anchor!.getAttribute('href')).toBe('https://www.google.com/preferences/source?q=example.com');
      expect(el.querySelector('[google-add-preferred-source-btn]')).toBeNull();
      expect(fallbacks).toHaveLength(1);
      expect((fallbacks[0]!.detail as { reason: string }).reason).toBe('no-render');
    } finally {
      vi.useRealTimers();
    }
  });

  it('auto mode: leaves the container alone when Google renders within the timeout', async () => {
    vi.useFakeTimers();
    try {
      const fallbacks: CustomEvent[] = [];
      preinstallSdkScript();
      const el = mount({ mode: 'auto' });
      el.addEventListener('ps-fallback', (event) => fallbacks.push(event as CustomEvent));

      // Google paints promptly here: the child exists by the time the watch
      // starts (happy-dom's MutationObserver does not deliver under fake
      // timers, so the pre-check path carries this test).
      el.querySelector('[google-add-preferred-source-btn]')!.appendChild(visibleChild());
      sdkScript()!.dispatchEvent(new Event('load'));
      await vi.advanceTimersByTimeAsync(10000);

      expect(el.shadowRoot!.querySelector('a[part="fallback"]')).toBeNull();
      expect(el.querySelector('[google-add-preferred-source-btn]')).not.toBeNull();
      expect(fallbacks).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('auto mode: honours the render-timeout attribute', async () => {
    vi.useFakeTimers();
    try {
      const fallbacks: CustomEvent[] = [];
      preinstallSdkScript();
      const el = mount({ mode: 'auto', 'render-timeout': '1000' });
      el.addEventListener('ps-fallback', (event) => fallbacks.push(event as CustomEvent));

      sdkScript()!.dispatchEvent(new Event('load'));
      await vi.advanceTimersByTimeAsync(999);
      expect(fallbacks).toHaveLength(0);
      await vi.advanceTimersByTimeAsync(2);
      expect(fallbacks).toHaveLength(1);
      expect((fallbacks[0]!.detail as { reason: string }).reason).toBe('no-render');
    } finally {
      vi.useRealTimers();
    }
  });

  it('auto mode: falls back with reason blocked when the script itself fails', async () => {
    vi.useFakeTimers();
    try {
      const fallbacks: CustomEvent[] = [];
      preinstallSdkScript();
      const el = mount({ mode: 'auto' });
      el.addEventListener('ps-fallback', (event) => fallbacks.push(event as CustomEvent));

      sdkScript()!.dispatchEvent(new Event('error'));
      await vi.advanceTimersByTimeAsync(1);

      expect(el.shadowRoot!.querySelector('a[part="fallback"]')).not.toBeNull();
      expect(fallbacks).toHaveLength(1);
      expect((fallbacks[0]!.detail as { reason: string }).reason).toBe('blocked');
    } finally {
      vi.useRealTimers();
    }
  });

  it('href-fallback wins over the computed deeplink', async () => {
    const el = mount({ 'href-fallback': 'https://www.google.com/preferences/source?q=apex.example' });
    sdkScript()!.dispatchEvent(new Event('error'));
    await settle();

    const anchor = el.shadowRoot!.querySelector<HTMLAnchorElement>('a[part="fallback"]');
    expect(anchor!.getAttribute('href')).toBe('https://www.google.com/preferences/source?q=apex.example');
  });
});
