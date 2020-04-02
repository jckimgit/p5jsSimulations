class Plankter extends Fish {

  constructor(loc) {
    super(loc);
    this.vel = new p5.Vector(0, 0);
    this.prevLoc = loc.copy();
    this.speed = 0.3;
    this.isSwallowed = false;
    this.fishColor = color(255, 255, 25, 150);
    this.size0 = 0;
  }

  run() {
    this.follow();
    this.update();
    this.updatePrevLoc();
    this.borders();
    this.show();
  }

  follow() {
    let x = Math.floor(this.loc.x / sea.divisionLength);
    if (x >= width/sea.divisionLength)
    x -= 1;
    let y = Math.floor(this.loc.y / sea.divisionLength);
    if (y >= height/sea.divisionLength)
    y -= 1;
    let index = x * sea.rows + y;
    let force = sea.flowfield[index];
    if (force !== null)
    this.acc.add(force);
  }

  updatePrevLoc() {
    this.prevLoc.x = this.loc.x;
    this.prevLoc.y = this.loc.y;
  }

  show() {
    stroke(this.fishColor);
    strokeWeight(2);
    line(this.loc.x, this.loc.y, this.prevLoc.x, this.prevLoc.y);
  }
}
