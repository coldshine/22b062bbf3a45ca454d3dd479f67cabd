import Converter from '../converter';
import Utils from "../utils";

class ChartsDataManager {

  constructor(chartData) {
    this.chartsData = chartData;
    this.converter = null;
    this.visibleRange = null;
  }

  setLayout(layout) {
    this.converter = new Converter(this.getAllValuesX(), this.getAllValuesY(), layout);
  }

  setVisibleRange(visibleRange) {
    this.visibleRange = visibleRange;
    this.converter.setVisibleRange(visibleRange);
    this.converter.setMaxVisibleValueY(this.getMaxVisibleValueY(visibleRange));
  }

  getNormalizedData() {
    const result = [];
    for (let chartIndex = 0; chartIndex < this.getChartsAmount(); chartIndex++) {
      let chartData = this.extractChartData(chartIndex);
      chartData = this.calculatePositions(chartData);
      result.push(chartData);
    }
    return result;
  }

  getAllValuesX() {
    return this.getValuesInColumn(this.chartsData.types.x);
  }

  getAllValuesY() {
    const columns = this.chartsData.columns.filter((column) => column[0] !== this.chartsData.types.x);
    let allValuesY = [0]; // chart values should started with zero
    columns.forEach((column) => {
      allValuesY = allValuesY.concat(column.slice(1));
    });
    return allValuesY;
  }

  getMaxVisibleValueY(visibleRange) {
    const [from, to] = visibleRange;
    let maxVisibleValueY = 0;
    this.getNormalizedData().forEach((chart) => {
      const indexFrom = Math.floor(chart.valuesY.length * from);
      const indexTo = Math.ceil(chart.valuesY.length * to);
      const valuesY = chart.valuesY.slice(indexFrom, indexTo);
      const [min, max] = Utils.getMinMax(valuesY);
      maxVisibleValueY = Math.max(maxVisibleValueY, max);
    });
    return maxVisibleValueY;
  }

  getAllPositionsX() {
    return this.getAllValuesX().map((x) => this.converter.xCoordToXPxPosition(x));
  }

  getAllCaptionsX() {
    return this.getAllValuesX().map((x) => {
      const date = new Date(x);
      return Utils.formatMonth(date.getMonth()) + ' ' + date.getDate();
    });
  }

  getCaptionsOnAxisY() {
    const captions = [];
    const step = Math.round(this.converter.maxY / 5);
    for (let i = 0; i <= this.converter.maxY; i += step) {
      captions.push(i);
    }
    return captions;
  }

  getPositionsOnAxisY() {
    return this.getCaptionsOnAxisY().map((y) => this.converter.yCoordToYPxPosition(y));
  }

  getValuesInColumn(columnKey) {
    return this.chartsData.columns.filter((column) => columnKey === column[0])[0].slice(1);
  }

  getChartsAmount() {
    return this.chartsData.columns.length - 1;
  }

  extractChartData(chartIndex) {
    const chartKey = `y${chartIndex}`;
    return {
      type: this.chartsData.types[chartKey],
      color: this.chartsData.colors[chartKey],
      name: this.chartsData.names[chartKey],
      valuesCount: this.getAllValuesX().length,
      valuesX: this.getAllValuesX(),
      valuesY: this.getValuesInColumn(chartKey),
    };
  }

  calculatePositions(chartData) {
    chartData.positions = [];
    for (let i = 0; i < chartData.valuesCount; i++) {
      const x = chartData.valuesX[i];
      const y = chartData.valuesY[i];
      chartData.positions.push(this.converter.coordsToPxPosition(x, y));
    }
    return chartData;
  }

  getHoverPosition(mouseX, mouseY) {
    let hoveredValueIndex = null;
    if (Utils.isMouseInsideLayout(mouseX, mouseY, this.converter.layout)) {
      const hoveredValueX = this.converter.pxPositionXToValueX(mouseX);
      hoveredValueIndex = this.converter.valuesX.indexOf(hoveredValueX);
    }
    return hoveredValueIndex;
  }

}

export default ChartsDataManager;