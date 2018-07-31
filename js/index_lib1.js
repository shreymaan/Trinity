"use strict";

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var dim = 10;
var ratio = .43;
var dimOffset = dim;
var maxWidth = canvas.width / (dim * ratio);
var maxHeight = canvas.height / dim;
var fps = 5;
var interval = 1000 / fps;
var then = Date.now();

ctx.font = "normal " + dim + "px Montserrat";
ctx.fillStyle = '#fff';
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < maxHeight; i++) {
    ctx.fillText(randomString(maxWidth, "aA#!"), 0, i * dim + dimOffset);
  }
}

function randomString(length) {
  var chars = arguments.length <= 1 || arguments[1] === undefined ? "aA#!" : arguments[1];

  var mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i) {
    result += mask[Math.floor(Math.random() * mask.length)];
  }return result;
}

function update() {
  var now = Date.now();
  var delta = now - then;
  if (delta >= interval) {
    then = now - delta % interval;
    render();
  }
  window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);