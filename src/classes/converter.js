import Utils from './utils';

class Converter {

  constructor(valuesX, valuesY, layout) {
    this.layout = layout;
    const [minX, maxX] = Utils.getMinMax(valuesX);
    const [minY, maxY] = Utils.getMinMax(valuesY);
    this.valuesX = valuesX;
    this.valuesY = valuesY;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.deltaX = maxX - minX;
    this.deltaY = maxY - minY;
    this.scaleX = 1;
    this.scaleY = 1;
    this.offsetX = 0;
    this.translateX = 0;
    this.translateY = 0;
  }

  setVisibleRange(visibleRange) {
    const [from, to] = visibleRange;
    const diff = to - from;
    this.scaleX = 1 / diff;
    this.offsetX = from;
    this.translateX = from * this.layout.width * this.scaleX;
  }

  setMaxVisibleValueY(maxY) {
    this.maxY = maxY;
    this.deltaY = maxY - this.minY;
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
    y = this.maxY - y; // y should be inverted since order is from the bottom to the top
    return this._coordToPxPosition(y, this.minY, this.deltaY, this.layout.height, this.layout.offsetTop - this.translateY, this.scaleY);
  }

  pxPositionXToValueX(x) {
    const coords = this._pxPositionToCoord(x, this.minX, this.deltaX, this.layout.width, this.offsetX, this.scaleX);
    return this.valuesX.findClosestValue(coords); // since chart value is discreet we have to find the exact chart value by pixel position and the look for real closest chart value;
  }

  /**
   * Converts chart coordinate (x or y) to pixel position
   */
  _coordToPxPosition(coord, coordOffset, delta, pxCount, translate, scale) {
    const localCoord = coord - coordOffset;
    const percents = localCoord / delta;
    let pxPosition = Math.round(percents * pxCount); // pixel position
    pxPosition *= scale;
    pxPosition += translate;
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