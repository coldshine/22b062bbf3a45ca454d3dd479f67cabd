export default class {

  static aliasPixel(pixelWidth) {
    return (pixelWidth % 2 === 0) ? 0 : 0.5;
  }

  static sortNumbersAsc(array) {
    const arrayClone = array.slice(0);
    return arrayClone.sort((a,b) => a - b);
  }

  static sortNumbersDesc(array) {
    const arrayClone = array.slice(0);
    return arrayClone.sort((a,b) => b - a);
  }

  static getMinMax(array) {
    array = this.sortNumbersAsc(array);
    const min = array[0];
    const max = array[array.length - 1];
    return [min, max]
  }

  /**
   * Converts chart one coordinate (x or y) to pixel position
   */
  static convertValueToPx(value, minValue, maxValue, maxPx) {
    const localValue = value - minValue;
    const delta = maxValue - minValue;
    const pc = localValue / delta; // percents
    return Math.round(pc * maxPx); // pixels
  }

  /**
   * Converts pixel position (x or y) to chart one coordinate
   */
  static convertPxToCoord(px, minValue, maxValue, values, maxPx) {
    const delta = maxValue - minValue;
    const pc = px / maxPx; // percents
    const localValue = Math.round(pc * delta);
    return values.findClosestValue(localValue + minValue); // since chart value is discreet we have to find the exact chart value by pixel position and the look for real closest chart value;
  }

  /**
   * Converts chart coordinate (x,y) to pixel position
   */
  static convertCoordsToPx(coord, min, max, viewportSize) {
    let [x, y] = coord;
    const [minX, minY] = min;
    const [maxX, maxY] = max;
    const [viewportWidth, viewportHeight] = viewportSize;
    y = maxY - y; // y should be inverted since order is from the bottom to the top
    return [
      this.convertValueToPx(x, minX, maxX, viewportWidth),
      this.convertValueToPx(y, minY, maxY, viewportHeight),
    ]
  }

  /**
   * Converts pixel position (x,y) to chart coordinate
   */
  static convertPxToCoords(coord, min, max, valuesX, valuesY, viewportSize) {
    let [x, y] = coord;
    const [minX, minY] = min;
    const [maxX, maxY] = max;
    const [viewportWidth, viewportHeight] = viewportSize;
    return [
      this.convertPxToCoord(x, minX, maxX, valuesX, viewportWidth),
      this.convertPxToCoord(y, minY, maxY, valuesY, viewportHeight)
    ];
  }

}