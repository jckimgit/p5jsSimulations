/* 'Times Tables, Mandelbrot and the Heart of Mathematics' by
Mathologer on Youtube
*/

const radius = 250;
let points;
let numPoints = 200;
let speed  = 0.5;
let multiplier = 0;
let maxMultiplier = numPoints;
let num = 0;
let auto = true;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(700, 700);
  cnv.parent('canvas');
  textSize(14);
  textAlign(LEFT);
  background(255);
}

function draw() {
  gui();
  if (!pause) {
    background(255);
    fill(0);
    let mult = Number.parseFloat(multiplier).toFixed(1);
    text("multiplier = " + mult, 10, height  - 30);
    translate(width /2, height / 2);
    //Draw lines
    for (let p of points) {
      if (points.indexOf(p) != 0) {
        let num = points.indexOf(p); // + numPoints * i;
        let numOther = floor(multiplier * num) % numPoints;
        if (numOther == 0) {
        }
        let other = points[numOther];
        line (p.x, p.y, other.x, other.y);
      }
      if (floor(multiplier) == numPoints) {
        noLoop();
      }
    }

    noFill();
    stroke(0);
    ellipse(0, 0, 2 * radius, 2 * radius);
    noStroke();
    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      fill(255, 0, 0, 100);
      ellipse(p.x, p.y, 3, 3);
    }
    stroke(0, 0, 255, 100);
    strokeWeight(1);

    if (auto && frameCount % speed == 0) {
      multiplier += 0.1;
    }
    if (multiplier > numPoints) {
      multiplier = numPoints;
    }
  }
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
  let slider0 = select('#numPoints');
  numPoints = slider0.elt.value;
  let slider1 = select('#speed');
  speed = map(slider1.elt.value, 0, 1, 50, 5);
  let auto0 = select('#m0');
  let mult = select('#mult');
  if (auto0.elt.checked) {
    auto = true;
    mult.elt.disabled = true;
  } else {
    auto = false;
    slider0.elt.disabled = false;
    slider1.elt.disabled = true;
    mult.elt.disabled = false;
    multiplier = mult.elt.value;
  }

  // mult.elt.addEventListener("keyup", function(event) {
  //   event.preventDefault();
  //   if (event.keyCode === 13) {
  //     start();
  //     auto0.elt.disabled = true;
  //   }
  // });
}

function start() {
  select('#start').elt.disabled = true;
  select('#numPoints').elt.disabled = true;
  select('#m0').elt.disabled = true;
  select('#m1').elt.disabled = true;
  select('#mult').elt.disabled = true;
  points = [];
  let angle = 2 * PI / numPoints;
  for (let i = 0; i < numPoints; i++) {
    let x = -radius * cos(-i * angle);
    let y = radius * sin(-i * angle);
    let p = new Vec2D(x, y);
    points.push(p);
  }
  pause = false;

  if (!auto && select('#mult').elt.value < 0.1) {
    multiplier = 0.1;
    select('#mult').elt.value = 0.1;
  }
}

function keyPressed() {
  if (key === 'R') {
    if (auto) {
      start();
    }
  } else if (key == 'P') { // pause/resume
    if (auto) {
      pause = !pause;
    }
  }
}
