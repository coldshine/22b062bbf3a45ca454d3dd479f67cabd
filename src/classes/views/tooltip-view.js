import Config from '../../json/config';
import { ctx } from '../canvas';
import store from "../../redux/store";

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
    this.hoveredValueIndex = null;
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
    if (this.hoveredValueIndex !== null) {
      this._drawSquare();
      this._drawText();
    }
  }

  _drawSquare() {
    const hoveredValueX = this.valuesX[this.hoveredValueIndex];
    const x = this.converter.valueXToPixel(hoveredValueX);
    const {width, height, offsetTop} = Config.layout.tooltip;
    ctx.strokeStyle = '#bdbdbd';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(x - width / 2, offsetTop, width, height);
    ctx.stroke();
    ctx.fill();
  }

  _drawText() {
    const hoveredValueX = this.valuesX[this.hoveredValueIndex];
    const x = this.converter.valueXToPixel(hoveredValueX);
    let {offsetTop} = Config.layout.tooltip;
    offsetTop += 10;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.fillText(hoveredValueX, x, offsetTop);

    offsetTop += 10;
    let textOffset = 0;
    this.charts.forEach((chart) => {
      ctx.strokeStyle = chart.data.color;
      ctx.fillStyle = chart.data.color;
      const hoveredValueY = chart.data.valuesY[this.hoveredValueIndex];
      ctx.fillText(hoveredValueY, x + textOffset, offsetTop);
      textOffset += 20;
    });
  }
}

