import Widget from './widget';

class App {
  constructor(data) {
    this.times = [];
    this.widgets = [];
    data.forEach((chartData, index) => {
      chartData.index = index;
      this.widgets.push(new Widget(chartData));
    });
    window.requestAnimationFrame(() => this.draw());
  }

  draw() {
    this.widgets.forEach((widget) => widget.draw());
    const now = performance.now();
    while (this.times.length > 0 && this.times[0] <= now - 1000) {
      this.times.shift();
    }
    this.times.push(now);
    document.getElementById('fps').innerText = this.times.length;
    window.requestAnimationFrame(() => this.draw());
  }
}

export default App;