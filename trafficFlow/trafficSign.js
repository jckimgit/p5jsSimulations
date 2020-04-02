class TrafficSign {
    constructor(loc, type, intersection) {
    this.loc = loc;
    this.type = type; // 0: two-way stop sign, 1: yield sign at a minor road,
    // 2: invisible yield sign at a major road, 3: invisible yield sign near two-way stop sign.
    this.intersection = intersection;
    this.waitingCars = [];
  }

  show() {
    push();
    translate(this.loc.x, this.loc.y);
    noStroke();
    if (this.type == 0) {
      fill(255, 0, 0);
    } else if (this.type == 1) {
      fill(255, 255, 0);
    } else if (this.type == 2 || this.type == 3) {
      fill(255, 0);
    }
    rectMode(CENTER);
    rect(0, 0, trafficSignSize, trafficSignSize);
    if (debug) {
      fill(255);
    //  textSize(12);
    //  text(String.valueOf(this.trafficSigns.indexOf(this)), -5, 25);
    }
    pop();
  }
}
