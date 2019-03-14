import Config from '../../json/config';
import Grid from '../grid';
import Charts from '../charts';
import Tooltip from './tooltip-view';

export default class {

  constructor(chartsData, minX, maxX) {

    const chartsFactory = new Charts(chartsData, Config.layout.main);
    chartsFactory.reduceValuesByX(minX, maxX);

    const converter = chartsFactory.getConverter();
    const charts = chartsFactory.getCharts();

    this.grid = new Grid(converter);
    this.tooltip = new Tooltip(charts, converter);

    this.converter = converter;
    this.charts = charts;
    this.selectedValueX = null;
    this.selectedValueIndex = null;
  }

  draw(ctx) {
    this.grid.draw(ctx, this.selectedValueX);
    this.charts.forEach((chart) => chart.draw(ctx, this.selectedValueX, this.selectedValueIndex));
    this.tooltip.draw(ctx, this.selectedValueX);
  }

  onMouseMove(mouseX, mouseY) {
    const {width, height, offsetTop, offsetLeft} = Config.layout.main;
    if (mouseX.between(offsetLeft, offsetLeft + width) && mouseY.between(offsetTop, offsetTop + height)) {
      this.selectedValueX = this.converter.pxToValueX(mouseX);
      this.selectedValueIndex = this.converter.valuesX.indexOf(this.selectedValueX);
    } else {
      this.reset();
    }
  }

  reset() {
    this.selectedValueX = null;
    this.selectedValueIndex = null;
  }

}
