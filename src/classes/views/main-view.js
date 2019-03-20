import Config from '../../json/config';
import ChartsFactory from '../charts/charts-factory';
import { getVisibleRange, subscribe } from '../charts/charts-visible-range';

export default class {

  constructor(canvas, ctx, chartsData) {
    const visibleRange = getVisibleRange();
    this.chartsFactory = (new ChartsFactory(canvas))
      .setChartsData(chartsData)
      .setLayout(Config.layout.main)
      .enableHover()
      .setVisibleRange(visibleRange)
    ;
    this.ctx = ctx;
    this.charts = this.chartsFactory.createCharts();
    this.grid = this.chartsFactory.createGrid();
    this.tooltip = this.chartsFactory.createTooltip();
    this._bindEvents();
  }

  draw() {
    this.grid.draw(this.ctx);
    this.charts.forEach((chart) => chart.draw(this.ctx));
    this.tooltip.draw(this.ctx);
  }

  _bindEvents() {
    subscribe(() => this.onStoreUpdate());
  }

  onStoreUpdate() {
    const visibleRange = getVisibleRange();
    this.chartsFactory.setVisibleRange(visibleRange);
  }
}
