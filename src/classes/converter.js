import Utils from './utils';

export default class {

  constructor(valuesX, valuesY, viewportSize) {
    const [minX, maxX] = Utils.getMinMax(valuesX); // [x, y]
    const [minY, maxY] = Utils.getMinMax(valuesY); // [x, y]
    const [viewportWidth, viewportHeight] = viewportSize;

    this.valuesX = valuesX;
    this.valuesY = valuesY;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.deltaX = maxX - minX;
    this.deltaY = maxY - minY;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

  }

  coordsToPixel(x, y) {
    y = this.maxY - y; // y should be inverted since order is from the bottom to the top
    return [
      this.coordToPixel(x, this.minX, this.deltaX, this.viewportWidth),
      this.coordToPixel(y, this.minY, this.deltaY, this.viewportHeight),
    ]
  }

  pxToValueX(x) {
    return this.pxToCoords(x, this.minX, this.deltaX, this.valuesX, this.viewportWidth);
  }

  /**
   * Converts chart one coordinate (x or y) to pixel position
   */
  coordToPixel(value, minValue, delta, maxPx) {
    const localValue = value - minValue;
    const pc = localValue / delta; // percents
    return Math.round(pc * maxPx); // pixels
  }

  /**
   * Converts pixel position (x or y) to chart one coordinate
   */
  pxToCoords(px, minValue, delta, values, maxPx) {
    const pc = px / maxPx; // percents
    const localValue = Math.round(pc * delta);
    return values.findClosestValue(localValue + minValue); // since chart value is discreet we have to find the exact chart value by pixel position and the look for real closest chart value;
  }
}