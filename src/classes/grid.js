import { ctx } from './canvas';

export default class {

  constructor(converter) {
    const ticksOnX = 6;
    const ticksOnY = 7;

    this.converter = converter;
    this.valuesX = converter.valuesX;
    this.valuesY = converter.valuesY;
    this.minX = converter.minX;
    this.maxX = converter.maxX;
    this.minY = converter.minY;
    this.maxY = converter.maxY;
    this.deltaX = converter.deltaX;
    this.deltaY = converter.deltaY;
    this.xValuesPerMarker = Math.round(this.deltaX / ticksOnX);
    this.yValuesPerMarker =  Math.round(this.deltaY / ticksOnY);
  }

  draw(selectedValueX) {
    this._drawGridX(ctx, true);
    this._drawGridY(ctx);
    if (selectedValueX) {
      this._drawVerticalGridLine(selectedValueX)
    }
  }

  _drawGridX(hideLines = false) {
    const step = this.xValuesPerMarker;
    for (let xValue = this.minX; xValue <= this.maxX; xValue += step) {
      const [fromX, fromY] = this.converter.coordsToPixel(xValue, this.minY);
      if (!hideLines) {
        this._drawVerticalGridLine(xValue)
      }
      this._drawGridText(xValue, fromX, fromY);
    }
  }

  _drawGridY() {
    const step = this.yValuesPerMarker;
    for (let yValue = this.minY; yValue <= this.maxY; yValue += step) {
      const [fromX, fromY] = this.converter.coordsToPixel(this.minX, yValue);
      this._drawHorizontalGridLine(yValue);
      this._drawGridText(yValue, fromX, fromY);
    }
  }

  _drawHorizontalGridLine(y) {
    const [fromX, fromY] = this.converter.coordsToPixel(this.minX, y);
    const [toX, toY] = this.converter.coordsToPixel(this.maxX, y);
    this._drawGridLine(fromX, fromY, toX, toY);
  }

  _drawVerticalGridLine(x) {
    const [fromX, fromY] = this.converter.coordsToPixel(x, this.minY);
    const [toX, toY] = this.converter.coordsToPixel(x, this.maxY);
    this._drawGridLine(fromX, fromY, toX, toY);
  }

  _drawGridLine(fromX, fromY, toX, toY) {
    ctx.strokeStyle = '#d1d1d1';
    ctx.lineWidth = 1;

    ctx.beginPath();
    // ctx.moveTo(fromX + Utils.aliasPixel(fromX), fromY + Utils.aliasPixel(fromY));
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  _drawGridText(text, x, y) {
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.fillText(text, x, y);
  }

}

