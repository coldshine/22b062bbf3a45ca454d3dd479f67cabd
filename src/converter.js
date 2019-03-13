import Utils from './utils';

export default class {

  constructor(valuesX, valuesY, viewportSize) {
    const [minX, maxX] = Utils.getMinMax(valuesX); // [x, y]
    const [minY, maxY] = Utils.getMinMax(valuesY); // [x, y]

    this.valuesX = valuesX;
    this.valuesY = valuesY;
    this.min = [minX, minY];
    this.max = [maxX, maxY];
    this.viewportSize = viewportSize;
  }

  convertCoordsToPx(x, y) {
    return Utils.convertCoordsToPx(
      [x, y],
      this.min,
      this.max,
      this.viewportSize
    );
  }

  convertPxToCoord(x) {
    const [viewportWidth] = this.viewportSize;
    const [minX, minY] = this.min;
    const [maxX, maxY] = this.max;
    return Utils.convertPxToCoord(
      x,
      minX,
      maxX,
      this.valuesX,
      viewportWidth,
    );
  }

}