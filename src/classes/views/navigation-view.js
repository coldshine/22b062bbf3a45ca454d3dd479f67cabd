import Config from '../../json/config';
import Charts from '../charts';

export default class {

  constructor(chartsData) {
    const chartsFactory = new Charts(chartsData, Config.layout.navigation);
    this.charts = chartsFactory.getCharts();
  }

  draw(ctx) {
    this.drawContainer(ctx);
    this.charts.forEach((chart) => chart.draw(ctx));
  }

  drawContainer(ctx) {
    ctx.fillStyle = '#eaffdd';
    ctx.beginPath();
    ctx.rect(
      Config.layout.navigation.offsetLeft,
      Config.layout.navigation.offsetTop,
      Config.layout.navigation.width,
      Config.layout.navigation.height
    );
    ctx.fill();
  }
}
