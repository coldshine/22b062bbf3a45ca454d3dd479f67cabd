import {
  UPDATE_VISIBLE_RANGE,
  UPDATE_HOVERED_VALUE_INDEX
} from './actions';

const initialState = {
  minX: 1542412800000,
  maxX: 1542672000000,
  hoveredValueIndex: null,
};

function charts(state = initialState, action) {
  switch (action.type) {
    case UPDATE_VISIBLE_RANGE:
      return Object.assign(state, action.payload);
    case UPDATE_HOVERED_VALUE_INDEX:
      return Object.assign(state, { hoveredValueIndex: action.payload });
    default:
      return state
  }
}

export default charts;