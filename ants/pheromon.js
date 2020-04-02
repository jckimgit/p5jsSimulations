class Pheromon {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.birthDate = frameCount;
    this.evaporation = 0;
    this.evaporationRate = 0.2
  }

  evaporate() {
    this.evaporation = this.evaporationRate * (frameCount - this.birthDate);
    if (this.evaporation > 255) {
      this.evaporation = 255;
    }
  }

  display(col) {
    noStroke();
    fill(col, 255 - this.evaporation);
    ellipse(this.x, this.y, this.r, this.r);
  }
}
