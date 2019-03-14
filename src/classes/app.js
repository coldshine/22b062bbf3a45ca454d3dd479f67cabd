import Data from '../json/data';
import MainView from './views/main-view';
import NavigationView from './views/navigation-view';
import { canvas, ctx } from './canvas';
import store from '../redux/store';
import { updateMousePosition } from '../redux/actions';

const chartData = Data[0];

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
    this._bindEvents();
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

  _bindEvents() {
    document.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = Math.round(e.clientX - rect.left);
      const mouseY = Math.round(e.clientY - rect.top);
      const isInsideCanvas = mouseX.between(0, rect.width) && mouseY.between(0, rect.height);
      if (isInsideCanvas) {
        store.dispatch(updateMousePosition(mouseX, mouseY));
      } else {
        store.dispatch(updateMousePosition(-1, -1));
      }
    }
  }

}

export default new App(chartData);
