class Floater {
  constructor(loc) {
    this.loc = loc; //super(loc);
    this.vel = new Vec2D();
    this.acc = new Vec2D();
    this.prevLoc = loc.copy();
    this.speed = 0.3;
    this.isSwallowed = false;
    this.color = color(floor(random(0, 100)), floor(random(0, 255)), floor(random(0, 100)));
    this.size0 = 0;
    this.radX = random(4, 7);
    this.radY = random(2, 4);
  }

  run() {
    this.follow();
    this.update();
    this.borders();
    this.show();
  }

  follow() {
    let x = Math.floor(this.loc.x / lake.divisionLength);
    if (x >= width/lake.divisionLength) {
      x -= 1;
    }
    let y = Math.floor(this.loc.y / lake.divisionLength);
    if (y >= height/lake.divisionLength) {
      y -= 1;
    }
    let index = x * lake.rows + y;
    let force = lake.flowfield[index];
    if (force !== null) {
      this.acc.addSelf(force);
    }
  }

  update() {
    this.vel.addSelf(this.acc);
    this.vel.limit(this.speed);
    this.loc.addSelf(this.vel);
    this.acc.scaleSelf(0);
  //  this.borders();
  }

  borders() {
      if (this.loc.x < 1) {
      this.loc.x = width;
    } else if (this.loc.x > width) {
      this.loc.x = 1;
    }
    if (this.loc.y < 1) {
      this.loc.y = height;
    } else if (this.loc.y > height) {
      this.loc.y = 1;
    }
  }

  show() {
    push();
    translate(this.loc.x - width / 2, this.loc.y - height / 2, this.loc.z);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.radX, this.radY);
    pop();
  }
}
