/**
 * True when running in a browser with a usable DOM.
 * Every side-effectful core function is a safe no-op when this is false,
 * so the package can be imported freely in Node/SSR bundles.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
