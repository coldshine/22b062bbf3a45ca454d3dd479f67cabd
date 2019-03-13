import Data from './data';
import Config from './config';
import Charts from './charts';

const chartData = Data[0];

console.log(chartData);

class App {

  constructor(chartDataRaw) {
    const minX = 1546905600000; //ms
    const maxX = 1552003200000; //ms
    const valuesX = this._getValuesX(chartDataRaw);

    const [minValueIndex, maxValueIndex] = this._getVisibleValuesIndices(valuesX, minX, maxX);
    const visibleValuesX = valuesX.slice(minValueIndex, maxValueIndex);

    const chartData = this._prepareChartData(chartDataRaw, minValueIndex, maxValueIndex);

    const {canvas, ctx} = this._initCanvas();
    this.canvas = canvas;
    this.ctx = ctx;
    this.charts = new Charts(chartData, visibleValuesX, minX, maxX);
    // this.navigation = new Navigation(this);

    this._draw();
    this._bindEvents();
  }

  _initCanvas() {
    // const scaleFactor = 2.5;
    const scaleFactor = 1;
    const canvas = document.getElementById('canvas');
    const [width, height] = Config.layout.canvasSize;
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
    return {canvas, ctx};
  }

  _prepareChartData(chartData, minValueIndex, maxValueIndex) {
    const result = [];
    const chartsAmount = chartData.columns.length - 1;
    for (let chartIndex = 0; chartIndex < chartsAmount; chartIndex++) {
      const chartDataFormatted = this._extractChartData(chartData, chartIndex);
      chartDataFormatted.visibleValuesY = chartDataFormatted.valuesY.slice(minValueIndex, maxValueIndex);
      if (chartDataFormatted.type === 'line') {
        result.push(chartDataFormatted);
      } else {
        console.error(`unsupported chart type ${type}`)
      }
    }
    return result;
  }

  _extractChartData(chartData, chartIndex) {
    const chartKey = `y${chartIndex}`;
    return {
      type: chartData.types[chartKey],
      color: chartData.colors[chartKey],
      name: chartData.names[chartKey],
      valuesY: this._getValuesInColumn(chartData, chartKey),
    };
  }

  _getValuesInColumn(chartData, columnKey) {
    return chartData.columns.filter((column) => columnKey === column[0])[0].slice(1);
  }

  _getValuesX(chartData) {
    return this._getValuesInColumn(chartData, chartData.types.x);
  }

  _getVisibleValuesIndices(valuesX, minX, maxX) {
    let minValueIndex = 0;
    let maxValueIndex = 0;

    valuesX.forEach((xValue, i) => {
      if (xValue >= minX && !minValueIndex) {
        minValueIndex = i;
      }
      if (xValue >= maxX && !maxValueIndex) {
        maxValueIndex = i;
      }
    });
    return [minValueIndex, maxValueIndex];
  }

  _clear() {
    this.ctx.clearRect(0, 0, Config.layout.canvasSize[0], Config.layout.canvasSize[1]);
  }

  _draw() {
    this._clear();
    this.charts.draw(this.ctx);
    // this.navigation.draw();
    // window.requestAnimationFrame(() => this._draw());
  }

  _bindEvents() {
    document.onmousemove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = Math.round(e.clientX - rect.left);
      this.charts.onMouseMove(mouseX);
    }
  }

}

export default new App(chartData);
