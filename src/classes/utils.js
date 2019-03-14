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
}