class Hinge {
  constructor(loc_, num_) {
    this.loc = loc_;
    this.vel = Vec3D.randomVector();
    this.acc = new Vec3D();
    this.wanderingSpeed = 2.5;
    this.chasingSpeed = 4;
    this.numAdjustments = 0;
    this.target = new Vec3D(random(width), random(height), random(-20, 20));
    this.num = num_;
    this.angle = 0;
    let n = floor(numHinges / 4);
    if (this.num < n) {
      this.size = map(this.num, 1, n, 3 * maxSize / 4, maxSize);
    } else if (this.num >= n && this.num < 1.8 * n) {
      this.size = maxSize;
    } else {
      this.size = map(this.num, 1.8 * n, numHinges, maxSize, 2);
    }
  }

  run() {
    if (this.num == 0) { // Head
      if (food == null) {
        this.wander();
      } else {
        this.chase();
      }
      this.borders();
      this.update();
    } else { // Bodies
      this.wiggle();
      this.update();
      this.follow();
      this.update();
    }
    this.show();
  }

  wander() { //For head
    if (this.numAdjustments == 0) { // Set a new direction.
      let ang = random(-PI / 2, PI / 2);
      let loc2D = new Vec2D(this.loc.x, this.loc.y);
      let vel2D = new Vec2D(this.vel.x, this.vel.y);
      let tempVel = vel2D.getRotated(ang).scaleSelf(500);
      let target2D = loc2D.add(tempVel);
      this.target = new Vec3D(target2D.x, target2D.y, random(-60, 20));
      this.maxNumAdjustments  = floor(map(abs(ang), 0, PI / 2, 50, 100));
      this.adjustForce();
    } else if (this.numAdjustments < this.maxNumAdjustments) { // Keep adjusting direction toward the target.
      this.adjustForce();
    } else {
      this.numAdjustments = 0;
    }
  }

  chase() {
    this.target = food;
    this.adjustForce();
    let dist = this.loc.sub(food).magnitude();
    if (dist < 5) {
      food = null;
    }
  }

  adjustForce() {// For head
    let steer = this.seek();
    if (food == null) {
      steer.scaleSelf(2.0 / this.maxNumAdjustments);
      this.numAdjustments++;
    } else {
      steer.scaleSelf(0.4);
    }
    this.acc.addSelf(steer);
  }

  follow() { // For bodies
    let hg = hinges[this.num - 1]; // Follow the hinge in front
    let dir = hg.loc.sub(this.loc);
    let s = 0.4;
    if (food != null) {
      s = 0.55;
    }
    this.target = this.loc.add(dir.scale(s));
    this.applyForce();
  }

  wiggle() {
    let mag = sin(0.5 * this.angle);
    let n = floor(numHinges / 8);
    if (food == null) {
      if (this.num > n) {
        mag = map(mag, -1, 1, -0.5, 0.5);
      } else {
        mag = map(mag, -1, 1, -0.5 * this.num / n, 0.5 * this.num / n);
      }
    } else {
      if (this.num > n) {
        // mag = map(mag, -1, 1, -1.5, 1.5);
        mag = map(mag, -1, 1, -1.5, 1.5);
      } else {
        mag = map(mag, -1, 1, -1.5 * this.num / n, 1.5 * this.num / n);
      }
    }
    // Wiggle while maintaining the snake's z-axis position.
    let v = new Vec2D(direction.x, direction.y);
    let temp = v.getPerpendicular().normalizeTo(mag * 2); // Wiggle perpendicularly to the snake's moving direction.
    let tempLoc = (new Vec2D(this.loc.x, this.loc.y)).add(temp);
    this.target = new Vec3D(tempLoc.x, tempLoc.y, this.loc.z);
    this.applyForce();
    if (food == null) {
      this.angle += 0.15;
    } else {
      this.angle += 0.25;
    }
  }

  applyForce() { // For bodies to follow or to wiggle
    let steer = this.seek();
    this.acc.addSelf(steer);
  }

  update() {
    this.vel.addSelf(this.acc);
    if (this.num == 0) {
      direction = this.vel;
    }
    this.loc.addSelf(this.vel);
    this.acc.scaleSelf(0);
  }

  seek() {
    let desired = this.target.sub(this.loc);
    if (this.num == 0) { // For smooth movements
      if (food == null) {
        desired.normalizeTo(this.wanderingSpeed);
      } else {
        desired.normalizeTo(this.chasingSpeed);
      }
    }
    let steer = desired.sub(this.vel);
    return steer;
  }

  borders() {
    if (this.loc.x < 0 || this.loc.x > width  || this.loc.y < 0 || this.loc.y > height) {
      let offX = width / 2;
      let offY = height / 2;
      if (this.loc.x < 0) {
        if (this.vel.y > 0) {
          this.target = new Vec3D(offX, height, this.loc.z);
        } else {
          this.target = new Vec3D(offX, 0, this.loc.z);
        }
      } else if (this.loc.x > width) {
        if (this.vel.y > 0) {
          this.target = new Vec3D(width - offX, height, this.loc.z);
        } else {
          this.target = new Vec3D(width - offX, 0, this.loc.z);
        }
      } else if (this.loc.y < 0) {
        if (this.vel.x > 0) {
          this.target = new Vec3D(width, offY, this.loc.z);
        } else {
          this.target = new Vec3D(0, offY, this.loc.z);
        }
      } else if (this.loc.y > height) {
        if (this.vel.x > 0) {
          this.target = new Vec3D(width, height - offY, this.loc.z);
        } else {
          this.target = new Vec3D(0, height - offY, this.loc.z);
        }
      }
      this.adjustForce();
    }
  }

  show() {
    let alp = map(this.loc.z, -30, 20, 0, 150);
    let b = map(this.loc.z, -30, 20, 0, 10);

    push();
    translate(this.loc.x - width / 2, this.loc.y - height / 2, this.loc.z);
    if (this.num == 0) {
      let angle = this.vel.headingXY() + PI / 2; // Head points to the north initially so that
      rotateZ(angle);
      push();

      for (let i = -11; i < 11; i++) { // Head as a collection of shperes.
        translate(0 , i * 0.5, 0);
        ambientLight(b);
        directionalLight(255, 255, 255, 0, 1, 0.1);
        ambientMaterial(150, 150, 0, alp);
        noStroke();
        sphere(abs(sqrt(i) * 3.5));
      }
      translate(0, 0, 0); // Eyes: an eyebll is a sphere protruding out of head.
      push();
      translate(-4 , -10 , 5);
      ambientMaterial(255, 0, 0);
      sphere(2);
      pop();
      push();
      translate(4 , -10 , 5);
      ambientMaterial(255, 0, 0);
      sphere(2);
      pop();
      pop();
    } else {
      ambientLight(b);
      ambientMaterial(150, 150, 0, alp);
      noStroke();
      sphere(this.size);
    }
    pop();
  }
}
