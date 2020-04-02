class Lake {
  constructor() {
    this.divisionLength = 64;
    this.cols = floor(width / this.divisionLength);
    this.rows = floor(height / this.divisionLength);
    this.flowfield = []; //new p5.Vector[cols * rows];
    this.divisionLength = 128;
    this.zoff = 0;
    this.inc = 0.003;
    this.incZ = 0.0003;
  }

  flow() { // Adapted from the flow field example by D. Shiffman.
    let yoff = 0;
    for (let y = 0; y < this.rows; y++) {
      let xoff = 0;
      for (let x = 0; x < this.cols; x++) {
        let index = x * this.rows + y;
        let angle = noise(xoff, yoff, this.zoff) * 2 * PI;
        let v = Vec2D.fromTheta(angle);
        this.flowfield[index] = v;
        xoff += this.inc;
      }
      yoff += this.inc;
      this.zoff += this.incZ;
    }
  }
}
