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
    if (selectedValueX) {
      this._drawSquare(ctx, x);
      this._drawText(ctx, x, selectedValueX);
    }
  }

  _drawSquare(ctx, x) {
    const {width, height, offsetTop} = Config.layout.tooltip;
    ctx.strokeStyle = '#bdbdbd';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(x - width / 2, offsetTop, width, height);
    ctx.stroke();
    ctx.fill();
  }

  _drawText(ctx, x, selectedValueX) {
    let {offsetTop} = Config.layout.tooltip;
    offsetTop += 10;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.fillText(selectedValueX, x, offsetTop);

    offsetTop += 10;
    let textOffset = 0;
    this.charts.forEach((chart) => {
      ctx.strokeStyle = chart.color;
      ctx.fillStyle = chart.color;
      ctx.fillText(chart.selectedValueY, x + textOffset, offsetTop);
      textOffset += 20;
    });
  }
}

