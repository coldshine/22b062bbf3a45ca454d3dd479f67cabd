import Config from '../json/config';

// const scaleFactor = 2.5;
const scaleFactor = 1;

export const canvas = document.getElementById('canvas');
const {width, height, offsetTop, offsetLeft} = Config.layout.canvas;
canvas.width = width * scaleFactor;
canvas.height = height * scaleFactor;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
canvas.style.top = offsetTop + 'px';
canvas.style.left = offsetLeft + 'px';

export const ctx = canvas.getContext('2d');
ctx.scale(scaleFactor, scaleFactor);

let boundingClientRect = canvas.getBoundingClientRect();

window.addEventListener('resize', () => boundingClientRect = canvas.getBoundingClientRect());

export { boundingClientRect };