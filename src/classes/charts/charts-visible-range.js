let visibleFrom = 0.25;
let visibleTo = 0.5;

const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

function dispatch() {
  listeners.forEach((listener) => listener());
}

export function updateVisibleRange(from, to) {
  visibleFrom = from;
  visibleTo = to;
  dispatch();
}

export function getVisibleRange() {
  return [visibleFrom, visibleTo];
}