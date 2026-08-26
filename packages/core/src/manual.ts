import { DEFAULT_TIMEOUT_MS } from './constants';
import { buildDeeplink } from './deeplink';
import { isBrowser } from './environment';
import { getLoadPromise, getSdkStatus } from './loader';
import type { OpenDialogOptions, OpenOutcome, PreferredSourceInitOptions } from './types';

/**
 * Queue a preferredSource.init({theme, lang}) command (manual mode).
 * Safe before, during, or after SDK load — uses the documented command queue:
 * (self.PREFERRED_SOURCE = self.PREFERRED_SOURCE || []).push(fn).
 * SSR: no-op. Does NOT load the script; call loadSdk() for that (loadSdk with
 * mode 'manual' already calls this internally).
 */
export function initPreferredSource(options: PreferredSourceInitOptions = {}): void {
  if (!isBrowser()) return;
  const init: PreferredSourceInitOptions = {};
  if (options.theme !== undefined) init.theme = options.theme;
  if (options.lang !== undefined) init.lang = options.lang;
  (window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || []).push((preferredSource) => {
    preferredSource.init(init);
  });
}

function triggerPopup(): void {
  (window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || []).push((preferredSource) => {
    preferredSource.addPreferredSource();
  });
}

function openDeeplinkFallback(options: OpenDialogOptions): OpenOutcome {
  if (options.fallbackToDeeplink === false || !isBrowser()) return 'none';
  window.open(buildDeeplink(options.domain), '_blank', 'noopener');
  return 'deeplink';
}

/**
 * Open the add-preferred-source flow.
 * 1. If status is 'ready' (manual mode): queue a command invoking
 *    preferredSource.addPreferredSource() → resolves 'popup'.
 * 2. If 'loading': wait up to timeoutMs for the load promise; then as (1)/(3).
 * 3. If 'blocked', 'idle', or 'unsupported': when fallbackToDeeplink !== false
 *    and we are in a browser, window.open(buildDeeplink(domain), '_blank',
 *    'noopener') → resolves 'deeplink'. Otherwise resolves 'none'.
 * Never rejects. Call this synchronously inside a user click handler where
 * possible so the popup/deeplink is not popup-blocked; when the status is
 * already settled the window.open happens in the same task as the click.
 *
 * HONEST LIMITATION: 'popup' means the flow was TRIGGERED. Google's SDK
 * provides no callback, promise, or event confirming the user completed the
 * add. Never present this result as a conversion.
 */
export async function openPreferredSourceDialog(options: OpenDialogOptions = {}): Promise<OpenOutcome> {
  if (options.theme !== undefined || options.lang !== undefined) {
    initPreferredSource({ theme: options.theme, lang: options.lang });
  }

  const status = getSdkStatus();

  if (status === 'ready') {
    triggerPopup();
    return 'popup';
  }

  if (status === 'loading') {
    const loadPromise = getLoadPromise();
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    if (loadPromise) {
      await Promise.race([
        loadPromise,
        new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
      ]);
    }
    if (getSdkStatus() === 'ready') {
      triggerPopup();
      return 'popup';
    }
  }

  return openDeeplinkFallback(options);
}
