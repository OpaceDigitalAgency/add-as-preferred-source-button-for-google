import { DEFAULT_TIMEOUT_MS, MANUAL_CONTROL_ATTRIBUTE, SDK_URL } from './constants';
import { isBrowser } from './environment';
import { initPreferredSource } from './manual';
import type { LoadSdkOptions, SdkLoadResult, SdkMode, SdkStatus } from './types';

interface LoaderState {
  status: SdkStatus;
  mode?: SdkMode;
  promise?: Promise<SdkLoadResult>;
  script?: HTMLScriptElement;
  injected: boolean;
  timer?: ReturnType<typeof setTimeout>;
}

const state: LoaderState = { status: 'idle', injected: false };

/** Matches both the .js and .mjs builds, however the host page loaded them. */
const EXISTING_SCRIPT_SELECTOR = 'script[src^="https://news.google.com/swg/js/v1/publisher"]';

/**
 * Idempotently load Google's Preferred Sources SDK.
 *
 * Behaviour:
 * - SSR: resolves immediately to { status: 'unsupported' }. Never touches the DOM.
 * - First browser call: injects `<script async src=SDK_URL>` into <head>.
 *   mode 'manual' (default) also sets preferred-sources-control="manual" on the
 *   script BEFORE insertion and pushes an init command onto
 *   (self.PREFERRED_SOURCE ||= []) so init({theme, lang}) runs as soon as the
 *   SDK drains the queue. mode 'auto' injects the plain script (Google renders
 *   into [google-add-preferred-source-btn] elements).
 * - Dedupe: subsequent calls return the SAME promise regardless of options
 *   (differing theme/lang on later calls are applied via a fresh init() push in
 *   manual mode; in auto mode they are ignored — auto config lives on the
 *   elements). Before injecting, the loader also scans for a pre-existing
 *   publisher script (e.g. added by the site's own template) and adopts it
 *   instead of injecting a duplicate. An adopted script's existing mode
 *   attribute wins over the requested mode; the result's `mode` reports the
 *   effective mode.
 * - Failure: the script 'error' event, or timeoutMs (default 5000) elapsing
 *   before 'load', settles the promise with { status: 'blocked' }. The promise
 *   never rejects. A later successful 'load' after timeout upgrades the internal
 *   status to 'ready' (openPreferredSourceDialog() re-checks live status).
 */
export function loadSdk(options: LoadSdkOptions = {}): Promise<SdkLoadResult> {
  const requestedMode: SdkMode = options.mode ?? 'manual';

  if (!isBrowser()) {
    return Promise.resolve({ status: 'unsupported', mode: requestedMode });
  }

  if (state.promise) {
    // Fresh theme/lang on a later call: re-init through the documented queue.
    if (state.mode === 'manual' && (options.theme !== undefined || options.lang !== undefined)) {
      initPreferredSource({ theme: options.theme, lang: options.lang });
    }
    return state.promise;
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let script = document.querySelector<HTMLScriptElement>(EXISTING_SCRIPT_SELECTOR);
  let mode: SdkMode = requestedMode;

  if (script) {
    // Adopt the page's own script; its attributes decide the effective mode.
    mode = script.getAttribute(MANUAL_CONTROL_ATTRIBUTE) === 'manual' ? 'manual' : 'auto';
    state.injected = false;
  } else {
    script = document.createElement('script');
    script.async = true;
    if (options.nonce) script.setAttribute('nonce', options.nonce);
    if (mode === 'manual') script.setAttribute(MANUAL_CONTROL_ATTRIBUTE, 'manual');
    script.src = options.scriptUrl ?? SDK_URL;
    state.injected = true;
  }

  state.mode = mode;
  state.status = 'loading';
  state.script = script;

  if (mode === 'manual') {
    initPreferredSource({ theme: options.theme, lang: options.lang });
  }

  state.promise = new Promise<SdkLoadResult>((resolve) => {
    let settled = false;
    const settle = (status: 'ready' | 'blocked'): void => {
      if (state.timer !== undefined) {
        clearTimeout(state.timer);
        state.timer = undefined;
      }
      // A late 'load' after a timeout still upgrades the live status.
      if (status === 'ready') {
        state.status = 'ready';
      } else if (!settled) {
        state.status = 'blocked';
      }
      if (settled) return;
      settled = true;
      resolve({ status, mode });
    };

    script.addEventListener('load', () => settle('ready'));
    script.addEventListener('error', () => settle('blocked'));

    if (timeoutMs > 0) {
      state.timer = setTimeout(() => settle('blocked'), timeoutMs);
    }

    if (state.injected && script.parentNode === null) {
      document.head.appendChild(script);
    }
  });

  return state.promise;
}

/** Current live status ('idle' before any loadSdk() call; 'unsupported' in SSR). */
export function getSdkStatus(): SdkStatus {
  if (!isBrowser()) return 'unsupported';
  return state.status;
}

/** Internal: the in-flight load promise, if any. Not part of the public API. */
export function getLoadPromise(): Promise<SdkLoadResult> | undefined {
  return state.promise;
}

/** Test hook: clears the singleton and removes the injected script. Not for production. */
export function resetSdkLoaderForTests(): void {
  if (state.timer !== undefined) clearTimeout(state.timer);
  if (state.injected && state.script?.parentNode) {
    state.script.parentNode.removeChild(state.script);
  }
  state.status = 'idle';
  state.mode = undefined;
  state.promise = undefined;
  state.script = undefined;
  state.timer = undefined;
  state.injected = false;
}
