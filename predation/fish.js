class Fish {

  constructor(loc) {
    this.loc = loc;
    this.vel = p5.Vector.random2D();
    this.acc = new p5.Vector();
    this.numWandering = 0;
    this.theta;
    // if (this instanceof Sardine) {
    //   this.normalSpeed = 1;
    //   this.normalForce = 0.02;
    //   this.maxSpeed = 1.5;
    //   this.maxNumWandering = 10;
    //   this.accAdj_roaming = 2;
    //   this.distance_separation = 30;
    //   this.accAdj_separation = 1.2;
    // }
    // else if (this instanceof Shark) {
    //   this.normalSpeed = 0.6;
    //   this.normalForce = 0.4;
    //   this.maxSpeed = 1.5;
    //   this.maxNumWandering = Math.round(random(100, 300));
    //   this.accAdj_roaming = 2;
    //   this.distance_separation = 50;
    //   this.accAdj_separation = 0.5;
    // }
    if (this instanceof Sardine) {
      this.normalSpeed = 2;
      this.normalForce = 0.03;
      this.maxSpeed = 1.5;
      this.maxNumWandering = 10;
      this.accAdj_roaming = 2;
      this.distance_separation = 30;
      this.accAdj_separation = 1.2;
    }
    else if (this instanceof Shark) {
      this.normalSpeed = 1.6;
      this.normalForce = 0.2;
      this.maxSpeed = 1.8;
      this.maxNumWandering = Math.round(random(100, 300));
      this.accAdj_roaming = 2;
      this.distance_separation = 50;
      this.accAdj_separation = 0.5;
    }
  }

  run() {
    this.update();
    this.show();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.speed);
    this.loc.add(this.vel);
    this.acc.mult(0);
    this.borders();
  }

  show() {
    this.theta = this.vel.heading() + radians(90);
    push();
    translate(this.loc.x, this.loc.y);
    rotate(this.theta);
    fill(this.fishColor);
    noStroke();
    beginShape(TRIANGLES);
    vertex(0, -this.size0*2);
    vertex(-this.size0, this.size0*2);
    vertex(this.size0, this.size0*2);
    endShape();
    pop();
  }

  seek() {
    let desired = p5.Vector.sub(this.target0, this.loc);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.force);
    return steer;
  }

  roam() {
    if (this instanceof Shark) {
      if (!(this).hasCaptured)
        this.accAdj_roaming = 0.5;
      else
        this.accAdj_roaming = 0.2;
    }
    this.numWandering++;
    if (this.numWandering > this.maxNumWandering) {
      this.target0 = new p5.Vector(random(width), random(height));
      let steer = this.seek();
      this.acc.add(steer.mult(this.accAdj_roaming));
      this.acc.add(steer);
      this.numWandering = 0;
    }
  }

  separate(fishList) { // Adpated from the flocking example by D. Shiffman.
    let steer = new p5.Vector(0, 0);
    let sum = new p5.Vector(0, 0);
    let count = 0;

    for (let f of fishList) {
      let d = this.calcDistance(this.loc, f.loc);
      if ((d > 0) && (d < this.distance_separation)) {
        let vel = p5.Vector.sub(this.loc, f.loc);
        vel.normalize();
        vel.div(d);
        sum.add(vel);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.setMag(this.speed);
      steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.force);
    }
    this.acc.add(steer.mult(this.accAdj_separation));
  }

  borders() {
    if (this.loc.x < -this.size0)
      this.loc.x = width + this.size0;
    else if (this.loc.x > width + this.size0)
      this.loc.x = -this.size0;
    if (this.loc.y < -this.size0)
      this.loc.y = height + this.size0;
    else if (this.loc.y > height + this.size0)
      this.loc.y = -this.size0;
  }

  // For faster calculations of distance between vectors.
  calcDistance(a, b) {
    let d = abs(a.x - b.x) + abs(a.y - b.y);
    return d;
  }
}
