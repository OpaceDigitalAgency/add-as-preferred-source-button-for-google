import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import { resetSdkLoaderForTests } from '@opacedev/preferred-source-core';
import type { PsClickDetail } from '@opacedev/preferred-source-core';
import { PreferredSourceButton, usePreferredSource } from '../src/index';

beforeEach(() => {
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

describe('PreferredSourceButton', () => {
  it('renders a button with the default label', () => {
    const { getByRole } = render(<PreferredSourceButton domain="example.com" />);
    const button = getByRole('button');
    expect(button.textContent).toBe('Add as a preferred source on Google');
  });

  it('fires onPsClick with the click detail', () => {
    const onPsClick = vi.fn();
    const { getByRole } = render(
      <PreferredSourceButton domain="example.com" theme="dark" onPsClick={onPsClick} />,
    );
    fireEvent.click(getByRole('button'));
    expect(onPsClick).toHaveBeenCalledTimes(1);
    const detail = onPsClick.mock.calls[0]![0] as PsClickDetail;
    expect(detail.outcome).toBe('pending');
    expect(detail.theme).toBe('dark');
    expect(detail.domain).toBe('example.com');
  });

  it('renders the attributed div in auto mode', () => {
    const { container } = render(<PreferredSourceButton mode="auto" theme="dark" lang="en" />);
    const div = container.querySelector('[google-add-preferred-source-btn]');
    expect(div).not.toBeNull();
    expect(div!.getAttribute('data-theme')).toBe('dark');
    expect(div!.getAttribute('data-lang')).toBe('en');
  });
});

describe('usePreferredSource', () => {
  it('progresses from loading and exposes the deeplink', async () => {
    const { result } = renderHook(() => usePreferredSource({ domain: 'example.com' }));
    expect(['idle', 'loading']).toContain(result.current.status);
    await waitFor(() => {
      expect(result.current.deeplink).toBe('https://www.google.com/preferences/source?q=example.com');
    });
    expect(typeof result.current.open).toBe('function');
  });
});
