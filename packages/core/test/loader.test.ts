import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MANUAL_CONTROL_ATTRIBUTE,
  SDK_URL,
  getSdkStatus,
  loadSdk,
  resetSdkLoaderForTests,
} from '../src/index';
import type { GooglePreferredSource } from '../src/index';

function injectedScripts(): HTMLScriptElement[] {
  return Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[src^="https://news.google.com/swg/js/v1/publisher"]'),
  );
}

function drainQueue(spy: GooglePreferredSource): void {
  const queue = window.PREFERRED_SOURCE ?? [];
  while (queue.length > 0) queue.shift()?.(spy);
}

beforeEach(() => {
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

afterEach(() => {
  vi.useRealTimers();
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

describe('loadSdk', () => {
  it('injects exactly one async script with the SDK URL; manual mode sets the control attribute and queues init', () => {
    void loadSdk({ mode: 'manual', theme: 'dark', lang: 'de' });
    const scripts = injectedScripts();
    expect(scripts).toHaveLength(1);
    const script = scripts[0]!;
    expect(script.async).toBe(true);
    expect(script.src).toBe(SDK_URL);
    expect(script.getAttribute(MANUAL_CONTROL_ATTRIBUTE)).toBe('manual');

    expect(window.PREFERRED_SOURCE).toHaveLength(1);
    const spy: GooglePreferredSource = { init: vi.fn(), addPreferredSource: vi.fn() };
    drainQueue(spy);
    expect(spy.init).toHaveBeenCalledTimes(1);
    expect(spy.init).toHaveBeenCalledWith({ theme: 'dark', lang: 'de' });
  });

  it('dedupes: concurrent and later calls share one promise and one script element', () => {
    const first = loadSdk();
    const second = loadSdk();
    const later = loadSdk({ theme: 'dark' });
    expect(second).toBe(first);
    expect(later).toBe(first);
    expect(injectedScripts()).toHaveLength(1);
  });

  it('adopts a pre-existing publisher script and reports its effective mode', async () => {
    const existing = document.createElement('script');
    existing.src = SDK_URL;
    existing.async = true;
    document.head.appendChild(existing);

    const promise = loadSdk({ mode: 'manual', timeoutMs: 0 });
    expect(injectedScripts()).toHaveLength(1);

    existing.dispatchEvent(new Event('load'));
    const result = await promise;
    expect(result.status).toBe('ready');
    // No manual attribute on the adopted script → effective mode is 'auto'.
    expect(result.mode).toBe('auto');
    existing.remove();
  });

  it('settles blocked on the script error event', async () => {
    const promise = loadSdk({ timeoutMs: 0 });
    injectedScripts()[0]!.dispatchEvent(new Event('error'));
    await expect(promise).resolves.toEqual({ status: 'blocked', mode: 'manual' });
    expect(getSdkStatus()).toBe('blocked');
  });

  it('settles blocked when timeoutMs elapses, then upgrades live status on a late load', async () => {
    vi.useFakeTimers();
    const promise = loadSdk({ timeoutMs: 5000 });
    vi.advanceTimersByTime(5001);
    await expect(promise).resolves.toEqual({ status: 'blocked', mode: 'manual' });
    expect(getSdkStatus()).toBe('blocked');

    injectedScripts()[0]!.dispatchEvent(new Event('load'));
    expect(getSdkStatus()).toBe('ready');
  });

  it('propagates a CSP nonce onto the injected script', () => {
    void loadSdk({ nonce: 'abc123' });
    expect(injectedScripts()[0]!.getAttribute('nonce')).toBe('abc123');
  });
});
