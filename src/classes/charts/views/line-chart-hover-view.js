import Config from '../../../config';
import { eventTypes, store } from "../../store";

class LineChartHover {

  constructor(index, color) {
    this.index = index;
    this.color = color;
    this.visible = true;
    this.x = null;
    this.y = null;
    this.background = 'white';
    this._bindEvents();
  }

  _bindEvents() {
    store.subscribe(eventTypes.toggleTheme, (eventType, theme) => this._onChangeTheme(theme))
  }

  _onChangeTheme(theme) {
    if (theme === Config.themes.night) {
      this.background = Config.colors.darkBlue;
    } else {
      this.background = 'white';
    }
  }

  setPosition(x, y) {
    this.x = x || null;
    this.y = y || null;
  }

  updateVisibility(visible) {
    this.visible = visible;
  }

  draw(ctx) {
    if (this.x > 0 && this.y > 0 && this.visible) {
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.background;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }

}

export default LineChartHover;
