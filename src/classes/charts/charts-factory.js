import LineChartView from './views/line-chart-view';
import LineChartHoverView from './views/line-chart-hover-view';
import GridView from './views/grid-view';
import ChartsDataManager from './charts-data-manager';
import Tooltip from '../views/tooltip-view';
import Utils from '../utils';

class ChartsFactory {

  constructor(canvas) {
    const boundingClientRect = canvas.getBoundingClientRect();

    this.canvas = canvas;
    this.offsetTop = boundingClientRect.top;
    this.offsetLeft = boundingClientRect.left;
    this.dataManager = null;
    this.hasHover = false;
    this.charts = [];
    this.grid = null;
    this.tooltip = null;
  }

  setChartsData(chartsData) {
    this.dataManager = new ChartsDataManager(chartsData);
    return this;
  }

  setLayout(layout) {
    this.dataManager.setLayout(layout);
    return this;
  }

  setVisibleRange(visibleRange) {
    this.dataManager.setVisibleRange(visibleRange);
    this.updateCharts();
    if (this.grid) {
      this.updateGrid();
    }
    return this;
  }

  enableHover() {
    this.hasHover = true;
    this._bindHoverEvents();
    return this;
  }

  createCharts() {
    this.dataManager.getNormalizedChartsData().forEach((item) => {
      switch (item.type) {
        case 'line':
          const chart = new LineChartView(item);
          this.charts.push(chart);
          break;
        default:
          console.error(`unsupported chart type ${type}`);
          break;
      }
    });
    if (this.hasHover) {
      this._createChartsHover();
    }
    return this.charts;
  }

  updateCharts() {
    const newChartsData = this.dataManager.getNormalizedChartsData();

    this.charts
      .filter((chart) => typeof chart.updatePositions === 'function')
      .forEach((chart) => {
        const currentChartData = chart.data;
        const {positionsX, positionsY} = newChartsData[currentChartData.index];
        chart.updatePositions(positionsX, positionsY);
      });

    this.charts.forEach((chart) => {
      const currentChartData = chart.data;
      const {visible} = newChartsData[currentChartData.index];
      chart.updateVisibility(visible);
    })
  }

  updateGrid() {
    this.grid.updatePositions(
      this.dataManager.getPositionsOnAxisX(),
      this.dataManager.getPositionsOnAxisY(),
      this.dataManager.getCaptionsOnAxisY(),
    );
  }

  createGrid() {
    this.grid = new GridView(
      this.dataManager.getPositionsOnAxisX(),
      this.dataManager.getCaptionsOnAxisX(),
      this.dataManager.getPositionsOnAxisY(),
      this.dataManager.getCaptionsOnAxisY(),
      this.dataManager.converter.layout
    );
    return this.grid;
  }

  createTooltip() {
    this.tooltip = new Tooltip(this.charts);
    return this.tooltip;
  }

  toggleChart(index) {
    this.dataManager.toggleChart(index);
    this.updateCharts();
    if (this.grid) {
      this.updateGrid();
    }
  }

  _createChartsHover() {
    this.dataManager.getNormalizedChartsData().forEach((chart) => {
      switch (chart.type) {
        case 'line':
          this.charts.push(new LineChartHoverView(chart));
          break;
      }
    });
  }

  _bindHoverEvents() {
    this.canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
    this.canvas.addEventListener('mouseleave', (e) => this._onMouseLeave(e));
  }

  _onMouseMove(e) {
    const mouseX = Math.round(e.clientX - this.offsetLeft + window.scrollX);
    const mouseY = Math.round(e.clientY - this.offsetTop + window.scrollY);
    this._handleMouseMove(mouseX, mouseY);
  }

  _onMouseLeave() {
    this._handleMouseMove(-100, -100);
  }

  _handleMouseMove(mouseX, mouseY) {
    const hoverValueIndex = this.dataManager.getHoverPosition(mouseX, mouseY);
    const hoverValueX = this.dataManager.getAllValuesX()[hoverValueIndex];
    const dateX = new Date(hoverValueX);
    const hoverCaptionX = Utils.formatWeekday(dateX.getDay()) + ', ' + Utils.formatMonth(dateX.getMonth()) + ' ' + dateX.getDate();
    const hoverPositionsX = this.dataManager.converter.xCoordToXPxPosition(hoverValueX);

    const charts = this.charts.map((chart) => {
      chart.hoverValueY = chart.data.valuesY[hoverValueIndex];
      chart.hoverCoordY = this.dataManager.converter.yCoordToYPxPosition(chart.hoverValueY);
      return chart;
    });

    charts
      .filter((chart) => typeof chart.setHoverPosition === 'function')
      .forEach((chart) => chart.setHoverPosition(hoverPositionsX, chart.hoverCoordY));

    if (this.grid) {
      this.grid.setHoverPositionX(hoverPositionsX);
    }

    if (this.tooltip) {
      this.tooltip.setCharts(charts.filter((chart) => chart instanceof LineChartView));
      this.tooltip.setHoverX(hoverPositionsX, hoverCaptionX);
    }

  }

}

export default ChartsFactory;