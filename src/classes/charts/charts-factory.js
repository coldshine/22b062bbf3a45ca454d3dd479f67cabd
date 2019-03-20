import LineChartView from './views/line-chart-view';
import LineChartHoverView from './views/line-chart-hover-view';
import GridView from './views/grid-view';
import ChartsDataManager from './charts-data-manager';
import Tooltip from '../views/tooltip-view';

class ChartsFactory {

  constructor(canvas) {
    this.boundingClientRect = canvas.getBoundingClientRect();
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
    this._bindMouseMove();
    return this;
  }

  createCharts() {
    this.charts = [];
    this.dataManager.getNormalizedChartsDataAll().forEach((item) => {
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
    this.charts
      .filter((chart) => typeof chart.updatePositions === 'function')
      .forEach((chart) => {
        const currentChartData = chart.data;
        const {positionsX, positionsY} = this.dataManager.getNormalizedChartsDataAll()[currentChartData.index];
        chart.updatePositions(positionsX, positionsY);
      });
  }

  updateGrid() {
    this.grid.updatePositions(
      this.dataManager.getAllPositionsX(),
      this.dataManager.getPositionsOnAxisY(),
      this.dataManager.getCaptionsOnAxisY(),
    );
  }

  createGrid() {
    this.grid = new GridView(
      this.dataManager.getAllPositionsX(),
      this.dataManager.getAllCaptionsX(),
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

  _createChartsHover() {
    this.dataManager.getNormalizedChartsDataAll().forEach((chart) => {
      switch (chart.type) {
        case 'line':
          this.charts.push(new LineChartHoverView(chart));
          break;
      }
    });
  }

  _bindMouseMove() {
    document.onmousemove = (e) => this._onMouseMove(e);
  }

  _onMouseMove(e) {
    const mouseX = Math.round(e.clientX - this.boundingClientRect.left);
    const mouseY = Math.round(e.clientY - this.boundingClientRect.top);
    this._handleMouseMove(mouseX, mouseY);
  }

  _handleMouseMove(mouseX, mouseY) {
    const hoverValueIndex = this.dataManager.getHoverPosition(mouseX, mouseY);
    const hoverValueX = this.dataManager.getAllValuesX()[hoverValueIndex];
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
      this.tooltip.setHoverValueX(hoverValueX);
      this.tooltip.setHoverPositionX(hoverPositionsX);
    }

  }

}

export default ChartsFactory;