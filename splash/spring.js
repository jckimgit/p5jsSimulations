class Spring {
  constructor(anchor) {
    this.anchor = anchor;
    this.k = 0.03; // Spring constant
    this.damping = 0.02;
    this.n = 0;
  }

  oscillate() {
    let force = this.bob.loc.sub(this.anchor);
    let d = force.magnitude();
    // let stretch = d - len; //console.log(len, stretch);
    let stretch = d - len;
    force.normalize();
    force.scaleSelf(-this.k * stretch).subSelf(this.bob.vel.scale(this.damping * this.bob.mass));
    if (this.n == 0) {
      this.bob.vel.scaleSelf(2);
      this.n = 1;
    }
    this.bob.applyForce(force);
    this.bob.update();
  }

  transfer() { // energy transfer.
    this.calcDels();
    let num = springs.indexOf(this);
    if (num > 0) {
      let s1 = springs[num - 1];
      s1.bob.vel.addSelf(new Vec2D(0, this.delL));
      s1.bob.loc.addSelf(new Vec2D(0, this.delL));
    }
    if (num < springs.length - 1) {
      let s1 = springs[num + 1];
      s1.bob.vel.addSelf(new Vec2D(0, this.delR));
      s1.bob.loc.addSelf(new Vec2D(0, this.delR));
    }
  }

  calcDels() {
    let num = springs.indexOf(this);
    if (num > 0) {
      let s = springs[num - 1];
      this.delL = spread * (this.bob.loc.y - s.bob.loc.y);
    }

    if (num < springs.length - 1) {
      let s = springs[num + 1];
      this.delR = spread * (this.bob.loc.y - s.bob.loc.y);
    }

  }

  // Constrain the distance between bob and anchor between min and max
  constrainLength(minlen, maxlen) { // Adpated from Shiffman
    let dir = this.bob.loc.sub(this.anchor);
    let d = dir.magnitude();
    if (d < minlen) {
      dir.normalize();
      dir.scaleSelf(minlen);
      // Reset loc and stop from moving (not realistic physics)
      this.bob.loc = this.anchor.add(dir);
      this.bob.vel.scaleSelf(0);
    } else if (d > maxlen) {
      dir.normalize();
      dir.scaleSelf(maxlen);
      // Reset loc and stop from moving (not realistic physics)
      this.bob.loc = this.anchor.add(dir);
      this.bob.vel.scaleSelf(0);
    }
  }
}
