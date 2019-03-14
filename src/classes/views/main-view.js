import Config from '../../json/config';
import Utils from '../utils';
import Grid from '../grid';
import Charts from '../charts';
import Tooltip from './tooltip-view';
import store from '../../redux/store';

export default class {

  constructor(chartsData) {
    const {minX, maxX, mouseX, mouseY} = store.getState();

    this.minX = minX;
    this.maxX = maxX;
    this.mouseX = mouseX;
    this.mouseY = mouseY;

    this.chartsFactory = new Charts(chartsData, Config.layout.main);
    this.chartsFactory.reduceValuesByX(minX, maxX);

    this.converter = this.chartsFactory.getConverter();
    this.charts = this.chartsFactory.getCharts();

    this.grid = new Grid(this.converter);
    this.tooltip = new Tooltip(this.charts, this.converter);

    this.selectedValueX = null;
    this.selectedValueIndex = null;

    store.subscribe(() => this.onStoreUpdate())
  }

  draw() {
    this.grid.draw(this.selectedValueX);
    this.charts.forEach((chart) => chart.draw(this.selectedValueX, this.selectedValueIndex));
    this.tooltip.draw(this.selectedValueX);
  }

  onStoreUpdate() {
    const {mouseX, mouseY, minX, maxX} = store.getState();
    if (this.isMousePositionChanged(mouseX, mouseY)) {
      this.handleMouseMove(mouseX, mouseY);
      }
    if (this.isVisibleRangeChanged(minX, maxX)) {
      this.handleVisibleRangeUpdate(minX, maxX);
    }
  }

  handleMouseMove(mouseX, mouseY) {
    if (Utils.isMouseInsideLayout(mouseX, mouseY, Config.layout.main)) {
      this.selectedValueX = this.converter.pixelToValueX(mouseX);
      this.selectedValueIndex = this.converter.valuesX.indexOf(this.selectedValueX);
    } else {
      this.reset();
    }
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  handleVisibleRangeUpdate(minX, maxX) {
    this.chartsFactory.reduceValuesByX(minX, maxX);

    this.converter = this.chartsFactory.getConverter();
    this.charts = this.chartsFactory.getCharts();

    this.grid = new Grid(this.converter);
    this.tooltip = new Tooltip(this.charts, this.converter);

    this.minX = minX;
    this.maxX = maxX;
  }

  isVisibleRangeChanged(minX, maxX) {
    return this.minX !== minX || this.maxX !== maxX;
  }

  isMousePositionChanged(mouseX, mouseY) {
    return this.mouseX !== mouseX || this.mouseY !== mouseY;
  }

  reset() {
    this.selectedValueX = null;
    this.selectedValueIndex = null;
  }

}
