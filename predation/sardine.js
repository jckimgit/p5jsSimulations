class Sardine extends Fish {  //<>//

  constructor(loc) {
    super(loc);
    this.isFound = false;
    this.isFleeing = false;
    this.isCaptured = false;
    this.size0 = 3;
  }

  run() {
    if (this.isFleeing) { // Flee from a hungry shark at maximum speed.
      if (this.isFound) {
        this.fishColor = color(255, 0, 0);
      } else {
        this.fishColor = color(180, 110, 230);
      }
      this.flee();
      this.separate(sardines);
    } else {
      this.fishColor = color(255);
      this.speed = this.normalSpeed;
      this.force = this.normalForce;
      this.roam();
      this.flock(); // Flock to form a bait ball.
      this.swallow(); // Swallow plankton.
      this.stayAway(); // Try to keep distance from any sharks.
      this.detect(); // Look for sharks in the vicinity.
    }
    super.run();
  }

  update() {
    if (this.isFleeing) {
      this.loc.add(this.vel);
      this.borders();
    } else {
      super.update();
    }
  }

  stayAway() {
    for (let sh of sharks) {
      let sharkLoc = new p5.Vector(sh.loc.x, sh.loc.y);
      if (this.calcDistance(sharkLoc, this.loc)  < 150) {
        let vel = p5.Vector.sub(this.loc, sh.loc);
        this.target0 = p5.Vector.add(this.loc, vel);
        let steer = this.seek();
        this.acc.add(steer.mult(3));
      }
    }
  }

  detect() {
    for (let sh of sharks) {
      let sharkLoc = new p5.Vector(sh.loc.x, sh.loc.y);
      if (this.calcDistance(sharkLoc, this.loc) < 80) {
        if (!sh.hasCaptured) {
          this.sharkFound = sh;
          this.isFleeing = true;
          break;
        }
      }
    }
  }

  flee() {
    if (frameCount % 30 == 0) {
      let angle = random(-PI / 2, PI / 2);
      let x_coord = cos(angle) * this.sharkFound.vel.x + sin(angle) * this.sharkFound.vel.y;
      let y_coord = -sin(angle) * this.sharkFound.vel.x + cos(angle) * this.sharkFound.vel.y;
      this.vel = new p5.Vector(x_coord, y_coord);
      this.vel.mult(this.maxSpeed);
      if (this.calcDistance(this.sharkFound.loc, this.loc) > 80) {
        this.isFleeing = false; // Roam again.
      }
    }
  }

  swallow() {
    for (let p of plankton) {
      if (this.calcDistance(this.loc, p.loc) < 20  && !this.isFleeing) {
        p.isSwallowed = true;
      }
    }
  }

  flock() { // Adpated from the flocking example by D. Shiffman.
    this.cohere(); //console.log("y"); noLoop();
    this.separate(sardines);
    this.align();
  }

  cohere() {
    let neighbordist = 250;
    let sum = new p5.Vector(0, 0);
    let count = 0;
    for (let sa of sardines) {
      let d = this.calcDistance(this.loc, sa.loc);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(sa.loc);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      this.target0 = sum;
      let steer = this.seek();
      this.acc.add(steer.mult(0.8));
    }
  }

  align() {
    let distance = 70;
    let steer = new p5.Vector(0, 0);
    let sum = new p5.Vector(0, 0);
    let count = 0;
    for (let sa of sardines) {
      let d = this.calcDistance(this.loc, sa.loc);
      if ((d > 0) && (d < distance)) {
        sum.add(sa.vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.setMag(this.speed);
      steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.force);
    }
    this.acc.add(steer.mult(0.8));
  }
}
