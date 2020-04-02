class Wheel {
  constructor() {
    this.particles = [];
    this.radius = 0;
    this.prevTargets_w = [];
    this.prevTargets_b= [];
    this.angAcc = 0;
    this.angVel = 0;
  }

  update() {
    if (rotation) {
      for (let p of this.particles) {
        p.update();
      }
    }
    this.axle.update();
    this.adjustLocation();
  }

  applyLinearForce(force) {
    this.f = force.scale(1 / this.axle.mass);
    this.axle.acc.addSelf(this.f);
  }

  adjustLocation() {
    // Make sure that two particles do not bump into each other or a particle does not bump into a blocker.
    for (let w of wheels) {
      if (!(w === (this))) {
        this.adjLoc_w(w);
      }
    }
    if (this.target_b != null) {
      this.adjLoc_b(this.target_b);
    }
  }

  collide(imp) {
    this.applyLinearForce(imp);
    if (rotation) {
      if (this.target_w != null) {
        this.findContact_w(this.target_w);
      }
      if (this.target_b != null) {
        this.findContact_b(this.target_b);
      }
      this.setAngularForce(imp);
      this.applyAngularForce();
    }
  }

  /**** Colliding with other wheels ****/

  /***
  Given a wheel w, relative status of another wheel w' with respect to w.
  (i) (near, noCol): collision occurs and noCol becomes col. The status
  becomes either (near, col) or (far, col).
  (ii) (near, col): no collision occurs because collision occurs
  for short period of time or at a single frame in this framework.
  The status becomes either (near, col) or (far col).
  (iii) (far, col): col becomes noCol, that is, when w' becomes far,
  collision memory is erased. This happens only when w' becomes far.
  The status becomes either (far, noCol) or (near, noCol).
  (iv) (far noCol): The status becomes either (far, noCol) or
  (near noCol).
  ***/

  withWheel() {
    for (let w of wheels) {
      if (wheels.indexOf(w) > wheels.indexOf(this) ) { // Check a later wheel.
        if (this.detect_w(w) && !this.prevTargets_w.includes(w)) { //(near, noCol)
          // Calculate the impulse and collide.
          this.calcImp = new CalcImpulse(this.axle, w.axle, restitution_w);
          this.impulse_w = this.calcImp.findImpulse();
          let mag = this.impulse_w.magnitude;

          if (w.axle.loc.y > 490 && this.axle.vel.magnitude() < 0.2 && this.impulse_w.magnitude() < 10) {
            this.impulse_w = new Vec2D(); console.log("y");
          }
          this.collide(this.impulse_w);
          // The same impulse with the oposite direction to the target
          w.impulse_w = this.impulse_w.scale(-1);
          w.collide(w.impulse_w);
          this.prevTargets_w.push(w); // Change noCol to col
        }
      }
    }
  }

  detect_w(w) {
    this.target_w = null;
    let dist = this.axle.loc.sub(w.axle.loc).magnitude();
    if (dist < this.radius + w.radius) { // near.
      this.target_w = w;
      return true;
    } else { // Far.
      if (this.prevTargets_w.includes(w)) {
        this.prevTargets_w.splice(w); // Set to noCol.
      }
      return false;
    }
  }

  adjLoc_w(w) {
    let d = this.axle.loc.sub(w.axle.loc);
    let dist = d.magnitude();
    if (dist < this.radius + w.radius) {
      let newD = d.copy().normalizeTo((this.radius + w.radius));
      let diff = newD.sub(d).scale(0.5);
      this.axle.loc.addSelf(diff);
    }
  }

  /*** Colliding with a blocker ***/
  withBlocker() {
    for (let b of blockers) {
      if (this.detect_b(b)) {
        let r = restitution_b;
        if (blockers.indexOf(this.target_b) >= blockers.length - 4) {
          //The restitution coefficient for the boundary is half that for the slopes.
          r *= 0.5;
          if (blockers.indexOf(this.target_b) == 5) {
            this.applyLinearForce(this.axle.vel.scale(-0.5));
            this.angVel *= 0.1;
          }
        }
        this.calcImp = new CalcImpulse(this.axle, new Axle(this.foot, 10000), r);
        this.impulse_b = this.calcImp.findImpulse();
        this.collide(this.impulse_b);
        this.prevTargets_b.push(b);
        break;
      }
    }
  }

  detect_b(b) {
    this.target_b = null;
    this.foot = getFoot(this.axle.loc, b.start, b.end);
    let off = b.segment.magnitude() - (this.foot.sub(b.start).magnitude() + this.foot.sub(b.end).magnitude());
    // If off is large, the wheel is off the blocker. If it is small, the wheel is above or below the blocker.
    if (abs(off) < 0.001) {
      let dist = this.axle.loc.sub(this.foot).magnitude(); // Distance of the wheel to the blocker.
      if (dist < this.radius) { // The wheel collides with the blocker.
        this.target_b = b;
        return true;
      } else { // if w is far,
        if (this.prevTargets_b.includes(b)) { // if w has been a target,
          this.prevTargets_b.splice(b);
        }
        return false;
      }
    } else {
      return false;
    }
  }


  /* If a particle is misplaced by bumping into a blocker, it needs to be relocated on the blocker. In this case,
  there may arise a problem. If there are many particles and resulting many collisions, too much force
  can be exerted on some particle. In such a case, the particle may penentrate the slope with a slight chance.
  Eliminating this possibility would require more checking of particle status, which makes simulation slow.
  We will proceed, allowing for the minimal number of penetrations.
  */

  adjLoc_b(b) {
    this.dist = this.foot.sub(this.axle.loc).magnitude();
    if (this.dist < this.radius) { // Slopes
      this.ln = this.axle.loc.sub(this.foot);
      this.axle.loc = this.foot.add(this.ln.normalizeTo(this.radius));
    }

    if (blockers.indexOf(b) >= blockers.length - 4) { // Boundaries
      if (this.axle.loc.y < this.radius) {
        this.axle.loc.y = this.radius;
      }
      if (this.axle.loc.x > width - this.radius) {
        this.axle.loc.x = width - this.radius;
      }
      if (this.axle.loc.y > height - this.radius) {
        this.axle.loc.y = height - this.radius;
      }
      if (this.axle.loc.x < this.radius) {
        this.axle.loc.x = this.radius;
      }
    }
  }

  /**** Rotation ****/
  findRoi() { // Rotational inertia
    let roi = 0;
    for (let p of this.particles) {
      roi +=  p.mass * pow(this.radius, 2);
    }
    this.rotationalInertia = roi;
  }

  findContact_w(w) {
    // Find a particle of the wheel at which another wheel collides. Impulse on the particle creates rotation.
    let d = w.axle.loc.sub(this.axle.loc);
    d = this.axle.loc.add(d.normalizeTo(this.radius));
    let min = 10000;
    let dist = 10000;
    for (let p of this.particles) {
      let dist = p.loc.sub(d).magnitude();
      if (dist < min) {
        min = dist;
        this.contact_w = p;
      }
    }
  }

  findContact_b(b) {
    let min = 10000;
    let dist = 10000;
    for (let p of this.particles) { // Find a particle where collision with a blocker occurs.
      //this.foot = getFoot(p.loc, b.start, b.end);
      dist = p.loc.sub(this.foot).magnitude();


      if (dist < min) {
        min = dist;
        this.contact_b = p;
      }
    }
  }

  applyAngularForce() {
    // Find total torque
    let totalTq = 0;
    for (let p of this.particles) {
      let tq = p.findTorque();
      totalTq += tq;
    }
    this.angAcc = totalTq / this.rotationalInertia;

    this.angAcc -= this.angVel * 0.005;
    this.angVel += this.angAcc;
  }

  setAngularForce(f) {
    for (let p of this.particles) {
      if (p === this.contact_w || p === this.contact_b) {
        p.angularForce = f.scale(0.5);
      } else {
        p.angularForce = new Vec2D();
      }
    }
  }

  show() {
    if (rotation) {
      strokeWeight(2);
      stroke(255, 255, 0);
      for (let i = 0; i < numParticles - 1; i++) { //console.log(this.particles);
        line(this.particles[i].loc.x, this.particles[i].loc.y, this.particles[i+1].loc.x, this.particles[i+1].loc.y);
      }
      line(this.particles[numParticles - 1].loc.x, this.particles[numParticles - 1].loc.y,
        this.particles[0].loc.x, this.particles[0].loc.y);

        if (numParticles > 5) {
          for (let i = 0; i < numParticles; i++) {
            strokeWeight(1);
            stroke(255);
            line(this.axle.loc.x, this.axle.loc.y, this.particles[i].loc.x, this.particles[i].loc.y);
          }
        }
      } else{
        noStroke();
        fill(255, 255, 0);
        ellipse(this.axle.loc.x, this.axle.loc.y, 2 * this.radius, 2 * this.radius);
      }
    }
  }
