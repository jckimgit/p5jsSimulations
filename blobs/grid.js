//class Grid {
function Grid(corners) {
  this.corners = corners;
  this.in = ['0', '0', '0', '0'];
  this.type;
  this.ends = [null, null];
  this.va = null;
  this.vb = null;
  this.c;
  
  this.findBoundaryPoint = function(b, d, vertical) {// Refer to Wong's work.
  let qx = 0;
  let qy = 0;
  let v = null;

  if (vertical) {
    qx = b.x;
    qy = b.y + (d.y - b.y) * ((1 - fallOff(b.x, b.y)) / (fallOff(d.x, d.y) - fallOff(b.x, b.y)));
    v = new Vec2D(qx, qy);
  } else {
    qx = b.x + (d.x - b.x) * ((1 - fallOff(b.x, b.y)) / (fallOff(d.x, d.y) - fallOff(b.x, b.y)));
    qy = b.y ;
    v = new Vec2D(qx, qy);
  }
  return v;
};

this.setFallOffType = function() {
  for (let i = 0; i < 4; i++) {
    let cn = this.corners[i];
    if (fallOff(cn.x, cn.y) >= 1) {
      this.in[i] = '1';
    } else {
      this.in[i] = '0';
    }
  }
  this.type = this.in.join('');
};

this.findLineSegments = function() {
  switch(this.type) {
    case "0001":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.findBoundaryPoint(this.corners[3], this.corners[2], false);
    break;

    case "0010":
    this.va = this.findBoundaryPoint(this.corners[1], this.corners[2], true);
    this.vb = this.findBoundaryPoint(this.corners[3], this.corners[2], false);
    break;

    case "0011":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.findBoundaryPoint(this.corners[1], this.corners[2], true);
    break;

    case "0100":
    this.va = this.findBoundaryPoint(this.corners[1], this.corners[2], true);
    this.vb = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    break;

    case "0101":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    break;

    case "0110":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    this.vb = this.findBoundaryPoint(this.corners[3], this.corners[2], false);
    break;

    case "0111":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    break;

    case "1000":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    break;

    case "1001":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    this.vb = this.findBoundaryPoint(this.corners[3], this.corners[2], false);
    break;

    case "1010":
    this.va = this.findBoundaryPoint(this.corners[1], this.corners[2], true);
    this.vb = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    break;

    case "1011":
    this.va = this.findBoundaryPoint(this.corners[1], this.corners[2], true);
    this.vb = this.findBoundaryPoint(this.corners[0], this.corners[1], false);
    break;

    case "1100":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.findBoundaryPoint(this.corners[1], this.corners[2], true);
    break;

    case "1101":
    this.va = this.findBoundaryPoint(this.corners[1], this.corners[2], true);
    this.vb = this.findBoundaryPoint(this.corners[3], this.corners[2], false);
    break;

    case "1110":
    this.va = this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.findBoundaryPoint(this.corners[3], this.corners[2], false);
    break;
  }
  this.ends[0] = this.va;
  this.ends[1] = this.vb;
};

this.findLineSegments0 = function() { // Less sophiticated than the above.
  switch(this.type) {
    case "0001":
    this.va = this.corners[0].scale(0.5).add(this.corners[3].scale(0.5));
    this.vb = this.corners[3].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "0010":
    this.va = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    this.vb = this.corners[3].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "0011":
    this.va = this.corners[0].scale(0.5).add(this.corners[3].scale(0.5));
    this.vb = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "0100":
    this.va = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    this.vb = this.corners[0].scale(0.5).add(this.corners[1].scale(0.5));
    break;

    case "0101":
    this.va = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    this.vb = this.corners[3].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "0110":
    this.va = this.corners[0].scale(0.5).add(this.corners[1].scale(0.5));
    this.vb = this.corners[3].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "0111":
    this.va = this.corners[0].scale(0.5).add(this.corners[3].scale(0.5));
    this.vb = this.corners[0].scale(0.5).add(this.corners[1].scale(0.5));
    break;

    case "1000":
    this.va = this.corners[0].scale(0.5).add(this.corners[3].scale(0.5));
    this.vb = this.corners[0].scale(0.5).add(this.corners[1].scale(0.5));
    break;

    case "1001":
    this.va = this.corners[0].scale(0.5).add(this.corners[1].scale(0.5));
    this.vb = this.corners[3].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "1010":
    this.va = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    this.vb = this.corners[0].scale(0.5).add(this.corners[1].scale(0.5));
    break;

    case "1011":
    this.va = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    this.vb = this.corners[0].scale(0.5).add(this.corners[1].scale(0.5));
    break;

    case "1100":
    this.va = this.corners[0].scale(0.5).add(this.corners[3].scale(0.5));
    this.findBoundaryPoint(this.corners[0], this.corners[3], true);
    this.vb = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "1101":
    this.va = this.corners[1].scale(0.5).add(this.corners[2].scale(0.5));
    this.vb = this.corners[3].scale(0.5).add(this.corners[2].scale(0.5));
    break;

    case "1110":
    this.va = this.corners[0].scale(0.5).add(this.corners[3].scale(0.5));
    this.vb = this.corners[3].scale(0.5).add(this.corners[2].scale(0.5));
    break;
  }

  this.ends[0] = this.va;
  this.ends[1] = this.vb;
};

this.show_boundary = function() {
  stroke(0, 255, 0);
  strokeWeight(1);
  if (this.type !== "0000" && this.type !== "1111") {
    line(this.ends[0].x, this.ends[0].y, this.ends[1].x, this.ends[1].y);
  }
  fill(255);
};

this.show_fill = function() {
  noStroke();
  fill(this.c);
  switch(this.type) {
    case "0001":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[3].x, this.corners[3].y);
    endShape();
    break;

    case "0010":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[2].x, this.corners[2].y);
    endShape();
    break;

    case "0011":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[2].x, this.corners[2].y);
    vertex(this.corners[3].x, this.corners[3].y);
    endShape();
    break;

    case "0100":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[1].x, this.corners[1].y);
    endShape();
    break;

    case "0101":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[1].x, this.corners[1].y);
    vertex(this.corners[2].x, this.corners[2].y);
    vertex(this.corners[3].x, this.corners[3].y);
    endShape();
    break;

    case "0110":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[2].x, this.corners[2].y);
    vertex(this.corners[1].x, this.corners[1].y);
    endShape();
    break;

    case "0111":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[1].x, this.corners[1].y);
    vertex(this.corners[2].x, this.corners[2].y);
    vertex(this.corners[3].x, this.corners[3].y);
    endShape();
    break;

    case "1000":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[0].x, this.corners[0].y);
    endShape();
    break;

    case "1001":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[3].x, this.corners[3].y);
    vertex(this.corners[0].x, this.corners[0].y);
    endShape();
    break;

    case "1010":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[2].x, this.corners[2].y);
    vertex(this.corners[3].x, this.corners[3].y);
    vertex(this.corners[0].x, this.corners[0].y);
    endShape();
    break;

    case "1011":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[0].x, this.corners[0].y);
    vertex(this.corners[3].x, this.corners[3].y);
    vertex(this.corners[2].x, this.corners[2].y);
    endShape();
    break;

    case "1100":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[1].x, this.corners[1].y);
    vertex(this.corners[0].x, this.corners[0].y);
    endShape();
    break;

    case "1101":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[3].x, this.corners[3].y);
    vertex(this.corners[0].x, this.corners[0].y);
    vertex(this.corners[1].x, this.corners[1].y);
    endShape();
    break;

    case "1110":
    beginShape();
    vertex(this.va.x, this.va.y);
    vertex(this.vb.x, this.vb.y);
    vertex(this.corners[2].x, this.corners[2].y);
    vertex(this.corners[1].x, this.corners[1].y);
    vertex(this.corners[0].x, this.corners[0].y);
    endShape();
    break;

    case "1111":
    beginShape();
    vertex(this.corners[0].x, this.corners[0].y);
    vertex(this.corners[1].x, this.corners[1].y);
    vertex(this.corners[2].x, this.corners[2].y);
    vertex(this.corners[3].x, this.corners[3].y);
    endShape();
    break;
  }
};
}
