class LineChart {

  constructor(data) {
    this.data = data;
    this.animationTime = 5;
    this.targetY = [];
  }

  draw(ctx) {
    if (this._needAnimation()) {
      this._animate();
    }
    this._drawLine(ctx);
  }

  updatePositions(positionsX, positionsY) {
    this.data.positionsX = positionsX.slice(0);
    this.targetY = positionsY.slice(0); // target for animation
  }

  _animate() {
    let inProgress = false;
    this.data.positionsY = this.data.positionsY.map((position, i) => {
      const target = this.targetY[i];
      const delta = target - position;
      if (delta !== 0) {
        inProgress = true;
        position = this._recalculatePosition(position, delta);
      }
      return position;
    });
    if (!inProgress) {
      this.targetY = [];
    }
  }

  _recalculatePosition(position, delta) {
    let increment = delta / this.animationTime;
    if (delta > 0) {
      increment = Math.min(Math.ceil(increment), delta);
    } else if (delta < 0) {
      increment = Math.max(Math.floor(increment), delta);
    }
    position += increment;
    return position;
  }

  _needAnimation() {
    return this.targetY.length;
  }

  _drawLine(ctx) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.data.color;
    ctx.beginPath();
    const x = this.data.positionsX[0];
    const y = this.data.positionsY[0];
    ctx.moveTo(x, y);
    for (let i = 1; i < this.data.valuesCount; i++) {
      const x = this.data.positionsX[i];
      const y = this.data.positionsY[i];
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

export default LineChart;

