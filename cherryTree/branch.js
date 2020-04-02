class Branch {
  constructor(len, diameter, angle, parent, level) {
    this.len = len;
    this.diameter = diameter;
    this.angle = angle;
    this.parent = parent;
    this.level = level;
  }

  show() {
    strokeWeight(this.diameter);
    push();
    translate(this.start.x, this.start.y);
    rotate(-PI / 2 - this.angle);
    beginShape();
    vertex(0,0);
    if(this.level >= lastBranch - 3){ // flowers
      stroke(cFlower);
      if (half) {
         bezierVertex(-1.2 * this.len, 0, 0, 0, -0.5 * this.len, -0.7 * this.len);
      } else {
        bezierVertex(-1.2 * this.len, 0, 0, 0, 0, 0.7 * this.len);// Use bezierVertex() not vertex() to elongate branches for flowers so that flowers look richer.
      }
    } else {
      fill(cBranch);
      bezierVertex(-0.2 * this.len, 0, 0, 0, 0, this.len); // Use bezierVertex() not vertex() to
      // make branches slightly bent.  branches point upward so that they must be appropriately rotated, that is, by -PI / 2 - this.angle
    }
    endShape();
    pop();
  }
}
