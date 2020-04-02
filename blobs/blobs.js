/* Based on http://jamie-wong.com/
A few circles move around. Blobs are formed around the circles.
*/

let grids;
let lenGrid = 10;
let circles;
let numCircles = 10;
let force = null;
let forceMag = 0.2;
let debug = false;
let fill_bool = true;
let pause = true;
let num= 0;
let cnv;

function setup() {
  cnv = createCanvas(800, 600);
  cnv.parent('canvas');
  grids = [];
  circles = [];

  createGrids();
  createCircles();
  background(50);
}

function draw() {
  gui();
  if (!pause) {
    background(50);
    render_grids();
    update();
  }
}

function createGrids() {
  let rows = height / lenGrid;
  let cols = width / lenGrid;
  let yoff = 0; // Make four corners.
  for (let i = 0; i < rows; i++) {
    let xoff = 0;
    for (let j = 0; j < cols; j++) {
      let cor = [];
      let v = new Vec2D(lenGrid * j, lenGrid * i);
      cor[0] = v;
      cor[1] = v.add(new Vec2D(lenGrid, 0));
      cor[2] = v.add(new Vec2D(lenGrid, lenGrid));
      cor[3] = v.add(new Vec2D(0, lenGrid));
      let gr = new Grid(cor);
      // Set grid's color
      let nc = noise(xoff, yoff) * 255;
      let c = color(100, nc, 150);
      gr.c = c;
      grids.push(gr);
      xoff += 0.03;
    }
    yoff += 0.03;
  }
}

function createCircles() {
  for (let i = 0; i < numCircles; i++) {
    let circ = new Circle(new Vec2D(random(width), random(height)), random(30, 60));
    circles.push(circ);
  }
}

function fallOff(x, y) { // Check whether corners of grids inside blobs.
  let fo = 0;
  for (let c of circles) {
    let r = c.radius;
    let cx = c.loc.x;
    let cy = c.loc.y;
    fo += Math.pow(r, 2) / (Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
  }
  return fo;
}

function render_grids() {
  for (let g of grids) {
    g.setFallOffType(); // Check relative position of a grid with respect to blobs.
    g.findLineSegments(); // g.findLineSegments0(); less shophiscated.
    if (fill_bool) { // Fill blobs.
      g.show_fill();
    } else {
      g.show_boundary(); // Show only boudaries of blobs.

    }
  }
}

function update() {
  for (let c of circles) {
    force = new Vec2D(random(-forceMag, forceMag), random(-forceMag, forceMag));
    c.acc.addSelf(force);
    c.borders();
    c.update();
    if (debug) {
      c.show();
    }
  }
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
  function start() {
    pause = false;
    document.getElementById('start').disabled = true;
  }
}

function mousePressed() {
  let mouseLoc = new Vec2D(mouseX, mouseY);
  let circ = new Circle(mouseLoc, random(30, 60));
  circles.push(circ);
}

function keyPressed() {
  if (key === 'R') {
    pause = false;
    grids = []
    circles = [];
    createGrids();
    createCircles();
  }

  if (key == 'P') { // pause/resume
    pause = !pause;
  }

  if (key == 'D') { // show/hide circles
    debug = !debug;
  }

  if (key == 'F') {
    fill_bool = !fill_bool; // fill/show boundary
  }
}
