import {
  DEFAULT_RENDER_TIMEOUT_MS,
  applyAutoAttributes,
  buildDeeplink,
  emitPsClick,
  initPreferredSource,
  isBrowser,
  loadSdk,
  normaliseDomain,
  openPreferredSourceDialog,
  watchAutoRenderAfterLoad,
} from '@opace/preferred-source-core';
import type {
  PreferredSourceTheme,
  PsClickDetail,
  SdkMode,
} from '@opace/preferred-source-core';
import { styles } from './styles';

const DEFAULT_LABEL = 'Add as a preferred source on Google';

type RenderState = 'auto' | 'trigger' | 'fallback';
type FallbackReason = 'blocked' | 'timeout' | 'no-render';

/** In-house four-colour circle "G" mark. Not a copy of any Google asset file. */
const ICON_SVG = `<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2a10 10 0 0 1 7.07 2.93l-2.83 2.83A6 6 0 0 0 12 6V2Z" fill="#EA4335"></path>
  <path d="M22 12a10 10 0 0 0-2.93-7.07l-2.83 2.83A6 6 0 0 1 18 12h4Z" fill="#4285F4"></path>
  <path d="M12 22a10 10 0 0 0 7.07-2.93l-2.83-2.83A6 6 0 0 1 12 18v4Z" fill="#34A853"></path>
  <path d="M2 12a10 10 0 0 0 2.93 7.07l2.83-2.83A6 6 0 0 1 6 12H2Z" fill="#FBBC05"></path>
  <path d="M2 12a10 10 0 0 1 2.93-7.07l2.83 2.83A6 6 0 0 0 6 12H2Z" fill="#EA4335"></path>
  <rect x="12" y="10.75" width="7" height="2.5" fill="#4285F4"></rect>
</svg>`;

/**
 * SSR-safe base: in Node there is no HTMLElement, but the class must still be
 * importable (it is only defined/constructed in the browser via register.ts).
 */
const BaseElement = (
  typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as unknown)
) as typeof HTMLElement;

/**
 * <preferred-source-button> — Google's Preferred Sources trigger as a web
 * component. Manual mode by default (own trigger + SDK command queue), auto
 * mode on request, deeplink fallback when the SDK is blocked.
 */
export class PreferredSourceButton extends BaseElement {
  static get observedAttributes(): string[] {
    return ['theme', 'lang', 'mode', 'label', 'href-fallback', 'variant', 'domain', 'disabled', 'render-timeout'];
  }

  #state: RenderState = 'trigger';
  #connectedOnce = false;
  #autoDiv: HTMLDivElement | null = null;
  #listenerBound = false;

  get theme(): PreferredSourceTheme {
    return this.getAttribute('theme') === 'dark' ? 'dark' : 'light';
  }
  set theme(value: PreferredSourceTheme) {
    this.setAttribute('theme', value);
  }

  get mode(): SdkMode {
    return this.getAttribute('mode') === 'auto' ? 'auto' : 'manual';
  }
  set mode(value: SdkMode) {
    this.setAttribute('mode', value);
  }

  get label(): string {
    return this.getAttribute('label') ?? DEFAULT_LABEL;
  }
  set label(value: string) {
    this.setAttribute('label', value);
  }

  get hrefFallback(): string | null {
    return this.getAttribute('href-fallback');
  }
  set hrefFallback(value: string | null) {
    if (value === null) this.removeAttribute('href-fallback');
    else this.setAttribute('href-fallback', value);
  }

  get variant(): 'google-default' | 'google-colours' | 'neutral' {
    const value = this.getAttribute('variant');
    return value === 'google-colours' || value === 'neutral' ? value : 'google-default';
  }
  set variant(value: 'google-default' | 'google-colours' | 'neutral') {
    this.setAttribute('variant', value);
  }

  get domain(): string {
    const explicit = this.getAttribute('domain');
    if (explicit) {
      try {
        return normaliseDomain(explicit);
      } catch {
        /* fall through to hostname */
      }
    }
    return isBrowser() ? location.hostname : '';
  }
  set domain(value: string) {
    this.setAttribute('domain', value);
  }

  /**
   * Auto mode only: milliseconds Google gets after a successful SDK load to
   * paint into the container before the deeplink fallback takes over
   * (reason 'no-render'). Default 4000.
   */
  get renderTimeout(): number {
    const raw = Number(this.getAttribute('render-timeout'));
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_RENDER_TIMEOUT_MS;
  }
  set renderTimeout(value: number) {
    this.setAttribute('render-timeout', String(value));
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  connectedCallback(): void {
    if (!this.isConnected || !isBrowser()) return;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open', delegatesFocus: true });
    }
    if (!this.#listenerBound) {
      this.shadowRoot!.addEventListener('click', (event) => this.#onClick(event));
      this.#listenerBound = true;
    }
    if (this.#connectedOnce) {
      this.#render();
      return;
    }
    this.#connectedOnce = true;

    if (this.mode === 'auto' && this.variant === 'google-default') {
      this.#startAuto();
    } else {
      this.#startManual();
    }
  }

  disconnectedCallback(): void {
    // watchAutoRender disconnects its own observer on settle; nothing else persists.
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (!this.#connectedOnce || oldValue === newValue) return;
    if ((name === 'theme' || name === 'lang') && this.mode === 'manual') {
      initPreferredSource({ theme: this.theme, lang: this.getAttribute('lang') ?? undefined });
    }
    this.#render();
  }

  #startManual(): void {
    this.#state = 'trigger';
    this.#render();
    void loadSdk({
      mode: 'manual',
      theme: this.theme,
      lang: this.getAttribute('lang') ?? undefined,
    }).then((result) => {
      if (result.status === 'ready') {
        this.#emit('ps-ready', { mode: result.mode });
      } else if (result.status === 'blocked') {
        this.#toFallback('blocked');
      }
    });
  }

  #startAuto(): void {
    this.#state = 'auto';
    // Google's scanner may not traverse shadow roots, so the attributed div
    // lives in the light DOM and is slotted into the shadow markup.
    const div = document.createElement('div');
    div.setAttribute('slot', 'google');
    applyAutoAttributes(div, {
      theme: this.theme,
      lang: this.getAttribute('lang') ?? undefined,
    });
    this.appendChild(div);
    this.#autoDiv = div;
    this.#render();

    // watchAutoRenderAfterLoad triggers the (idempotent) auto-mode load, waits
    // for the script to settle, then gives Google renderTimeout ms to paint.
    // The SDK loads happily on unrecognised origins and silently renders
    // nothing, so a load-failure check alone would leave the box empty forever.
    void watchAutoRenderAfterLoad(div, { timeoutMs: this.renderTimeout }).then((outcome) => {
      if (this.#state !== 'auto') return;
      if (outcome === 'blocked') {
        this.#toFallback('blocked');
      } else if (outcome === 'no-render') {
        this.#toFallback('no-render');
      }
    });
  }

  #toFallback(reason: FallbackReason): void {
    this.#state = 'fallback';
    if (this.#autoDiv) {
      this.#autoDiv.remove();
      this.#autoDiv = null;
    }
    this.#render();
    this.#emit('ps-fallback', { reason });
  }

  #fallbackHref(): string {
    if (this.hrefFallback) return this.hrefFallback;
    try {
      return buildDeeplink(this.domain);
    } catch {
      return '';
    }
  }

  #onClick(event: Event): void {
    const target = event.target as Element | null;
    if (!target?.closest('button.btn')) return;
    if (this.disabled) return;

    const lang = this.getAttribute('lang') ?? undefined;
    const detail: PsClickDetail = {
      outcome: 'pending',
      mode: this.mode,
      theme: this.theme,
      lang,
      domain: this.domain,
    };
    emitPsClick(this, detail);

    const hrefOverride = this.hrefFallback;
    void openPreferredSourceDialog({
      theme: this.theme,
      lang,
      domain: this.domain,
      fallbackToDeeplink: hrefOverride === null,
    }).then((outcome) => {
      if (outcome === 'none' && hrefOverride !== null) {
        window.open(hrefOverride, '_blank', 'noopener');
        outcome = 'deeplink';
      }
      if (outcome === 'deeplink') {
        // Subsequent clicks become plain anchor navigations.
        this.#state = 'fallback';
        this.#render();
      }
    });
  }

  #emit(name: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  #render(): void {
    const root = this.shadowRoot;
    if (!root) return;
    const themeClass = this.theme === 'dark' ? 'theme-dark' : 'theme-light';

    let inner: string;
    if (this.#state === 'auto') {
      inner = `<div part="container" class="container ${themeClass}">
        <div class="google-slot"><slot name="google"></slot></div>
      </div>`;
    } else if (this.#state === 'fallback') {
      inner = `<div part="container" class="container ${themeClass}">
        <a part="fallback" class="btn fallback variant-${this.variant}" href="${escapeAttr(this.#fallbackHref())}"
           target="_blank" rel="noopener noreferrer">
          <span class="label"><slot>${escapeHtml(this.label)}</slot></span>
        </a>
      </div>`;
    } else {
      inner = `<div part="container" class="container ${themeClass}">
        <button part="button" class="btn variant-${this.variant}" type="button"${this.disabled ? ' disabled' : ''}>
          ${ICON_SVG}
          <span class="label"><slot>${escapeHtml(this.label)}</slot></span>
        </button>
      </div>`;
    }

    root.innerHTML = `<style>${styles}</style>${inner}`;

    // Mirror the label as the accessible name when no slotted text overrides it.
    if (this.#state !== 'auto' && !(this.textContent ?? '').trim()) {
      this.setAttribute('aria-label', this.label);
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;');
}
