import Config from '../config';
import MainView from './views/main-view';
import NavigationView from './views/navigation-view';
import ChartsDataManager from './charts/charts-data-manager';


class Widget {

  constructor(chartData) {
    this._init(chartData);
    this._bindEvents();
  }

  _init(chartData) {
    const chartsDataManager = new ChartsDataManager(chartData);
    const chartName = chartsDataManager.getBaseName();
    const names = chartsDataManager.getNames();
    const colors = chartsDataManager.getColors();
    const chartsAmount = chartsDataManager.getChartsAmount();

    const navButton = this._createNavButtons(chartData, chartName);
    this._createChartTitle(chartName);
    const ctx = this._createCanvas();
    const chartButtons = this._createChartButtons(names, colors, chartsAmount);

    this.ctx = ctx;
    this.main = new MainView(ctx, chartData);
    this.navigation = new NavigationView(ctx, chartData);
    this.chartButtons = chartButtons;
    this.navButton = navButton;
  }

  draw() {
    this._clear();
    this.main.draw();
    this.navigation.draw();
  }

  _createNavButtons(chartData, chartName) {
    const navButton = document.createElement('button');
    navButton.innerHTML = chartName;
    document.getElementById('navigation').appendChild(navButton);
    return navButton;
  }

  _createCanvas() {
    const ratio = 2;

    const canvas = document.createElement('canvas');
    const width = Math.min(Config.layout.canvas.size, document.getElementById('charts').offsetWidth);
    const height = Config.layout.canvas.size;
    const widthScaled = width * ratio;
    const heightScaled = height * ratio;
    canvas.width = widthScaled;
    canvas.height = heightScaled;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);

    document.getElementById('charts').appendChild(canvas);

    return ctx
  }

  _createChartTitle(chartName) {
    const title = document.createElement('h1');
    title.innerHTML = chartName;
    document.getElementById('charts').appendChild(title);
  }

  _createChartButtons(names, colors, chartsAmount) {
    const chartButtons = [];

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'chart-buttons';

    document.getElementById('charts').appendChild(buttonsContainer);
    for (let i = 0; i < chartsAmount; i++) {
      const name = names[i];
      const color = colors[i];

      const chartButton = document.createElement('button');
      chartButton.className = 'chart-buttons__button active';

      const checkbox = document.createElement('span');
      checkbox.className = 'chart-buttons__button__checkbox';
      checkbox.style.backgroundColor = color;
      chartButton.appendChild(checkbox);

      const buttonName = document.createElement('span');
      buttonName.innerHTML = name;
      chartButton.appendChild(buttonName);

      buttonsContainer.appendChild(chartButton);

      chartButton.addEventListener('click', () => chartButton.classList.toggle('active'), false);

      chartButtons.push(chartButton);
    }
    return chartButtons;
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.offsetWidth, this.ctx.canvas.offsetHeight);
  }

  _bindEvents() {
    this.chartButtons.forEach((chartButton, index) => {
      chartButton.addEventListener('click', () => this._toggleChart(index), false);
    });

    this.navButton.addEventListener('click', () => this._scrollToChart(), false);
  }

  _toggleChart(index) {
    this.main.toggleChart(index);
    this.navigation.toggleChart(index);
  }

  _scrollToChart() {
    this.ctx.canvas.scrollIntoView({ behavior: 'smooth'});
  }
}

export default Widget;