import Config from '../../json/config';
import Charts from '../charts';

export default class {

  constructor(chartsData) {
    const chartsFactory = new Charts(chartsData, Config.layout.navigationSize);
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
      0,
      Config.layout.chartSize[1] + 20,
      Config.layout.canvasSize[0],
      Config.layout.canvasSize[1] - Config.layout.chartSize[1] - 20
    );
    ctx.fill();
  }
}
