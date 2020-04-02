let gravity = new Vec2D(0, 0.02);
let numWheels = 100;
let numParticles = 4;
let radius = 10;
let totalMass = 30;
let maxSpeed = 3.0;
let restitution_w = 0.9;
let restitution_b = 0.7;
let config = 1;
let wheels;
let blockers;
let num = 0;
let rotation = false;
let wheel = false;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(1100, 500);
  cnv.parent('canvas');
  wheels = [];
  background(50);
}

function draw() {
  gui();
  if (!pause) {
    background(50);
    addWheels();
    run();
  }
  show();
}


function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }

  if (document.getElementById('yes').checked) {
    document.getElementById('box0').disabled = false;
    document.getElementById('wheel').disabled = false;
    document.getElementById('divShape').style.visibility = "visible"
  } else if (document.getElementById('no').checked) {
    document.getElementById('divShape').style.visibility = "hidden"
  }

  if (document.getElementById('box0').checked) {
    numParticles = 4;
  } else if (document.getElementById('wheel').checked) {
    numParticles = 10;
  }
}

function start() {
  numWheels = document.getElementById('numWheels').value;
  if (document.getElementById("yes").checked) {
    rotation = true;
  }
  if (document.getElementById('disconnected').checked) {
    config = 1; //console.log(config);
    createBlockers();
  } else if (document.getElementById('connected').checked) {
    config = 2; //console.log(config);
    createBlockers();
  }

  pause = false;
  document.getElementById('numWheels').disabled = true;
  document.getElementById('yes').disabled = true;
  document.getElementById('no').disabled = true;
  document.getElementById('disconnected').disabled = true;
  document.getElementById('connected').disabled = true;
  document.getElementById('box0').disabled = true;
  document.getElementById('wheel').disabled = true;
  document.getElementById('start').disabled = true;
}

function run() {
  for (w of wheels) {
    w.applyLinearForce(gravity.scale(w.axle.mass));
    w.withWheel(); // The wheel may collide with another wheel.
    w.withBlocker(); // The wheel may collide with a slope and slide on it.
  }
  for (w of wheels) {
    w.update();
  }
}

function createBlockers() {
  // Two types of slopes
  blockers = [];
  if (config == 1) {
    let start = new Vec2D(500, 150);
    let end = new Vec2D(1000, 50);
    let b = new Blocker(start, end);
    blockers.push(b);
    start = new Vec2D(100, 100);
    end = new Vec2D(600, 250);
    b = new Blocker(start, end);
    blockers.push(b);
    start = new Vec2D(400, 450);
    end = new Vec2D(800, 250);
    b = new Blocker(start, end);
    blockers.push(b);
  } else if (config == 2) {
    for (let i = 0; i < 15; i++) {
      let start = null;
      let end = null;
      if (i == 0) {
        start = new Vec2D(100, 300);
        end = new Vec2D(100 + random(50, 70), 300 + random(-40, 40));
        let b = new Blocker(start, end);
        blockers.push(b);
      } else {
        if (i != 8) {
          start = new Vec2D(blockers[i - 1].end.x, blockers[i - 1].end.y);
          end = new Vec2D(start.x + random(50, 70), start.y + random(-40, 40));
          //end = new Vec2D(100 + ranx, 300 + rany);
          let b = new Blocker(start, end);
          blockers.push(b);
        } else {
          start = new Vec2D(blockers[i - 1].end.x, blockers[i - 1].end.y);
          end = new Vec2D(start.x + random(50, 70), start.y + random(-40, 40));
          //end = new Vec2D(100 + ranx, 300 + rany);
          let b = new Blocker(start, end);
          blockers.push(b);
        }
      }
    }
  }

  // Boundaries
  b = new Blocker(new Vec2D(0, 0), new Vec2D(width, 0));
  blockers.push(b);
  b = new Blocker(new Vec2D(width, 0), new Vec2D(width, height));
  blockers.push(b);
  b = new Blocker(new Vec2D(width, height), new Vec2D(0, height));
  blockers.push(b);
  b = new Blocker(new Vec2D(0, height), new Vec2D(0, 0));
  blockers.push(b);
}

function addWheels() {
  if (wheels.length < numWheels) {
    let r = random(1);
    if (r < 0.1) {
      let w = new Wheel();
      let loc = new Vec2D(random(50, 0.9 * width), 10);
      let a = random(0.5, 1);
      w.axle = new Axle(loc, a * totalMass);
      w.axle.wheel = w;
      w.radius = a * radius;
      if (rotation) {
        let ps = [];
        let m = w.axle.mass / numParticles; // Indiviudal particles's mass
        let ia = random(0, PI);
        for (let j = 0; j < numParticles; j++) {
          let theta = 2 * PI / numParticles;
          let p = new Particle(w, new Vec2D(w.axle.loc.x + a * radius * cos(j * theta),
          w.axle.loc.y + a * radius * sin(j * theta)), m);
          p.angle = j * theta;
          p.initAngle = ia;
          w.particles.push(p);
        }
      }
      wheels.push(w);
    }
  }

  if (rotation) {
    for (let w of wheels) {
      w.findRoi(); // Calculate the rotational inertia.
    }
  }
}

function show() {
  for (w of wheels) {
    w.show();
  }
  if (blockers != null){
    for (b of blockers) {
      b.show();
    }
  }
}

function keyPressed() {
  if (key === 'R') {
    wheels = [];
  }
  if (key == 'P') {
    pause = !pause;
  }
}

/* Given a point p, this utility finds a point n on a line segment ab such that  pa is
perpendicular to ab. */

function getFoot(p, a, b) {
  let pa = p.sub(a);
  let ba = b.sub(a);
  ba.normalize();
  let l = pa.dot(ba);
  ba.scaleSelf(l);
  let n = a.add(ba);
  return n;
}
