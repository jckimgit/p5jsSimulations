/*
frame count  1      2        3       4
time        0      dt       2dt     3dt
f           f(0)   f(dt)    f(2dt)  f(3dt)
wave        w(0)   w(1)     w(2)    w(3)

0. f(x) = 1 on [-PI, 0) and 0 on [0, PI].
1. f(x) = 0 on [-PI, 0) and x on [0, PI].
2.  f(x) = x^2 on [-PI, PI].
a. Fourier series. f(x) = PI^2 / 3 - 4 * (sum_i (-1)^i 1 / (i + 1)^2 cos((i + 1)x))
= PI^2 / 3 - 4 * (sum_i (-1)^i 1 / (i + 1)^2 sin(PI / 2 - (i + 1)x)).
b. In this example, g(x) = (50 / 4) f(x) is drawn to make it look nicer.
For example, f(PI) = PI^2 = 9.870. g(PI) = 9.870 * (50 / 4) = 123.370.
c.
*/
let xscale = 100;
let numCircles = 5;
let time = Math.PI / 8;;
let wave;
let circlePath;
let func;
let num = 0;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(800, 400);
  cnv.parent('canvas');
  background(50);
}

function draw() {
  gui();
  if (!pause) {
    background(0);
    translate(width / 4, height / 2);
    // Draw circles and lines from the centers to rolling points on them.
    let x = 0;
    let y = 0;
    if (func == 1) {
      y =  50 * Math.PI / 2;
    } else if (func == 2) {
      y =  Math.PI * Math.PI / 3 * 50 / 4;
    }
    for (let i = 0; i < numCircles; i++) {
      let centerx = x;
      let centery = y;
      let radius = 0;
      if (func == 0) {
        let n = i * 2 + 1;
        radius = 50 * (4 / (n * Math.PI));
        x += radius * cos(n * time);
        y += radius * sin(n * time);
      } else if (func == 1) {
        radius = 50 / (i + 1);
        x += radius * cos((i + 1) * time);
        y += radius * sin((i + 1) * time);
      } else if (func == 2) {
        radius = 50 * pow(-1, i) / ((i + 1) * (i + 1));
        x += radius * cos(-Math.PI / 2 + (i + 1) * time);
        y += radius * sin(-Math.PI / 2 + (i + 1) * time);
      }
      stroke(255, 100);
      noFill();
      ellipse(centerx, centery, radius * 2, radius * 2);
      stroke(255);
      line(centerx, centery, x, y);
      if (i == numCircles - 1) { // The last circle
        circlePath.push(createVector(x, y));
      }
    }

    wave.unshift(y);
    line(x, y, 200, y); // Draw a horizontal line connecting a rolling point of the last circle and
    // a point 200 pixels away toward right.
    beginShape();
    noFill();
    for (let i = 0; i < wave.length; i++) {
      vertex(i + 200, wave[i]);
    }
    endShape();

    if (wave.length > width - 200) {
      wave.splice(wave.length - 1, );
    }

    if (frameCount % (2 * xscale) == 0) {
      circlePath = [];
    }
    beginShape();
    noFill();
    for (let i = 0; i < circlePath.length; i++) {
      let c = circlePath[i];
      vertex(c.x, c.y);
    }
    endShape();

    let dt = Math.PI / xscale;
    time += dt;
  }
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
  let slider0 = select('#numCircles');
  numCircles = slider0.elt.value;

  let f0 = select('#0');
  f0.mousePressed(function() {time = Math.PI / 8;});
  let f1 = select('#1');
  f1.mousePressed(function() {time = Math.PI / 8;});
  let f2 = select('#2');
  f2.mousePressed(function() {time = Math.PI;});
  if (select('#0').elt.checked) {
    func = 0;
  } else if (select('#1').elt.checked) {
    func = 1;
  } else if (select('#2').elt.checked) {
    func = 2;
  }
}

function start() {
  select('#start').elt.disabled = true;
  // xscale = 100;
  // time = Math.PI / 8;
  wave = [];
  circlePath = [];
  pause = false;
}

function keyPressed() {
  if (key === 'R') {
    start();
  }
  if (key == 'P') { // pause/resume
    pause = !pause;
  }
}
