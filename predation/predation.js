/* Sharks feed on sardines, which feed on plankton. Normally, sharks and sardines roam.
Sardines tend to flock and form a bait ball and to stay away from sharks.
If a shark detects a sardine nearby, it chases the sardine, which turns red and flees.
When a shark is very close to the bait ball, startled sardines turn purple and flee.
If a shark catches a sardine, it stops hunting and concentrates on eating for a while.
*/
let sea;
let plankton;
let sardines;
let sharks;
let numPlankton = 500;
let numSardines = 100;
let num = 0;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(800, 800);
  cnv.parent('canvas');
  create();
  background(20, 50, 170);
}

function draw() {
  gui();
  if (!pause) {
    background(20, 50, 170);
    sea.flow(); // Make seawater flow, on which plankton float.

    // Plankton are swallowed by sardines.
    let count = 0;
    for (let i = plankton.length - 1; i >= 0; i--) {
      let pl = plankton[i];
      if (pl.isSwallowed) {
        plankton.splice(i, 1);
        count++;
      }
      pl.run();
    }

    //The same number of swallowed plankton is replenished.
    for (let i = 0; i < count; i++) {
      let p = new Plankter(new p5.Vector(random(width), random(height)));
      plankton.push(p);
    }

    for (let i = sardines.length - 1; i >= 0; i--) {
      let sa = sardines[i];
      if (sa.isCaptured)
      sardines.splice(i, 1);
      sa.run();
    }

    for (let sh of sharks) {
      sh.run();
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

function create() {
  plankton = [];
  sardines = [];
  sharks = [];
  sea = new Sea();

  // Create plankton, sardines and sharks.
  for (let i = 0; i < numPlankton; i++) {
    let loc = new p5.Vector(random(width), random(height));
    let plankter = new Plankter(loc);
    plankton.push(plankter);
  }

  for (let i = 0; i < numSardines; i++) {
    let loc = new p5.Vector(random(10, width-10), random(10, height-10));
    let sardine = new Sardine(loc);
    sardines.push(sardine);
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let loc = new p5.Vector(mouseX, mouseY);
    let shark = new Shark(loc);
    sharks.push(shark);
  }
}

function keyPressed() {
  if (key == 'R') {
    create();
  }
  if (key == 'P') { // pause/resume
    pause = !pause;
  }
}
