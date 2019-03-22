import Utils from '../../utils';
import Config from '../../../config';

class GridView {

  constructor(positionsX, captionsX, positionsY, captionsY, layout) {
    const sidePadding = 10;
    this.minSpaceBetweenGridLineX = 80;
    this.layout = layout;
    this.positionsX = positionsX;
    this.captionsX = captionsX;
    this.positionsY = positionsY;
    this.captionsY = captionsY;
    this.minX = this.layout.offsetLeft + sidePadding;
    this.maxX = this.layout.offsetLeft + this.layout.width - sidePadding;
    this.minY = this.layout.offsetTop + this.layout.height;
    this.maxY = this.layout.offsetTop;
    this.xAxisCaptionPositionY = this.minY + 20;
    this.opacititesX = this.calcOpacitiesX();
    this.animationTime = 5;
    this.hoverPositionX = null;
    this.targetPositionsY = [];
    this.targetOpacititesX = [];
  }

  calcOpacitiesX() {
    let stepX = Math.ceil(this.minSpaceBetweenGridLineX / (this.positionsX[1] - this.positionsX[0]));
    const progression = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]; // toDo refactor this
    stepX = progression.findClosestValue(stepX);
    const opacities = Array(this.positionsX.length).fill(0);
    for (let i = 0; i <= this.positionsX.length; i+=stepX) {
      opacities[i] = 1;
    }
    return opacities;
  }

  updatePositions(newPositionsX, newPositionsY, newCaptionsY) {
    this.positionsX = newPositionsX.slice(0);
    this.targetPositionsY = newPositionsY.slice(0);

    this.targetOpacititesX = this.calcOpacitiesX();

    const captionsY = newCaptionsY.slice(0);
    const targetPositionsY = newPositionsY.slice(0);
    let positionsY = [];

    const [minCaptionY, maxCaptionY] = Utils.getMinMax(captionsY);

    // move out min and max values
    this.captionsY.forEach((captionY) => {
      if (captionY > maxCaptionY) {
        // add values to the end
        captionsY.push(captionY);
        targetPositionsY.push(-100);
      } else if (captionY < minCaptionY) {
        // add values to the beginning
        captionsY.unshift(captionY);
        targetPositionsY.unshift(this.layout.height + 100);
      }
    });

    // merging current values
    captionsY.forEach((captionY) => {
      const currentCaptionIndexY = this.captionsY.indexOf(captionY);
      let currentPositionY;
      if (currentCaptionIndexY >= 0) {
        currentPositionY = this.positionsY[currentCaptionIndexY];
      }
      positionsY.push(currentPositionY);
    });

    // setting undefined positions
    const diffMiddle = Math.round(this.positionsY[1] - this.positionsY[0]) / 2;
    positionsY = positionsY.map((positionY, index) => {
      if (!positionY) {
        const prev = positionsY[index - 1];
        positionY = diffMiddle + prev;
      }
      return positionY;
    });

    // if there's still undefined values
    positionsY = positionsY.map((positionY, index) => positionY ? positionY : targetPositionsY[index]);


    this.positionsY = positionsY;
    this.captionsY = captionsY;
    this.targetPositionsY = targetPositionsY;
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
    }
    this._drawGridY(ctx);
    this._drawBottomSquare(ctx);
    this._drawGridX(ctx, true);
    if (this.hoverPositionX !== null) {
      this._drawVerticalGridLine(ctx, this.hoverPositionX);
    }
  }

  _animateX() {
    let inProgress = false;
    this.opacititesX = this.opacititesX.map((opacity, i) => {
      const targetOpacity = this.targetOpacititesX[i];
      const delta = targetOpacity - opacity;
      let increment = delta / this.animationTime;
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
      this.targetOpacititesX = [];
    }
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
    if (!inProgress) {
      this.targetPositionsY = [];
    }
  }

  _needAnimationX() {
    return this.targetOpacititesX.length;
  }

  _needAnimationY() {
    return this.targetPositionsY.length;
  }

  _drawGridX(ctx, hideLines = false) {
    for (let i = 0; i <= this.positionsX.length; i++) {
      const positionX = this.positionsX[i];
      const caption = this.captionsX[i];
      const opacity = this.opacititesX[i];
      if (!hideLines) {
        this._drawVerticalGridLine(ctx, positionX)
      }
      this._drawGridText(ctx, caption, positionX, this.xAxisCaptionPositionY, 'center', opacity);
    }
  }

  _drawGridY(ctx) {
    for (let i = 0; i <= this.positionsY.length; i ++) {
      const positionY = this.positionsY[i];
      const caption = this.captionsY[i];
      this._drawHorizontalGridLine(ctx, positionY);
      this._drawGridText(ctx, caption, this.minX, positionY - 10, 'left');
    }
  }

  _drawHorizontalGridLine(ctx, y) {
    ctx.save();
    ctx.fillStyle = Config.colors.greyLine;
    ctx.fillRect(this.minX, y - 1, this.maxX, 1);
    ctx.restore();
  }

  _drawVerticalGridLine(ctx, x) {
    ctx.save();
    ctx.fillStyle = Config.colors.greyLine;
    ctx.fillRect(x, this.maxY, 1, this.minY);
    ctx.restore();
  }

  _drawGridText(ctx, text, x, y, align, opacity = 1) {
    ctx.save();
    ctx.fillStyle = Config.colors.greyText;
    ctx.font = Config.fonts.regular.fontSize + ' ' + Config.fonts.regular.fontFamily;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = 1;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.restore();
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

