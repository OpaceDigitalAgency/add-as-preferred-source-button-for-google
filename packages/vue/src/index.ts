import type { App, Plugin } from 'vue';
import { onMounted, ref } from 'vue';
import {
  buildDeeplink,
  getSdkStatus,
  isBrowser,
  loadSdk,
  openPreferredSourceDialog,
} from '@opacedev/preferred-source-core';
import type {
  OpenOutcome,
  PreferredSourceInitOptions,
  SdkStatus,
} from '@opacedev/preferred-source-core';
import PreferredSourceButton from './PreferredSourceButton.vue';

export { PreferredSourceButton };

export interface UsePreferredSourceOptions extends PreferredSourceInitOptions {
  domain?: string;
  timeoutMs?: number;
}

/** Composable mirroring the React hook: loads the SDK (manual mode) on mount. */
export function usePreferredSource(options: UsePreferredSourceOptions = {}) {
  const status = ref<SdkStatus>('idle');
  const deeplink = ref('');

  onMounted(() => {
    status.value = 'loading';
    void loadSdk({ mode: 'manual', theme: options.theme, lang: options.lang, timeoutMs: options.timeoutMs }).then(
      () => {
        status.value = getSdkStatus();
      },
    );
    if (isBrowser()) {
      try {
        deeplink.value = buildDeeplink(options.domain);
      } catch {
        deeplink.value = '';
      }
    }
  });

  const open = (): Promise<OpenOutcome> =>
    openPreferredSourceDialog({
      theme: options.theme,
      lang: options.lang,
      domain: options.domain,
      timeoutMs: options.timeoutMs,
    });

  return { status, deeplink, open };
}

/** app.use(PreferredSourcePlugin) registers <PreferredSourceButton> globally. */
export const PreferredSourcePlugin: Plugin = {
  install(app: App) {
    app.component('PreferredSourceButton', PreferredSourceButton);
  },
};
