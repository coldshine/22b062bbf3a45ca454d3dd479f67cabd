import { ctx } from '../canvas';
import Config from '../../json/config';
import Charts from '../charts';
import store from '../../redux/store';

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
