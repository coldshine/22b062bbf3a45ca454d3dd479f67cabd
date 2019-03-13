/*
Use this JSON file as input data for the 5 charts. It contains a vector of JSON objects ('chart'), each representing a separate graph.

chart.columns – List of all data columns in the chart. Each column has its label at position 0, followed by values.
x values are UNIX timestamps in miliseconds.

chart.types – Chart types for each of the columns. Supported values:
"line" (line on the graph with linear interpolation),
"x" (x axis values for each of the charts at the corresponding positions).

chart.colors – Color for each line in 6-hex-digit format (e.g. "#AAAAAA").
chart.names – Names for each line.
 */

Number.prototype.between = function (a, b, inclusive) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return inclusive ? this >= min && this <= max : this > min && this < max;
};
Array.prototype.findClosestValue = function (search) {
  const sorted = this.map((value) => Math.abs(value - search));
  const min = Math.min.apply(Math, sorted);
  return this[sorted.indexOf(min)]
};

import './app';