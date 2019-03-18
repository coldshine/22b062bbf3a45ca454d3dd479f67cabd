import Converter from '../converter';
import Utils from "../utils";

class ChartsDataManager {

  constructor(chartData) {
    this.chartsData = chartData;
    this.converter = null;
    this.visibleRange = null;
    this.yAxisSteps = [0.5, 1, 2, 5, 10, 20]; // toDo
  }

  setLayout(layout) {
    this.converter = new Converter(this.getAllValuesX(), this.getAllValuesY(), layout);
  }

  setVisibleRange(visibleRange) {
    this.visibleRange = visibleRange;
    this.converter.setVisibleRange(visibleRange);
    this.converter.setMaxVisibleValueY(this.getMaxVisibleValueY(visibleRange));
  }

  getNormalizedChartsDataAll() {
    const result = [];
    for (let chartIndex = 0; chartIndex < this.getChartsAmount(); chartIndex++) {
      result.push(this.prepareChartData(chartIndex));
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
    this.getNormalizedChartsDataAll().forEach((chart) => {
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
    for (let i = 0; i < this.converter.maxY; i += step) {
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

  prepareChartData(chartIndex) {
    const chartKey = `y${chartIndex}`;
    const valuesX = this.getAllValuesX();
    const valuesY = this.getValuesInColumn(chartKey);
    const valuesCount = valuesX.length;
    const [positionsX, positionsY] = this.calculatePositions(valuesX, valuesY, valuesCount);
    return {
      index: chartIndex,
      type: this.chartsData.types[chartKey],
      color: this.chartsData.colors[chartKey],
      name: this.chartsData.names[chartKey],
      valuesCount,
      valuesX,
      valuesY,
      positionsX,
      positionsY,
    };
  }

  calculatePositions(valuesX, valuesY, valuesCount) {
    const positionsX = [];
    const positionsY = [];
    for (let i = 0; i < valuesCount; i++) {
      const x = valuesX[i];
      const y = valuesY[i];
      const [positionX, positionY] = this.converter.coordsToPxPosition(x, y);
      positionsX.push(positionX);
      positionsY.push(positionY);
    }
    return [positionsX, positionsY];
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