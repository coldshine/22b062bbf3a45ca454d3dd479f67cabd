import { ctx } from '../../canvas';

class LineChart {

  constructor(data) {
    this.data = data;
  }

  draw() {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.data.color;
    ctx.beginPath();
    const [x, y] = this.data.positions[0];
    ctx.moveTo(x, y);
    for (let i = 1; i < this.data.valuesCount; i++) {
      const [x, y] = this.data.positions[i];
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

}

export default LineChart;

