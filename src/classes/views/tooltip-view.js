import Config from '../../config';

class Tooltip {

  constructor(chartsData) {
    this.offsetTop = Config.layout.tooltip.offsetTop;
    this.position = null;
    this.captionX = null;
    this.captionsY = [];
    this.pixelsPerChar = 10; //px
    this.minColumnWidth = 70; //px
    this.updateChartsData(chartsData);
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
      this._drawRect(ctx, x);
      this._drawText(ctx, x + 10, this.captionX);
    }
  }

  _drawRect(ctx, x) {
    ctx.save();
    ctx.strokeStyle = Config.colors.greyLine;
    ctx.fillStyle = 'white';
    ctx.shadowColor =  Config.colors.shadow;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;
    ctx.beginPath();
    ctx.rect(x, this.offsetTop, this.width, Config.layout.tooltip.height);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
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
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.font = Config.fonts.highlight.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  _drawValue(ctx, x, y, text, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = 'bold ' + Config.fonts.highlight.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  _drawChartName(ctx, x, y, text, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = Config.fonts.regular.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}

export default Tooltip;

