class Firefly  { // For stones and droplets
  constructor(loc, size) {
    this.loc = loc;
    this.vel = new Vec2D(random(-1, 1), random(-1, 1));
    this.size = size;
  }

  flicker() {
    /* At each time, a firefly is either in no pulse state or in pulse state. If the firefly hasn't detected a light pulse of other neighboring fireflies, it is in the former state. Otherwise, it is in the latter state. When entering the latter state, it increases its internal  clock time so that it fires a light earlier than otherwise.  When it lights up, it does so for a certain period of time. After that, it resets its own clock time to zero and the whole process starts all over again.
    */
    this.time += 1;
    this.move();
    this.inBoundary();
    if (this.time >= cycle / 2) {
      this.on = true;
      this.influence();
      if (this.time >= cycle) {
        this.time = 0;
      }
    } else {
      this.on = false;
    }
  }

  move() {
    this.loc.addSelf(this.vel);
  }

  inBoundary() {
    if (this.loc.x < this.size || this.loc.x > width - this.size ) {
      this.vel.x *= -1;
    }
    if (this.loc.y < this.size || this.loc.y > height - this.size ) {
      this.vel.y *= -1;
    }
  }

  influence() {
    for (let i = 0; i < fireflies.length; i++) {
      let ff = fireflies[i];
      if (ff != this) {
        if (!ff.on) {
          let temp = ff.time + 1;
          if (temp < cycle / 2) {
            ff.time = temp;
          }
        }
      }
    }
  }

  show() {
    if (this.on) {
      if (this.time >= cycle / 2 && this.time < cycle / 2 + cycle / 4) {
        let alpha = map(this.time, cycle / 2, cycle / 2 + cycle / 4, 0, 255);
        fill(255, 255, 30, alpha);
      } else if (this.time >= cycle / 2 + cycle / 4 && this.time < cycle) {
        let alpha = map(this.time, cycle / 2 + cycle / 4, cycle, 255, 0);
        fill(255, 255, 30, alpha);
      }
    } else {
      fill(0);
    }
    ellipse(this.loc.x, this.loc.y, 2 * this.size, 2 * this.size);
  }
}
