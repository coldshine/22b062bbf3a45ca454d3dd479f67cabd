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
    this.charts = [];
    this.hovers = [];
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
    this.updateChartsPositions();
    if (this.grid) {
      this.updateGrid();
    }
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
    return this.charts;
  }

  updateChartsPositions() {
    const newChartsData = this.dataManager.getNormalizedChartsData();
    this.charts
      .filter((chart) => typeof chart.updatePositions === 'function')
      .forEach((chart) => {
        const {positionsX, positionsY} = newChartsData[chart.data.index];
        chart.updatePositions(positionsX, positionsY);
      });
  }

  updateChartsVisibility() {
    const newChartsData = this.dataManager.getNormalizedChartsData();

    this.charts.forEach((chart) => {
      const {visible} = newChartsData[chart.data.index];
      chart.updateVisibility(visible);
    });

    this.hovers.forEach((hover) => {
      const {visible} = newChartsData[hover.index];
      hover.updateVisibility(visible);
    });

    if (this.tooltip) {
      this.tooltip.updateChartsData(newChartsData);
    }
    this.updateChartsPositions();
  }

  updateGrid() {
    this.grid.updatePositions(
      this.dataManager.getPositionsOnAxisX(),
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
    this.tooltip = new Tooltip(this.charts.map((chart) => chart.data));
    return this.tooltip;
  }

  toggleChart(index) {
    this.dataManager.toggleChart(index);
    this.updateChartsVisibility();
    if (this.grid) {
      this.updateGrid();
    }
  }

  createHovers() {
    this.dataManager.getNormalizedChartsData().forEach((chart) => {
      switch (chart.type) {
        case 'line':
          this.hovers.push(new LineChartHoverView(chart.index, chart.color));
          break;
      }
    });
    this._bindHoverEvents();
    return this.hovers;
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
    const hoverPositionX = this.dataManager.converter.xCoordToXPxPosition(hoverValueX);
    const hoverValuesY = [];

    this.charts
      .forEach((chart) => {
        const hoverValueY = chart.data.valuesY[hoverValueIndex];
        hoverValuesY.push(hoverValueY);
      });

    this.hovers
      .forEach((hover, index) => {
        const hoverValueY = hoverValuesY[index];
        const hoverPositionY = this.dataManager.converter.yCoordToYPxPosition(hoverValueY);
        hover.setPosition(hoverPositionX, hoverPositionY);
      });

    if (this.grid) {
      this.grid.setHoverPositionX(hoverPositionX);
    }

    if (this.tooltip) {
      const dateX = new Date(hoverValueX);
      const hoverCaptionX = Utils.formatWeekday(dateX.getDay()) + ', ' + Utils.formatMonth(dateX.getMonth()) + ' ' + dateX.getDate();
      this.tooltip.setHover(hoverPositionX, hoverCaptionX, hoverValuesY);
    }

  }

}

export default ChartsFactory;