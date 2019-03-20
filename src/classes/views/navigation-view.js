import Config from '../../json/config';
import ChartsFactory from '../charts/charts-factory';
import { getVisibleRange, updateVisibleRange } from '../charts/charts-visible-range';

export default class {

  constructor(canvas, ctx, chartsData) {
    const [visibleRangeFrom, visibleRangeTo] = getVisibleRange();
    this.canvas = canvas;
    this.ctx = ctx;
    this.boundingClientRect = canvas.getBoundingClientRect();
    this.chartsFactory = (new ChartsFactory(canvas))
      .setChartsData(chartsData)
      .setLayout(Config.layout.navigation)
    ;
    this.charts = this.chartsFactory.createCharts();
    this.rangeFromPx = this._convertRangePercentsToPx(visibleRangeFrom);
    this.rangeToPx  = this._convertRangePercentsToPx(visibleRangeTo);
    this.prevRangeMoveMouseX = null;
    this.deltaRangeMoveMouseX = 0;
    this.mouseBorderWidth = 40;
    this.mouseBorderWidthHalf = Math.round(this.mouseBorderWidth / 2);
    this.prevLeftBorderMoveMouseX = null;
    this.prevRightBorderMoveMouseX = null;
    this.deltaLeftBorderMoveMouseX = 0;
    this.deltaRightBorderMoveMouseX = 0;
    this.minVisibleRangeDelta = 60;
    this.bindEvents();
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
    document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    document.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
  }

  onMouseDown(e) {
    const [mouseX, mouseY] = this._getMouseLocalPosition(e);
    this.prevLeftBorderMoveMouseX = this._isMouseOnLeftRangeBorder(mouseX, mouseY) ? mouseX : null;
    this.prevRightBorderMoveMouseX = this._isMouseOnRightRangeBorder(mouseX, mouseY) ? mouseX : null;
    if (!(this.prevLeftBorderMoveMouseX || this.prevRightBorderMoveMouseX)) {
      this.prevRangeMoveMouseX = this._isMouseOnRange(mouseX, mouseY) ? mouseX : null;
    }
  }

  onMouseMove(e) {
    const isMouseOut = this._isMouseOutsideOfPage(e);
    const [mouseX, mouseY] = this._getMouseLocalPosition(e);
    document.body.style.cursor = this._isMouseOnRangeBorder(mouseX, mouseY)  ? 'ew-resize' : this._isMouseOnRange(mouseX, mouseY) ? 'grab' : 'default';
    if (this.prevRangeMoveMouseX) {
      this.deltaRangeMoveMouseX = mouseX - this.prevRangeMoveMouseX;
      this._handleRangeMove();
      if (!isMouseOut) {
        this.prevRangeMoveMouseX = mouseX;
      }
    }
    if (this.prevLeftBorderMoveMouseX) {
      this.deltaLeftBorderMoveMouseX = mouseX - this.prevLeftBorderMoveMouseX;
      this._handleRangeLeftBorderMove();
      if (!isMouseOut) {
        this.prevLeftBorderMoveMouseX = mouseX;
      }
    }
    if (this.prevRightBorderMoveMouseX) {
      this.deltaRightBorderMoveMouseX = mouseX - this.prevRightBorderMoveMouseX;
      this._handleRangeRightBorderMove();
      if (!isMouseOut) {
        this.prevRightBorderMoveMouseX = mouseX;
      }
    }
  }

  onMouseUp(e) {
    this.prevRangeMoveMouseX = null;
    this.prevLeftBorderMoveMouseX = null;
    this.prevRightBorderMoveMouseX = null;
  }

  _handleRangeMove() {
    document.body.style.cursor = 'grabbing';
    let delta;
    let needUpdate = false;
    if (this.deltaRangeMoveMouseX > 0) {
      // move right
      delta = this._getIncreasingDelta(this.deltaRangeMoveMouseX);
      needUpdate = true;
    } else if (this.deltaRangeMoveMouseX < 0) {
      // move left
      delta = this._getDecreasingDelta(this.deltaRangeMoveMouseX);
      needUpdate = true;
    }
    if (needUpdate) {
      this.rangeFromPx+=delta;
      this.rangeToPx+=delta;
      this._updateRange();
    }
  }

  _handleRangeLeftBorderMove() {
    let delta;
    if (this.deltaLeftBorderMoveMouseX > 0) {
      // move right
      delta = this._getIncreasingDelta(this.deltaLeftBorderMoveMouseX);
      delta = Math.min(delta, this.rangeToPx - this.minVisibleRangeDelta - this.rangeFromPx);
      this.rangeFromPx+=delta;
      this._updateRange();
    } else if (this.deltaLeftBorderMoveMouseX < 0) {
      // move left
      delta = this._getDecreasingDelta(this.deltaLeftBorderMoveMouseX);
      this.rangeFromPx+=delta;
      this._updateRange();
    }
  }

  _handleRangeRightBorderMove() {
    let delta;
    if (this.deltaRightBorderMoveMouseX > 0) {
      // move right
      delta = this._getIncreasingDelta(this.deltaRightBorderMoveMouseX);
      this.rangeToPx+=delta;
      this._updateRange();
    } else if (this.deltaRightBorderMoveMouseX < 0) {
      // move left
      delta = this._getDecreasingDelta(this.deltaRightBorderMoveMouseX);
      delta = Math.max(delta, -(this.rangeToPx - this.rangeFromPx - this.minVisibleRangeDelta));
      this.rangeToPx+=delta;
      this._updateRange();
    }
  }

  _updateRange() {
    const from = this._convertRangePxToPercents(this.rangeFromPx);
    const to = this._convertRangePxToPercents(this.rangeToPx);
    updateVisibleRange(from, to);
  }

  _isMouseOnRange(mouseX, mouseY) {
    return mouseX.between(this.rangeFromPx, this.rangeToPx) && this._isMouseYInsideLayout(mouseY);
  }

  _isMouseOnRangeBorder(mouseX, mouseY) {
    return this._isMouseOnLeftRangeBorder(mouseX, mouseY) || this._isMouseOnRightRangeBorder(mouseX, mouseY);
  }

  _isMouseOnLeftRangeBorder(mouseX, mouseY) {
    return mouseX.between(this.rangeFromPx - this.mouseBorderWidthHalf, this.rangeFromPx + this.mouseBorderWidthHalf) && this._isMouseYInsideLayout(mouseY);
  }

  _isMouseOnRightRangeBorder(mouseX, mouseY) {
    return mouseX.between(this.rangeToPx - this.mouseBorderWidthHalf, this.rangeToPx + this.mouseBorderWidthHalf) && this._isMouseYInsideLayout(mouseY);
  }

  _isMouseOutsideOfPage(e) {
    return e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight);
  }

  _isMouseYInsideLayout(mouseY) {
    return mouseY.between(Config.layout.navigation.offsetTop, this.boundingClientRect.height);
  }

  _getIncreasingDelta(delta) {
    return Math.min(Config.layout.navigation.width - this.rangeToPx, delta);
  }

  _getDecreasingDelta(delta) {
    return Math.max(-this.rangeFromPx, delta);
  }

  _convertRangePercentsToPx(percents) {
    return percents * Config.layout.navigation.width;
  }

  _convertRangePxToPercents(px) {
    return px / Config.layout.navigation.width;
  }

  _getMouseLocalPosition(e) {
    const mouseX = Math.round(e.clientX - this.boundingClientRect.left);
    const mouseY = Math.round(e.clientY - this.boundingClientRect.top);
    return [mouseX, mouseY];
  }

  draw() {
    this.drawHandler();
    this.charts.forEach((chart) => chart.draw(this.ctx));
    this.drawCover();
  }

  drawHandler() {
    this.drawHandlerTopBottom(Config.layout.navigation.offsetTop);
    this.drawHandlerTopBottom(Config.layout.navigation.offsetTop + Config.layout.navigation.height - 3);
    this.drawHandlerSide(this.rangeFromPx);
    this.drawHandlerSide(this.rangeFromPx );
    this.drawHandlerSide(this.rangeToPx - 5);
  }

  drawHandlerTopBottom(offsetTop) {
    const height = 3;
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(234,255,221,1)';
    this.ctx.beginPath();
    this.ctx.rect(
      this.rangeFromPx,
      offsetTop,
      this.rangeToPx - this.rangeFromPx,
      height
    );
    this.ctx.fill();
    this.ctx.restore();
  }

  drawHandlerSide(x) {
    const width = 5;
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(234,255,221,1)';
    this.ctx.beginPath();
    this.ctx.rect(
      x,
      Config.layout.navigation.offsetTop,
      width,
      Config.layout.navigation.height
    );
    this.ctx.fill();
    this.ctx.restore();
  }

  drawCover() {
    const width = Config.layout.navigation.width;
    const offsetLeft = Config.layout.navigation.offsetLeft;
    this.drawCoverPart(
      offsetLeft,
      this.rangeFromPx
    );
    this.drawCoverPart(
      offsetLeft + this.rangeToPx,
      width - this.rangeToPx,
    );
  }

  drawCoverPart(offsetLeft, width) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(234,255,221,0.5)';
    this.ctx.beginPath();
    this.ctx.rect(
      offsetLeft,
      Config.layout.navigation.offsetTop,
      width,
      Config.layout.navigation.height
    );
    this.ctx.fill();
    this.ctx.restore();
  }

}
