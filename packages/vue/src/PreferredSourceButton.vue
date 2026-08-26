<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  buildDeeplink,
  emitPsClick,
  getSdkStatus,
  isBrowser,
  loadSdk,
  openPreferredSourceDialog,
  watchAutoRenderAfterLoad,
} from '@opace/preferred-source-core';
import type { PreferredSourceTheme, PsClickDetail, SdkMode, SdkStatus } from '@opace/preferred-source-core';

const props = withDefaults(
  defineProps<{
    theme?: PreferredSourceTheme;
    lang?: string;
    mode?: SdkMode;
    label?: string;
    variant?: 'google-default' | 'google-colours' | 'neutral';
    domain?: string;
    hrefFallback?: string;
    /** Auto mode only: ms Google gets after SDK load to paint before the deeplink fallback. Default 4000. */
    renderTimeoutMs?: number;
  }>(),
  {
    theme: 'light',
    mode: 'manual',
    label: 'Add as a preferred source on Google',
    variant: 'google-default',
  },
);

const emit = defineEmits<{
  (event: 'ps-click', detail: PsClickDetail): void;
  (event: 'ps-fallback', detail: { reason: 'blocked' | 'no-render' }): void;
}>();

const status = ref<SdkStatus>('idle');
const deeplink = ref('');
const root = ref<HTMLElement | null>(null);
const autoEl = ref<HTMLElement | null>(null);
const autoFallback = ref<'blocked' | 'no-render' | null>(null);

onMounted(() => {
  try {
    deeplink.value = props.hrefFallback ?? buildDeeplink(props.domain);
  } catch {
    deeplink.value = '';
  }
  if (props.mode === 'manual') {
    status.value = 'loading';
    void loadSdk({ mode: 'manual', theme: props.theme, lang: props.lang }).then(() => {
      status.value = getSdkStatus();
    });
  } else if (autoEl.value) {
    // The SDK loads fine on unrecognised origins and silently paints nothing,
    // so watch the container itself and swap to the deeplink on non-render.
    const el = autoEl.value;
    void watchAutoRenderAfterLoad(el, { timeoutMs: props.renderTimeoutMs }).then((outcome) => {
      if (outcome !== 'blocked' && outcome !== 'no-render') return;
      el.dispatchEvent(
        new CustomEvent('ps-fallback', { bubbles: true, composed: true, detail: { reason: outcome } }),
      );
      emit('ps-fallback', { reason: outcome });
      autoFallback.value = outcome;
    });
  }
});

const classes = computed(() => ['opace-ps-btn', `opace-ps-btn--${props.variant}`, `opace-ps-theme-${props.theme}`]);

function onClick(): void {
  const detail: PsClickDetail = {
    outcome: 'pending',
    mode: props.mode,
    theme: props.theme,
    lang: props.lang,
    domain: props.domain ?? (isBrowser() ? location.hostname : ''),
  };
  if (root.value) emitPsClick(root.value, detail);
  emit('ps-click', detail);
  void openPreferredSourceDialog({
    theme: props.theme,
    lang: props.lang,
    domain: props.domain,
  }).then((outcome) => {
    if (outcome === 'deeplink') status.value = 'blocked';
  });
}
</script>

<template>
  <div
    v-if="props.mode === 'auto' && autoFallback === null"
    ref="autoEl"
    google-add-preferred-source-btn
    :data-theme="props.theme"
    :data-lang="props.lang"
  />
  <a
    v-else-if="status === 'blocked' || autoFallback !== null"
    :class="classes"
    :href="deeplink"
    target="_blank"
    rel="noopener noreferrer"
    data-ps-fallback=""
  >
    <slot>{{ props.label }}</slot>
  </a>
  <button v-else ref="root" type="button" :class="classes" @click="onClick">
    <slot>{{ props.label }}</slot>
  </button>
</template>

<style scoped>
.opace-ps-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
  font-family: Roboto, system-ui, -apple-system, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.55em 1.1em;
  line-height: 1.2;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.opace-ps-btn:focus-visible {
  outline: 2px solid #4285f4;
  outline-offset: 2px;
}
.opace-ps-btn--google-default {
  background: #ffffff;
  color: #1f1f1f;
  border: 1px solid #dadce0;
  border-radius: 4px;
}
.opace-ps-btn--google-default.opace-ps-theme-dark {
  background: #202124;
  color: #e8eaed;
  border-color: #5f6368;
}
.opace-ps-btn--google-colours {
  background: #4285f4;
  color: #ffffff;
  border: none;
  border-radius: 9999px;
}
.opace-ps-btn--google-colours:hover,
.opace-ps-btn--google-colours:focus-visible {
  background: #34a853;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}
.opace-ps-btn--neutral {
  background: transparent;
  color: inherit;
  border: 1px solid currentColor;
  border-radius: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .opace-ps-btn {
    transition: background-color 0.2s ease;
  }
  .opace-ps-btn--google-colours:hover,
  .opace-ps-btn--google-colours:focus-visible {
    transform: none;
    box-shadow: none;
  }
}
</style>
