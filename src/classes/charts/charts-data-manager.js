import Converter from '../converter';
import Utils from "../utils";

class ChartsDataManager {

  constructor(chartData) {
    this.chartsData = chartData;
    this.converter = null;
    this.visibleRange = [0, 1];
    this.visibleCharts = [];
  }

  setLayout(layout) {
    this.converter = new Converter(this.getAllValuesX(), this.getAllValuesY(), layout);
  }

  setVisibleRange(visibleRange) {
    this.visibleRange = visibleRange;
    this.converter.setVisibleRange(visibleRange);
    this.converter.setMaxY(this.getMaxVisibleValueY());
  }

  getNormalizedChartsData() {
    const result = [];
    for (let chartIndex = 0; chartIndex < this.getChartsAmount(); chartIndex++) {
      result.push(this.prepareChartData(chartIndex));
    }
    return result;
  }

  getBaseName() {
    return 'Chart ' + (this.chartsData.index + 1);
  }

  getNames() {
    const names = [];
    this.chartsData.columns.forEach((column) => {
      const columnIndex = column[0];
      if (this.chartsData.names[columnIndex]) {
        names.push(this.chartsData.names[columnIndex]);
      }
    });
    return names;
  }

  getColors() {
    const colors = [];
    this.chartsData.columns.forEach((column) => {
      const columnIndex = column[0];
      if (this.chartsData.colors[columnIndex]) {
        colors.push(this.chartsData.colors[columnIndex]);
      }
    });
    return colors;
  }

  getAllValuesX() {
    return this.getValuesInColumn(this.chartsData.types.x);
  }

  getAllValuesY() {
    const columns = this.chartsData.columns.filter((column) => column[0] !== this.chartsData.types.x);
    let allValuesY = [];
    columns.forEach((column) => allValuesY = allValuesY.concat(column.slice(1)));
    return allValuesY;
  }

  getMaxVisibleValueY() {
    const [from, to] = this.visibleRange;
    let maxVisibleY = null;
    this.getNormalizedChartsData()
      .filter((chart) => chart.visible)
      .forEach((chart) => {
        const indexFrom = Math.floor(chart.valuesY.length * from);
        const indexTo = Math.ceil(chart.valuesY.length * to);
        const valuesY = chart.valuesY.slice(indexFrom, indexTo);
        const max = Utils.getMax(valuesY);
        maxVisibleY = maxVisibleY ? Math.max(maxVisibleY, max) : max;
      });
    if (!maxVisibleY) {
      maxVisibleY = Utils.getMax(this.getAllValuesY());
    }
    return maxVisibleY;
  }

  getPositionsOnAxisX() {
    return this.getAllValuesX().map((x) => this.converter.xCoordToXPxPosition(x));
  }

  getPositionsOnAxisY() {
    return this.getCaptionsOnAxisY().map((y) => this.converter.yCoordToYPxPosition(y));
  }

  getCaptionsOnAxisX() {
    return this.getAllValuesX().map((x) => {
      const date = new Date(x);
      return Utils.formatMonth(date.getMonth()) + ' ' + date.getDate();
    });
  }

  getCaptionsOnAxisY() {
    const captions = [];
    for (let i = this.converter.minY; i < this.converter.maxY; i += this.converter.stepY) {
      captions.push(i);
    }
    return captions;
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
      visible: this.visibleCharts.indexOf(chartIndex) < 0,
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

  toggleChart(index) {
    this.visibleCharts[index] = this.visibleCharts.indexOf(index) < 0 ? index : null;
    this.converter.setMaxY(this.getMaxVisibleValueY());
  }

}

export default ChartsDataManager;