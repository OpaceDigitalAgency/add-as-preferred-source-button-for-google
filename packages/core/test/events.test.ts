import { describe, expect, it } from 'vitest';
import { PS_CLICK_EVENT, emitPsClick } from '../src/index';
import type { PsClickDetail } from '../src/index';

describe('emitPsClick', () => {
  it('dispatches a bubbling, composed ps-click CustomEvent and returns it', () => {
    const target = document.createElement('button');
    document.body.appendChild(target);

    const detail: PsClickDetail = {
      outcome: 'pending',
      mode: 'manual',
      theme: 'light',
      lang: 'en',
      domain: 'example.com',
    };

    let receivedOnDocument: CustomEvent<PsClickDetail> | null = null;
    document.addEventListener(PS_CLICK_EVENT, (event) => {
      receivedOnDocument = event as CustomEvent<PsClickDetail>;
    });

    const dispatched = emitPsClick(target, detail);

    expect(dispatched.type).toBe('ps-click');
    expect(dispatched.bubbles).toBe(true);
    expect(dispatched.composed).toBe(true);
    expect(dispatched.detail).toEqual(detail);
    expect(receivedOnDocument).not.toBeNull();
    target.remove();
  });
});
