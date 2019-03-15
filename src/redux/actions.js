export const UPDATE_VISIBLE_RANGE = 'UPDATE_VISIBLE_RANGE';
export const UPDATE_HOVERED_VALUE_INDEX = 'UPDATE_HOVERED_VALUE_INDEX';

export function updateVisibleRange(minX, maxX) {
  return {
    type: UPDATE_VISIBLE_RANGE,
    payload: {
      minX,
      maxX
    }
  }
}

export function updateHoveredValueIndex(valueIndex) {
  return {
    type: UPDATE_HOVERED_VALUE_INDEX,
    payload: valueIndex
  }
}