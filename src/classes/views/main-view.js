import Config from '../../json/config';
import Utils from '../utils';
import Grid from '../grid';
import Charts from '../charts';
import Tooltip from './tooltip-view';
import store from '../../redux/store';

export default class {

  constructor(chartsData) {
    const {minX, maxX} = store.getState();
    this.chartsFactory = new Charts(chartsData, Config.layout.main);
    this.chartsFactory.reduceValuesByX(minX, maxX);

    const converter = this.chartsFactory.getConverter();
    const charts = this.chartsFactory.getCharts();

    this.grid = new Grid(converter);
    this.tooltip = new Tooltip(charts, converter);

    this.converter = converter;
    this.charts = charts;
    this.selectedValueX = null;
    this.selectedValueIndex = null;

    store.subscribe(() => this.onStoreUpdate())
  }

  draw(ctx) {
    this.grid.draw(ctx, this.selectedValueX);
    this.charts.forEach((chart) => chart.draw(ctx, this.selectedValueX, this.selectedValueIndex));
    this.tooltip.draw(ctx, this.selectedValueX);
  }

  onStoreUpdate() {
    const {mouseX, mouseY, minX, maxX} = store.getState();
    this.handleMouseMove(mouseX, mouseY);
    this.handleVisibleRangeUpdate(minX, maxX);
  }

  handleMouseMove(mouseX, mouseY) {
    if (Utils.isMouseInsideLayout(mouseX, mouseY, Config.layout.main)) {
      this.selectedValueX = this.converter.pxToValueX(mouseX);
      this.selectedValueIndex = this.converter.valuesX.indexOf(this.selectedValueX);
    } else {
      this.reset();
    }
  }

  handleVisibleRangeUpdate(minX, maxX) {
    this.chartsFactory.reduceValuesByX(minX, maxX);

    const converter = this.chartsFactory.getConverter();
    const charts = this.chartsFactory.getCharts();

    this.grid = new Grid(converter);
    this.tooltip = new Tooltip(charts, converter);

    this.converter = converter;
    this.charts = charts;
  }

  reset() {
    this.selectedValueX = null;
    this.selectedValueIndex = null;
  }

}
