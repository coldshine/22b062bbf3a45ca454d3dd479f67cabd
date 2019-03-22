import Widget from './widget';

class App {
  constructor() {
    this.widgets = [];
    window.DATA.forEach((chartData, index) => {
      chartData.index = index;
      this.widgets.push(new Widget(chartData));
    });
    this.draw();
  }

  draw() {
    this.widgets.forEach((widget) => widget.draw());
    window.requestAnimationFrame(() => this.draw());
  }
}

export default App;