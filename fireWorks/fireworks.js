/* A variation of D. Shiffman' firework example */

let skyrockets;
let gravity = new p5.Vector(0, 0.02);
let maxNumSkyrockets = 10;
let num = 0;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(800, 600);
  cnv.parent('canvas');
  colorMode(HSB, 360, 100, 100, 255);
  skyrockets = [];
  background(0);
}

function draw() {
  gui();
  if (!pause) {
    if (random(1) < 0.05 && skyrockets.length <= maxNumSkyrockets) {
      skyrockets.push(new Skyrocket(new p5.Vector(random(width), height)));
    }
    noStroke();
    fill(0, 30);
    rect(0, 0, width, height);

    for (let i = skyrockets.length - 1; i >= 0; i--) {
      let s = skyrockets[i];
      s.run();
      if (s.explosion) {
        for (let j = 0; j < s.stars.length; j++) {
          s.stars[j].run();
        }
      }
      if (s.explosion1) {
        for (let j = 0; j < s.stars1.length; j++) {
          s.stars1[j].run();
        }
      }
      if (s.isDead()) {
        skyrockets.splice(i, 1);
      }
    }
  }
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
}

function start() {
  select('#start').elt.disabled = true;
  skyrockets = [];
  pause = false;
}


function keyPressed() {
  if (key === 'R') {
    skyrockets = [];
  }
  if (key == 'P') {
    pause = !pause;
  }
}
