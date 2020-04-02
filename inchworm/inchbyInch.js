let inchworm;
let num = 0;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(600, 400);
  cnv.parent('canvas');
  inchworm = new Inchworm();
  background(50);
}

function draw() {
  gui();
  if (!pause) {
    background(50);
    inchworm.run();
    stroke(0, 255, 0);
    strokeWeight(3);
    line(0, height / 2 + 2, width, height / 2 + 2);
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

function keyPressed() {
  if (key == 'R') {
    inchworm = new Inchworm();
  }
  if (key == 'P') {
    pause = !pause;
  }
}
