class Segment {

  constructor(s) {
    this.start = s;
    this.thickness = 5;
  }

  show() {
    stroke(255, 255, 0);
    strokeWeight(this.thickness);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
    noStroke();
    fill(255, 0, 0);
    ellipse(this.start.x, this.start.y, 5, 5);
  }
}
