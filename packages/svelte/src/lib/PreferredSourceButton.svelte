<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    buildDeeplink,
    emitPsClick,
    getSdkStatus,
    isBrowser,
    loadSdk,
    openPreferredSourceDialog,
    watchAutoRenderAfterLoad,
  } from '@opace/preferred-source-core';
  import type {
    PreferredSourceTheme,
    PsClickDetail,
    SdkMode,
    SdkStatus,
  } from '@opace/preferred-source-core';

  export let theme: PreferredSourceTheme = 'light';
  export let lang: string | undefined = undefined;
  export let mode: SdkMode = 'manual';
  export let label = 'Add as a preferred source on Google';
  export let variant: 'google-default' | 'google-colours' | 'neutral' = 'google-default';
  export let domain: string | undefined = undefined;
  export let hrefFallback: string | undefined = undefined;
  /** Auto mode only: ms Google gets after SDK load to paint before the deeplink fallback. Default 4000. */
  export let renderTimeoutMs: number | undefined = undefined;

  const dispatch = createEventDispatcher<{
    'ps-click': PsClickDetail;
    'ps-fallback': { reason: 'blocked' | 'no-render' };
  }>();

  let status: SdkStatus = 'idle';
  let deeplink = '';
  let buttonEl: HTMLButtonElement | null = null;
  let autoEl: HTMLDivElement | null = null;
  let autoFallback: 'blocked' | 'no-render' | null = null;

  onMount(() => {
    try {
      deeplink = hrefFallback ?? buildDeeplink(domain);
    } catch {
      deeplink = '';
    }
    if (mode === 'manual') {
      status = 'loading';
      void loadSdk({ mode: 'manual', theme, lang }).then(() => {
        status = getSdkStatus();
      });
    } else if (autoEl) {
      // The SDK loads fine on unrecognised origins and silently paints
      // nothing, so watch the container and swap to the deeplink on non-render.
      const el = autoEl;
      void watchAutoRenderAfterLoad(el, { timeoutMs: renderTimeoutMs }).then((outcome) => {
        if (outcome !== 'blocked' && outcome !== 'no-render') return;
        el.dispatchEvent(
          new CustomEvent('ps-fallback', { bubbles: true, composed: true, detail: { reason: outcome } }),
        );
        dispatch('ps-fallback', { reason: outcome });
        autoFallback = outcome;
      });
    }
  });

  function onClick(): void {
    const detail: PsClickDetail = {
      outcome: 'pending',
      mode,
      theme,
      lang,
      domain: domain ?? (isBrowser() ? location.hostname : ''),
    };
    if (buttonEl) emitPsClick(buttonEl, detail);
    dispatch('ps-click', detail);
    void openPreferredSourceDialog({ theme, lang, domain }).then((outcome) => {
      if (outcome === 'deeplink') status = 'blocked';
    });
  }
</script>

{#if mode === 'auto' && autoFallback === null}
  <div bind:this={autoEl} google-add-preferred-source-btn data-theme={theme} data-lang={lang}></div>
{:else if status === 'blocked' || autoFallback !== null}
  <a
    class={`opace-ps-btn opace-ps-btn--${variant} opace-ps-theme-${theme} ${$$props.class ?? ''}`}
    href={deeplink}
    target="_blank"
    rel="noopener noreferrer"
    data-ps-fallback=""
  >
    <slot>{label}</slot>
  </a>
{:else}
  <button
    bind:this={buttonEl}
    type="button"
    class={`opace-ps-btn opace-ps-btn--${variant} opace-ps-theme-${theme} ${$$props.class ?? ''}`}
    on:click={onClick}
  >
    <slot>{label}</slot>
  </button>
{/if}

<style>
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
