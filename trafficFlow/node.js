class Node {
  constructor(loc, generation, num) {
    this.loc = loc;
    this.num = num;
    this.generation = generation;
    this.neighbors = []; // Collection of neighbors needed for building roads and A* searching.
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.prev = null;
    this.waitingCars = [];
    this.noWaitingCars = [];
    nodes.push(this);
  }

  createNeighbors () {
    let nd = null;
    let numNeighbors = floor(random(1, 5)); // The number of neighbors.
    let combi = new Combination(4, numNeighbors);
    let directions = combi.getCombination();
    for (let dir of directions) {
      let loc = null;
      if (dir == 0) {
        loc = new Vec2D(this.loc.x + distance, this.loc.y); // East.
      } else if (dir == 1) {
        loc = new Vec2D(this.loc.x - distance, this.loc.y); // West.
      } else if (dir == 2) {
        loc = new Vec2D(this.loc.x, this.loc.y - distance); // North.
      } else if (dir == 3) {
        loc = new Vec2D(this.loc.x, this.loc.y + distance); // South.
      }
      if (this.boundary(loc)) {
        nd = this.checkNodeAt(loc);
        if (nd == null) { // Create a new neighbor if no node exists.
          let gen = -1;
          if (this.generation == numGenerations - 1) {
            gen = numGenerations;
          } else if (this.generation < numGenerations - 1) { // Make a new node.
            gen = this.generation + 1;
            currNum++;
            nd = new Node(loc, gen, currNum);

            if (!this.neighbors.includes(nd)) {
              this.neighbors.push(nd); // Make each other a neighbor.
            }
            if (!nd.neighbors.includes(this)) {
              nd.neighbors.push(this);
            }
            if (nd.generation < numGenerations - 1) {
              nd.createNeighbors();
            }
          }
        }
      }
    }
  }

  boundary(l) {
    let within = true;
    if (l.x < 10 || l.x > width - 10 || l.y < 10 || l.y > height - 10) {
      within = false;
    }
    return within;
  }

  checkNodeAt(loc) {
    let node = null;
    for (let nd of nodes) {
      if (nd.loc.sub(loc).magnitude() < 1) {
        node = nd;
        break;
      }
    }
    return node;
  }

  show() {
    push();
    translate(this.loc.x, this.loc.y);
    fill(255);
    strokeWeight(0.5);
  //  text(this.num, 10, - 10);
    stroke(50);
    strokeWeight(6);
    point(0, 0);
    pop();
  }
}
