import Widget from './widget';
import { store } from './store';
import Config from '../config';

class App {
  constructor(data) {
    this.theme = store.getTheme();
    this.themes = Config.themes;
    // this.times = [];
    this.widgets = [];
    data.forEach((chartData, index) => {
      chartData.index = index;
      this.widgets.push(new Widget(chartData));
    });
    this.switchThemeButton = this._createSwitchThemeButton();
    this.switchThemeButtonMobile = this._createSwitchThemeButtonMobile();
    this._actualizeSwitchModeButtonText();
    this._bindEvents();
    window.requestAnimationFrame(() => this.draw());
  }

  _bindEvents() {
    this.switchThemeButton.addEventListener('click', () => this._switchMode(), false)
    this.switchThemeButtonMobile.addEventListener('click', () => this._switchMode(), false)
  }

  draw() {
    this.widgets.forEach((widget) => widget.draw());
    // const now = performance.now();
    // while (this.times.length > 0 && this.times[0] <= now - 1000) {
    //  this.times.shift();
    // }
    // this.times.push(now);
    // document.getElementById('fps').innerText = this.times.length;
    window.requestAnimationFrame(() => this.draw());
  }

  _createSwitchThemeButton() {
    const button = document.createElement('button');
    document.getElementById('leftCol').appendChild(button);
    return button;
  }

  _createSwitchThemeButtonMobile() {
    const button = document.createElement('button');
    document.getElementById('switchThemeButtonHolder').appendChild(button);
    return button;
  }

  _switchMode() {
    if (this.theme === this.themes.day) {
      this.theme = this.themes.night;
    } else {
      this.theme = this.themes.day;
    }
    store.switchTheme(this.theme);
    this._actualizeBodyClass();
    this._actualizeSwitchModeButtonText();
  }

  _actualizeBodyClass() {
    document.body.classList.remove(this.themes.day + '-theme');
    document.body.classList.remove(this.themes.night + '-theme');
    document.body.classList.add(this.theme + '-theme');
  }

  _actualizeSwitchModeButtonText() {
    const text = this.theme === this.themes.day ? this.themes.night : this.themes.day ;
    this.switchThemeButton.innerText = `Switch to ${text} mode`;
    this.switchThemeButtonMobile.innerText = this.switchThemeButton.innerText;
  }
}

export default App;