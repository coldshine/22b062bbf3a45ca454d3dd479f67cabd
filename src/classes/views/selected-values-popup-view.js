import Config from '../../json/config';
import Utils from '../utils';

export default class {

  constructor(charts, converter) {
    this.charts = charts;
    this.converter = converter;
    this.valuesX = converter.valuesX;
    this.valuesY = converter.valuesY;
    this.minX = converter.minX;
    this.maxX = converter.maxX;
    this.minY = converter.minY;
    this.maxY = converter.maxY;
    this.deltaX = converter.deltaX;
    this.deltaY = converter.deltaY;
  }

  draw(ctx, selectedValueX) {
    const [x, y] = this.converter.coordsToPixel(this.charts[0].selectedValueX, 0);
    this._drawSquare(ctx, x);
    this._drawText(ctx, x, selectedValueX);
  }

  _drawSquare(ctx, x) {
    const [popupWidth, popupHeight] = Config.layout.popupSize;
    ctx.strokeStyle = '#bdbdbd';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(x - popupWidth / 2, 10, popupWidth, popupHeight);
    ctx.stroke();
    ctx.fill();
  }

  _drawText(ctx, x, selectedValueX) {
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.fillText(selectedValueX, x, 20);

    let textOffset = 0;
    this.charts.forEach((chart) => {
      ctx.strokeStyle = chart.color;
      ctx.fillStyle = chart.color;
      ctx.fillText(chart.selectedValueY, x + textOffset, 30);
      textOffset += 20;
    });
  }

}

