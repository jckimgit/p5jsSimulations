class Particle {
  constructor (wheel, loc, mass) {
    this.wheel = wheel;
    this.loc = loc;
    this.mass = mass;
  }

  findTorque() {
    let perp = this.loc.sub(this.wheel.axle.loc).perpendicular();
    let tq = this.angularForce.dot(perp);
    return tq;
  }

  update() {
    this.angle += this.wheel.angVel;
    this.loc = new Vec2D(this.wheel.axle.loc.x + this.wheel.radius * cos(this.angle + this.initAngle),
    this.wheel.axle.loc.y + this.wheel.radius * sin(this.angle + this.initAngle));
  }
}
