import { PS_CLICK_EVENT } from './constants';
import type { PsClickDetail } from './types';

/**
 * Dispatch the library's click event from a trigger element:
 * new CustomEvent('ps-click', { bubbles: true, composed: true, detail }).
 * Returns the dispatched event. This is OUR event for analytics wiring —
 * it reports that a user clicked a trigger, and (in detail.outcome) how the
 * click is being fulfilled. It does NOT and CANNOT report a completed add.
 */
export function emitPsClick(target: EventTarget, detail: PsClickDetail): CustomEvent<PsClickDetail> {
  const event = new CustomEvent<PsClickDetail>(PS_CLICK_EVENT, {
    bubbles: true,
    composed: true,
    detail,
  });
  target.dispatchEvent(event);
  return event;
}
