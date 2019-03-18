import Data from '../json/data';
import MainView from './views/main-view';
import NavigationView from './views/navigation-view';
import { canvas, ctx } from './canvas';

const chartData = Data[1];

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
    this.main = new MainView(chartData);
    this.navigation = new NavigationView(chartData);
    this._draw();
  }

  _clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  _draw() {
    this._clear();
    this.main.draw();
    this.navigation.draw();
    window.requestAnimationFrame(() => this._draw());
  }
}

export default new App(chartData);
