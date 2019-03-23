import Config from '../config';

export const eventTypes = {
  visibleRangeChange: 'VISIBLE_RANGE_CHANGE',
  toggleTheme: 'TOGGLE_THEME',
};

class Store {
  constructor() {
    this.state = {
      visibleRanges: [],
      theme: Config.defaults.theme
    };
    this.listeners = {};
  }

  subscribe(eventType, listener) {
    this.listeners[eventType] = this.listeners[eventType] || [];
    this.listeners[eventType].push(listener);
  }

  switchTheme(theme) {
    if (this.state.theme !== theme) {
      this.state.theme = theme;
      this._dispatch(eventTypes.toggleTheme, this.getTheme());
    }
  }

  updateVisibleRange(chartIndex, from, to) {
    this.state.visibleRanges[chartIndex] = [from, to];
    this._dispatch(eventTypes.visibleRangeChange, this.getVisibleRange(chartIndex));
  }

  getVisibleRange(chartIndex) {
    if (!this.state.visibleRanges[chartIndex]) {
      this._setDefaultRange(chartIndex);
    }
    return this.state.visibleRanges[chartIndex].slice(0);
  }

  getTheme() {
    return this.state.theme;
  }

  _dispatch(eventType) {
    this.listeners[eventType] = this.listeners[eventType] || [];
    this.listeners[eventType].forEach((listener) => listener(...arguments));
  }

  _setDefaultRange(chartIndex) {
    this.state.visibleRanges[chartIndex] = Config.defaults.visibleRange;
  }
}

export const store = new Store();