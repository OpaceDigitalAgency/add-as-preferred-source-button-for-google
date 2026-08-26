/** Shadow styles for <preferred-source-button>. All knobs are CSS custom properties. */
export const styles = `
:host {
  display: inline-block;
}
:host([hidden]) {
  display: none;
}
.container {
  display: inline-block;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--ps-gap, 0.5em);
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
  font-family: var(--ps-font-family, Roboto, system-ui, -apple-system, sans-serif);
  font-size: var(--ps-font-size, 0.875rem);
  font-weight: var(--ps-font-weight, 500);
  padding: var(--ps-padding, 0.55em 1.1em);
  border-radius: var(--ps-radius, 4px);
  transition: var(--ps-transition, background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease);
  line-height: 1.2;
}
.btn:focus-visible {
  outline: var(--ps-focus-ring, 2px solid #4285F4);
  outline-offset: var(--ps-focus-ring-offset, 2px);
}
.btn[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
.icon {
  width: 1.1em;
  height: 1.1em;
  flex: none;
}

/* Variant: google-default (manual-mode trigger visually close to Google's stock button) */
.variant-google-default {
  background: var(--ps-bg, #ffffff);
  color: var(--ps-colour, #1f1f1f);
  border: var(--ps-border, 1px solid #dadce0);
}
.variant-google-default:hover:not([disabled]) {
  background: var(--ps-hover-bg, #f8f9fa);
}
.theme-dark .variant-google-default {
  background: var(--ps-bg, #202124);
  color: var(--ps-colour, #e8eaed);
  border: var(--ps-border, 1px solid #5f6368);
}
.theme-dark .variant-google-default:hover:not([disabled]) {
  background: var(--ps-hover-bg, #303134);
}

/* Variant: google-colours (CRO-styled: blue, green hover, lift) */
.variant-google-colours {
  background: var(--ps-bg, #4285F4);
  color: var(--ps-colour, #ffffff);
  border: var(--ps-border, none);
  border-radius: var(--ps-radius, 9999px);
}
.variant-google-colours:hover:not([disabled]),
.variant-google-colours:focus-visible {
  background: var(--ps-hover-bg, #34A853);
  transform: translateY(var(--ps-lift, -2px));
  box-shadow: var(--ps-shadow-hover, 0 4px 12px rgba(0, 0, 0, 0.18));
}

/* Variant: neutral (themed entirely by the host page) */
.variant-neutral {
  background: var(--ps-bg, transparent);
  color: var(--ps-colour, inherit);
  border: var(--ps-border, 1px solid currentColor);
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: background-color 0.2s ease;
  }
  .variant-google-colours:hover:not([disabled]),
  .variant-google-colours:focus-visible {
    transform: none;
    box-shadow: none;
  }
}
`;
