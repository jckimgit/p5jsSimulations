/* Adapted from https://gamedevelopment.tutsplus.com/tutorials/make-a-splash-with-dynamic-2d-water-effects--gamedev-236 for wave phenomenon.
*/
let stones = [];
let springs = [];
let dist = 3; // distance between springs
len = 250;
let numSprings;
let spread = 0.01;
let gravity = new Vec2D(0, 0.5);
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(800, 600);
  cnv.parent('canvas');
  create();
  background(180, 200, 250);
}

function create() {
  numSprings = floor(width / dist + 1);
  for (let i = 0; i < numSprings; i++) {
    let sp = new Spring(new Vec2D(dist * i, height));
    let loc = new Vec2D(dist * i, height - len);
    sp.bob = new Particle(loc, 1);
    sp.bob.damping = 0.5;
    springs.push(sp);
  }
}

function draw() {
  gui();
  if (!pause) {
    background(180, 200, 250);
    ripple();
    run_stone();
    wave();
    clearParticles();
    showWater();
  }
}

function gui() {
  let button0 = select('#start');
  button0.mousePressed(start);
  function start() {
    pause = false;
    document.getElementById('start').disabled = true;
  }
}

function ripple() {
  for (let sp of springs) {
      let f = new Vec2D(random(-0.01, 0.01), random(-0.1, 0.1));
      sp.bob.applyForce(f);
  }
}

function run_stone() {
  for (let st of stones) {
    st.applyForce(gravity.scale(st.mass));
    if (st.numCollisions == 0) {
      st.detectSurface(); // Find where to collide with water surface
    }
    if (st.target !== null) {
      let num = springs.indexOf(st.target);
      if (st.numCollisions === 1) {
        let t = 0;
        st.collide();
        st.splash();
        st.target = null;
      }
    }
    if (!st.in) {
      st.isIn();
    } else {
      st.inWater(); // Water resitance
    }
    st.update();
    st.show();
    run_droplets(st);
  }
}

function run_droplets(st) {
  for (let i = 0; i < st.droplets.length; i++) {
    let dr = st.droplets[i];
    dr.applyForce(gravity.scale(dr.mass));
    dr.update();
    if (!dr.in) {
      dr.isIn();
    }
    dr.show();
  }
}

function wave() {
  for (let sp of springs) {
    sp.oscillate();
    sp.constrainLength(30, 300);
  }
  for (let i = 0; i < 15; i++) {
    for (let sp of springs) {
      sp.transfer();
    }
  }
}

function clearParticles() {
  for (let st of stones) {
    if (st.loc.y > height + st.size / 2) {
      let num = stones.indexOf(st);
      stones.splice(num, 1);
    }
    for (let dr of st.droplets) {
      if (dr.loc.y > height + dr.size / 2) {
        let num = st.droplets.indexOf(dr);
        st.droplets.splice(num, 1);
      }
    }
  }
}

function showWater() { // Show water.
  for (let j = 0; j < numSprings - 1; j ++) {
    let s0 = springs[j];
    let s1 = springs[j + 1];
    for (let i = j * dist; i < (j + 1) * dist; i++) {
      strokeWeight(1);
      stroke(0, 50, 200, 150);
      let y0 = s0.bob.loc.y;
      let y1 = s1.bob.loc.y; //console.log(y0, y1);
      let y = y0 + ((y1 - y0)  / dist) * (i  - j * dist);
      line(i, height, i, y);
    }
  }
  for (let i = height; i > 1 * height / 5; i--) {
    let alpha = map(i, 1 * height / 5, height, 0, 255);
    strokeWeight(1);
    stroke(60, 60, 200, alpha);
    line(0, i, width, i);
  }
}

function mousePressed() {
  if (mouseY > 0) {
    let mass = random(10000, 20000);
    let size = mass * 0.001;
    let st = new Stone(new Vec2D(mouseX , mouseY ), mass, size);
    stones.push(st);
  }
}

function keyPressed() {
  if (key == 'P') { // pause/resume
    pause = !pause
  }
}
