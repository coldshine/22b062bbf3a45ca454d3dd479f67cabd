import { ctx } from '../../canvas';

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
  }

  updatePositions(positionsX, positionsY, captionsY) {
    this.positionsX = positionsX;
    this.positionsY = positionsY;
    this.captionsY = captionsY;
  }

  setHoverPositionX(hoverPositionX) {
    this.hoverPositionX = hoverPositionX;
  }

  draw() {
    this._drawGridX(true);
    this._drawGridY();
    if (this.hoverPositionX !== null) {
      this._drawVerticalGridLine(this.hoverPositionX);
    }
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
    ctx.strokeStyle = '#d1d1d1';
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
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

}

export default GridView;

