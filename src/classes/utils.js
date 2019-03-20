export default class {

  static aliasPixel(pixelWidth) {
    return (pixelWidth % 2 === 0) ? 0 : 0.5;
  }

  static sortNumbersAsc(array) {
    const arrayClone = array.slice(0);
    return arrayClone.sort((a,b) => a - b);
  }

  static sortNumbersDesc(array) {
    const arrayClone = array.slice(0);
    return arrayClone.sort((a,b) => b - a);
  }

  static getMinMax(array) {
    array = this.sortNumbersAsc(array);
    const min = array[0];
    const max = array[array.length - 1];
    return [min, max]
  }

  static isMouseInsideLayout(mouseX, mouseY, layout) {
    const {width, height, offsetTop, offsetLeft} = layout;
    return mouseX.between(offsetLeft, offsetLeft + width) && mouseY.between(offsetTop, offsetTop + height);
  }

  static formatMonth(month) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[month];
  }

  static arrayUnique(array) {
    const a = array.concat();
    for(let i = 0; i < a.length; i++) {
      for(let j = i + 1; j < a.length; j++) {
        if(a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }
    return a;
  }
}