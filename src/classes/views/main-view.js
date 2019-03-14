import Config from '../../json/config';
import Grid from '../grid';
import Charts from '../charts';
import SelectedValuesPopup from './selected-values-popup-view';

export default class {

  constructor(chartsData, minX, maxX) {

    const chartsFactory = new Charts(chartsData);
    chartsFactory.setViewportSize(Config.layout.chartSize);
    chartsFactory.reduceValuesByX(minX, maxX);

    const allValuesX = chartsFactory.getAllValuesX();
    const allValuesY = chartsFactory.getAllValuesY();
    const converter = chartsFactory.getConverter();
    const charts = chartsFactory.getCharts();

    this.grid = new Grid(allValuesX, allValuesY, converter);
    this.selectedValuesPopup = new SelectedValuesPopup(allValuesX, allValuesY, charts, converter);

    this.allValuesX = allValuesX;
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
    this.selectedValueIndex = this.allValuesX.indexOf(this.selectedValueX);
  }

}
