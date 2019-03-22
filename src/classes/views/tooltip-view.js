import Config from '../../json/config';

class Tooltip {

  constructor() {
    this.layout = Config.layout.tooltip;
    this.halfWidth = this.layout.width / 2;
    this.hoverX = {
      position: null,
      caption: null,
    };
  }

  setCharts(charts) {
    this.charts = charts;
  }

  setHoverX(position, caption) {
    this.hoverX = { position, caption };
  }

  draw(ctx) {
    if (this.hoverX.position !== null) {
      const x = this.hoverX.position - this.halfWidth;
      this._drawRect(ctx, x);
      this._drawText(ctx, x + 10, this.hoverX.caption);
    }
  }

  _drawRect(ctx, x) {
    const {width, height, offsetTop} = this.layout;
    ctx.save();
    ctx.strokeStyle = Config.colors.greyLine;
    ctx.fillStyle = 'white';
    ctx.shadowColor =  Config.colors.shadow;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;
    ctx.beginPath();
    ctx.rect(x, offsetTop, width, height);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  _drawText(ctx, x, caption) {
    const {offsetTop} = this.layout;
    let positionY = offsetTop + 20;
    this._drawDate(ctx, x, positionY, caption);

    positionY += 25;
    let textOffset = 0;
    this.charts.forEach((chart) => {
      this._drawValue(
        ctx,
        x + textOffset,
        positionY,
        chart.hoverValueY,
        chart.data.color
      );
      this._drawChartName(
        ctx,
        x + textOffset,
        positionY + 15,
        chart.data.name,
        chart.data.color
      );
      textOffset += this.halfWidth;
    });
  }

  _drawDate(ctx, x, y, text) {
    ctx.save();
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

