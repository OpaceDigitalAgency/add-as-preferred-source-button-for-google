/**
 * Minimal structural types for the Astro hooks this integration uses.
 * Kept local so the package needs no astro devDependency to typecheck;
 * they match the shapes Astro 4–7 pass to `astro:config:setup`.
 */
export interface AstroIntegrationLogger {
  warn(message: string): void;
  info(message: string): void;
}

export interface AstroConfigSetupParams {
  injectScript(stage: 'head-inline' | 'before-hydration' | 'page' | 'page-ssr', content: string): void;
  logger: AstroIntegrationLogger;
}

export interface AstroIntegration {
  name: string;
  hooks: {
    'astro:config:setup'?: (params: AstroConfigSetupParams) => void | Promise<void>;
  };
}

export interface PreferredSourceIntegrationOptions {
  /** Button/popup theme. Default 'light'. */
  theme?: 'light' | 'dark';
  /** ISO language code. Default unset (browser language). */
  lang?: string;
  /** Default 'auto' — a site-wide script suits static sites. */
  mode?: 'auto' | 'manual';
  /**
   * Inject the SDK script site-wide. Default true. Set false to only load
   * when a component mounts (components always self-load via core).
   */
  injectScript?: boolean;
}
