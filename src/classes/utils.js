export default class {

  static sortNumbersAsc(array) {
    const arrayClone = array.slice(0);
    return arrayClone.sort((a,b) => a - b);
  }

  static getMinMax(array) {
    array = this.sortNumbersAsc(array);
    return [array[0], array[array.length - 1]]
  }

  static getMax(array) {
    return this.sortNumbersAsc(array)[array.length - 1];
  }

  static isMouseInsideLayout(mouseX, mouseY, layout) {
    const {width, height, offsetTop, offsetLeft} = layout;
    return mouseX.between(offsetLeft, offsetLeft + width) && mouseY.between(offsetTop, offsetTop + height);
  }

  static formatMonth(month) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[month];
  }

  static formatWeekday(weekday) {
    const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return weekdays[weekday];
  }

  static calculateLayoutWidth(width) {
    return Math.min(width, document.getElementById('charts').offsetWidth);
  }

  static formatNumber(number){
    const e = (Math.log(number) / Math.log(1e3)) | 0;
    return +(number / Math.pow(1e3, e)).toFixed(2) + ('kMGTPEZY'[e - 1] || '');
  }
}