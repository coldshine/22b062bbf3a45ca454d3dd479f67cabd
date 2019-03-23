import Utils from './utils';

class Converter {

  constructor(valuesX, valuesY, layout) {
    this.layout = layout;
    this.layout.width =  Utils.calculateLayoutWidth(layout.width);
    const [minX, maxX] = Utils.getMinMax(valuesX);
    this.valuesX = valuesX;
    this.valuesY = valuesY;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = 0;
    this.maxY = Utils.getMax(valuesY);
    this.deltaX = this.maxX - this.minX;
    this.scaleX = 1;
    this.percentsOffsetX = 0;
    this.translateX = 0;
    this.yAxisLinesCount = 6;
  }

  setVisibleRange(visibleRange) {
    const [from, to] = visibleRange;
    const diff = to - from;
    this.scaleX = 1 / diff;
    this.percentsOffsetX = from;
    this.translateX = from * this.layout.width * this.scaleX;
  }

  setMaxY(maxY) {
    this.stepY = this._calculateAxisYStep(maxY);
    this.maxY = this._calculateMaxY(maxY);
  }

  coordsToPxPosition(x, y) {
    return [
      this.xCoordToXPxPosition(x),
      this.yCoordToYPxPosition(y),
    ]
  }

  xCoordToXPxPosition(x) {
    return this._coordToPxPosition(x, this.minX, this.deltaX, this.layout.width, this.layout.offsetLeft - this.translateX, this.scaleX);
  }

  yCoordToYPxPosition(y) {
    y = this.maxY - y + this.minY; // y should be inverted since order is from the bottom to the top
    return this._coordToPxPosition(y, this.minY, this.maxY, this.layout.height, this.layout.offsetTop);
  }

  pxPositionXToValueX(x) {
    const coords = this._pxPositionToCoord(x, this.minX, this.deltaX, this.layout.width, this.percentsOffsetX, this.scaleX);
    return this.valuesX.findClosestValue(coords); // since chart value is discreet we have to find the exact chart value by pixel position and the look for real closest chart value;
  }

  _calculateAxisYStep(maxY) {
    return Math.ceil(maxY / this.yAxisLinesCount);
  }

  _calculateMaxY(maxY) {
    return Math.ceil(maxY / this.stepY) * this.stepY;
  }

  /**
   * Converts chart coordinate (x or y) to pixel position
   */
  _coordToPxPosition(coord, coordOffset, delta, pxCount, offset, scale = 1) {
    const localCoord = coord - coordOffset;
    const percents = localCoord / delta;
    let pxPosition = Math.round(percents * pxCount); // pixel position
    pxPosition *= scale;
    pxPosition += offset;
    return pxPosition;
  }

  /**
   * Converts pixel position (x or y) to chart coordinate
   */
  _pxPositionToCoord(pixelCoord, coordOffset, delta, pxCount, offset, scale) {
    let percents = pixelCoord / pxCount; // percents
    percents /= scale;
    percents += offset;
    return Math.round(percents * delta) + coordOffset; // coordinate
  }

}

export default Converter;