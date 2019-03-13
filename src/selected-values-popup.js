import Config from './config';
import Utils from './utils';

export default class {

  constructor(valuesX, valuesY, charts, converter) {
    const [minX, maxX] = Utils.getMinMax(valuesX);
    const [minY, maxY] = Utils.getMinMax(valuesY);

    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.charts = charts;
    this.valuesX = valuesX;
    this.valuesY = valuesY;
    this.converter = converter;
  }

  draw(ctx, selectedValueX) {
    const [x, y] = this.converter.convertCoordsToPx(this.charts[0].selectedValueX, 0);
    const [popupWidth, popupHeight] = Config.layout.popupSize;

    ctx.strokeStyle = '#bdbdbd';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(x - popupWidth / 2, 10, popupWidth, popupHeight);
    ctx.stroke();
    ctx.fill();

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

