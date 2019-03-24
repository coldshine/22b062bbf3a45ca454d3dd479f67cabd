import Config from '../../config';
import { store, eventTypes } from '../store';

class Tooltip {

  constructor(chartsData) {
    this.offsetTop = Config.layout.tooltip.offsetTop;
    this.position = null;
    this.captionX = null;
    this.captionsY = [];
    this.pixelsPerChar = 10; //px
    this.minColumnWidth = 70; //px
    this.background = 'white';
    this.dateTextColor = 'black';
    this.shadowColor = Config.colors.shadowLight;
    this.updateChartsData(chartsData);
    this._bindEvents();
  }

  _bindEvents() {
    store.subscribe(eventTypes.toggleTheme, (eventType, theme) => this._onChangeTheme(theme))
  }

  _onChangeTheme(theme) {
    if (theme === Config.themes.night) {
      this.background = Config.colors.darkBlue;
      this.dateTextColor = 'white';
      this.shadowColor = 'black';
    } else {
      this.background = 'white';
      this.dateTextColor = 'black';
      this.shadowColor = Config.colors.shadowLight;
    }
  }

  updateChartsData(chartsData) {
    this.chartsData = chartsData;
    this.chartsDataVisible = chartsData.filter((chartData) => chartData.visible);
    this.calculateTooltipSize();
  }

  calculateTooltipSize() {
    this.width = 0;
    this.chartsDataVisible.forEach((chartData) => {
      let width = chartData.valuesY[chartData.valuesY.length - 1].toString().length * this.pixelsPerChar;
      width = Math.max(width, this.minColumnWidth);
      this.width += width;
    });
    this.width = Math.max(this.width, 100);
    this.halfWidth = this.width / 2;
    this.columnWidth = this.width / this.chartsDataVisible.length;
  }

  setHover(position, captionX, captionsY) {
    this.position = position;
    this.captionX = captionX;
    this.captionsY = captionsY;
  }

  draw(ctx) {
    if (this.position !== null) {
      let x = this.position - this.halfWidth;
      x = Math.max(1, x);
      x = Math.min(x, ctx.canvas.offsetWidth - this.width - 1);
      ctx.save();
      this._drawRect(ctx, x);
      ctx.restore();
      ctx.save();
      this._drawText(ctx, x + 10, this.captionX);
      ctx.restore();
    }
  }

  _drawRect(ctx, x) {
    const y = this.offsetTop;
    const width = this.width;
    const height = Config.layout.tooltip.height;
    const radius = 5;
    ctx.strokeStyle = Config.colors.greyLine;
    ctx.fillStyle = this.background;
    ctx.shadowColor =  this.shadowColor;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 10;
    // ctx.fillRect(x, y, width, height);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  _drawText(ctx, x, captionX) {
    let positionY = this.offsetTop + 20;
    this._drawDate(ctx, x, positionY, captionX);

    positionY += 25;
    let textOffset = 0;
    this.captionsY.forEach((captionY, index) => {
      const chartData = this.chartsData[index];
      if (chartData.visible) {
        this._drawValue(
          ctx,
          x + textOffset,
          positionY,
          captionY,
          chartData.color
        );
        this._drawChartName(
          ctx,
          x + textOffset,
          positionY + 15,
          chartData.name,
          chartData.color
        );
        textOffset += this.columnWidth;
      }
    });
  }

  _drawDate(ctx, x, y, text) {
    ctx.fillStyle = this.dateTextColor;
    ctx.font = Config.fonts.highlight.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.fillText(text, x, y);
  }

  _drawValue(ctx, x, y, text, color) {
    ctx.fillStyle = color;
    ctx.font = 'bold ' + Config.fonts.highlight.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.fillText(text, x, y);
  }

  _drawChartName(ctx, x, y, text, color) {
    ctx.fillStyle = color;
    ctx.font = Config.fonts.regular.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.fillText(text, x, y);
  }
}

export default Tooltip;

