import Config from '../../json/config';
import ChartsFactory from '../charts/charts-factory';
import store from '../../redux/store';

export default class {

  constructor(chartsData) {
    const { visibleRange } = store.getState();
    this.chartsFactory = (new ChartsFactory())
      .setChartsData(chartsData)
      .setLayout(Config.layout.main)
      .enableHover()
      .setVisibleRange(visibleRange)
    ;
    this.charts = this.chartsFactory.createCharts();
    this.grid = this.chartsFactory.createGrid();
    this.tooltip = this.chartsFactory.createTooltip();
    this._bindEvents();
  }

  draw() {
    this.grid.draw();
    this.charts.forEach((chart) => chart.draw());
    this.tooltip.draw();
  }

  _bindEvents() {
    store.subscribe(() => this.onStoreUpdate());
  }

  onStoreUpdate() {
    const { visibleRange } = store.getState();
    this.chartsFactory.setVisibleRange(visibleRange);
    this.charts = this.chartsFactory.createCharts();
    this.grid = this.chartsFactory.createGrid();
    this.tooltip = this.chartsFactory.createTooltip();
  }
}
