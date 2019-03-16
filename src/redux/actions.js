export const UPDATE_VISIBLE_RANGE = 'UPDATE_VISIBLE_RANGE';

export function updateVisibleRange(from, to) {
  return {
    type: UPDATE_VISIBLE_RANGE,
    payload: [from, to]
  }
}
