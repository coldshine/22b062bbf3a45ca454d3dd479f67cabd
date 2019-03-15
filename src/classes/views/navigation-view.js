import { boundingClientRect, canvas, ctx } from '../canvas';
import Config from '../../json/config';
import Charts from '../charts';
import store from '../../redux/store';
import { updateVisibleRange } from '../../redux/actions';

export default class {

  constructor(chartsData) {
    const {minX, maxX} = store.getState();
    const chartsFactory = new Charts(chartsData, Config.layout.navigation);
    this.charts = chartsFactory.getCharts();
    this.converter = chartsFactory.getConverter();
    this.rangeFromPx = this.converter.valueXToPixel(minX);
    this.rangeToPx = this.converter.valueXToPixel(maxX);
    this.bindEvents();
  }

  bindEvents() {
    let currentMouseX = false;
    canvas.addEventListener("mousedown", (e) => {
      const mouseX = Math.round(e.clientX - boundingClientRect.left);
      const mouseY = Math.round(e.clientY - boundingClientRect.top);
      if (mouseX.between(this.rangeFromPx, this.rangeToPx) && mouseY.between(Config.layout.navigation.offsetTop, boundingClientRect.height)) {
        currentMouseX = mouseX;
      } else {
        currentMouseX = false;
      }
    }, false);
    document.addEventListener("mousemove", (e) => {
      const isMouseOut = e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight);
      const mouseX = Math.round(e.clientX - boundingClientRect.left);
      if (currentMouseX) {
        const delta = Math.abs(currentMouseX - mouseX);
        if (mouseX > currentMouseX) {
          if (this.rangeToPx <= boundingClientRect.width) {
            // move right
            this.rangeFromPx+=delta;
            this.rangeToPx+=delta;
            this.dispatchUpdateVisibleRange();
          }
        } else if (mouseX < currentMouseX) {
          if (this.rangeFromPx >= 0) {
            // move left
            this.rangeFromPx-=delta;
            this.rangeToPx-=delta;
            this.dispatchUpdateVisibleRange();
          }
        }
        if (!isMouseOut) {
          currentMouseX = mouseX;
        }
      }
    }, false);
    canvas.addEventListener("mouseup", () => {
      currentMouseX = false;
    }, false);
  }

  dispatchUpdateVisibleRange() {
    const minX = this.converter.pixelToValueX(this.rangeFromPx);
    const maxX = this.converter.pixelToValueX(this.rangeToPx);
    store.dispatch(updateVisibleRange(minX, maxX));
  }

  draw() {
    this.charts.forEach((chart) => chart.draw());
    this.drawHandler();
  }

  drawHandler() {
    const width = Config.layout.navigation.width;
    let offsetLeft = Config.layout.navigation.offsetLeft;
    this.drawHandlerPart(
      offsetLeft,
      this.rangeFromPx
    );
    this.drawHandlerPart(
      offsetLeft + this.rangeToPx,
      width - this.rangeToPx,
    );
  }

  drawHandlerPart(offsetLeft, width) {
    ctx.fillStyle = 'rgba(234,255,221,0.5)';
    ctx.beginPath();
    ctx.rect(
      offsetLeft,
      Config.layout.navigation.offsetTop,
      width,
      Config.layout.navigation.height
    );
    ctx.fill();
  }

}
