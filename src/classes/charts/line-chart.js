import Utils from '../utils';

export default class {

  constructor(data, converter) {
    const [minX, maxX] = Utils.getMinMax(data.valuesX);
    const [minY, maxY] = Utils.getMinMax(data.valuesY);

    this.data = data;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.converter = converter;
    this.selectedValueX = null;
    this.selectedValueY = null;
  }

  draw(ctx, selectedValueX = null, selectedValueIndex = null) {
    this._drawLine(ctx);
    if (selectedValueX && selectedValueIndex) {
      this.selectedValueX = selectedValueX;
      this.selectedValueY = this.data.valuesY[selectedValueIndex];
      this._drawSelected(ctx);
    }
  }

  _drawLine(ctx) {

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.data.color;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < this.data.valuesX.length - 1; i++) {
      const valueX = this.data.valuesX[i];
      const valueY = this.data.valuesY[i];
      const [x, y] = this.converter.coordsToPixel(valueX, valueY);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  _drawSelected(ctx) {
    const valueX = this.selectedValueX;
    const valueY = this.selectedValueY;
    const [x, y] = this.converter.coordsToPixel(valueX, valueY);

    ctx.strokeStyle = this.data.color;
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

}

