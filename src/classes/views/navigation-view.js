import Config from '../../config';
import ChartsFactory from '../charts/charts-factory';
import { eventTypes, store } from '../store';

export default class {

  constructor(ctx, chartsData) {
    const [visibleRangeFrom, visibleRangeTo] = store.getVisibleRange();
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
    this.background = 'white';
    this.coverColor = Config.colors.navigationCoverLight;
    this.handlerColor = Config.colors.navigationHandlerLight;
    this._bindEvents();
  }

  _bindEvents() {
    this.clickAndMoveMouseHandler = (e) => this._onClickAndMoveMouse(e.clientX, e.clientY);
    this.tapAndSwipeHandler = (e) => this._onClickAndMoveMouse(e.touches[0].clientX, e.touches[0].clientY);

    // mouse events
    this.ctx.canvas.addEventListener('mousedown', (e) => this._onMouseDown(e.clientX, e.clientY), false);
    this.ctx.canvas.addEventListener('mousemove', (e) => this._onMouseMove(e.clientX, e.clientY), false);
    this.ctx.canvas.addEventListener('mouseleave', () => this._onMouseLeave(), false);
    document.addEventListener('mouseup', () => this._onMouseUp(), false);

    // touch events
    this.ctx.canvas.addEventListener("touchstart", (e) => this._onMouseDown(e.touches[0].clientX, e.touches[0].clientY), false);
    this.ctx.canvas.addEventListener("touchend", () => this._onMouseUp(), false);
    this.ctx.canvas.addEventListener("touchcancel", () => this._onMouseUp(), false);

    // store events
    store.subscribe(eventTypes.toggleTheme, (eventType, theme) => this._onChangeTheme(theme))
  }

  _onChangeTheme(theme) {
    if (theme === Config.themes.night) {
      this.coverColor = Config.colors.navigationCoverDark;
      this.handlerColor = Config.colors.navigationHandlerDark;
      this.background = Config.colors.darkBlue;
    } else {
      this.coverColor = Config.colors.navigationCoverLight;
      this.handlerColor = Config.colors.navigationHandlerLight;
      this.background = 'white';
    }
  }

  _onMouseDown(clientX, clientY) {
    document.addEventListener('mousemove', this.clickAndMoveMouseHandler, false);
    document.addEventListener('touchmove', this.tapAndSwipeHandler, false);
    this._actualizeMouseLocalPosition(clientX, clientY);
    this.prevLeftBorderMoveMouseX = this._isMouseOnLeftRangeBorder() ? this.mouseX : null;
    this.prevRightBorderMoveMouseX = this._isMouseOnRightRangeBorder() ? this.mouseX : null;
    if (!(this.prevLeftBorderMoveMouseX || this.prevRightBorderMoveMouseX)) {
      this.prevRangeMoveMouseX = this._isMouseOnRange() ? this.mouseX : null;
    }
  }

  _onMouseMove(clientX, clientY) {
    this._actualizeMouseLocalPosition(clientX, clientY);
    document.body.style.cursor = this._isMouseOnRangeBorder()  ? 'ew-resize' :
      this._isMouseOnRange() ? 'grab' : 'default';
  }

  _onClickAndMoveMouse(clientX, clientY) {
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

  _onMouseLeave() {
    document.body.style.cursor = 'default';
  }

  _onMouseUp() {
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
    store.updateVisibleRange(this.index, from, to);
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
    this._drawBackground();
    this._drawHandler();
    this.charts.forEach((chart) => chart.draw(this.ctx));
    this._drawCover();
  }

  _drawHandler() {
    const x = this.rangeFromPx;
    const y = Config.layout.navigation.offsetTop;
    const width = this.rangeToPx - this.rangeFromPx;
    const height = Config.layout.navigation.height;

    this.ctx.save();
    this.ctx.fillStyle = this.handlerColor;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(x + 5, y + 3, width - 10, height - 6);
    this.ctx.restore();
  }

  _drawCover() {
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
    this.ctx.fillStyle = this.coverColor;
    this.ctx.fillRect(
      offsetLeft,
      Config.layout.navigation.offsetTop,
      width,
      Config.layout.navigation.height
    );
    this.ctx.restore();
  }

  _drawBackground() {
    this.ctx.save();
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(
      Config.layout.main.offsetLeft,
      Config.layout.main.offsetTop + Config.layout.main.height,
      Config.layout.main.width,
      this.ctx.canvas.offsetHeight - Config.layout.main.height
    );
    this.ctx.restore();
  }


  toggleChart(index) {
    this.chartsFactory.toggleChart(index);
  }
}
