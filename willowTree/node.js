/* There are two types of nodes. (i) Branch nodes (child and peer) including a root node and
(ii) leaf nodes (falling and hanging).
*/

/* Attricutes.
generation: Hierarchy of branch nodes.
child: if true, a child node
numChildren: The number of child nodes (nodes of higher generation).
numPeers: The number of peer nodes (nodes of same generation).
startDate: Date at which a branch node starts moving (the correspoding branch starts growing).
activePeriods: Periods during which a branch node moves (the corresponding branch grows).
endDate: Date at which a branch node stops moving (the corresponding branch stops growing).
direction: Branch nodes move to the left (-1), to the right (1) or randomly (0).
target_: Branch nodes move toward random targets, which results in branch growing.
speed: The mving speed of a branch node, which determines the length of the corresponding branch.
force_: The length of branche may be limited. force is reserved by toxiclibs.
separation: Branch nodes avoid colliding while moving.
d0: Needed for drawing different shapes of leaves
*/

class Node extends VerletParticle2D {
  constructor(loc, startDate, direction) {
    super(loc);
    this.startDate = startDate;
    this.direction = direction;
  }

  // constructor overloading.
  static root(loc, startDate) {
    let nd = new Node(loc, startDate, undefined);
    nd.generation = 0;
    nd.numChildren = 2;
    nd.numPeers = 0;
    nd.endDate = nd.startDate + 1;
    this.weight = 1.2;
    return nd;
  }

  static branch(loc, startDate, direction) {
    let nd = new Node(loc, startDate, direction);
    nd.activePeriods = floor(random(-initDate - 9, -initDate + 11));
    nd.endDate = nd.startDate + nd.activePeriods;
    nd.numChildren = 0;
    nd.numPeers = 0;
    nd.maxSpeed = 1.2; // The maximum speed of branch node moving or branch growing.
    nd.force_  = 0.1;
    nd.separation = 20;
    return nd;
  }

  static leaf(loc, startDate) {
    let nd = new Node(loc, startDate, null);
    nd.generation = -2;
    nd.activePeriods = floor(random(300, 500));
    nd.endDate = nd.startDate + nd.activePeriods;
    let d = floor(random(0, ts.numLeafTypes));
    nd.d0 = ts.leafTypes[d];
    return nd;
  }

  create_branches() {
    let num = this.numChildren;
    if (this.generation == 0) {
      this.create_childBranches(this, num);
    }
    else if (this.generation == 1) {
      if (this.numPeers >= 3) {
        let r = random(1);
        if (r > 0.8 || this.numPeers >= 5) { // If r is high enough or gen. 1 nodes have moved at least five times.
          this.create_childBranches(this, num);
        } else {
          this.create_peerBranches(this);
        }
      } else { // Gen. 1 nodes create peer nodes at least three times.
        this.create_peerBranches(this);
      }
    } else if (this.generation == 2 || this.generation == 3) {
      let r = random(1);
      if (r > 0.8 || this.numPeers >= 3) {
        this.create_childBranches(this, num);
      } else {
        this.create_peerBranches(this);
      }
    } else if (this.generation <= lastGen - 1) {
      let r = random(1);
      if (r > 0.8 || this.numPeers >= 3) {
        this.create_childBranches(this, num);
      } else {
        this.create_peerBranches(this);
      }
    }
    this.lock(); // The branch node becomes inactive and the corresponding branch stops growing.
  }

  create_childBranches(nd, num) {
    for (let i = 0; i < num; i++) {
      let childNd = this.make_branchNode(nd, true);
      let br = new Branch(nd, childNd, 0, 0); // Spring strength is set to zero so that branches to grow.
      physics.addSpring(br);
    }
  }

  create_peerBranches(nd) {
    nd.numPeers++;
    let peerNd = this.make_branchNode(nd, false);
    let br = new Branch(nd, peerNd, 0, 0);   physics.addSpring(br);
  }

  make_branchNode(nd, isChildNode) {
    let derivative; // Either child or peer nodes.
    let loc_ = new Vec2D(nd.x, nd.y);
    if (nd.generation < 2) { // Child nodes of gen. 0, 1 or 2, that is, gen. 1, 2 or 3, move to the left or to the right randomly.
      derivative = Node.branch(loc_, nd.endDate, 0);
    } else {
      let r = random(1);
      if (r < 0.5) {
        derivative = Node.branch(loc_, nd.endDate, -1);
      } else {
        derivative = Node.branch(loc_, nd.endDate, 1);
      }
    }

    //Nodes inherit attributes of the parent nodes.
    if (isChildNode) { // Child nodes.
      derivative.generation = nd.generation + 1;
    } else { // Peer nodes.
      derivative.generation = nd.generation;
      derivative.numPeers = nd.numPeers;
      derivative.direction = nd.direction;
    }

    if (derivative.generation == 1 || derivative.generation == 2) {
      derivative.numChildren = floor(random(1, 4));
    } else if (derivative.generation <= lastGen - 2) {
      derivative.numChildren = floor(random(5, 9));
    } else if (derivative.generation == lastGen - 1) {
      derivative.numChildren = floor(random(4, 7));
    }

    derivative.speed = derivative.maxSpeed; // High speed means long branch.
    if (nd.generation == 0) {
      derivative.speed = derivative.maxSpeed * 6;
    } else if (nd.generation >= lastGen - 2) {
      derivative.speed = derivative.maxSpeed / 2; // For short twigs.
    }
    physics.addParticle(derivative);
    return derivative;

  }

  grow_branch() {
    let r, dx, dy;
    if (this.direction == 0) {
      r = random(1);
      if (r > 0.5) {// Rightward growth.
        dx = random(this.x, width) - this.x;
      } else { // Leftward.
        dx = random(0, this.x) - this.x;
      }
    } else if (this.direction == 1) {
      dx = random(this.x, width) - this.x;
    } else {
      dx = random(0, this.x) - this.x;
    }
    dx *= pow(this.generation, 1);
    // Branches of higher gen. are flatter.
    if (this.generation == 1 ) {
      dy = tan(random(0.3 * PI, 0.5 * PI)) * dx;
    } else if (this.generation == 2) {
      dy = tan(random(0.25 * PI, 0.4 * PI)) * dx;
    } else if (this.generation == 3) {
      dy = tan(random(0.25 * PI, 0.5 * PI)) * dx;
    } else {
      dy = tan(random(0.2 * PI, 0.4 * PI)) * dx;
    }
    // Set nodes' (random) targets.
    if (dx > 0) {
      this.target_ = new Vec2D(this.x + dx, this.y - dy); // Rightward, upward.
    } else {
      this.target_ = new Vec2D(this.x + dx, this.y + dy); // Leftward, upward.
    }

    let steer = this.seek();
    this.addForce(steer); // New locations of nodes are updated automatically by toxiclibs
    if (this.generation >= lastGen - 2) { // Branche nodes of generations equal to or higher than 4 grow downward.
      this.addBehavior(gravity);
    }
  }

  seek() {
    let desired = this.target_.sub(new Vec2D(this.x, this.y));
    desired.normalizeTo(this.speed);
    let steer = desired.sub(this.getVelocity());
    if (this.generation > 1) {
      steer.limit(this.force_); // Make sure that trunks (from the root to generation 1 branch nodes) grow long
    }
    return steer;
  }

  separate_branches() { // Nodes do not to bump into each other. Adapted from the flocking example by D. Shiffman.
    let steer = new Vec2D(0, 0);
    let sum = new Vec2D(0, 0);
    let count = 0;
    for (let nd of physics.particles) {
      let d = this.distanceTo(nd);
      if ((d > 0) && (d < this.separation)) {
        let vel = this.sub(nd);
        vel.normalize();
        vel.scaleSelf(1 / d);
        sum.addSelf(vel);
        count++;
      }
    }
    if (count > 0) {
      sum.scale(1.0 / count);
      sum.normalize();
      sum.scaleSelf(this.speed);
      steer = sum.sub(this.getVelocity());
      steer.limit(this.force_);
    }
    this.addForce(steer);
  }

  scatter_leaf() {
    this.addBehavior(gravity);
    let v = new Vec2D(random(-1, 1), random(0, -0.02)); // For drifting leaves.
    this.addForce(v);
  }

  show_leaf() {
    noStroke();
    let gr = color(0, 255, 0);
    let br = color(130, 90, 30);
    let col = lerpColor(gr, br, (frameCount - this.startDate) / 300.0);
    fill(col);
    push();
    translate(this.x, this.y);
    //ellipse(0, 0, 3, 5);
    this.bezierLeaf();
    pop();

  }

  bezierLeaf() {
    let time = frameCount - this.startDate;
    if (time > 800) {
      time = 800;
    }
    let leafSize = map(time, 0, 800, 0.03, 0.08);
    let a1 = ts.a0.scale(leafSize);
    let b1 = ts.b0.scale(leafSize);
    let c1 = ts.c0.scale(leafSize);
    let d1 = this.d0.scale(leafSize);
    beginShape();
    vertex(a1.x, a1.y);
    bezierVertex(b1.x, b1.y, c1.x, c1.y, d1.x, d1.y);
    bezierVertex(-c1.x, c1.y, -b1.x, b1.y, a1.x, a1.y);
    endShape();
  }
}
