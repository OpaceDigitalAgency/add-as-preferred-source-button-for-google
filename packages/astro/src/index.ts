import type { AstroIntegration, PreferredSourceIntegrationOptions } from './types';

export type { AstroIntegration, PreferredSourceIntegrationOptions } from './types';

const SDK_URL = 'https://news.google.com/swg/js/v1/publisher.js';

/** Build the head-inline snippet that loads Google's SDK exactly once. */
export function buildHeadSnippet(options: PreferredSourceIntegrationOptions = {}): string {
  const mode = options.mode ?? 'auto';
  const initParts: string[] = [];
  if (options.theme) initParts.push(`theme:${JSON.stringify(options.theme)}`);
  if (options.lang) initParts.push(`lang:${JSON.stringify(options.lang)}`);

  const manualAttr =
    mode === 'manual' ? `s.setAttribute("preferred-sources-control","manual");` : '';
  const manualInit =
    mode === 'manual'
      ? `(self.PREFERRED_SOURCE=self.PREFERRED_SOURCE||[]).push(function(ps){ps.init({${initParts.join(',')}});});`
      : '';

  return (
    `(function(){var d=document;` +
    `if(d.querySelector('script[src^="https://news.google.com/swg/js/v1/publisher"]'))return;` +
    `var s=d.createElement("script");s.async=true;${manualAttr}` +
    `s.setAttribute("data-opace-ps","");s.src=${JSON.stringify(SDK_URL)};` +
    `d.head.appendChild(s);${manualInit}})();`
  );
}

/**
 * Astro integration for Google's Preferred Sources button.
 * Injects the official SDK script once, site-wide, via a head-inline snippet;
 * core's loader adoption scan recognises it, so mixing the integration with
 * the components never double-loads the script.
 */
export default function preferredSource(
  options: PreferredSourceIntegrationOptions = {},
): AstroIntegration {
  return {
    name: '@opacedev/astro-preferred-source',
    hooks: {
      'astro:config:setup': ({ injectScript, logger }) => {
        if (options.mode === 'manual' && options.injectScript === false) {
          logger.warn(
            '@opacedev/astro-preferred-source: mode "manual" with injectScript: false means nothing initialises until a component loads. Harmless, but check it is what you intended.',
          );
        }
        if (options.injectScript !== false) {
          injectScript('head-inline', buildHeadSnippet(options));
        }
      },
    },
  };
}
