
class TextPrerender {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 30;
    this.canvas.height = 10;
  }

  prerenderText(text) {
    this.ctx.fillText(text, 0, 0);
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  prerenderTextArray(array) {
    return array.map((text) => this.prerenderText(text))
  }

}

export default new TextPrerender();