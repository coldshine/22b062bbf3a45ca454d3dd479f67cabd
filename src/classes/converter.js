import Utils from './utils';

export default class {

  constructor(valuesX, valuesY, layout) {
    const [minX, maxX] = Utils.getMinMax(valuesX); // [x, y]
    const [minY, maxY] = Utils.getMinMax(valuesY); // [x, y]

    this.valuesX = valuesX;
    this.valuesY = valuesY;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.deltaX = maxX - minX;
    this.deltaY = maxY - minY;
    this.layout = layout;

  }

  coordsToPixel(x, y) {
    return [
      this.valueXToPixel(x),
      this.valueYToPixel(y),
    ]
  }

  valueXToPixel(x) {
    return this.coordToPixel(x, this.minX, this.deltaX, this.layout.width, this.layout.offsetLeft);
  }

  valueYToPixel(y) {
    y = this.maxY - y; // y should be inverted since order is from the bottom to the top
    return this.coordToPixel(y, this.minY, this.deltaY, this.layout.height, this.layout.offsetTop);
  }

  pixelToValueX(x) {
    const coords = this.pixelToCoord(x, this.minX, this.deltaX, this.layout.width);
    return this.valuesX.findClosestValue(coords); // since chart value is discreet we have to find the exact chart value by pixel position and the look for real closest chart value;
  }

  /**
   * Converts chart one coordinate (x or y) to pixel position
   */
  coordToPixel(value, minValue, delta, maxPx, offset) {
    const localValue = value - minValue;
    const pc = localValue / delta; // percents
    return Math.round(pc * maxPx) + offset; // pixels
  }

  /**
   * Converts pixel position (x or y) to chart one coordinate
   */
  pixelToCoord(px, minValue, delta, maxPx) {
    const pc = px / maxPx; // percents
    return Math.round(pc * delta) + minValue; // value
  }
}