class Branch extends VerletSpring2D {
  constructor (a, b, len, str) {
    super(a, b, len, str);
    let nd = this.b;

    if (nd.generation == lastGen - 2) {
      this.numLeaves = floor(random(3, 5));
    } else if (nd.generation == lastGen - 1) {
      this.numLeaves = floor(random(4, 7));
    } else if (nd.generation == lastGen) {
      this.numLeaves = floor(random(3, 5));
    }
    this.leafLocs = [];
    for (let i = 0; i < ts.numLeafTypes; i++) {
      this.leafLocs[i] = random(1);
    }
  }

  create_leaves() {
    for (let i = 0; i < this.leafLocs.length; i++) {
      let x_ = lerp(this.a.x, this.b.x, this.leafLocs[i]);
      let y_ = lerp(this.a.y, this.b.y, this.leafLocs[i]);
      x_ += random(-2, 2);
      y_ += random(-2, 2);
      let nd = Node.leaf(new Vec2D(x_, y_), this.a.startDate);
      nd.setWeight(0.5);
      let r = random(1);
      if (r < 0.05) {
        nd.lock();
      }
      physics.particles.push(nd);
    }
  }

  show() {
    let nda = this.a;
    let ndb = this.b;
    let scale_ = ndb.generation;
    strokeWeight(25 / (pow(scale_, 1.5) + 1)); // The higher generation node, the thinner branch.
    stroke(70);
    line(nda.x, nda.y, ndb.x, ndb.y);
  }
}
