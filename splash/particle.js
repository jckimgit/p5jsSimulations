class Particle  { // For stones and droplets
  constructor(loc, mass, size) {
    this.loc = loc;
    this.mass = mass;
    this.size = size;
    this.vel = new Vec2D();
    this.acc = new Vec2D();
    this.in = false;
  }

  isIn() {
    if (this.loc.y > height - 250) {
      this.in = true;
    }
  }

  show() { // For droplets
    push();
    translate(this.loc.x, this.loc.y);
    if (!this.in) {
      fill(60, 80, 200, 150);
    } else {
      fill(60, 80, 200, 20);
    }
    ellipse(0, 0, this.size, this.size);
    pop();
  }

  update() {
    this.vel.addSelf(this.acc);
    this.loc.addSelf(this.vel);
    this.acc.scaleSelf(0);
  }

  applyForce(f) {
    let a = f.scale(1 / this.mass);
    this.acc.addSelf(a);
  }
}
