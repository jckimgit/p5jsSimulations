let trunk;
let trunkLength = 200;
let trunkDiameter = 16;
let branches;
let lastBranch = 10;
let cBranch, cFlower;
let num = 0;
let half = true;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(900, 600);
  cnv.parent('canvas');
  background(115, 115, 180);

//  cBranch = color(36, 25, 7);
 cBranch = color(54, 39, 39);
  cFlower = color(255, 183, 197);
  branches = [];
  trunk = new Branch(trunkLength, trunkDiameter, PI / 2, null, 0);
  trunk.start = new Vec2D(width/2, height);
}

function draw() {
  gui();
  if (!pause) {
    background(115, 115, 180);
    if (num == 0) {
      makeBranches(trunkLength, trunkDiameter, trunk, 0);
      num = 1;
      for (let i = 0; i < branches.length; i++) {
        let br = branches[i];
        // if (br.level == 0 || br.level == 1) {
        //   console.log(degrees(br.angle));
        // }
      }
    }
    showTrunk();
    fill(255);
    for(let b of branches) {
      b.show();
    }
  }
}

function makeBranches(len, dia, par, lvl) {
  let l = 0;
  let d = 0.6 * dia;
  let v = lvl + 1;
  let ang = 0;
  let numBranches = 0;
  if(v < lastBranch) {
    if (v == 1) {
      numBranches = floor(random(2, 4));
      l = 0.667 * len;
    } else if (v < lastBranch - 3){
      numBranches = floor(random(3, 5));
      l = 0.667 * len;
    } else { // flowers
      if (half) {
        numBranches = 1;
      } else {
        numBranches = floor(random(2, 4));
      }
      l = 0.667 * len;
    }
    for(let i = 0; i < numBranches; i++) {
      if (i == 0) {
        ang = random(0, PI / 4);
      } else if (i == 1) {
        ang = random(3 * PI / 4 , PI);
      } else {
        ang = random(-0.2 * PI, 1.2 * PI);
      }
      let b = new Branch(l, d, ang, par, v);
      let bStart = par.start.add(new Vec2D(par.len * cos(-par.angle), par.len * sin(-par.angle)));
      b.start = bStart;
      branches.push(b);
      makeBranches(l, d, b, v);//make new branch with b as a parent
    }
  }
}

function showTrunk() {
  fill(cBranch);
  stroke(cBranch);
  push();
  translate(trunk.start.x, trunk.start.y);
  beginShape();
  vertex(24, 0);
  bezierVertex(30, -60, 30, -30, 10, -trunkLength );
  line(10, -trunkLength, -5, -trunkLength);
  vertex(-5, -trunkLength);
  bezierVertex(7, -30, 15,-60, -20, 0 );
  line(-20, 0, 20, 0);
  endShape(CLOSE);
  pop();
}

function gui() {
  let button0 = select('#start');
  button0.mousePressed(start);
  if (select('#half').elt.checked) {
    half = true;
  }  else if (select('#full').elt.checked) {
    half = false;
  }
  function start() {
    pause = false;
    button0.elt.disabled = true;
    if (select('#half').elt.checked) {
      half = true;
    }  else if (select('#full').elt.checked) {
      half = false;
    }
    select('#full').elt.disabled = true;
    select('#half').elt.disabled = true;
  }
}

function keyPressed() {
  if (key == 'R') {//restart
    pause = false;
    branches = [];
    trunk = new Branch(trunkLength, trunkDiameter, PI / 2, null, 0);
    trunk.start = new Vec2D(width / 2, height);
    makeBranches(trunkLength, trunkDiameter, trunk, 0);
  }
}
