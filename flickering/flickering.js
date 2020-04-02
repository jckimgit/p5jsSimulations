let fireflies;
let numFireflies = 100;
let size = 4;
let cycle = 70;
let maxRatio = -1;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(800, 600);
  cnv.parent('canvas');
  frameRate(30);
  background(0);
  fireflies = [];
  create();
}


function draw() {
  gui();
  if (!pause) {
    background(0);
    for (let ff of fireflies) {
      ff.flicker();
      ff.show();
    }
  }
  //console.log(frameCount);

  // let n = 0;
  // for (let ff of fireflies) {
  //   if (ff.on) {
  //     n++;
  //   }
  // }
  // let ratio = n / fireflies.length;
  // if (fireflies. length >= numFireflies) {
  //   console.log(frameCount, fireflies.length, ratio);
  // }
}

function create() {
  for (let i = 0; i < numFireflies; i++) {
    let loc = new Vec2D(random(width), random(height));
    firefly = new Firefly(loc, size);
    firefly.time = floor(random(cycle / 2));
    fireflies.push(firefly);
  }
}

function gui() {
  let button0 = select('#start');
  button0.mousePressed(start);

}

function start() {
  startTime = frameCount;
  pause = false;
  document.getElementById('start').disabled = true;
}


function keyPressed() {
  if (key === 'R') {
    start();
  }
  if (key == 'P') { // pause/resume
    pause = !pause
  }
}
