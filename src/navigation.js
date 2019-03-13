class Navigation {

  constructor(app) {
    this.app = app;
    this.charts = this.app.getCharts(this);
  }

  draw() {
    this.drawContainer();
    this.charts.forEach((chart) => chart.draw());
  }

  drawContainer() {
    this.app.ctx.fillStyle = '#eaffdd';
    this.app.ctx.rect(
      0,
      Config.layout.chartSize[1] + 20,
      Config.layout.canvasSize[0],
      Config.layout.canvasSize[1] - Config.layout.chartSize[1] - 20
    );
    this.app.ctx.fill();
  }

  convertCoordToPx(x, y) {
    return [
      Math.round((x / deltaX) * Config.layout.chartSize[0]),
      Math.round((y / deltaY) * Config.layout.chartSize[1])
    ];
  }

  convertPxToCoord(x, y) {
    const deltaX = this.maxX - this.minX;
    const deltaY = this.maxY - this.minY;

    const rawValueX = Math.round((x / Config.layout.chartSize[0]) * deltaX) + this.minX;

    const valueX = this.app.getValuesX().findClosestValue(rawValueX);
    const valueY = Math.round((y / Config.layout.chartSize[1]) * deltaY) + this.minY;

    return [valueX, valueY];
  }
}
