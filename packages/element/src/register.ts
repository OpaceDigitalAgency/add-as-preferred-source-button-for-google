import { PreferredSourceButton } from './preferred-source-button';

export { PreferredSourceButton };

if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
  if (!customElements.get('preferred-source-button')) {
    customElements.define('preferred-source-button', PreferredSourceButton);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'preferred-source-button': PreferredSourceButton;
  }
}
