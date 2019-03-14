import Data from '../json/data';
import Config from '../json/config';
import MainView from './views/main-view';
import NavigationView from './views/navigation-view';

const chartData = Data[0];

class App {

  constructor(chartData) {
    const minX = 1546905600000; //ms
    const maxX = 1552003200000; //ms

    const {canvas, ctx} = this._initCanvas();

    this.canvas = canvas;
    this.ctx = ctx;

    this.main = new MainView(chartData, minX, maxX);
    this.navigation = new NavigationView(chartData);

    this._draw();
    this._bindEvents();
  }

  _initCanvas() {
    // const scaleFactor = 2.5;
    const scaleFactor = 1;

    const canvas = document.getElementById('canvas');
    const {width, height} = Config.layout.canvas;
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    // toDo offset top & offset left
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);

    return {canvas, ctx};
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _draw() {
    this._clear();
    this.main.draw(this.ctx);
    this.navigation.draw(this.ctx);
    window.requestAnimationFrame(() => this._draw());
  }

  _bindEvents() {
    document.onmousemove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = Math.round(e.clientX - rect.left);
      const mouseY = Math.round(e.clientY - rect.top);
      const isInsideCanvas = mouseX.between(0, rect.width) && mouseY.between(0, rect.height);
      if (isInsideCanvas) {
        this.main.onMouseMove(mouseX, mouseY);
      } else {
        this.main.reset();
      }
    }
  }

}

export default new App(chartData);
