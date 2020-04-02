class Stone extends Particle {
  constructor(loc, mass, size) {
    super(loc, mass, size);
    this.target;
    this.numCollisions = 0;
    this.calcImp;
    this.droplets = [];
  }

  detectSurface() {
    if (this.loc.y > height - 250 - this.size) {
      let min = 10000;
      for (let sp of springs) {
        let dist = this.loc.sub(sp.bob.loc).magnitude();
        if (dist < min) {
          min = dist;
          this.target = sp;
        }
      }
      this.numCollisions = 1;
    }
  }

  collide() {
    this.calcImp = new CalcImpulse(this, this.target.bob, 0.5);
    this.imp = this.calcImp.findImpulse();
    this.applyForce(this.imp);
    this.target.bob.applyForce(this.imp.scale(-1));
  }

  splash() {
    if (this.numCollisions == 1) {
      let num = 1.5 * floor(this.imp.magnitude()) + 10;
      for (let i = 0; i < num; i++) {
        let d = new Particle(this.loc.add(new Vec2D(10, 10)), 1, 0.2 * this.imp.magnitude());
        d.size *= random(1.0, 2.0);
        this.droplets.push(d);
      }

      for (let dr of this.droplets) {
        let ang = random(-5 * PI / 8,  -3 * PI / 8);
        let v = new Vec2D(cos(ang), sin(ang));
        let str = random(0.2, 0.4);
        v.scaleSelf(str * this.imp.magnitude());
        dr.applyForce(v);
      }
    }
  }

  inWater() {
    if (this.in) {
      let drag = pow(this.vel.magnitude(), 2);
      let dragVec = this.vel.copy().normalizeTo(-0.06 * drag);
      this.applyForce(dragVec.scale(this.mass));
    }
  }

  show() {
    fill(100, 70, 70, 150);
    push();
    translate(this.loc.x, this.loc.y);
    ellipse(0, 0, 1.5 * this.size, this.size);
    pop();
  }
}
