import Config from '../json/config';

// const scaleFactor = 2.5;
const scaleFactor = 1;

export const canvas = document.getElementById('canvas');
const {width, height} = Config.layout.canvas;
canvas.width = width * scaleFactor;
canvas.height = height * scaleFactor;
// toDo offset top & offset left
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

export const ctx = canvas.getContext('2d');
ctx.scale(scaleFactor, scaleFactor);

export const boundingClientRect = canvas.getBoundingClientRect();