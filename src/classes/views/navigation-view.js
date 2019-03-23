import Config from '../../config';
import ChartsFactory from '../charts/charts-factory';
import { getVisibleRange, updateVisibleRange } from '../charts/charts-visible-range';

export default class {

  constructor(ctx, chartsData) {
    const [visibleRangeFrom, visibleRangeTo] = getVisibleRange();
    this.ctx = ctx;
    this.chartsFactory = (new ChartsFactory(this.ctx.canvas))
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
    this.index = chartsData.index;
    this.mouseX = null;
    this.mouseY = null;
    this.bindEvents();
  }

  bindEvents() {
    this.clickAndMoveMouseHandler = (e) => this.onClickAndMoveMouse(e.clientX, e.clientY);
    this.tapAndSwipeHandler = (e) => this.onClickAndMoveMouse(e.touches[0].clientX, e.touches[0].clientY);

    this.ctx.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e.clientX, e.clientY), false);
    this.ctx.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e.clientX, e.clientY), false);
    this.ctx.canvas.addEventListener('mouseleave', () => this.onMouseLeave(), false);
    document.addEventListener('mouseup', () => this.onMouseUp(), false);

    this.ctx.canvas.addEventListener("touchstart", (e) => this.onMouseDown(e.touches[0].clientX, e.touches[0].clientY), false);
    this.ctx.canvas.addEventListener("touchend", () => this.onMouseUp(), false);
    this.ctx.canvas.addEventListener("touchcancel", () => this.onMouseUp(), false);
  }

  onMouseDown(clientX, clientY) {
    document.addEventListener('mousemove', this.clickAndMoveMouseHandler, false);
    document.addEventListener('touchmove', this.tapAndSwipeHandler, false);
    this._actualizeMouseLocalPosition(clientX, clientY);
    this.prevLeftBorderMoveMouseX = this._isMouseOnLeftRangeBorder() ? this.mouseX : null;
    this.prevRightBorderMoveMouseX = this._isMouseOnRightRangeBorder() ? this.mouseX : null;
    if (!(this.prevLeftBorderMoveMouseX || this.prevRightBorderMoveMouseX)) {
      this.prevRangeMoveMouseX = this._isMouseOnRange() ? this.mouseX : null;
    }
  }

  onMouseMove(clientX, clientY) {
    this._actualizeMouseLocalPosition(clientX, clientY);
    document.body.style.cursor = this._isMouseOnRangeBorder()  ? 'ew-resize' :
      this._isMouseOnRange() ? 'grab' : 'default';
  }

  onClickAndMoveMouse(clientX, clientY) {
    const isMouseOut = this._isMouseOutsideOfPage(clientX, clientY);
    this._actualizeMouseLocalPosition(clientX, clientY);
    if (this.prevRangeMoveMouseX) {
      this.deltaRangeMoveMouseX = this.mouseX - this.prevRangeMoveMouseX;
      this._handleRangeMove();
      if (!isMouseOut) {
        this.prevRangeMoveMouseX = this.mouseX;
      }
    }
    if (this.prevLeftBorderMoveMouseX) {
      this.deltaLeftBorderMoveMouseX = this.mouseX - this.prevLeftBorderMoveMouseX;
      this._handleRangeLeftBorderMove();
      if (!isMouseOut) {
        this.prevLeftBorderMoveMouseX = this.mouseX;
      }
    }
    if (this.prevRightBorderMoveMouseX) {
      this.deltaRightBorderMoveMouseX = this.mouseX - this.prevRightBorderMoveMouseX;
      this._handleRangeRightBorderMove();
      if (!isMouseOut) {
        this.prevRightBorderMoveMouseX = this.mouseX;
      }
    }
  }

  onMouseLeave() {
    document.body.style.cursor = 'default';
  }

  onMouseUp() {
    document.removeEventListener('mousemove', this.clickAndMoveMouseHandler, false);
    document.removeEventListener('touchmove', this.tapAndSwipeHandler, false);
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
    let needUpdate = false;
    if (this.deltaLeftBorderMoveMouseX > 0) {
      // move right
      delta = Math.min(this.deltaLeftBorderMoveMouseX, this.rangeToPx - this.minVisibleRangeDelta - this.rangeFromPx);
      needUpdate = true;
    } else if (this.deltaLeftBorderMoveMouseX < 0) {
      // move left
      delta = this._getDecreasingDelta(this.deltaLeftBorderMoveMouseX);
      needUpdate = true;
    }
    if (needUpdate) {
      this.rangeFromPx+=delta;
      this._updateRange();
    }
  }

  _handleRangeRightBorderMove() {
    let delta;
    let needUpdate = false;
    if (this.deltaRightBorderMoveMouseX > 0) {
      // move right
      delta = this._getIncreasingDelta(this.deltaRightBorderMoveMouseX);
      needUpdate = true;
    } else if (this.deltaRightBorderMoveMouseX < 0) {
      // move left
      delta = Math.max(this.deltaRightBorderMoveMouseX, -(this.rangeToPx - this.rangeFromPx - this.minVisibleRangeDelta));
      needUpdate = true;
    }
    if (needUpdate) {
      this.rangeToPx+=delta;
      this._updateRange();
    }
  }

  _updateRange() {
    const from = this._convertRangePxToPercents(this.rangeFromPx);
    const to = this._convertRangePxToPercents(this.rangeToPx);
    updateVisibleRange(this.index, from, to);
  }

  _isMouseOnRange() {
    return this.mouseX.between(this.rangeFromPx, this.rangeToPx) && this._isMouseYInsideLayout();
  }

  _isMouseOnRangeBorder() {
    return this._isMouseOnLeftRangeBorder() || this._isMouseOnRightRangeBorder();
  }

  _isMouseOnLeftRangeBorder() {
    return this.mouseX.between(this.rangeFromPx - this.mouseBorderWidthHalf, this.rangeFromPx + this.mouseBorderWidthHalf) && this._isMouseYInsideLayout();
  }

  _isMouseOnRightRangeBorder() {
    return this.mouseX.between(this.rangeToPx - this.mouseBorderWidthHalf, this.rangeToPx + this.mouseBorderWidthHalf) && this._isMouseYInsideLayout();
  }

  _isMouseOutsideOfPage(clientX, clientY) {
    return clientY <= 0 || clientX <= 0 || (clientX >= window.innerWidth || clientY >= window.innerHeight);
  }

  _isMouseYInsideLayout() {
    const rect = this.ctx.canvas.getBoundingClientRect();
    return this.mouseY.between(Config.layout.navigation.offsetTop, rect.height);
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

  _actualizeMouseLocalPosition(clientX, clientY) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    this.mouseX = Math.round(clientX - rect.left);
    this.mouseY = Math.round(clientY - rect.top);
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
    this.ctx.fillStyle = Config.colors.navigationHandler;
    this.ctx.fillRect(
      this.rangeFromPx,
      offsetTop,
      this.rangeToPx - this.rangeFromPx,
      height
    );
    this.ctx.restore();
  }

  drawHandlerSide(x) {
    const width = 5;
    this.ctx.save();
    this.ctx.fillStyle = Config.colors.navigationHandler;
    this.ctx.fillRect(
      x,
      Config.layout.navigation.offsetTop,
      width,
      Config.layout.navigation.height
    );
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
    this.ctx.fillStyle = Config.colors.navigationCover;
    this.ctx.fillRect(
      offsetLeft,
      Config.layout.navigation.offsetTop,
      width,
      Config.layout.navigation.height
    );
    this.ctx.restore();
  }

  toggleChart(index) {
    this.chartsFactory.toggleChart(index);
  }
}
