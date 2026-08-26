// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  buildDeeplink,
  getSdkStatus,
  initPreferredSource,
  isBrowser,
  loadSdk,
  openPreferredSourceDialog,
} from '../src/index';

describe('SSR safety (node environment)', () => {
  it('imports without touching any browser global', () => {
    expect(typeof loadSdk).toBe('function');
  });

  it('isBrowser() is false', () => {
    expect(isBrowser()).toBe(false);
  });

  it("loadSdk() resolves { status: 'unsupported' } without touching globals", async () => {
    await expect(loadSdk()).resolves.toEqual({ status: 'unsupported', mode: 'manual' });
    expect(getSdkStatus()).toBe('unsupported');
  });

  it('initPreferredSource() no-ops', () => {
    expect(() => initPreferredSource({ theme: 'dark' })).not.toThrow();
  });

  it("openPreferredSourceDialog() resolves 'none'", async () => {
    await expect(openPreferredSourceDialog()).resolves.toBe('none');
  });

  it('buildDeeplink() throws with no argument and works with one', () => {
    expect(() => buildDeeplink()).toThrow(TypeError);
    expect(buildDeeplink('example.com')).toBe('https://www.google.com/preferences/source?q=example.com');
  });
});
