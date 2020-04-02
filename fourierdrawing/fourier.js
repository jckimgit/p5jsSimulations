let drawing; // drawing data
let numData;
let cumNumData;
let numData0;
let numData1;
let idx = 0;
let sx; // x values of the drawing data
let sy;
let ecx; // Epicycles responsible for x coordinate
let ecy;
let pathx; // x values for drawing obtained from ecx
let pathy;
let ftsx; // Fourier Transform of sx
let ftsy;
let time = 0;
let num = 0;
let pause = true;
let clear = false;;
let original = false;
let cnv;

function setup() {
  cnv = createCanvas(1000, 800);
  cnv.parent('canvas');
  drawing = [];
  numData = [];
  cumNumData = [];
  for (let i = 0; i < 1000; i++) {
    numData[i] = 0;
  }
  sx = [];
  sy = [];
  ecx = [];
  ecy = [];
  ftsx = [];
  ftsy = [];
  background(0);
}

function draw() {
  gui();
  if (!pause) {
    background(0);
    ecx = epicycles(3 * width / 4, height / 6, 0, ftsx);
    ecy = epicycles(width / 6, 3 * height / 4, PI / 2, ftsy);
    show(ecx.x, ecy.y);
    if (!clear) {
      stroke(255);
      strokeWeight(1);
      line(ecx.x, ecx.y, pathx[0], pathy[0]);
      line(ecy.x, ecy.y, pathx[0], pathy[0]);
    }
    const dt = 1 / (cumNumData[idx]);
    time += dt;
  }
}

function mouseDragged() {
  if (!select('#start').elt.disabled) {
    numData[idx] += 1;
    cumNumData[0] = numData[0];
    for (let i = 1; i < numData.length; i++) {
      cumNumData[i] = cumNumData[i - 1] + numData[i];
    }

    let point = createVector(mouseX, mouseY);
    drawing.push(point); // save the locus of the picture

    // Show the picture.
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < cumNumData[0]; i++) {
      vertex(drawing[i].x, drawing[i].y);
    }
    endShape();
    for (let j = 1; j < cumNumData.length; j++) {
      beginShape();
      for (let i = cumNumData[j - 1]; i < cumNumData[j]; i++) {
        vertex(drawing[i].x, drawing[i].y);
      }
      endShape();
    }
    // Save the locus of each coordinate separately
    for (let i = 0; i < cumNumData[idx]; i++) { // Save the picture's locus
    sx[i] = drawing[i].x - 3 * width / 4;
    sy[i] = drawing[i].y - 3 * height / 4;
  }
}
}

function mouseReleased() { // Keep track of indices of line segments of the picture
  idx++;
}

function show(x, y) {
  if (original) {
    show_raw();
  }
  pathx.unshift(x); // Store x signal value, the most recent at the very front.
  pathy.unshift(y);
  stroke(255, 255, 0);
  strokeWeight(2);
  noFill();

  beginShape();
  for (let i = 0; i < cumNumData[0]; i++) {
    vertex(pathx[i], pathy[i]);
  }
  endShape();
  for (let j = 1; j < cumNumData.length; j++) {
    beginShape();
    for (let i = cumNumData[j - 1]; i < cumNumData[j]; i++) {
      vertex(pathx[i], pathy[i]);
    }
    endShape();
  }
  if (!clear) {
    stroke(255, 0, 0);
    ellipse(x, y, 7, 7);
  }
  if (pathy.length > cumNumData[idx]) { // When drawing is done, stop.
    noLoop();
  }
}

function show_raw() {
  beginShape();
  stroke(0, 255, 255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i = 0; i < cumNumData[0]; i++) {
    vertex(sx[i] + 3 * width / 4, sy[i] + 3 * height / 4);
  }
  endShape();
  for (let j = 1; j < cumNumData.length; j++) {
    beginShape();
    for (let i = cumNumData[j - 1]; i < cumNumData[j]; i++) {
      vertex(sx[i] + 3 * width / 4, sy[i] + 3 * height / 4);
    }
    endShape();
  }
}

function epicycles(x, y, rotation, ft) {
  for (let k = 0; k < ft.length; k++) {
    let centerx = x;
    let centery = y;
    let freq = k;
    let radius = ft[k].amp / sx.length;
    let phase = ft[k].phase;
    x += radius * cos(2 * PI * freq * time - phase + rotation);
    y += radius * sin(2 * PI * freq * time - phase + rotation);
    if (!clear) {
      stroke(255, 100);
      noFill();
      ellipse(centerx, centery, radius * 2);
      stroke(255);
      line(centerx, centery, x, y);
    }
  }
  let XY = {x, y};
  return XY;
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
  ftsx = ft(sx);
  ftsy = ft(sy);

  let clr = select('#clr');
  if (clr.elt.checked) {
    clear = true;
  }
  let orig = select('#orig');
  if (orig.elt.checked) {
    original = true;
  }
}

function start() {
  if (drawing.length > 0) {
    let d = document.getElementsByClassName('drawing');
    for (let i = 0; i < d.length; i++) {
      d[i].disabled = true;
    }
    let c = document.getElementsByClassName('chkbox');
    for (let i = 0; i < c.length; i++) {
      c[i].disabled = true;
    }
    select('#start').elt.disabled = true;
    startTime = frameCount;
    pathx = [];
    pathy = [];
    circlePath = [];
    pause = false;
    clear = false;
  }
}

function keyPressed() {
  if (key == 'P') { // pause/resume
    pause = !pause;
  }
  else if (key == 'C') {
    clear = !clear;
  }
}

// class ComplexNumber {
//   constructor(a, b) {
//     this.re = a;
//     this.im = b;
//     this.amp = sqrt(this.re * this.re + this.im * this.im);
//     this.phase = atan2(this.im, this.re);
//   }
//
//   mult(c) {
//     let r = this.re * c.re - this.im * c.im;
//     let i = this.im * c.re + this.re * c.im;
//     return new ComplexNumber(r, i);
//   }
//
//   add(c) {
//     let r = this.re + c.re;
//     let i = this.im + c.im;
//     return new ComplexNumber(r, i);
//   }
//
// }
