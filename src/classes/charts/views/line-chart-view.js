class LineChart {

  constructor(data) {
    this.data = data;
    this.animationTime = 5;
    this.targetY = [];
    this.targetVisibility = true;
    this.opacity = 1;
  }

  draw(ctx) {
    if (this._needMoveAnimation()) {
      this._animateMovement();
    }
    if (this._needFadeAnimation()) {
      this._animateFade();
    }
    this._drawLine(ctx);
  }

  updatePositions(positionsX, positionsY) {
    this.data.positionsX = positionsX.slice(0);
    this.targetY = positionsY.slice(0); // target for animation
  }

  updateVisibility(visible) {
    this.targetVisibility = visible;
  }

  _animateMovement() {
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

  _animateFade() {
    if (this.targetVisibility) {
      this.opacity += 0.1;
    } else {
      this.opacity -= 0.1;
    }
    this.opacity = Math.min(this.opacity, 1);
    this.opacity = Math.max(this.opacity, 0);
    const inProgress = this.opacity.between(0, 1);
    if (!inProgress) {
      this.data.visible = this.targetVisibility;
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

  _needMoveAnimation() {
    return this.targetY.length;
  }

  _needFadeAnimation() {
    return this.data.visible !== this.targetVisibility;
  }

  _drawLine(ctx) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.data.color;
    ctx.globalAlpha = this.opacity;
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

