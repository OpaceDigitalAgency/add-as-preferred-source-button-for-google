/** Official Google Preferred Sources SDK, IIFE build. */
export const SDK_URL = 'https://news.google.com/swg/js/v1/publisher.js';
/** Official SDK, ES-module build (documented alternative; the loader uses SDK_URL). */
export const SDK_MODULE_URL = 'https://news.google.com/swg/js/v1/publisher.mjs';
/** Attribute Google's auto mode scans for. */
export const AUTO_ATTRIBUTE = 'google-add-preferred-source-btn';
/** Script attribute that switches the SDK to manual mode. */
export const MANUAL_CONTROL_ATTRIBUTE = 'preferred-sources-control';
/** Base of the no-JS deeplink. */
export const DEEPLINK_BASE = 'https://www.google.com/preferences/source';
/** Name of the CustomEvent emitted when a trigger is clicked. */
export const PS_CLICK_EVENT = 'ps-click';
/** Default SDK load timeout in milliseconds. */
export const DEFAULT_TIMEOUT_MS = 5000;
/**
 * Default auto-mode render timeout in milliseconds: how long after the SDK
 * loads an attributed container may stay empty before it is treated as a
 * non-render (Google's SDK loads on unrecognised origins but silently
 * declines to paint a button).
 */
export const DEFAULT_RENDER_TIMEOUT_MS = 4000;
