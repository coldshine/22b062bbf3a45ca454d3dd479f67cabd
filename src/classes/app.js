import Config from '../json/config';
import Data from '../json/data';
import MainView from './views/main-view';
import NavigationView from './views/navigation-view';

Number.prototype.between = function (a, b, inclusive) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return inclusive ? this >= min && this <= max : this > min && this < max;
};
Array.prototype.findClosestValue = function (search) {
  const sorted = this.map((value) => Math.abs(value - search));
  const min = Math.min.apply(Math, sorted);
  return this[sorted.indexOf(min)]
};

class App {

  constructor(chartData) {
    this._init(chartData);
    this._draw();
  }

  _init(chartData) {
    const button = document.createElement('button');
    button.innerHTML = 'Chart ' + (chartData.index + 1);
    document.getElementById('navigation').appendChild(button);
    const {ctx, canvas} = this._createCanvas();
    document.getElementById('canvases').appendChild(canvas);

    this.ctx = ctx;
    this.canvas = canvas;
    this.main = new MainView(canvas, ctx, chartData);
    this.navigation = new NavigationView(canvas, ctx, chartData);
  }

  _createCanvas() {
    const scaleFactor = 1;

    const canvas = document.createElement('canvas');
    const {width, height, offsetTop, offsetLeft} = Config.layout.canvas;
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.style.top = offsetTop + 'px';
    canvas.style.left = offsetLeft + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);

    let boundingClientRect = canvas.getBoundingClientRect();
    window.addEventListener('resize', () => boundingClientRect = canvas.getBoundingClientRect());

    return {
      canvas,
      ctx,
      boundingClientRect
    }
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _draw() {
    this._clear();
    this.main.draw();
    this.navigation.draw();
    window.requestAnimationFrame(() => this._draw());
  }
}

Data.forEach((chartData, index) => {
  chartData.index = index;
  new App(chartData);
});