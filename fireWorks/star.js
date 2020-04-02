class Star {
  constructor(hu) {
    this.size = 2;
    this.age = 255;
    this.hu = hu;
    this.loc = new p5.Vector();
    this.acc = new p5.Vector();
  }

   run() {
    this.update();
    this.show();
  }

  update() {
    this.acc.add(gravity);
    this.vel.add(this.acc);
    this.vel.mult(0.985); //console.log(this.loc, this.vel);
    this.loc.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    noStroke();
    fill(this.hu, 100, 100, alpha);
    ellipse(this.loc.x, this.loc.y, this.size, this.size);
  }
}
