import { UPDATE_VISIBLE_RANGE, UPDATE_MOUSE_POSITION } from './actions';

const initialState = {
  minX: 1546905600000,
  maxX: 1552003200000,
  mouseX: -1,
  mouseY: -1,
};

function charts(state = initialState, action) {
  switch (action.type) {
    case UPDATE_VISIBLE_RANGE:
      return Object.assign(state, action.payload);
    case UPDATE_MOUSE_POSITION:
      return Object.assign(state, action.payload);
    default:
      return state
  }
}

export default charts;