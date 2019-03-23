import Config from '../../../config';

class GridView {

  constructor(positionsX, captionsX, positionsY, captionsY, layout) {
    const sidePadding = 10; // px
    const offsetTop = 20; // technical offset in px
    const xAxisCaptionOffset = 20; // px
    this.minSpaceBetweenVerticalLines = 80; // px
    this.animationTime = 5; // ms
    this.layout = layout;
    this.positionsX = positionsX;
    this.captionsX = captionsX;
    this.originalPositionsY = positionsY.slice(0);
    this.positionsY = positionsY;
    this.captionsY = captionsY;

    this.horizontalLine = {
      offsetLeft: this.layout.offsetLeft + sidePadding,
      length: this.layout.width - (sidePadding * 2)
    };
    this.verticalLine = {
      offsetTop: this.layout.offsetTop - offsetTop,
      length: this.layout.height + offsetTop
    };

    this.xAxisCaptionPositionY = this.layout.offsetTop + this.layout.height + xAxisCaptionOffset;
    this.opacititesX = this.calculateOpacitiesX();
    this.hoverPositionX = null;
    this.targetOpacititesX = [];

    this.targetPositionsY = [];
    this.newPositionsY = [];
    this.newTargetPositionsY = [];
    this.newCaptionsY = [];
    this.opacityY = 1;
    this.targetOpacityY = 1;
    this.newOpacityY = 0;
    this.newTargetOpacityY = 0;
  }

  calculateOpacitiesX() {
    let stepX = Math.ceil(this.minSpaceBetweenVerticalLines / (this.positionsX[1] - this.positionsX[0]));
    stepX = Math.pow(2, Math.round(Math.sqrt(stepX)));
    const opacities = Array(this.positionsX.length).fill(0);
    for (let i = 0; i < this.positionsX.length; i+=stepX) {
      opacities[i] = 1;
    }
    return opacities;
  }

  updatePositions(newPositionsX, newCaptionsY) {
    this.positionsX = newPositionsX.slice(0);
    this.targetOpacititesX = this.calculateOpacitiesX();

    this.newTargetPositionsY = this.originalPositionsY.slice(0);
    this.targetOpacityY = 0;
    this.newTargetOpacityY = 1;

    if (this.newCaptionsY[1] !== newCaptionsY[1]) {
      this.newCaptionsY = newCaptionsY.slice(0);
      if (this.captionsY[1] > newCaptionsY[1]) {
        // from bottom to top
        this.targetPositionsY = this.originalPositionsY.map((positionY) => positionY - ((this.originalPositionsY[0] - positionY) * 1.1));
        this.newPositionsY = this.originalPositionsY.map((positionY) => positionY + ((this.originalPositionsY[0] - positionY) * 0.9));
      } else if (this.captionsY[1] < newCaptionsY[1]) {
        // from top to bottom
        this.targetPositionsY = this.originalPositionsY.map((positionY) => positionY + ((this.originalPositionsY[0] - positionY) * 0.9));
        this.newPositionsY = this.originalPositionsY.map((positionY) => positionY - ((this.originalPositionsY[0] - positionY) * 1.1));
      }
    }
  }

  setHoverPositionX(hoverPositionX) {
    this.hoverPositionX = hoverPositionX;
  }

  draw(ctx) {
    if (this._needAnimationX()) {
      this._animateX();
    }
    if (this._needAnimationY()) {
      this._animateY();
      this._drawGridY(ctx, this.newPositionsY, this.newCaptionsY, this.newOpacityY);
    }
    this._drawGridY(ctx, this.positionsY, this.captionsY, this.opacityY);
    this._drawBottomSquare(ctx);
    this._drawGridX(ctx, this.positionsX, this.captionsX, this.opacititesX, true);
    if (this.hoverPositionX !== null) {
      this._drawVerticalGridLine(ctx, this.hoverPositionX);
    }
  }

  _animateX() {
    this._animateOpacity('opacititesX', 'targetOpacititesX');
  }

  _animateY() {
    let inProgress = false;

    this.positionsY = this.positionsY.map((position, i) => {
      const targetPosition = this.targetPositionsY[i];
      const delta = targetPosition - position;
      let increment = delta / this.animationTime;
      if (delta !== 0) {
        inProgress = true;
        if (delta > 0) {
          increment = Math.min(Math.ceil(increment), delta);
        } else if (delta < 0) {
          increment = Math.max(Math.floor(increment), delta);
        }
        position += increment;
      }
      return position;
    });

    this.newPositionsY = this.newPositionsY.map((position, i) => {
      const targetPosition = this.newTargetPositionsY[i];
      const delta = targetPosition - position;
      let increment = delta / this.animationTime;
      if (delta !== 0) {
        inProgress = true;
        if (delta > 0) {
          increment = Math.min(Math.ceil(increment), delta);
        } else if (delta < 0) {
          increment = Math.max(Math.floor(increment), delta);
        }
        position += increment;
      }
      return position;
    });

    let opacityDeltaY = this.targetOpacityY - this.opacityY;
    let opacityIncrement = (opacityDeltaY / this.animationTime).toFixedNumber(1);
    if (opacityIncrement === 0) {
      this.opacityY = Math.round(this.opacityY);
      opacityDeltaY = 0;
    }
    if (opacityDeltaY !== 0) {
      inProgress = true;
      if (opacityDeltaY > 0) {
        opacityIncrement = Math.min(opacityIncrement, opacityDeltaY);
      } else if (opacityDeltaY < 0) {
        opacityIncrement = Math.max(opacityIncrement, opacityDeltaY);
      }
      this.opacityY += opacityIncrement;
    }

    let newOpacityDeltaY = this.newTargetOpacityY - this.newOpacityY;
    let newOpacityIncrement = (newOpacityDeltaY / this.animationTime).toFixedNumber(1);
    if (newOpacityIncrement === 0) {
      this.newOpacityY = Math.round(this.newOpacityY);
      newOpacityDeltaY = 0;
    }
    if (newOpacityDeltaY !== 0) {
      inProgress = true;
      if (opacityDeltaY > 0) {
        newOpacityIncrement = Math.min(newOpacityIncrement, opacityDeltaY);
      } else if (opacityDeltaY < 0) {
        newOpacityIncrement = Math.max(newOpacityIncrement, opacityDeltaY);
      }
      this.newOpacityY += newOpacityIncrement;
    }

    if (!inProgress) {
      this.positionsY = this.newTargetPositionsY.slice(0);
      this.captionsY = this.newCaptionsY.slice(0);
      this.opacityY = this.newOpacityY;
      this.targetPositionsY = [];
      this.newPositionsY = [];
      this.newTargetPositionsY = [];
    }
  }

  _animateOpacity(current, target) {
    let inProgress = false;
    this[current] = this[current].map((opacity, i) => {
      const targetOpacity = this[target][i];
      let delta = targetOpacity - opacity;
      let increment = (delta / this.animationTime).toFixedNumber(2);
      if (increment === 0) {
        opacity = Math.round(opacity);
        delta = 0;
      }
      if (delta !== 0) {
        inProgress = true;
        if (delta > 0) {
          increment = Math.min(increment, delta);
        } else if (delta < 0) {
          increment = Math.max(increment, delta);
        }
        opacity += increment;
      }
      return opacity;
    });
    if (!inProgress) {
      this[target] = [];
    }
  }

  _needAnimationX() {
    return this.targetOpacititesX.length;
  }

  _needAnimationY() {
    return this.targetPositionsY.length;
  }

  _drawGridX(ctx, positions, captions, opacitites, hideLine = false) {
    ctx.save();
    for (let i = 0; i <= positions.length; i++) {
      ctx.globalAlpha = opacitites[i];
      if (!hideLine) {
        this._drawVerticalGridLine(ctx, positions[i])
      }
      this._drawGridText(ctx, captions[i], positions[i], this.xAxisCaptionPositionY, 'center');
    }
    ctx.restore();
  }

  _drawGridY(ctx, positions, captions, opacity) {
    ctx.save();
    for (let i = 0; i < positions.length; i ++) {
      ctx.globalAlpha = opacity;
      this._drawHorizontalGridLine(ctx, positions[i]);
      this._drawGridText(ctx, captions[i], this.horizontalLine.offsetLeft, positions[i] - 10, 'left');
    }
    ctx.restore();
  }

  _drawHorizontalGridLine(ctx, y) {
    ctx.fillStyle = Config.colors.greyLine;
    ctx.fillRect(this.horizontalLine.offsetLeft, y - 1, this.horizontalLine.length, 1);
  }

  _drawVerticalGridLine(ctx, x) {
    ctx.fillStyle = Config.colors.greyLine;
    ctx.fillRect(x, this.verticalLine.offsetTop, 1, this.verticalLine.length);
  }

  _drawGridText(ctx, text, x, y, align) {
    ctx.fillStyle = Config.colors.greyText;
    ctx.font = Config.fonts.regular.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.lineWidth = 1;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  _drawBottomSquare(ctx) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(
      Config.layout.main.offsetLeft,
      Config.layout.main.offsetTop + Config.layout.main.height,
      Config.layout.main.width,
      ctx.canvas.offsetHeight - Config.layout.main.height
    );
    ctx.restore();
  }

}

export default GridView;

