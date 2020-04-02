const len = 200;
let num = 0;
let startTime; // The time when the 'run' button is clicked and a simulation starts
let speed = 30;
let boundary = true;
let Gaussian_b = true;
let box0_b = false;
let triangle0_b = false;
let ext = false;
let cosine = true;
let sine = false;
let mix = false;
let m = 50;
let pause = true  ;
let cnv;

function setup() {
  cnv = createCanvas(1000, 400); // Create signals.
  cnv.parent('canvas');
  background(0);
}

function draw() {
  gui();
  if (!pause) {
    background(0);
    show();
  }
}

function f0(x) { // no boundary conditions
  if (x >= -100 * len && x <= 100 * len){
    if (cosine) {
      return cos(2 * PI * x / len) * 50;
    } else if (sine){
      return sin(4 * PI * x / len + PI / 4) * 75;
    } else {
      return cos(2 * PI * x / len) * 50 / 2 + sin(4 * PI * x / len + PI / 4) * 75 / 2;
    }
  }
}

function Gaussian(x) { // with boundary conditions
  if (x >= 0 && x <= len) {
    return 1000 * exp(-(x - len / 2) * (x - len / 2) / (2 * 10 * 10)) / sqrt(2 * Math.PI * 10 * 10);
  }
}

function box0(x) { // with boundary conditions
  let d = len / 10;
  let x0 = (len - d) / 2;
  let x1 = x0 + d;
  if (x >= 0 && x <= len) {
    if (x >= x0 && x < x1) {
      return 50;
    } else {
      return 0;
    }
  }
}

function triangle0(x) { // with boundary conditions
  let d = len / 10;
  let x0 = (len - d) / 2;
  let x1 = x0 + d;
  let xc = x0 + d / 2;
  if (x >= 0 && x <= len) {
    if (x >= x0 && x < xc) {
      return 2 * m * (x - x0) / d;
    } else if (x >= xc && x < x1) {
      return -2 * m * ( x - x1) / d;
    } else {
      return 0;
    }
  }
}

function g(x) { // pulse at the initial time
  if (x >= 0 && x <= 10) {
    return 5 * cos(0.05 * x);
  } else {
    return 0;
  }
}

function F(x) {
  if (Gaussian_b) {
    return extension(7, Gaussian, x); //works for num = 3, 4, 7, 8, 11, 12, ...
  } else if (box0_b) {
    return extension(7, box0, x); //works for num = 3, 4, 7, 8, 11, 12, ...
  } else {
    return extension(7, triangle0, x); //works for num = 3, 4, 7, 8, 11, 12, ...
  }
}

function G(x) {
  return extension(7, g, x);
}

function extension(num, func, x) {
  if (num == 0) {
    if (x >= -len && x <= len) {
      if (x >= 0 && x <= len) {
        return func(x);
      } else { // extend f(x) for -len <= x <= 0, which is needed for F(x) to be an odd function.
        return -func(-x);
      }
    }
  } else { // extend f(x) to be periodic.
    if (x > 0) {
      return extension(num - 1, func, x - num * len);
    } else  {
      return extension(num - 1, func, x + num * len);
    }
  }
}

function show() {
  translate(width / 2, height / 2);
  stroke(0, 255, 0, 150);
  strokeWeight(1);
  line(0, -100, 0, 100);
  line(-width / 2, 0, width / 2, 0);
  stroke(255, 0, 0, 150);
  for (i = -10; i < 10; i++) {
    ellipse(i * len, 0, 1, 10);
  }

  if (boundary) {
    stroke(255, 255, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let x = 0; x < len; x++) {
      vertex(x, (F(x + (frameCount - startTime)) + F(x - (frameCount - startTime))) / 2);
    }
    endShape();
    if (ext) { // Show extension of f(x).
      stroke(255, 255, 0, 150);
      strokeWeight(1);
      beginShape();
      for (let x = -3 * len; x < 3 * len; x++) {
        vertex(x, F(x));
      }
      endShape();
    }
    fill(255, 255, 0);
    ellipse(0, 0, 5, 5);
    text("0", 0, 20);
    ellipse(len, 0, 5, 5);
    text("L", len, 20);
  } else {
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let x = -3 * len; x < 3 * len; x++) {
      vertex(x, (f0(x + (frameCount - startTime)) + f0(x - (frameCount - startTime))) / 2);
    }
    endShape();
    beginShape();
    for (let x = -3 * len; x < 3 * len; x++) { // Moving leftward
      stroke(255, 0, 255, 150);
      strokeWeight(1);
      vertex(x, f0(x + (frameCount - startTime)));
    }
    endShape();
    beginShape();
    for (let x = -3 * len; x < 3 * len; x++) { // Moving rightward
      stroke(0, 255, 255, 150);
      strokeWeight(1);
      vertex(x, f0(x - (frameCount - startTime)));
    }
    endShape();
  }
}

function integrate(a, b, n, func) {// Trapezoidal method
  let h = (b - a) / (n - 1);
  let area = 0;
  area += func(a) * h / 2;
  area += func(b) * h / 2;
  for (let i = 2; i < n; i++) {
    let x = a + (i - 1) * h;
    let ar = func(x) * h;
    area += ar;
  }
  return area;
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
  if (select('#ext').elt.checked) {
    ext = true;
  } else {
    ext = false;
  }
  if (select('#boundary').elt.checked) {
    boundary = true;
  } else if (select('#noBoundary').elt.checked) {
    boundary = false;
  }
  if (select('#Gaussian').elt.checked) {
    Gaussian_b = true;
    box0_b = false;
    triangle_b = false;
  } else if (select('#box0').elt.checked) {
    Gaussian_b = false;
    box0_b = true;
    triangle_b = false;
  } else if (select('#triangle0').elt.checked) {
    Gaussian_b = false;
    box0_b = false;
    triangle_b = true;
  }
  if (select('#cosine').elt.checked) {
    cosine = true;
    sine = false;
    mix = false;
  } else if (select('#sine').elt.checked) {
    cosine = false;
    sine = true;
    mix = false;
  } else if (select('#mix').elt.checked) {
    cosine = false;
    sine = false;
    mix = true;
  }
  if (document.getElementById('boundary').checked) {
      document.getElementById('divShape1').style.visibility = "visible"
    document.getElementById('divShape2').style.visibility = "visible"
    document.getElementById('divShape4').style.visibility = "hidden"
  } else if (document.getElementById('noBoundary').checked) {
    document.getElementById('cosine').disabled = false;
    document.getElementById('sine').disabled = false;
    document.getElementById('divShape1').style.visibility = "hidden"
    document.getElementById('divShape2').style.visibility = "hidden"
    document.getElementById('divShape4').style.visibility = "visible"
  }
  let slider1 = select('#speed');
  speed = map(slider1.elt.value, 0, 1, 1, 59);
  frameRate(speed);
}

function start() {
  startTime = frameCount;
  pause = false;
  select('#start').elt.disabled = true;
}

function keyPressed() {
  if (key === 'R') {
    start();
  }
  if (key == 'P') {
    pause = !pause;
  }
}
