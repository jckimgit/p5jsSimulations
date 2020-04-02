// Hypotrochoid: Wolfram MathWorld

let angle = 0;
const radius0 = 200.0; // Big circle
let numCusps; // The number of cusps.
let radius; // Small circle.
let horizLength = 1;
let x0, y0, x, y; // Big circle's center and its locus
let xp, yp; // locus of a fixed point on the small circle.
let path; // = []; // Collection of (xp, yp).
let numAstroids; // Total number of astroids.
let count = 0; // The number of astroids drawn.
let numSizes; // The number of path's size.
let colors;
let alpha;
let num = 0;
let line_b = true;
let circle = true;
let randomColor = false;
let symmetry = true;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(800, 600);
  cnv.parent('canvas');
  background(50); // To show the canvas at frameCount 0.
}

function draw() {
  gui();
  if (!pause) {
    background(50);
    radius = radius0 / numCusps;
    h = horizLength * radius; // If horizLength = 1, hypotrochoid becomes Hypocycloid. Further, if numCusps is 4, hypocycloid becomes astroid.
    translate(width / 2, height / 2);
    astroids();
    circles();
  }

  textFont('Verdana', 16);
  textAlign(LEFT);
  stroke(255, 255, 0);
  strokeWeight(1);
  if (count > 0)  {
    text('Astroid ' + count, - width / 2 + 20, - height / 2 + 30);
  }
  if (count == numAstroids) { // Stop drawing.
    text("Done!", -width / 2 + 20, -height /2 + 50);
    noLoop();
  }
}

function circles() {
  if (circle) { //For drawing circles.
    let alp = floor(map(count, 0, numAstroids, 255, 0));
    stroke(255, 255, 255, alp);
    strokeWeight(2);
    noFill();
    x = (radius0 - radius) * cos(angle);
    y = (radius0 - radius) * sin(angle);
    ellipse(0, 0, radius0 * 2, radius0 * 2);
    ellipse(x, y, radius * 2, radius * 2);
    line(x, y, xp, yp);
  }
}

function astroids() {
  // Calculate locus of astroids
  xp = (1 - 1.0 / numAstroids * (count)) * ((radius0 - radius) * cos(angle) + h * cos((radius0 - radius) / radius * angle));
  if (symmetry) {
    yp = (1 - 1.0 / numAstroids * (count)) * (radius0 - radius) * sin(angle) - h * sin((radius0 - radius) / radius * angle);
  } else {
    yp = (radius0 - radius) * sin(angle) - h * sin((radius0 - radius) / radius * angle);
  }
  path.push(new createVector(xp, yp));
  angle += 0.02;

  if (count == 0) {// The first astroid.
    if (line_b) {
      stroke(colors[0]);
      noFill();
    } else {
      fill(colors[0]);
      noStroke();
    }
    beginShape();
    for (let i = 0; i < path.length; i++) {
      let v = path[i];
      vertex(v.x, v.y);
    }
    endShape();
  } else {
    let weight = 0;
    for (let j = 0; j < count; j++) { // Existing astroids.
      weight = floor(map(j, 0, 0.9 * numAstroids, 0, 255));
      beginShape();
      if (line_b) {
        stroke(colors[j]);
        noFill();
      } else {
        fill(colors[j]);
        noStroke();
      }
      //Draw curent astroid
      for (let i = numSizes[j]; i < numSizes[j + 1]; i++) {
        let v = path[i];
        vertex(v.x, v.y);
      }
      endShape();
    }
    if (count < numAstroids) {
      beginShape(); // Current astroid.
      weight = floor(map(count, 0, 0.9 * numAstroids, 0, 255));
      if (line_b) {
        stroke(colors[count]);
      } else {
        fill(colors[count]);
      }
      for (let i = numSizes[count]; i < path.length; i++) {
        let v = path[i];
        vertex(v.x, v.y);
      }
      endShape();
    }
  }

  if (angle > TWO_PI) { // When creation of an astroid is done, do the next one.
    count++;
    if (count < numAstroids) {
      numSizes[count] = path.length;
    }
    angle = 0;
  }
}


function gui() {
  if (num == 0) {
    num++;
  let button0 = select('#start');
  button0.mousePressed(start);
}

  let slider0 = select('#cusp');
  numCusps = slider0.elt.value;
  let slider1 = select('#astroid');
  numAstroids = slider1.elt.value;
  let slider2 = select('#horiz');
  horizLength = slider2.elt.value;

  let chk0 = select('#sym');
  if (chk0.elt.checked) {
    symmetry = true;
  } else {
    symmetry = false;
  }
  let chk1 = select('#lin');
  if (chk1.elt.checked) {
    line_b = true;
  } else {
    line_b = false;
  }
  let chk2 = select('#rad');
  if (chk2.elt.checked) {
    randomColor = true;
  } else {
    randomColor = false;
  }
}

function start() {
  pause = false;
  circle = true;
  setColors();
  select('#start').elt.disabled = true;
  path = [];
  numSizes = [];
  numSizes[0] = 0;
}

function keyPressed() {
  if (key == 'R') {//restart
    start();
  }
  else if (key == 'P') { // pause/resume
    pause = !pause;
  }
  else if (key == 'C') {
    circle = !circle;
  }
}

function setColors() {
  let col;
  colors = [];
  let x = floor(random(255));
  for (let i = 0; i < numAstroids; i++) {
    let weight = floor(map(i, 0, numAstroids - 1, 0, 255));
    if (!randomColor) {
      col = color(weight, 255, weight);
    }
    else {
      let rv = random(1);
      if (rv < 1 / 3.0) {
        col = color(weight, 255, weight);
      } else if ( rv < 2 / 3.0) {
        col = color(255, weight, weight);
      } else {
        col = color(weight, weight, 255);
      }
    }
    colors.push(col);
  }
}

function setAlpha() {
  for (let col of colors) {
    if (line_b) {
      col.setAlpha(255);
    } else {
      col.setAlpha(50);
    }
  }
}
