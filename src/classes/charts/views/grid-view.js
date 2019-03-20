import { ctx } from '../../canvas';
import Utils from '../../utils';
import Config from '../../../json/config';

class GridView {

  constructor(positionsX, captionsX, positionsY, captionsY, layout) {
    const sidePadding = 10;
    const minSpaceBetweenGridLineX = 30;

    this.layout = layout;
    this.positionsX = positionsX;
    this.captionsX = captionsX;
    this.positionsY = positionsY;
    this.captionsY = captionsY;
    this.minX = this.layout.offsetLeft + sidePadding;
    this.maxX = this.layout.offsetLeft + this.layout.width - sidePadding;
    this.minY = this.layout.offsetTop + this.layout.height;
    this.maxY = this.layout.offsetTop;
    this.stepX = minSpaceBetweenGridLineX / (this.positionsX[1] - this.positionsX[0]);
    this.animationTime = 5;
    this.hoverPositionX = null;
    this.targetPositionsY = [];
  }

  updatePositions(newPositionsX, newPositionsY, newCaptionsY) {
    this.positionsX = newPositionsX.slice(0);
    this.targetPositionsY = newPositionsY.slice(0);

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

  draw() {
    if (this._needAnimation()) {
      this._animate();
    }
    this._drawGridY();
    this._drawBottomSquare();
    this._drawGridX(true);
    if (this.hoverPositionX !== null) {
      this._drawVerticalGridLine(this.hoverPositionX);
    }
  }

  _animate() {
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

  _needAnimation() {
    return this.targetPositionsY.length;
  }

  _drawGridX(hideLines = false) {
    for (let i = 0; i <= this.positionsX.length; i += this.stepX) {
      const positionX = this.positionsX[i];
      const caption = this.captionsX[i];
      if (!hideLines) {
        this._drawVerticalGridLine(positionX)
      }
      this._drawGridText(caption, positionX, this.minY + 20, 'center');
    }
  }

  _drawGridY() {
    for (let i = 0; i <= this.positionsY.length; i ++) {
      const positionY = this.positionsY[i];
      const caption = this.captionsY[i];
      this._drawHorizontalGridLine(positionY);
      this._drawGridText(caption, this.minX, positionY - 10, 'left');
    }
  }

  _drawHorizontalGridLine(y) {
    this._drawGridLine(this.minX, y, this.maxX, y);
  }

  _drawVerticalGridLine(x) {
    this._drawGridLine(x, this.maxY, x, this.minY);
  }

  _drawGridLine(fromX, fromY, toX, toY) {
    ctx.save();
    ctx.strokeStyle = 'rgba(209,209,209,1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // ctx.moveTo(fromX + Utils.aliasPixel(fromX), fromY + Utils.aliasPixel(fromY));
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.restore();
  }

  _drawGridText(text, x, y, align) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = 1;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  _drawBottomSquare() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(
      Config.layout.main.offsetLeft,
      Config.layout.main.offsetTop + Config.layout.main.height,
      Config.layout.main.width,
      Config.layout.canvas.height - Config.layout.main.height
    );
    ctx.restore();
  }

}

export default GridView;

