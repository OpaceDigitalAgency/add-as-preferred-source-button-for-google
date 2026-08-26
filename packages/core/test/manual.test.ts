import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initPreferredSource,
  loadSdk,
  openPreferredSourceDialog,
  resetSdkLoaderForTests,
} from '../src/index';
import type { GooglePreferredSource } from '../src/index';

function drainQueue(spy: GooglePreferredSource): void {
  const queue = window.PREFERRED_SOURCE ?? [];
  while (queue.length > 0) queue.shift()?.(spy);
}

beforeEach(() => {
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

afterEach(() => {
  vi.restoreAllMocks();
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

describe('initPreferredSource', () => {
  it('creates the queue when absent', () => {
    initPreferredSource({ theme: 'dark' });
    expect(window.PREFERRED_SOURCE).toHaveLength(1);
    const spy: GooglePreferredSource = { init: vi.fn(), addPreferredSource: vi.fn() };
    drainQueue(spy);
    expect(spy.init).toHaveBeenCalledWith({ theme: 'dark' });
  });

  it('pushes onto an existing queue without clobbering it', () => {
    const marker = vi.fn();
    window.PREFERRED_SOURCE = [marker];
    initPreferredSource({ lang: 'en' });
    expect(window.PREFERRED_SOURCE).toHaveLength(2);
    expect(window.PREFERRED_SOURCE[0]).toBe(marker);
  });
});

describe('openPreferredSourceDialog', () => {
  it("queues addPreferredSource and resolves 'popup' when the SDK is ready", async () => {
    const promise = loadSdk({ timeoutMs: 0 });
    document
      .querySelector('script[src^="https://news.google.com/swg/js/v1/publisher"]')!
      .dispatchEvent(new Event('load'));
    await promise;

    const outcome = await openPreferredSourceDialog();
    expect(outcome).toBe('popup');

    const spy: GooglePreferredSource = { init: vi.fn(), addPreferredSource: vi.fn() };
    drainQueue(spy);
    expect(spy.addPreferredSource).toHaveBeenCalledTimes(1);
  });

  it("opens the deeplink when the SDK is blocked and resolves 'deeplink'", async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const promise = loadSdk({ timeoutMs: 0 });
    document
      .querySelector('script[src^="https://news.google.com/swg/js/v1/publisher"]')!
      .dispatchEvent(new Event('error'));
    await promise;

    const outcome = await openPreferredSourceDialog({ domain: 'example.com' });
    expect(outcome).toBe('deeplink');
    expect(open).toHaveBeenCalledWith(
      'https://www.google.com/preferences/source?q=example.com',
      '_blank',
      'noopener',
    );
  });

  it('waits for a loading SDK, then triggers the popup once it is ready', async () => {
    // Intercept insertion so happy-dom does not fire its synchronous error
    // for the (deliberately unfetchable) external script.
    let script: HTMLScriptElement | null = null;
    const appendSpy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementation((node) => {
        script = node as HTMLScriptElement;
        return node;
      });

    void loadSdk({ timeoutMs: 0 });
    const dialogPromise = openPreferredSourceDialog({ timeoutMs: 1000 });
    script!.dispatchEvent(new Event('load'));
    await expect(dialogPromise).resolves.toBe('popup');
    appendSpy.mockRestore();
  });

  it("resolves 'none' when blocked and fallbackToDeeplink is false", async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const promise = loadSdk({ timeoutMs: 0 });
    document
      .querySelector('script[src^="https://news.google.com/swg/js/v1/publisher"]')!
      .dispatchEvent(new Event('error'));
    await promise;

    const outcome = await openPreferredSourceDialog({ fallbackToDeeplink: false });
    expect(outcome).toBe('none');
    expect(open).not.toHaveBeenCalled();
  });
});
