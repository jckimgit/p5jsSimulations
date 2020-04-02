class TreeSystem {
  constructor() {
    this.initPhysics();
  }

  initPhysics() {
    physics = new VerletPhysics2D();
    physics.setWorldBounds(new Rect(0, 0, width, height - 60));
    gravity = new GravityBehavior(new Vec2D(0, 0.015));
    // Create a root.
    // let nd = Node.root(new Vec2D(width/2, height - 13), initDate);
    // physics.addParticle(nd);
    // Create parameters for leaves.
    this.numLeafTypes = 5;
    this.leafTypes = [];
    this.a0 = new Vec2D(0, -40); // a0, b0, and c0 are common for all leaves. d0 is unique to each leaf. Needed for bezier shape.
    this.b0 = new Vec2D(-20, -20);
    this.c0 = new Vec2D(-30, 0);
    for (let i = 0; i < this.numLeafTypes; i++) {
      let d = new Vec2D((40 - 80.0 / (this.numLeafTypes - 1) * i), 100);
      this.leafTypes[i] = d;
    }
  }

  run() {
    this.grow_tree();
    if (falling) {
      this.scatter_leaves();
    }
    this.show_branches(); // To make leaves more visible, branches are drawn first.
    this.show_leaves();
    this.show_background();
  }

  grow_tree() {
      for (let nd of physics.particles) { // Two branch nodes are connected by a spring to form a branch
      if (nd.generation != -2) { //Branches
        if (frameCount < nd.endDate) { // The tree keeps growing before all branch nodes become inactive.
          nd.grow_branch();
          nd.separate_branches(); // Branch nodes do not bump into each other.
        } else if (frameCount == nd.endDate) { // When a branch stops growing, it creates child or peer branches.

          nd.create_branches();
        }
      }
    }

    for (let br of physics.springs) { // Leaves
      let nd = br.b;
      if (nd.generation >= lastGen - 2 && frameCount == nd.endDate) {
        br.create_leaves();
      }
    }
  }

  scatter_leaves() { // Most of dried leaves fall.
    for (let nd of physics.particles) {
      if (nd.generation == -2){
        if (frameCount > nd.startDate + 400) {
          nd.scatter_leaf();
        }
      }
    }
  }

  show_branches() {
    for (let br of physics.springs) {
      br.show();
    }
  }

  show_leaves() {
    for (let nd of physics.particles) {
      if (nd.generation == -2) {
        nd.show_leaf();
        if (nd.y >= height - 20) {
          nd.scaleVelocity(-0.25); // Fallen leaves bounce off on the ground.
        }
      }
    }
  }

  show_background() {
    for (let y = 0; y < height - 60; y++) {// Air
      let alpha = map(y, 0, height - 60, 100, 0);
      strokeWeight(1);
      stroke(0, alpha);
      line(0, y, width, y);
    }
    let alpha = 0;
    for (let y = height - 60; y < height; y++) {// Ground
      if (y > height - 60 && y < height - 50) {
        alpha = 255;
      } else {
        alpha = map(y, height - 50, height, 255, 50);
      }
      strokeWeight(1);
      stroke(150, 150, 120, alpha);
      line(0, y, width, y);
    }
  }

  // getSpring(p) {
  //   let s;
  //   for (let sp of physics.springs) {
  //     if (sp.b === p) {
  //       s = sp;
  //       break;
  //     }
  //   }
  //   return s;
  // }

  //VerletParticle2D getA(VerletParticle2D b_) {
  //  VerletParticle2D a0 = null;
  //  for (int i = 0; i < physics.springs.size(); i++) {
  //    VerletSpring2D sp = (VerletSpring2D) physics.springs.get(i);
  //    if ((VerletParticle2D) sp.b == b_) {
  //      a0 = (VerletParticle2D) sp.a;
  //      break;
  //    }
  //  }
  //  return a0;
  //}

  //VerletNode2D getB(VerletNode2D a_) {
  //  VerletNode2D b0 = null;
  //  for (int i = 0; i < physics.springs.size(); i++) {
  //    VerletSpring2D sp = (VerletSpring2D) physics.springs.get(i);
  //    if ((VerletNode2D) sp.b == a_) {
  //      b0 = (VerletNode2D) sp.b;
  //      break;
  //    }
  //  }
  //  return b0;
  //}
}
