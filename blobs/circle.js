//class Circle {
function Circle(loc, radius) {
  this.loc = loc;
  this.radius = radius;
  this.vel = new Vec2D();
  this.acc = new Vec2D();

  this.update = function() {
    this.vel = this.vel.add(this.acc);
    this.vel.limit(2);
    this.loc = this.loc.add(this.vel);
    this.acc.scaleSelf(0);
  };

  this.borders = function() {
    if (this.loc.x < -this.radius) {
      this.loc.x = width + this.radius;
    } else if (this.loc.x > width +this.radius) {
      this.loc.x = -this.radius;
    }
    if (this.loc.y < -this.radius) {
      this.loc.y = height + this.radius;
    }
    else if (this.loc.y > height + this.radius) {
      this.loc.y = -this.radius;
    }
  };

  this.show = function() {
    noFill();
    strokeWeight(1);
    stroke(255, 255, 0);
    ellipse(this.loc.x, this.loc.y, 2 * this.radius, 2 * this.radius);
  };
}
//}
