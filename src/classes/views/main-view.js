import Config from '../../json/config';
import Utils from '../utils';
import Grid from '../grid';
import Charts from '../charts';
import Tooltip from './tooltip-view';
import store from '../../redux/store';
import { updateHoveredValueIndex } from '../../redux/actions';
import { boundingClientRect } from "../canvas";

export default class {

  constructor(chartsData) {
    const {minX, maxX} = store.getState();

    this.minX = minX;
    this.maxX = maxX;
    this.chartsFactory = new Charts(chartsData, Config.layout.main);
    this.chartsFactory.enableHover();
    this.chartsFactory.reduceValuesByX(minX, maxX);
    this.converter = this.chartsFactory.getConverter();
    this.charts = this.chartsFactory.getCharts();
    this.grid = new Grid(this.converter);
    this.tooltip = new Tooltip(this.charts, this.converter);
    this.hoveredValueIndex = null;

    this._bindEvents();
  }

  draw() {
    this.grid.draw();
    this.charts.forEach((chart) => chart.draw());
    this.tooltip.draw();
  }

  _bindEvents() {
    document.onmousemove = (e) => this.onMouseMove(e);
    store.subscribe(() => this.onStoreUpdate());
  }

  onMouseMove(e) {
    const mouseX = Math.round(e.clientX - boundingClientRect.left);
    const mouseY = Math.round(e.clientY - boundingClientRect.top);
    this.handleMouseMove(mouseX, mouseY);
  }

  onStoreUpdate() {
    const {minX, maxX} = store.getState();
    if (this.isVisibleRangeChanged(minX, maxX)) {
      this.handleVisibleRangeUpdate(minX, maxX);
    }
  }

  handleMouseMove(mouseX, mouseY) {
    let hoveredValueIndex = null;
    if (Utils.isMouseInsideLayout(mouseX, mouseY, Config.layout.main)) {
      const hoveredValueX = this.converter.pixelToValueX(mouseX);
      hoveredValueIndex = this.converter.valuesX.indexOf(hoveredValueX);
    }

    if (this.hoveredValueIndex !== hoveredValueIndex) {
      store.dispatch(updateHoveredValueIndex(hoveredValueIndex));
      this.hoveredValueIndex = hoveredValueIndex;
    }
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
}
