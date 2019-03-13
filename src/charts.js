import Config from './config';
import Converter from './converter';
import Grid from './grid';
import LineChart from './line-chart';
import SelectedValuesPopup from './selected-values-popup';

export default class {

  constructor(chartData, valuesX, minX, maxX) {

    this.valuesX = valuesX;
    this.minX = minX;
    this.maxX = maxX;
    this.charts = [];
    let aggregatedValuesY = [0];
    chartData.forEach((lineData) => {
      aggregatedValuesY = aggregatedValuesY.concat(lineData.valuesY);
    });
    this.converter = new Converter(
      valuesX,
      aggregatedValuesY,
      Config.layout.chartSize
    );

    chartData.forEach((lineData) => {
      lineData.valuesX = valuesX;
      this.charts.push(
        new LineChart(
          lineData,
          this.converter
        )
      );
    });

    this.grid = new Grid(
      this.valuesX,
      aggregatedValuesY,
      this.converter
    );

    this.selectedValuesPopup = new SelectedValuesPopup(
      this.valuesX,
      aggregatedValuesY,
      this.charts,
      this.converter
    );

    this.selectedValueX = null;
    this.selectedValueIndex = null;
  }

  draw(ctx) {
    this.grid.draw(ctx, this.selectedValueX);
    this.charts.forEach((chart) => chart.draw(ctx, this.selectedValueX, this.selectedValueIndex));
    this.selectedValuesPopup.draw(ctx, this.selectedValueX);
  }

  onMouseMove(mouseX) {
    this.selectedValueX = this.converter.convertPxToCoord(mouseX);
    this.selectedValueIndex = this.valuesX.indexOf(this.selectedValueX);
  }

}

