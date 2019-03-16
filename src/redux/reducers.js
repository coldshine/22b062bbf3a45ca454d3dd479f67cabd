import {
  UPDATE_VISIBLE_RANGE
} from './actions';

const initialState = {
  visibleRange: [0.25, 0.5],
  hoveredValueIndex: null,
};

function charts(state = initialState, action) {
  switch (action.type) {
    case UPDATE_VISIBLE_RANGE:
      return Object.assign(state, { visibleRange: action.payload });
    default:
      return state
  }
}

export default charts;