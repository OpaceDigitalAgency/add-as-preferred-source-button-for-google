'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { emitPsClick, isBrowser, watchAutoRenderAfterLoad } from '@opacedev/preferred-source-core';
import type { PreferredSourceTheme, PsClickDetail, SdkMode } from '@opacedev/preferred-source-core';
import { usePreferredSource } from './usePreferredSource';

const DEFAULT_LABEL = 'Add as a preferred source on Google';
const STYLE_TAG_ID = 'opace-ps-react-styles';

export type PreferredSourceVariant = 'google-default' | 'google-colours' | 'neutral';
export type PreferredSourceFallbackReason = 'blocked' | 'no-render';

export interface PreferredSourceButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  theme?: PreferredSourceTheme;
  lang?: string;
  mode?: SdkMode;
  label?: string;
  variant?: PreferredSourceVariant;
  domain?: string;
  hrefFallback?: string;
  /**
   * Auto mode only: ms Google gets after a successful SDK load to paint into
   * the container before the deeplink fallback takes over. Default 4000.
   */
  renderTimeoutMs?: number;
  /** Fired when the trigger is clicked. Reports the click, never a completed add. */
  onPsClick?: (detail: PsClickDetail) => void;
  /** Fired when the component swaps to the deeplink fallback. */
  onPsFallback?: (detail: { reason: PreferredSourceFallbackReason }) => void;
  children?: ReactNode;
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5em',
  boxSizing: 'border-box',
  cursor: 'pointer',
  textDecoration: 'none',
  fontFamily: 'Roboto, system-ui, -apple-system, sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '0.55em 1.1em',
  lineHeight: 1.2,
};

function variantStyle(variant: PreferredSourceVariant, theme: PreferredSourceTheme): CSSProperties {
  if (variant === 'google-colours') {
    return { background: '#4285F4', color: '#ffffff', border: 'none', borderRadius: 9999 };
  }
  if (variant === 'neutral') {
    return { background: 'transparent', color: 'inherit', border: '1px solid currentColor', borderRadius: 4 };
  }
  return theme === 'dark'
    ? { background: '#202124', color: '#e8eaed', border: '1px solid #5f6368', borderRadius: 4 }
    : { background: '#ffffff', color: '#1f1f1f', border: '1px solid #dadce0', borderRadius: 4 };
}

/** Hover/focus rules cannot live in inline styles; inject one deduped tag. */
const hoverCss = `
.opace-ps-btn { transition: background-color .2s ease, transform .2s ease, box-shadow .2s ease; }
.opace-ps-btn:focus-visible { outline: 2px solid #4285F4; outline-offset: 2px; }
.opace-ps-btn--google-colours:hover:not(:disabled),
.opace-ps-btn--google-colours:focus-visible {
  background: #34A853 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,.18);
}
@media (prefers-reduced-motion: reduce) {
  .opace-ps-btn { transition: background-color .2s ease; }
  .opace-ps-btn--google-colours:hover:not(:disabled),
  .opace-ps-btn--google-colours:focus-visible { transform: none; box-shadow: none; }
}
`;

function ensureStyles(): void {
  if (!isBrowser() || document.getElementById(STYLE_TAG_ID)) return;
  const tag = document.createElement('style');
  tag.id = STYLE_TAG_ID;
  tag.textContent = hoverCss;
  document.head.appendChild(tag);
}

/**
 * Google Preferred Sources trigger for React. Manual mode by default: styled
 * button + SDK command queue, with a deeplink anchor fallback when the SDK is
 * blocked. Auto mode renders the attributed div and watches it: if Google's
 * script loads but paints nothing within renderTimeoutMs (it declines
 * silently on unrecognised origins), the deeplink fallback takes over.
 * Client component ('use client' baked in).
 */
export function PreferredSourceButton({
  theme = 'light',
  lang,
  mode = 'manual',
  label = DEFAULT_LABEL,
  variant = 'google-default',
  domain,
  hrefFallback,
  renderTimeoutMs,
  onPsClick,
  onPsFallback,
  children,
  className,
  style,
  disabled,
  ...rest
}: PreferredSourceButtonProps): ReactNode {
  const { status, open, deeplink } = usePreferredSource({ theme, lang, domain, mode });
  const autoRef = useRef<HTMLDivElement | null>(null);
  const [autoFallback, setAutoFallback] = useState<PreferredSourceFallbackReason | null>(null);

  useEffect(() => {
    ensureStyles();
  }, []);

  useEffect(() => {
    if (mode !== 'auto') return;
    const el = autoRef.current;
    if (!el) return;
    let cancelled = false;
    void watchAutoRenderAfterLoad(el, { timeoutMs: renderTimeoutMs }).then((outcome) => {
      if (cancelled || (outcome !== 'blocked' && outcome !== 'no-render')) return;
      // Emit the bubbling DOM event before React swaps the markup.
      el.dispatchEvent(
        new CustomEvent('ps-fallback', { bubbles: true, composed: true, detail: { reason: outcome } }),
      );
      onPsFallback?.({ reason: outcome });
      setAutoFallback(outcome);
    });
    return () => {
      cancelled = true;
    };
    // onPsFallback deliberately excluded from deps: the watch must run once per mount.
  }, [mode, renderTimeoutMs]);

  const handleClick = useCallback(
    (event: { currentTarget: EventTarget & HTMLElement }) => {
      if (disabled) return;
      const detail: PsClickDetail = {
        outcome: 'pending',
        mode,
        theme,
        lang,
        domain: domain ?? (isBrowser() ? location.hostname : ''),
      };
      emitPsClick(event.currentTarget, detail);
      onPsClick?.(detail);
      void open();
    },
    [disabled, mode, theme, lang, domain, onPsClick, open],
  );

  const mergedStyle: CSSProperties = { ...baseStyle, ...variantStyle(variant, theme), ...style };
  const classes = ['opace-ps-btn', `opace-ps-btn--${variant}`, className].filter(Boolean).join(' ');

  if (mode === 'auto' && autoFallback === null) {
    // Server-renderable attributed div; the SDK script must be on the page
    // before this markup for Google's documented scan to find it.
    const autoProps: Record<string, string> = { 'google-add-preferred-source-btn': '' };
    if (theme) autoProps['data-theme'] = theme;
    if (lang) autoProps['data-lang'] = lang;
    return <div ref={autoRef} className={className} {...autoProps} />;
  }

  if (status === 'blocked' || autoFallback !== null) {
    const href = hrefFallback ?? deeplink;
    return (
      <a
        className={classes}
        style={mergedStyle}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-ps-fallback=""
      >
        {children ?? label}
      </a>
    );
  }

  return (
    <button type="button" className={classes} style={mergedStyle} onClick={handleClick} disabled={disabled} {...rest}>
      {children ?? label}
    </button>
  );
}
