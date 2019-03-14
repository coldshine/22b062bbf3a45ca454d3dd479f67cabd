import Utils from './utils';

export default class {

  constructor(valuesX, valuesY, converter) {
    const [minX, maxX] = Utils.getMinMax(valuesX);
    const [minY, maxY] = Utils.getMinMax(valuesY);

    const ticksOnX = 6;
    const ticksOnY = 7;

    this.valuesX = valuesX;
    this.valuesY = valuesY;
    this.converter = converter;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.deltaX = maxX - minX;
    this.deltaY = maxY - minY;
    this.xValuesPerMarker = Math.round(this.deltaX / ticksOnX);
    this.yValuesPerMarker =  Math.round(this.deltaY / ticksOnY);
  }

  draw(ctx, selectedValueX) {
    this._drawGridX(ctx, true);
    this._drawGridY(ctx);
    if (selectedValueX) {
      this._drawVerticalGridLine(ctx, selectedValueX)
    }
  }

  _drawGridX(ctx, hideLines = false) {
    const step = this.xValuesPerMarker;
    for (let xValue = this.minX; xValue <= this.maxX; xValue += step) {
      const [fromX, fromY] = this.converter.coordsToPixel(xValue, this.minY);
      if (!hideLines) {
        this._drawVerticalGridLine(ctx, xValue)
      }
      this._drawGridText(ctx, xValue, fromX, fromY);
    }
  }

  _drawGridY(ctx) {
    const step = this.yValuesPerMarker;
    for (let yValue = this.minY; yValue <= this.maxY; yValue += step) {
      const [fromX, fromY] = this.converter.coordsToPixel(this.minX, yValue);
      this._drawHorizontalGridLine(ctx, yValue);
      this._drawGridText(ctx, yValue, fromX, fromY);
    }
  }

  _drawHorizontalGridLine(ctx, y) {
    const [fromX, fromY] = this.converter.coordsToPixel(this.minX, y);
    const [toX, toY] = this.converter.coordsToPixel(this.maxX, y);
    this._drawGridLine(ctx, fromX, fromY, toX, toY);
  }

  _drawVerticalGridLine(ctx, x) {
    const [fromX, fromY] = this.converter.coordsToPixel(x, this.minY);
    const [toX, toY] = this.converter.coordsToPixel(x, this.maxY);
    this._drawGridLine(ctx, fromX, fromY, toX, toY);
  }

  _drawGridLine(ctx, fromX, fromY, toX, toY) {
    ctx.strokeStyle = '#d1d1d1';
    ctx.lineWidth = 1;

    ctx.beginPath();
    // ctx.moveTo(fromX + Utils.aliasPixel(fromX), fromY + Utils.aliasPixel(fromY));
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  _drawGridText(ctx, text, x, y) {
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.fillText(text, x, y);
  }

}

