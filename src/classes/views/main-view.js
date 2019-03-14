import Config from '../../json/config';
import Grid from '../grid';
import Charts from '../charts';
import SelectedValuesPopup from './selected-values-popup-view';

export default class {

  constructor(chartsData, minX, maxX) {

    const chartsFactory = new Charts(chartsData, Config.layout.chartSize);
    chartsFactory.reduceValuesByX(minX, maxX);

    const converter = chartsFactory.getConverter();
    const charts = chartsFactory.getCharts();

    this.grid = new Grid(converter);
    this.selectedValuesPopup = new SelectedValuesPopup(charts, converter);

    this.converter = converter;
    this.charts = charts;
    this.selectedValueX = null;
    this.selectedValueIndex = null;
  }

  draw(ctx) {
    this.grid.draw(ctx, this.selectedValueX);
    this.charts.forEach((chart) => chart.draw(ctx, this.selectedValueX, this.selectedValueIndex));
    this.selectedValuesPopup.draw(ctx, this.selectedValueX);
  }

  onMouseMove(mouseX) {
    this.selectedValueX = this.converter.pxToValueX(mouseX);
    this.selectedValueIndex = this.converter.valuesX.indexOf(this.selectedValueX);
  }

}
