import LineChart from './charts/line-chart';
import Converter from './converter';

class ChartDataFormatter {

  constructor(chartData) {
    this.chartData = chartData;
  }

  getFormattedData() {
    const result = [];
    for (let chartIndex = 0; chartIndex < this.getChartsAmount(); chartIndex++) {
      result.push(this.extractChartData(chartIndex));
    }
    return result;
  }

  getAllValuesX() {
    return this.getValuesInColumn(this.chartData.types.x);
  }

  getAllValuesY() {
    const columns = this.chartData.columns.filter((column) => column[0] !== this.chartData.types.x);
    let allValuesY = [0]; // chart values should started with zero
    columns.forEach((column) => {
      allValuesY = allValuesY.concat(column.slice(1));
    });
    return allValuesY;
  }

  getValuesInColumn(columnKey) {
    return this.chartData.columns.filter((column) => columnKey === column[0])[0].slice(1);
  }

  getChartsAmount() {
    return this.chartData.columns.length - 1;
  }

  extractChartData(chartIndex) {
    const chartKey = `y${chartIndex}`;
    return {
      type: this.chartData.types[chartKey],
      color: this.chartData.colors[chartKey],
      name: this.chartData.names[chartKey],
      valuesCount: this.getAllValuesX().length,
      valuesX: this.getAllValuesX(),
      valuesY: this.getValuesInColumn(chartKey),
    };
  }

  reduceValuesByX(minX, maxX) {
    const [minValueIndex, maxValueIndex]  = this.getIndicesByValuesX(minX, maxX);
    this.reduceValuesTo(minValueIndex, maxValueIndex);
  }

  reduceValuesTo(minValueIndex, maxValueIndex) {
    this.chartData.columns = this.chartData.columns.map((column) => {
      return [column[0]].concat(column.slice(minValueIndex, maxValueIndex));
    });
  }

  getIndicesByValuesX(minX, maxX) {
    let minValueIndex = 0;
    let maxValueIndex = 0;

    this.getAllValuesX().forEach((xValue, i) => {
      if (xValue >= minX && !minValueIndex) {
        minValueIndex = i;
      }
      if (xValue >= maxX && !maxValueIndex) {
        maxValueIndex = i;
      }
    });
    return [minValueIndex, maxValueIndex];
  }

}

class ChartsFactory {

  constructor(chartsData, converter) {
    this.chartsData = chartsData;
    this.converter = converter;
  }

  fetch() {
    const converter = this.converter;
    const charts = [];
    this.chartsData.forEach((chartData) => {
      switch (chartData.type) {
        case 'line':
          charts.push(new LineChart(chartData, converter));
          break;
        default:
          console.error(`unsupported chart type ${type}`);
          break;
      }
    });

    return charts;
  }

}

export default class {

  constructor(chartData, layout) {
    this.layout = layout;
    this.dataFormatter = new ChartDataFormatter(Object.assign({}, chartData));
    this.converter = new Converter(this.dataFormatter.getAllValuesX(), this.dataFormatter.getAllValuesY(), this.layout);
    this.chartsFactory = new ChartsFactory(this.dataFormatter.getFormattedData(), this.converter);
  }

  reduceValuesByX(minX, maxX) {
    this.dataFormatter.reduceValuesByX(minX, maxX);
    this.converter = new Converter(this.dataFormatter.getAllValuesX(), this.dataFormatter.getAllValuesY(), this.layout);
    this.chartsFactory = new ChartsFactory(this.dataFormatter.getFormattedData(), this.converter);
  }

  getConverter() {
    return this.chartsFactory.converter;
  }

  getCharts() {
    return this.chartsFactory.fetch();
  }

}