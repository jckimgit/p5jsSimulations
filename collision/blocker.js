class Blocker {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.segment = start.sub(end);
  }

  show() {
    strokeWeight(3);
    if (this.start.x < width && this.start.x > 0) {
      stroke(255, 0, 0);
    } else {
      stroke(50); 
    }
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}
