import Config from '../../json/config';
import Charts from '../charts';
import store from '../../redux/store';

export default class {

  constructor(chartsData) {
    const chartsFactory = new Charts(chartsData, Config.layout.navigation);
    this.charts = chartsFactory.getCharts();
  }

  draw(ctx) {
    this.charts.forEach((chart) => chart.draw(ctx));
    this.drawHandler(ctx);
  }

  drawHandler(ctx) {
    const width = Config.layout.navigation.width;
    const halfWidth = width / 2;
    let offsetLeft = Config.layout.navigation.offsetLeft;
    const transparentPartWidth = 100;
    this.drawHandlerPart(
      ctx,
      offsetLeft,
      halfWidth
    );
    this.drawHandlerPart(
      ctx,
      offsetLeft + halfWidth + transparentPartWidth,
      width - halfWidth - transparentPartWidth,
    );
  }

  drawHandlerPart(ctx, offsetLeft, width) {
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
