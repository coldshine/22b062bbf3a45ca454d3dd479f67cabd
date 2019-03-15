import Utils from '../utils';
import { ctx } from '../canvas';
import store from '../../redux/store';

export default class {

  constructor(data, converter, hasHover) {
    const [minX, maxX] = Utils.getMinMax(data.valuesX);
    const [minY, maxY] = Utils.getMinMax(data.valuesY);

    this.data = data;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.converter = converter;
    this.hoveredValueX = null;
    this.hoveredValueY = null;
    this.hoveredValueIndex = null;
    this.hasHover = hasHover;
    this._bindEvents();
  }

  _bindEvents() {
    store.subscribe(() => this.onStoreChange());
  }

  onStoreChange() {
    const { hoveredValueIndex } = store.getState();
    this.hoveredValueIndex = hoveredValueIndex;
  }

  draw() {
    this._drawLine();
    if (this.hoveredValueIndex !== null && this.hasHover) {
      this.hoveredValueX = this.data.valuesX[this.hoveredValueIndex];
      this.hoveredValueY = this.data.valuesY[this.hoveredValueIndex];
      this._drawHover();
    }
  }

  _drawLine() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.data.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < this.data.valuesCount; i++) {
      const valueX = this.data.valuesX[i];
      const valueY = this.data.valuesY[i];
      const [x, y] = this.converter.coordsToPixel(valueX, valueY);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  _drawHover() {
    const valueX = this.hoveredValueX;
    const valueY = this.hoveredValueY;
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

