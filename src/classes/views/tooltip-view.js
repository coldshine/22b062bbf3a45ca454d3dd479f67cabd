import Config from '../../json/config';

class Tooltip {

  constructor() {
    this.layout = Config.layout.tooltip;
    this.hoverPositionX = null;
    this.hoverValueX = null;
  }

  setCharts(charts) {
    this.charts = charts;
  }

  setHoverValueX(hoverValueX) {
    this.hoverValueX = hoverValueX;
  }

  setHoverPositionX(hoverPositionX) {
    this.hoverPositionX = hoverPositionX;
  }

  draw(ctx) {
    if (this.hoverPositionX !== null && this.hoverValueX !== null) {
      this._drawSquare(ctx, this.hoverPositionX);
      this._drawText(ctx, this.hoverPositionX, this.hoverValueX);
    }
  }

  _drawSquare(ctx, x) {
    ctx.save();
    const {width, height, offsetTop} = this.layout;
    ctx.strokeStyle = '#bdbdbd';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(x - width / 2, offsetTop, width, height);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  _drawText(ctx, x, caption) {
    let {offsetTop} = this.layout;
    offsetTop += 10;
    ctx.save();
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.fillText(caption, x, offsetTop);

    offsetTop += 10;
    let textOffset = 0;
    this.charts.forEach((chart) => {
      ctx.strokeStyle = chart.data.color;
      ctx.fillStyle = chart.data.color;
      ctx.fillText(chart.hoverValueY, x + textOffset, offsetTop);
      textOffset += 20;
    });
    ctx.restore();
  }
}

export default Tooltip;

