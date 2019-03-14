export const UPDATE_VISIBLE_RANGE = 'UPDATE_VISIBLE_RANGE';
export const UPDATE_MOUSE_POSITION = 'UPDATE_MOUSE_POSITION';

export function updateVisibleRange(minX, maxX) {
  return {
    type: UPDATE_VISIBLE_RANGE,
    payload: {
      minX,
      maxX
    }
  }
}

export function updateMousePosition(mouseX, mouseY) {
  return {
    type: UPDATE_MOUSE_POSITION,
    payload: {
      mouseX,
      mouseY
    }
  }
}