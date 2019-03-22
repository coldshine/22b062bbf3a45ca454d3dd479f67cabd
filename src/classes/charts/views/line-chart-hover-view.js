class LineChartHover {

  constructor(data) {
    this.data = data;
    this.hoverX = null;
    this.hoverY = null;
  }

  setHoverPosition(x, y) {
    this.hoverX = x || null;
    this.hoverY = y || null;
  }

  updateVisibility(visible) {
    this.data.visible = visible;
  }

  draw(ctx) {
    if (this.hoverX > 0 && this.hoverY > 0 && this.data.visible) {
      ctx.save();
      ctx.strokeStyle = this.data.color;
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.hoverX, this.hoverY, 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }

}

export default LineChartHover;
