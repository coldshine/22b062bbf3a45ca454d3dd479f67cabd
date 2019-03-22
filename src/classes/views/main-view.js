import Config from '../../config';
import ChartsFactory from '../charts/charts-factory';
import { getVisibleRange, subscribe } from '../charts/charts-visible-range';

export default class {

  constructor(ctx, chartsData) {
    const visibleRange = getVisibleRange();
    this.chartsFactory = (new ChartsFactory(ctx.canvas))
      .setChartsData(chartsData)
      .setLayout(Config.layout.main)
      .enableHover()
      .setVisibleRange(visibleRange)
    ;
    this.ctx = ctx;
    this.charts = this.chartsFactory.createCharts();
    this.grid = this.chartsFactory.createGrid();
    this.tooltip = this.chartsFactory.createTooltip();
    this.index = chartsData.index;
    this._bindEvents();
  }

  draw() {
    this.grid.draw(this.ctx);
    this.charts.forEach((chart) => chart.draw(this.ctx));
    this.tooltip.draw(this.ctx);
  }

  toggleChart(index) {
    this.chartsFactory.toggleChart(index);
  }

  _bindEvents() {
    subscribe(() => this.chartsFactory.setVisibleRange(getVisibleRange(this.index)));
  }
}
