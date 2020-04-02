class Skyrocket {
  constructor(loc) {
    this.lifespan = 500;
    this.size = 3;
    this.timer = 0;
    this.numStars = 200;
    this.explosionTime = 0;
    this.explosion = false;
    this.explosion1 = false;
    this.loc = loc;
    this.vel = new p5.Vector(0, random(-20, -10));
    this.acc = new p5.Vector();
    this.stars = [];
    this.stars1 = [];
    this.createStars();
  }

  run() {
    this.update();
    this.explode();
    this.explode1();


    this.show();
  }

  createStars() {
    let hu = random(255);
    for (let i = 0; i < this.numStars; i++) {
      let s = new Star(hu);
      s.vel = new p5.Vector(random(-1, 1), random(-1, 1)).normalize();
      s.vel.x *= random(2, 4);
      s.vel.y *= random(2, 4);
      this.stars[i] = s;
    }

    hu = random(255);
    for (let i = 0; i < this.numStars / 2; i++) {
      let s = new Star(hu);
      s.vel = new p5.Vector(random(-1, 1), random(-1, 1)).normalize();
      s.vel.x *= random(1, 2);
      s.vel.y *= random(1, 2);
      this.stars1[i] = s;
    }
  }

  update() {
    this.acc.add(gravity);
    this.vel.add(this.acc);
    this.vel.mult(0.97);
    this.loc.add(this.vel);
    this.acc.mult(0);
  }

  isDead() {
    if (this.timer >= this.lifespan) {
      return true;
    }
    else {
      return false;
    }
  }

  show() {
    noStroke();
    let alpha = this.lifespan - this.timer;
    fill(90, 50, 100, alpha);
    ellipse(this.loc.x, this.loc.y, this.size, this.size);
  }

  explode() {
    if (this.vel.y >= 0) {// skyrocket reaches its highest altitude
      this.timer++;
      if (!this.explosion) {
        for (let i = 0; i < this.stars.length; i++) {
          this.stars[i].loc = new p5.Vector(this.loc.x, this.loc.y);
        }
        this.explosion = true;
        this.explosionTime = frameCount;
      }
    }
  }

  explode1() {
    if (this.vel.y >= 0 &&  (frameCount >= this.explosionTime + 200)) {
      this.timer++;
      if (!this.explosion1) {
        for (let i = 0; i < this.stars1.length; i++) {
          this.stars1[i].loc = new p5.Vector(this.loc.x, this.loc.y);
        }
        this.explosion1 = true;
      }
    }
  }
}
