class AStarSearch { // A* search. Adapted from the A* pathfinding by D. Shiffman.

  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.openSet = [this.start];
    this.closedSet = [];
  }

  calcPath() {
    this.search();
    let path = [];
    let temp = this.end;
    path.push(temp);
    while (temp.prev !== null) {
      path.push(temp.prev);
      temp = temp.prev;
    }
    return path;
  }

  search() {
    if (this.openSet.length > 0) {
      let winner = 0;
      for (let i = 1; i < this.openSet.length; i++) {
        let nd = this.openSet[i];
        if (nd.f < this.openSet[winner].f) {
          winner = i;
        }
        if (nd.f == this.openSet[winner].f) {
          if (nd.g > this.openSet[winner].g) {
            winner = i;
          }
        }
      }
      let curr = this.openSet[winner];
      if (curr == this.end) { // End serching.
        return;
      }
      this.removeFrom(this.openSet, curr);
      this.closedSet.push(curr);
      let currNeighbors = curr.neighbors;
      for (let i = 0; i < currNeighbors.length; i++) {
        let neighbor = currNeighbors[i];
        if (!this.closedSet.includes(neighbor)) {
          let tempG = curr.g + distance;
          if (this.openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
            }
          } else {
            neighbor.g = tempG;
            this.openSet.push(neighbor);
          }
          neighbor.h = this.heuristic(neighbor, this.end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.prev = curr;
        }
      }
      this.search();
    }
  }

  removeFrom(arr, node) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let nd = arr[i];
      if (nd === node) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  heuristic(a, b) {
    let d = a.loc.distanceTo(b.loc); // The Euclidean distance appears to work better than the Manhattan distance.
    return d;
  }
}
