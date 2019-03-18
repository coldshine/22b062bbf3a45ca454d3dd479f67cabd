import { ctx } from '../../canvas';

class LineChart {

  constructor(data) {
    this.data = data;
    this.hasAnimation = false;
    this.animationId = null;
    this.animationSpeed = 5;
  }

  enableAnimation() {
    this.hasAnimation = true;
    this.targetY = [];
  }

  updatePositions(positionsX, positionsY) {
    this._updateX(positionsX);
    this._updateY(positionsY);
  }

  _updateX(positionsX) {
    this.data.positionsX = positionsX.slice(0);
  }

  _updateY(positionsY) {
    if (this.hasAnimation) {
      this.targetY = positionsY.slice(0);
      this._startAnimation();
    } else {
      this.data.positionsY = positionsY.slice(0);
    }
  }

  _startAnimation() {
    this._stopAnimation();
    this.animationId = setInterval(() => {
      if (this._isAnimationCompleted()) {
        this._stopAnimation();
      } else {
        this.data.positionsY = this._recalculatePositions(this.data.positionsY, this.targetY);
      }
    }, 10);
  }

  _stopAnimation() {
    if (this.animationId) {
      clearInterval(this.animationId);
    }
  }

  _isAnimationCompleted() {
    let deltaY = 0;
    for (let i = 0; i < this.data.positionsY.length; i++) {
      const currentY = this.data.positionsY[i];
      const targetY = this.targetY[i];
      deltaY = Math.max(Math.abs(targetY - currentY), deltaY);
    }
    return deltaY === 0;
  }

  _recalculatePositions(positions, targets) {
    return positions.map((position, i) => {
      const target = targets[i];
      const delta = target - position;
      let increment = delta / this.animationSpeed;
      if (delta > 0) {
        increment = Math.min(Math.ceil(increment), delta);
      } else if (delta < 0) {
        increment = Math.max(Math.floor(increment), delta);
      }
      position += increment;
      return position;
    });
  }

  draw() {
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

