let hinges;
let numHinges = 90;
let maxSize = 8;
let direction = new Vec3D();
let floaters;
let numfloaters = 300;
let lake;
let food;
let t = 0;
let num = 0;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(1200, 1000, WEBGL);
  cnv.parent('canvas');
  create();
  background(10, 60, 170);
}

function draw() {
  gui();
  if (!pause) {
    background(10, 60, 170);
    lake.flow(); // Make water flow, on which floaters float.

    for (let i = floaters.length - 1; i >= 0; i--) {
      let fl = floaters[i];
      fl.run();
    }

    for (let hg of hinges) {
      hg.run();
    }

    if (food != null) {
      push();
      translate(food.x - width /2, food.y - height /2, food.z);
      rotateX(t)
      rotateY(t);
      directionalLight(0, 0, 0, 200, 0, 0);
      ambientMaterial(100, 100, 255);
      noStroke();
      torus(5, 3);
      t += 0.05;
      pop();
    }
  }
}

function water() {
  for (let y = 0; y < height; y += 0.5) {
    strokeWeight(1);
    stroke(color(10, 60, 170), 70);
    line(0, y, width, y);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let hg = hinges[0];
    food = new Vec3D(mouseX, mouseY, 0);
    hg.target = food;
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

function create() {
  lake = new Lake();

  floaters = [];
  for (let i = 0; i < numfloaters; i++) {
    let loc = new Vec2D(random(width), random(height));
    let floater = new Floater(loc);
    floaters.push(floater);
  }

  hinges = [];
  // Head
  let loc = new Vec3D(width / 2, height / 2, 0);
  hinges.push(new Hinge(loc, 0));
  //Bodies
  let t = 1;
  let d = 2.0 / (numHinges - 1);
  for (let i = 1; i < numHinges; i++) { //Bodies of num 1 to numBodies - 1.
    let ang = 5 * acos(t);
    let hg = hinges[i - 1];
    loc = hg.loc.add(new Vec3D(maxSize * cos(ang), maxSize * sin(ang), 0));
    hg = new Hinge(loc, i);
    hinges.push(hg);
    t -= d;
  }
}

function keyPressed() {
  if (key == 'R') { // pause/resume
    create();
  }
  if (key == 'P') { // pause/resume
    pause = !pause
  }
}
