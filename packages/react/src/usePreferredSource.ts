'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  buildDeeplink,
  getSdkStatus,
  isBrowser,
  loadSdk,
  openPreferredSourceDialog,
} from '@opace/preferred-source-core';
import type {
  OpenOutcome,
  PreferredSourceInitOptions,
  SdkMode,
  SdkStatus,
} from '@opace/preferred-source-core';

export interface UsePreferredSourceOptions extends PreferredSourceInitOptions {
  domain?: string;
  timeoutMs?: number;
  /** 'manual' (default) or 'auto'. Auto loads the plain script so Google can render into attributed elements. */
  mode?: SdkMode;
}

export interface UsePreferredSourceResult {
  /** Live SdkStatus, re-rendered on change ('unsupported' during SSR render). */
  status: SdkStatus;
  /** Trigger the flow; same semantics/limitations as core openPreferredSourceDialog(). */
  open: () => Promise<OpenOutcome>;
  /** The computed deeplink ('' during SSR when domain is not supplied). */
  deeplink: string;
}

/** Loads the SDK (manual mode by default) on mount; never during render. */
export function usePreferredSource(options: UsePreferredSourceOptions = {}): UsePreferredSourceResult {
  const { theme, lang, domain, timeoutMs, mode = 'manual' } = options;
  const [status, setStatus] = useState<SdkStatus>(() =>
    isBrowser() ? getSdkStatus() : 'unsupported',
  );
  const [deeplink, setDeeplink] = useState<string>(() => {
    if (domain) return buildDeeplink(domain);
    return '';
  });

  useEffect(() => {
    let cancelled = false;
    setStatus(getSdkStatus() === 'idle' ? 'loading' : getSdkStatus());
    void loadSdk({ mode, theme, lang, timeoutMs }).then(() => {
      if (!cancelled) setStatus(getSdkStatus());
    });
    if (isBrowser()) {
      try {
        setDeeplink(buildDeeplink(domain));
      } catch {
        setDeeplink('');
      }
    }
    return () => {
      cancelled = true;
    };
  }, [theme, lang, domain, timeoutMs, mode]);

  const open = useCallback(
    () => openPreferredSourceDialog({ theme, lang, domain, timeoutMs }),
    [theme, lang, domain, timeoutMs],
  );

  return { status, open, deeplink };
}
