const defaultVisibleFrom = 0.25;
const defaultVisibleTo = 0.5;

const visibleRanges = [];
const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

function dispatch() {
  listeners.forEach((listener) => listener());
}

function setDefaultRange(chartIndex) {
  visibleRanges[chartIndex] = [defaultVisibleFrom, defaultVisibleTo];
}

export function updateVisibleRange(index, from, to) {
  visibleRanges[index] = [from, to];
  dispatch();
}

export function getVisibleRange(chartIndex) {
  if (!visibleRanges[chartIndex]) {
    setDefaultRange(chartIndex);
  }
  return visibleRanges[chartIndex];
}