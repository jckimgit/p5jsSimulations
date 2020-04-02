class Shark extends Fish {

  constructor(loc) {
    super(loc);
    this.fishColor = color(0, 200);
    this.size0 = 7;
    this.isHunting = false;
    this.hasCaptured = false;
    this.maxForce = 0.8;
    this.eatingTime = 1500;
  }

  run() {
    if (this.isHunting) {
      this.speed = this.maxSpeed;
      this.force = this.maxForce;
      this.chase();
    } else {
      this.speed = this.normalSpeed;
      this.force = this.normalForce;
      this.roam();
      if (this.hasCaptured) {
        this.vel.limit(0.5 * this.speed); // While eating, slow down.
        if (frameCount >= this.captureTime + this.eatingTime) {// Finish eating.
          this.hasCaptured = false;
        }
      } else {
        this.search();
      }
    }
    this.separate(sharks);
    super.run();

  }

  search() {
    for (let sa of sardines) {
      let sardineLoc = new p5.Vector(sa.loc.x, sa.loc.y);
      if (this.calcDistance(sardineLoc, this.loc) < 150
      && this.vel.angleBetween(p5.Vector.sub(sardineLoc, this.loc)) < PI / 2) {
        this.sardineFound = sa;
        sa.isFound = true;
        this.isHunting = true;
        break;
      }
    }
  }

  chase() {
    this.target0 = new p5.Vector(this.sardineFound.loc.x, this.sardineFound.loc.y);
    let steer = this.seek();
    this.acc.add(steer);

    if (this.calcDistance(this.sardineFound.loc, this.loc) < 30) { // Capture a sardine.
      this.captureTime = frameCount;
      this.hasCaptured = true;
      this.sardineFound.isCaptured = true;
      this.isHunting = false;
      for (let sa of sardines) {
        sa.isFleeing = false;
      }
    }

    if (this.calcDistance(this.sardineFound.loc, this.loc) > 200) { // The sardine chased is able to sucessfully escape.
      this.isHunting = false;
      this.sardineFound.isFound = false;
      this.sardineFound = null;
      for (let sa of sardines) {
        sa.isFleeing = false;
      }
    }
  }

  show() {
    push();
    translate(this.loc.x, this.loc.y);
    if (this.theta !== undefined) {
      rotate(this.theta);
    }
    if (this.hasCaptured) {// Draw a captured sardine.
      if (frameCount - this.captureTime < this.eatingTime) {
        let decay = Math.round(map(frameCount - this.captureTime, 0, this.eatingTime, 255, 0));
        fill(255, decay);
        noStroke();

        beginShape(TRIANGLES);
        vertex(0, -this.sardineFound.size0*6);
        vertex(-this.sardineFound.size0, -this.sardineFound.size0*2);
        vertex(this.sardineFound.size0, -this.sardineFound.size0*2);
        endShape();
      }
    }
    pop();
    super.show();
  }
}
