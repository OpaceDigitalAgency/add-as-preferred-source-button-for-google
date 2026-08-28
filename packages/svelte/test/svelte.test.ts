import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { resetSdkLoaderForTests } from '@opacedev/preferred-source-core';
import type { PsClickDetail } from '@opacedev/preferred-source-core';
import PreferredSourceButton from '../src/lib/PreferredSourceButton.svelte';

beforeEach(() => {
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

afterEach(() => {
  cleanup();
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

describe('PreferredSourceButton (Svelte)', () => {
  it('mounts and renders the default label', () => {
    const { getByRole } = render(PreferredSourceButton, { props: { domain: 'example.com' } });
    expect(getByRole('button').textContent).toContain('Add as a preferred source on Google');
  });

  it('fires ps-click with the detail on click', async () => {
    const { getByRole, component } = render(PreferredSourceButton, {
      props: { domain: 'example.com', theme: 'dark' },
    });
    let detail: PsClickDetail | null = null;
    component.$on('ps-click', (event: CustomEvent<PsClickDetail>) => {
      detail = event.detail;
    });
    await fireEvent.click(getByRole('button'));
    expect(detail).not.toBeNull();
    expect(detail!.outcome).toBe('pending');
    expect(detail!.theme).toBe('dark');
    expect(detail!.domain).toBe('example.com');
  });

  it('renders the attributed div in auto mode', () => {
    const { container } = render(PreferredSourceButton, { props: { mode: 'auto', theme: 'dark' } });
    const div = container.querySelector('[google-add-preferred-source-btn]');
    expect(div).not.toBeNull();
    expect(div!.getAttribute('data-theme')).toBe('dark');
  });
});
