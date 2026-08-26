export type PreferredSourceTheme = 'light' | 'dark';

/** Options accepted by Google's preferredSource.init(). Nothing else exists. */
export interface PreferredSourceInitOptions {
  /** Button/popup theme. Google's default is 'light'. */
  theme?: PreferredSourceTheme;
  /** ISO language code overriding the browser language (e.g. 'en', 'de'). */
  lang?: string;
}

export type SdkMode = 'auto' | 'manual';

export type SdkStatus =
  | 'idle' // loadSdk() not yet called in this document
  | 'loading' // script inserted, neither load nor error yet
  | 'ready' // script onload fired (manual mode: init() has been queued)
  | 'blocked' // script onerror fired or timeout elapsed (ad blocker, consent blocker, offline)
  | 'unsupported'; // not a browser (SSR) — permanent no-op

export interface LoadSdkOptions extends PreferredSourceInitOptions {
  /**
   * 'manual' (default) suppresses Google's auto-render and enables openPreferredSourceDialog().
   * 'auto' loads the plain script so Google renders into AUTO_ATTRIBUTE elements.
   */
  mode?: SdkMode;
  /** Milliseconds before an unloaded script is declared 'blocked'. Default 5000. 0 disables the timer. */
  timeoutMs?: number;
  /** CSP nonce copied onto the injected <script>. */
  nonce?: string;
  /** Override the script URL (testing only). Default SDK_URL. */
  scriptUrl?: string;
}

export interface SdkLoadResult {
  status: Extract<SdkStatus, 'ready' | 'blocked' | 'unsupported'>;
  mode: SdkMode;
}

/** How an auto-mode container fared once the SDK had its chance to render. */
export type AutoRenderOutcome =
  | 'rendered' // Google injected markup into the container
  | 'no-render' // script loaded but painted nothing within the render timeout
  | 'blocked' // the script itself failed to load or timed out
  | 'unsupported'; // SSR / non-browser

export interface WatchAutoRenderAfterLoadOptions {
  /**
   * Milliseconds Google gets AFTER a successful script load to inject markup
   * before the container is declared 'no-render'. Default DEFAULT_RENDER_TIMEOUT_MS (4000).
   */
  timeoutMs?: number;
}

export type OpenOutcome =
  | 'popup' // SDK ready; preferredSource.addPreferredSource() was invoked
  | 'deeplink' // SDK unavailable; the deeplink was opened in a new tab
  | 'none'; // SDK unavailable and fallback disabled — caller must handle

export interface OpenDialogOptions extends PreferredSourceInitOptions {
  /** Domain for the deeplink fallback. Default: normaliseDomain(location.hostname). */
  domain?: string;
  /** Open the deeplink when the SDK is blocked/unavailable. Default true. */
  fallbackToDeeplink?: boolean;
  /** Milliseconds to wait for a still-loading SDK before falling back. Default DEFAULT_TIMEOUT_MS. */
  timeoutMs?: number;
}

export interface PsClickDetail {
  /** How the click will be (attempted to be) fulfilled at dispatch time. */
  outcome: OpenOutcome | 'pending';
  mode: SdkMode;
  theme: PreferredSourceTheme;
  lang?: string;
  domain: string;
}

export interface FallbackAnchorOptions {
  /** Default: normaliseDomain(location.hostname). */
  domain?: string;
  /** Default: 'Add as a preferred source on Google'. */
  label?: string;
  /** Optional class for host-page styling. */
  className?: string;
  /** Default: '_blank'. */
  target?: '_blank' | '_self';
}

/** The complete documented manual-mode API. Do not add members. */
export interface GooglePreferredSource {
  init(options: PreferredSourceInitOptions): void;
  addPreferredSource(): void;
}

declare global {
  interface Window {
    /** Google's manual-mode command queue. */
    PREFERRED_SOURCE?: Array<(ps: GooglePreferredSource) => void>;
  }
}
