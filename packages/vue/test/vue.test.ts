import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { resetSdkLoaderForTests } from '@opacedev/preferred-source-core';
import type { PsClickDetail } from '@opacedev/preferred-source-core';
import { PreferredSourceButton } from '../src/index';

beforeEach(() => {
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

afterEach(() => {
  resetSdkLoaderForTests();
  delete window.PREFERRED_SOURCE;
});

describe('PreferredSourceButton (Vue)', () => {
  it('mounts and renders the default label', () => {
    const wrapper = mount(PreferredSourceButton, { props: { domain: 'example.com' } });
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Add as a preferred source on Google');
  });

  it('emits ps-click with the detail on click', async () => {
    const wrapper = mount(PreferredSourceButton, {
      props: { domain: 'example.com', theme: 'dark' },
    });
    await wrapper.find('button').trigger('click');
    const emitted = wrapper.emitted('ps-click');
    expect(emitted).toBeTruthy();
    const detail = emitted![0]![0] as PsClickDetail;
    expect(detail.outcome).toBe('pending');
    expect(detail.theme).toBe('dark');
    expect(detail.domain).toBe('example.com');
  });

  it('renders the attributed div in auto mode', () => {
    const wrapper = mount(PreferredSourceButton, { props: { mode: 'auto', theme: 'dark' } });
    const div = wrapper.find('[google-add-preferred-source-btn]');
    expect(div.exists()).toBe(true);
    expect(div.attributes('data-theme')).toBe('dark');
  });
});
