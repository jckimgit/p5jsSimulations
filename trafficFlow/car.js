class Car {
  constructor(maxSpeed, maxForce) {
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;

    this.loc;
    this.vel = new Vec2D();
    this.acc = new Vec2D();
    this.size = 3;
    this.speed = this.maxSpeed;

    this.startNode = this.getRandomNode();
    let temp = this.getEndNode();
    while (temp === this.startNode) {
      temp = this.getEndNode();
    }
    this.endNode = temp;
    this.targetNode = this.startNode;
    this.prevTargetNode  = this.startNode;
    this.nextTargetNode = null;

    this.target = null;
    this.search = new AStarSearch(this.startNode, this.endNode);
    this.path = []; // An itinerary of the car from start to end.
    this.pathFound = false;
    this.turnType = 0; // There are 12 types of cars moving: four types of right turns, four types of left turns, and four types of moving straight.
    this.direction = 0; // Direction of the car toward target: northbound: 0, southbound: 1, eastbound: 2, westbound: 3.
    this.turnAround = 0; // The car turns around an end node.

    this.trafficSignFound = null;
    this.prevTrafficSignFound = null; // A stop sign from which the car has just left.
    this.arrivalTime = 0;
    this.firstTime = false;

    this.go = true;
    this.nearCollision = null;

    this.searchPath();
    this.initTarget();
  }

  getRandomNode() {
    let e = floor(random(nodes.length));
    return nodes[e];
  }

  getEndNode() {
    let e = floor(random(endNodes.length));
    return endNodes[e];
  }

  // This method initializes the location and target of the car after it finds the initial path.
  initTarget() {
    let nextNode = this.path[1];
    if (abs(this.startNode.loc.x - nextNode.loc.x) < 5 && this.startNode.loc.y > nextNode.loc.y) { // Northbound.
      this.loc = new Vec2D(this.startNode.loc.x + roadWidth / 4, this.startNode.loc.y);
    } else if (abs(this.startNode.loc.x - nextNode.loc.x) < 5 && this.startNode.loc.y < nextNode.loc.y) { // Sothbound.
      this.loc = new Vec2D(this.startNode.loc.x - roadWidth / 4, this.startNode.loc.y);
    } else if (this.startNode.loc.x < nextNode.loc.x && abs(this.startNode.loc.y - nextNode.loc.y) < 5) { // Eastbound.
      this.loc = new Vec2D(this.startNode.loc.x, this.startNode.loc.y + roadWidth / 4);
    } else if (this.startNode.loc.x > nextNode.loc.x && abs(this.startNode.loc.y - nextNode.loc.y) < 5) { // Westbound.
      this.loc = new Vec2D(this.startNode.loc.x, this.startNode.loc.y - roadWidth / 4);
    }
    this.target = this.loc.copy();
  }

  run() {
    this.searchPath();
    this.go_Stop();
    this.show();
  }

  searchPath() {
    if (!this.pathFound) {
      for (let nd of nodes) { // Before finding a path, delete prev nodes of all nodes, if any, created for a previous A* this.search.
        nd.prev = null;
      }
      this.path = this.search.calcPath();
      this.path.reverse();
      this.pathFound = true;
    } else {
      if (cars.indexOf(this) == 0) {
        this.drawPath();
      }
    }
  }

  // When the car arrives at its destination, it sets a new destination, starting from the old destination.
  // This method makes it possible for the car to make a new A* this.search.
  resetSearch() {
    this.startNode = this.endNode;
    let temp = this.getEndNode();
    while (temp === this.startNode) {
      temp = this.getEndNode();
    }
    this.endNode = temp;
    // Reset the A* instance.
    this.search.start = this.startNode;
    this.search.end = this.endNode;
    this.search.openSet = [];
    this.search.closedSet = [];
    this.search.openSet.push(this.search.start);
    this.targetNode = this.startNode;
    this.pathFound = false;
  }

  setTargetNode() { // Before setting a target, set the target node first.
    if (this.path.indexOf(this.targetNode) < this.path.length - 1) {
      if (this.loc.distanceTo(this.target) < 5) {
        this.prevTargetNode = this.targetNode;
        this.targetNode = this.path[this.path.indexOf(this.targetNode) + 1];
        if (this.path.indexOf(this.targetNode) < this.path.length - 1) {
          this.nextTargetNode = this.path[this.path.indexOf(this.targetNode) + 1];
        }
        this.setTurnType(); // Depending on turn types, set target differently for the same target node.
      }
    }
  }

  /* On a square, choose three connected points clockwise, which are right turnArounds. There are four patterns.
  When moving from the firstTime point to the second, if x-value does not chage, assign 0, if it increases (dcreases), assign 1 (-1).
  Do the same for moving from  the second point to the third. The result is (0, -1, 1, 0), (1, 0, 0, 1), (0, 1, -1, 0) and (-1, 0, 0, -1).
  Repeat by choosing three points counterclockwise, which represents left turnArounds.
  The result is (1, 0, 0, -1), (0, -1, -1, 0), (-1, 0, 0, 1) and (0, 1, 1, 0).
  The car can head toward north, (0, -1, 0, -1), south (0, 1, 0, 1), east (1, 0, 1, 0), or west (-1, 0, -1, 0).
  Collecting the results, we have 11 turn types as follows:
  Type  Pattern          Turn
  0     (0, -1, 1, 0)    right
  1     (1, 0, 0, 1)     right
  2     (0, 1, -1, 0)    right
  3     (-1, 0, 0, -1)   right
  4     (1, 0, 0, -1)    left
  5     (0, -1, -1, 0)   left
  6     (-1, 0, 0, 1)    left
  7     (0, 1, 1, 0)     left
  8     (0, -1, 0, -1)   straight to the north
  9     (0, 1, 0, 1)     straight to the south
  10    (1, 0, 1, 0)     straight to the east
  11    (-1, 0, -1, 0)   straight to the west.
  */
  setTurnType() {
    let d = [];
    if (abs(this.targetNode.loc.x - this.prevTargetNode.loc.x) < 5) {
      d[0] = 0;
    } else if (this.targetNode.loc.x > this.prevTargetNode.loc.x) {
      d[0] = 1;
    } else if (this.targetNode.loc.x < this.prevTargetNode.loc.x) {
      d[0] = -1;
    }
    if (abs(this.targetNode.loc.y - this.prevTargetNode.loc.y) < 5) {
      d[1] = 0;
    } else if (this.targetNode.loc.y > this.prevTargetNode.loc.y) {
      d[1] = 1;
    } else if (this.targetNode.loc.y < this.prevTargetNode.loc.y) {
      d[1] = -1;
    }
    if (this.nextTargetNode != null) {
      if (abs(this.nextTargetNode.loc.x - this.targetNode.loc.x) < 5) {
        d[2] = 0;
      } else if (this.nextTargetNode.loc.x > this.targetNode.loc.x) {
        d[2] = 1;
      } else if (this.nextTargetNode.loc.x < this.targetNode.loc.x) {
        d[2] = -1;
      }
      if (abs(this.nextTargetNode.loc.y - this.targetNode.loc.y) < 5) {
        d[3] = 0;
      } else if (this.nextTargetNode.loc.y > this.targetNode.loc.y) {
        d[3] = 1;
      } else if (this.nextTargetNode.loc.y < this.targetNode.loc.y) {
        d[3] = -1;
      }
      if (d[0] == 0 && d[1] == -1 && d[2] == 1 && d[3] == 0) {
        this.turnType = 0;
      } else if (d[0] == 1 && d[1] == 0 && d[2] == 0 && d[3] == 1) {
        this.turnType = 1;
      } else if (d[0] == 0 && d[1] == 1 && d[2] == -1 && d[3] == 0) {
        this.turnType = 2;
      } else if (d[0] == -1 && d[1] == 0 && d[2] == 0 && d[3] == -1) {
        this.turnType = 3;
      } else if (d[0] == 1 && d[1] == 0 && d[2] == 0 && d[3] == -1) {
        this.turnType = 4;
      } else if (d[0] == 0 && d[1] == -1 && d[2] == -1 && d[3] == 0) {
        this.turnType = 5;
      } else if (d[0] == -1 && d[1] == 0 && d[2] == 0 && d[3] == 1) {
        this.turnType = 6;
      } else if (d[0] == 0 && d[1] == 1 && d[2] == 1 && d[3] == 0) {
        this.turnType = 7;
      } else if (d[0] == 0 && d[1] == -1 && d[2] == 0 && d[3] == -1) {
        this.turnType = 8;
      } else if (d[0] == 0 && d[1] == 1 && d[2] == 0 && d[3] == 1) {
        this.turnType = 9;
      } else if (d[0] == 1 && d[1] == 0 && d[2] == 1 && d[3] == 0) {
        this.turnType = 10;
      } else if (d[0] == -1 && d[1] == 0 && d[2] == -1 && d[3] == 0) {
        this.turnType = 11;
      }
    }
  }

  // A target is set differently depending on whether the car is far from or near the destination.
  setTarget() {
    if (this.targetNode != this.path[this.path.length - 1]) {
      this.setTarget_Far();
    } else {
      this.setTarget_Near();
    }
  }

  // When the car is far from the destination, a target lies to the right of the corresponding target node
  // becuase cars always stay on the right side of the road.
  setTarget_Far() {
    let dx = -1;
    let dy = -1;
    if (this.turnType == 0 || this.turnType == 4) {
      dx = roadWidth / 4;
      dy = roadWidth / 4;
    } else if (this.turnType == 1 || this.turnType == 7) {
      dx = - roadWidth / 4;
      dy =  roadWidth / 4;
    } else if (this.turnType == 2 || this.turnType == 6) {
      dx = -roadWidth / 4;
      dy =  -roadWidth / 4;
    } else if (this.turnType == 3 || this.turnType == 5) {
      dx =  roadWidth / 4;
      dy =  -roadWidth / 4;
    } else if (this.turnType == 8) {
      dx =  roadWidth / 4;
      dy = 0;
    } else if (this.turnType == 9) {
      dx =  -roadWidth / 4;
      dy =  0;
    } else if (this.turnType == 10) {
      dx =  0;
      dy =  roadWidth / 4;
    } else if (this.turnType == 11) {
      dx =  0;
      dy =  -roadWidth / 4;
    }
    this.target = new Vec2D(this.targetNode.loc.x + dx, this.targetNode.loc.y + dy);
  }

  // When the car approaches the destination, it turns around the end node. There are three targets around the end node.
  setTarget_Near() {
    let dxy = 3 * roadWidth / 10;
    if (this.loc.distanceTo(this.target) < 5) {
      if (this.getDirection() == 0) {
        if (this.turnAround == 0) {
          this.target = new Vec2D(this.targetNode.loc.x + dxy, this.targetNode.loc.y);
        } else if (this.turnAround == 1) {
          this.target = new Vec2D(this.targetNode.loc.x, this.targetNode.loc.y - dxy);
        } else if (this.turnAround == 2) {
          this.target = new Vec2D(this.targetNode.loc.x - dxy, this.targetNode.loc.y);
        }
      } else if (this.getDirection() == 1) {
        if (this.turnAround == 0) {
          this.target = new Vec2D(this.targetNode.loc.x - dxy, this.targetNode.loc.y);
        } else if (this.turnAround == 1) {
          this.target = new Vec2D(this.targetNode.loc.x, this.targetNode.loc.y + dxy);
        } else if (this.turnAround == 2) {
          this.target = new Vec2D(this.targetNode.loc.x + dxy, this.targetNode.loc.y);
        }
      } else if (this.getDirection() == 2) {
        if (this.turnAround == 0) {
          this.target = new Vec2D(this.targetNode.loc.x, this.targetNode.loc.y + dxy);
        } else if (this.turnAround == 1) {
          this.target = new Vec2D(this.targetNode.loc.x + dxy, this.targetNode.loc.y);
        } else if (this.turnAround == 2) {
          this.target = new Vec2D(this.targetNode.loc.x, this.targetNode.loc.y - dxy);
        }
      } else if (this.getDirection() == 3) {
        if (this.turnAround == 0) {
          this.target = new Vec2D(this.targetNode.loc.x, this.targetNode.loc.y - dxy);
        } else if (this.turnAround == 1) {
          this.target = new Vec2D(this.targetNode.loc.x - dxy, this.targetNode.loc.y);
        } else if (this.turnAround == 2) {
          this.target = new Vec2D(this.targetNode.loc.x, this.targetNode.loc.y + dxy);
        }
      }
      if (this.turnAround == 3) { // When arriving at the destination, set a new destination and make a new A* this.search for it.
        this.resetSearch();
        this.turnAround = -1;
      }
      this.turnAround++;
    }
  }

  go_Stop() {
    if (this.go) {
      this.go_main();
      this.go_sub();
      this.update();
    } else {
      this.stop_at();
    }
  }

  go_main() {
    this.setTargetNode();
    this.setTarget();
    this.drive();
  }

  // While the car is moving, it attempts to find a traffic sign, watches out for other cars nearby to avoid collision,
  // and checks if there is another car moving ahead within a short distance. If there is one, it starts slowing down to keep distance.
  go_sub() {
    this.nearCollision = null;
    if (this.trafficSignFound == null) {
      this.findTrafficSign();
    }
    if (this.trafficSignFound != null && this.trafficSignFound !== this.prevTrafficSignFound) { // The car ignores a traffic sign, which it has just passed.
      if (this.arriveAtTrafficSign()) {
        this.go = false;
        if (this.trafficSignFound.type == 0) { // Arriving at a four-way intersection, check all cars waiting at stop signs.
          this.trafficSignFound.intersection.waitingCars.push(this);
        } else if (this.trafficSignFound.type == 1 || this.trafficSignFound.type == 2  || this.trafficSignFound.type == 3) {
          this.trafficSignFound.waitingCars.push(this);
        }
      }
    }

    this.watchOut();

    if (this.nearCollision !== null) {
      this.speed = 0.05 * this.maxSpeed; // Slow to near stop to avoid collision.
    } else {
      this.speed = this.maxSpeed;
    }

    let c = this.lookAhead();
    if (c !== null) {
      let d = this.loc.distanceTo(c.loc);
      this.slowDown(d);
    }
  }

  stop_at() {
    this.nearCollision = null;
    if (this.trafficSignFound.type === 0) { // Stop signs, two-way or four-way.
      let wc = this.trafficSignFound.intersection.waitingCars;
      if (wc[0] === this) { // Move to the foremost position at a two- or four-way stop sign.
        if (!this.firstTime) {
          this.firstTime = true;
          this.arrivalTime = frameCount;
        } else { // Wait for a while at the stop sign before leaving.
          if (frameCount > this.arrivalTime + 30 && !this.lookForCars(this.trafficSignFound, 0)) {
            this.go = true;
            this.firstTime = false;
            let idx = wc[this];
            wc.splice(idx, 1); // Leave the stop sign.
            this.prevTrafficSignFound = this.trafficSignFound;
            this.trafficSignFound = null;
          }
        }
      }
    } else { // Yield sign, visible or invisible.
      if (this.trafficSignFound.waitingCars[0] === this) { // Move to the foremost position at a yield sign.
        if ((this.trafficSignFound.type == 1 && !this.lookForCars(this.trafficSignFound, 1))
        || (this.trafficSignFound.type == 2 && !this.lookForCars(this.trafficSignFound, 2))
        || (this.trafficSignFound.type == 3 && !this.lookForCars(this.trafficSignFound, 3))) {
          this.go = true;
          let idx = this.trafficSignFound.waitingCars[this];
          this.trafficSignFound.waitingCars.splice(this, 1);
          this.prevTrafficSignFound = this.trafficSignFound;
          this.trafficSignFound = null;
        }
      }
    }
  }

  findTrafficSign() {
    for (let ts of trafficSigns) {
      if (this.loc.distanceTo(ts.loc) < 100) {
        if (this.getDirection() == 0) {
          if (ts.loc.x > ts.intersection.loc.x  && ts.loc.y > ts.intersection.loc.y && this.loc.y > ts.loc.y && this.loc.y > ts.loc.y + 10 ) { // The car is northbound and looks for a traffic sign located southeast of the corresponding intersection
            // because it approaches the sign from the south. The car must also be south of the traffic sign.
            this.trafficSignFound = ts;
            break;
          }
        } else if (this.getDirection() == 1) {
          if (ts.loc.x < ts.intersection.loc.x  && ts.loc.y < ts.intersection.loc.y && this.loc.y < ts.loc.y && this.loc.y + 10 < ts.loc.y) {
            this.trafficSignFound = ts;
            break;
          }
        } else if (this.getDirection() == 2) {
          if (ts.loc.x < ts.intersection.loc.x  && ts.loc.y > ts.intersection.loc.y && this.loc.x < ts.loc.x && this.loc.x  + 10 < ts.loc.x) {
            this.trafficSignFound = ts;
            break;
          }
        } else if (this.getDirection() == 3) {
          if (ts.loc.x > ts.intersection.loc.x  && ts.loc.y < ts.intersection.loc.y && this.loc.x > ts.loc.x && this.loc.x > ts.loc.x + 10) {
            this.trafficSignFound = ts;
            break;
          }
        }
      }
    }
  }

  // The car arrives at a traffic sign only if (i) the angle between the car's moving direction
  // and the direction from its location to the traffic sign's location is at least 90 degrees;
  // and (ii) it is close to the traffic sign.
  arriveAtTrafficSign() {
    let arr = false;
    if (this.vel.angleBetween(this.trafficSignFound.loc.sub(this.loc), true) >= PI / 2 && this.loc.distanceTo(this.trafficSignFound.loc) < 20) {
      arr = true;
    }
    return arr;
  }

  lookForCars(ts, type) {
    let running = false;
    let xy = [];
    let x = ts.intersection.loc.x;
    let y = ts.intersection.loc.y;
    if (this.type == 0 || this.type == 3) { // At the four-way intersection.
      xy[0] = x - 0.9 * roadWidth / 2;
      xy[1] = x + 0.9 * roadWidth / 2;
      xy[2] = y - 0.9 * roadWidth / 2;
      xy[3] = y + 0.9 * roadWidth / 2;
    } else if (this.type == 1) { // From a minor road to a major road. 6 * roadWidth / 5 is used  // for incorporating defensive driving.
      if (this.turnType == 0) {
        xy[0] = x - 6 * roadWidth / 5;
        xy[1] = x + 6 * roadWidth / 5;
        xy[2] = y;
        xy[3] = y + roadWidth / 2;
      } else if (this.turnType == 1) {
        xy[0] = x  - roadWidth / 2;
        xy[1] = x;
        xy[2] = y - 6 * roadWidth / 5;
        xy[3] = y + 6 * roadWidth / 5;
      } else if (this.turnType == 2) {
        xy[0] = x - 6 * roadWidth / 5;
        xy[1] = x + 6 * roadWidth / 5;
        xy[2] = y - roadWidth /2;
        xy[3] = y;
      } else if (this.turnType == 3) {
        xy[0] = x;
        xy[1] = x + roadWidth /2;
        xy[2] = y - 6 * roadWidth / 5;
        xy[3] = y + 6 * roadWidth / 5;
      } else if (this.turnType == 4) {
        xy[0] = x - roadWidth / 2;
        xy[1] = x + roadWidth / 2;
        xy[2] = y;
        xy[3] = y + 6 * roadWidth / 5;
      } else if (this.turnType == 5) {
        xy[0] = x;
        xy[1] = x + 6 * roadWidth / 5;
        xy[2] = y - roadWidth / 2;
        xy[3] = y + roadWidth / 2;
      } else if (this.turnType == 6) {
        xy[0] = x - roadWidth / 2;
        xy[1] = x + roadWidth / 2;
        xy[2] = y - 6 * roadWidth / 5;
        xy[3] = y;
      } else if (this.turnType == 7) {
        xy[0] = x - 6 * roadWidth / 5;
        xy[1] = x;
        xy[2] = y - roadWidth / 2;
        xy[3] = y + roadWidth / 2;
      }
    } else if (type == 2) { // For a left turn from a major road to a minor road.
      if (this.turnType == 4) {
        xy[0] = x - roadWidth / 6;
        xy[1] = x + 1.8 * 6 * roadWidth / 5;
        xy[2] = y - roadWidth / 2;
        xy[3] = y;
      } else if (this.turnType == 5) {
        xy[0] = x - roadWidth / 2;
        xy[1] = x;
        xy[2] = y - 1.8 * 6 * roadWidth / 5;
        xy[3] = y + roadWidth / 6;
      } else if (this.turnType == 6) {
        xy[0] = x - 1.8 * 6 * roadWidth / 5;
        xy[1] = x + roadWidth / 6;
        xy[2] = y;
        xy[3] = y + roadWidth / 2;
      } else if (this.turnType == 7) {
        xy[0] = x;
        xy[1] = x + roadWidth / 2;
        xy[2] = y - roadWidth / 6;
        xy[3] = y + 1.8 * 6 * roadWidth / 5;
      }
    }
    for (let c of cars) {
      if (c != this) {
        if (c.loc.x > xy[0] && c.loc.x < xy[1] && c.loc.y > xy[2] && c.loc.y < xy[3]) {
          running = true;
        }
      }
    }
    return running;
  }

  lookAhead() {
    let c = null;
    let min = 10000;
    for (let c0 of cars) {
      if (c0 != this  && this.carAhead(c0)) {
        let d = this.loc.distanceTo(c0.loc);
        if (d < min) {
          min = d;
          c = c0;
        }
      }
    }
    return c;
  }

  // This method checks if c is ahead.
  carAhead(c) {
    let ahead = false;
    if (this.getDirection() == 0 && c.getDirection() == 0 && abs(this.loc.x - c.loc.x) < 5 && c.loc.y < this.loc.y) { // Both cars are northbound.
      // A car ahead has the same x-value as and the lower y-value than that of the car.
      ahead = true;
    } else if (this.getDirection() == 1 && c.getDirection() == 1 && abs(this.loc.x - c.loc.x) < 5 && c.loc.y > this.loc.y) {
      ahead = true;
    } else if (this.getDirection() == 2 && c.getDirection() == 2 && c.loc.x > this.loc.x && abs(this.loc.y - c.loc.y) < 5) {
      ahead = true;
    } else if (this.getDirection() == 3 && c.getDirection() == 3 && c.loc.x < this.loc.x && abs(this.loc.y - c.loc.y) < 5) {
      ahead = true;
    }
    return ahead;
  }

  getDirection() {
    let dir = -1;
    if (abs(this.targetNode.loc.x - this.prevTargetNode.loc.x) < 5 && this.targetNode.loc.y < this.prevTargetNode.loc.y) { // Northbound.
      dir = 0;
    } else if (abs(this.targetNode.loc.x - this.prevTargetNode.loc.x) < 5 && this.targetNode.loc.y > this.prevTargetNode.loc.y) { // Southbound.
      dir = 1;
    } else if (this.targetNode.loc.x > this.prevTargetNode.loc.x && abs(this.targetNode.loc.y - this.prevTargetNode.loc.y) < 5) { // Eastbound.
      dir = 2;
    } else if (this.targetNode.loc.x < this.prevTargetNode.loc.x && abs(this.targetNode.loc.y - this.prevTargetNode.loc.y) < 5) {// Westbound.
      dir = 3;
    }
    return dir;
  }

  // When the car gets near a car ahead, it starts slowing down.
  slowDown(d) {
    let w = 1;
    let a = 4 * this.size;
    let b = 8 * this.size;
    let c = 12 * this.size;
    if (d > b && d < c) {
      w = map(d, c, b, 1, 0.5);
    } else if (d <= b && d > a) {
      w = 0.5;
    } else if (d <= a) {
      w = 0.001;
    }
    this.speed = this.maxSpeed * w;
  }

  watchOut() {
    let a = 6 * this.size;
    let b = -1 * this.size;
    let c = 9 * this.size;
    let min = 10000;
    for (let c0 of cars) {
      if (c0 != this) {
        if (this.getDirection() == 0) { // Northbound.
          if (c0.loc.x < this.loc.x + a && c0.loc.x > this.loc.x - a && c0.loc.y < this.loc.y - b && c0.loc.y > this.loc.y - c) {
            let d = this.loc.distanceTo(c0.loc);
            if (d < min) {
              min = d;
              this.nearCollision = c0;
            }
          }
        } else if (this.getDirection() == 1) {
          if (c0.loc.x < this.loc.x + a && c0.loc.x > this.loc.x - a && c0.loc.y > this.loc.y + b && c0.loc.y < this.loc.y + c) {
            let d = this.loc.distanceTo(c0.loc);
            if (d < min) {
              min = d;
              this.nearCollision = c0;
            }
          }
        } else if (this.getDirection() == 2) {
          if (c0.loc.x < this.loc.x + c && c0.loc.x > this.loc.x + b && c0.loc.y < this.loc.y + a && c0.loc.y > this.loc.y - a) {
            let d = this.loc.distanceTo(c0.loc);
            if (d < min) {
              min = d;
              this.nearCollision = c0;
            }
          }
        } else if (this.getDirection() == 3) {
          if (c0.loc.x < this.loc.x - b && c0.loc.x > this.loc.x - c && c0.loc.y < this.loc.y + a && c0.loc.y > this.loc.y - a) {
            let d = this.loc.distanceTo(c0.loc);
            if (d < min) {
              min = d;
              this.nearCollision = c0;
            }
          }
        }
      }
    }
  }

  seek() {
    let desired = this.target.sub(this.loc);
    desired.normalize();
    desired.scaleSelf(this.maxSpeed);
    let steer = desired.sub(this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  drive() {
    let steer = this.seek();
    this.acc.addSelf(steer);
  }

  update() {
    this.vel.addSelf(this.acc);
    this.vel.limit(this.speed);
    this.loc.addSelf(this.vel);
    this.acc.scaleSelf(0);
  }

  drawPath() {
    for (let i = 0; i < this.path.length; i++) {
      let nd = this.path[i];
      strokeWeight(7);
      if (nd === this.startNode) {
        stroke(0, 255, 0);
        point(nd.loc.x, nd.loc.y);
      } else if (nd === this.endNode) {
        stroke(0, 0, 255);
        point(nd.loc.x, nd.loc.y);
      }
    }
    noFill();
    stroke(200, 0, 200);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.path.length; i++) {
      let nd = this.path[i];
      vertex(nd.loc.x, nd.loc.y);
    }
    endShape();
  }

  show() {
    let theta = this.vel.heading() + PI / 2;
    push();
    translate(this.loc.x, this.loc.y);
    rotate(theta);

    fill(50);
    let num = cars.indexOf(this);
    if (num != 0) {
    if (abs(this.speed - fast) < 0.01) {
      fill(0, 0, 255);
    } else if (abs(this.speed - slow) < 0.01) {
      fill(0, 255, 0);
    }
    if (this.trafficSignFound !== null) { // Color of the firstTime car waiting at a traffic sign.
      let s = -1;
      let i = -1;

      if (this.trafficSignFound.intersection.waitingCars != null) {
        if (this.trafficSignFound.type == 0) {
          s = this.trafficSignFound.intersection.waitingCars.length;
          i = this.trafficSignFound.intersection.waitingCars.indexOf(this);
        } else {
          s = this.trafficSignFound.waitingCars.length;
          i = this.trafficSignFound.waitingCars.indexOf(this);
        }
      }
      if (s > 0 && i == 0) {
        fill(220, 40, 50);
      }
    }
    if (this.nearCollision != null) {
      fill(30, 130, 130);
    }

  } else {
//    if (this.num == 0) {
      fill(200, 0, 200);
//    }
  }

    noStroke();
    beginShape(TRIANGLES);
    vertex(0, -this.size*2);
    vertex(-this.size, this.size*2);
    vertex(this.size, this.size*2);
    endShape();
    // if (debug) {
    //   fill(255);
    //   textSize(12);
    //   text(String.valueOf(this.cars.indexOf(this)), -5, 25);
    // }
    //beginShape();
    //vertex(-size, 3 * size);
    //vertex(size, 3 * size);
    //vertex(size, -size);
    //vertex(-size, -size);
    //endShape();
    //stroke(255, 255, 0);
    //strokeWeight(2.5);
    //point(-size + 1, -size - 1);
    //point(size - 1, -size - 1);
    pop();

  }
  //  }
}
