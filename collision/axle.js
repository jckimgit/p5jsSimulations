class Axle {
  constructor(loc, mass) {
    this.loc = loc;
    this.mass = mass;
    this.vel = new Vec2D();
    this.acc = new Vec2D();
  }

  update() {
    this.vel.addSelf(this.acc);
    this.speed = this.vel.magnitude();
    this.speed = constrain(this.speed, 0, maxSpeed);
    this.vel.normalizeTo(this.speed);
    this.loc.addSelf(this.vel);
    this.acc.scaleSelf(0);
  //  console.log(this.vel.magnitude());
  }
}
