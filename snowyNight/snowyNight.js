let numSnowflakes = 600;
let physics;
let minDist = 5;
let restLength = 5;
let strength = 0.8;
let prob = 0.1;
let ground;
let num = 0;
let short = true;
let pause = true;
let cnv;

function setup() {
  cnv = createCanvas(700, 500);
  cnv.parent('canvas');
  createWorld();
  background(50);
}

function createWorld() {
  physics = new VerletPhysics2D();
  physics.setDrag(0.1);
  physics.setWorldBounds(new Rect(0, 0, width, height));
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.05)));
  ground = [];
  for (x = 0; x < width; x++) {
    ground[x] = random(10, 30);
  }
}

function draw() {
  gui();
  if (!pause) {
    background(50);
    if (frameCount < 3000) {
      snowFall();
    }
    coalesce();
    wind();
    lock();
    melt();
    show();
    physics.update();
  }
}

function snowFall() {
  let r = random(1);
  if (r < prob) {
    let p = new Snowflake(new Vec2D(random(width), random(10)), 10 * random(0.5, 1.5), frameCount);
    physics.addParticle(p);
  }
}

function coalesce() {
  for (let p of physics.particles){
    for (let q of physics.particles){
      if (q !== p){
        p.coalesce(q)
      }
    }
  }
}

function wind() {
  for (let p of physics.particles) {
    if (p.y < height - 20) {
      p.jitter(new Vec2D(random(-0.2, 0.2), random(-0.15, 0.05)));
    }
  }
}

function lock() {
  for (let p of physics.particles) {
    if (p.y > height - 20) {
      p.lock();
    }
  }
}

function melt() {
  for (let i = physics.particles.length - 1; i >= 0; i--) {
    let p =  physics.particles[i];
    if (frameCount > p.death) {
      physics.removeParticle(p);
      let springs = getSprings(p);
      for (s of springs) {
        physics.removeSpring(s);
      }
    }
  }
}

function getSprings(p) {
  let springs = [];
  for (let s of physics.springs) {
    if (s.a == p || s.b == p) {
      springs.push(s);
    }
  }
  return springs;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height - 20) {
    let p = new Snowflake(new Vec2D(mouseX, mouseY), 10 * random(0.5, 1.5), frameCount);
    physics.addParticle(p);
  }
}

function show() {
  noStroke();
  for (let p of physics.particles) {
    p.show();
  }

  for (let x = 0; x < width; x++) { // Ground
    strokeWeight(1);
    stroke(150, 150, 120, 255);
    line(x, height, x, height - ground[x]);
  }
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle/2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);


    function start() {
      pause = false;
      button0.elt.disabled = true;
      if (select('#light').elt.checked) {
        prob = 0.1;
      } else if (select('#heavy').elt.checked) {
        prob = 0.2;
      }
      select('#light').elt.disabled = true;
      select('#heavy').elt.disabled = true;
    }
  }
}


function keyPressed() {
  if (key == 'R') {//restart
    pause = false;
    createWorld();
  }
  if (key == 'P') { // pause/resume
    pause = !pause;
  }
}
