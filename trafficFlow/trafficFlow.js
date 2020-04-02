/* Cars stay on the right side of the road. Ten percent of cars move quickly and another ten percent move slowly.  //<>//
If a car arrives at its destination, it sets a new destination.
Pink car's path from start to destination is drawn as a pink line. On the way to the destination,
a car may encounter four-way (or two-way) stop signs, in which case it stops for a short period of time. At a yield sign, it has to yield to
other cars in front. When a car stops at traffic signs, it turns red. When the car is near collision with another car,
its color turns light green.
*/

let nodes;
let endNodes;
const numGenerations= 5;
let currNum = 0;
let roadWidth = 50;
let distance = 180; // Distance between nodes or the length of road.
let n = 4;  // For combinatoral creation of roads. Four directions at each node.

let trafficSigns;
let trafficSignSize = 6;
let stopSignType = 2; // = 2; // 2: two-way stop sign, 4: four-way stop sign.

let numCars = 20;
let cars;
let fast = 1.3;
let slow = 0.7;
let num = 0;

let pause = true;
let debug = false;
let myFont;
let cnv;

function setup() {
  cnv = createCanvas(800, 800);
  cnv.parent('canvas');
  createRoads();
  background(200);
}

function draw() {
  gui();
  if (!pause) {
    background(200);
    drawRoads();
    drive();
  }
}
function create() {
  createRoads();
  createTrafficSigns();
  createCars();
}

function createRoads() {
  nodes = [];
  endNodes = [];
  let loc = new Vec2D(width / 2, height /2);
  let node = new Node(loc, 0, 0);
  node.createNeighbors();
  for (let nd of nodes) {
    if (nd.neighbors.length == 1) {
      endNodes.push(nd);
    }
  }
}

function createTrafficSigns() {
  trafficSigns = [];
  for (let nd of nodes) {
    let s = nd.neighbors.length;
    let ts  = null;
    if (s == 4) { // Four-way intersection, which has four neighbors.
      if (stopSignType == 4) { // Four-way stop signs.
        ts = new TrafficSign(new Vec2D(nd.loc.x - roadWidth / 2, nd.loc.y - 7 * roadWidth / 10), 0, nd);
        trafficSigns.push(ts);
        ts = new TrafficSign(new Vec2D(nd.loc.x + roadWidth / 2, nd.loc.y + 7 * roadWidth / 10), 0, nd);
        trafficSigns.push(ts);
        ts = new TrafficSign(new Vec2D(nd.loc.x - 7 * roadWidth / 10, nd.loc.y + roadWidth / 2), 0, nd);
        trafficSigns.push(ts);
        ts = new TrafficSign(new Vec2D(nd.loc.x + 7 * roadWidth / 10, nd.loc.y - roadWidth / 2), 0, nd);
        trafficSigns.push(ts);
      } else if (stopSignType == 2) { // Tow-way stop signs.
        ts = new TrafficSign(new Vec2D(nd.loc.x - roadWidth / 2, nd.loc.y - 7 * roadWidth / 10), 0, nd);
        trafficSigns.push(ts);
        ts = new TrafficSign(new Vec2D(nd.loc.x + roadWidth / 2, nd.loc.y + 7 * roadWidth / 10), 0, nd);
        trafficSigns.push(ts);
        ts = new TrafficSign(new Vec2D(nd.loc.x - 7 * roadWidth / 10, nd.loc.y + roadWidth / 2), 3, nd);
        trafficSigns.push(ts);
        ts = new TrafficSign(new Vec2D(nd.loc.x + 7 * roadWidth / 10, nd.loc.y - roadWidth / 2), 3, nd);
        trafficSigns.push(ts);
      }
    } else if (s == 3) { // Three-way intersection, which has three neighbors.
      let minor = null;
      let count = 0;
      for (let n0 of nd.neighbors) {
        if (abs(nd.loc.y - n0.loc.y) < 1) {
          count++;
        }
      }
      if (count == 1) { // Horizontal road is minor.
        for (let n0 of nd.neighbors) {
          if (abs(nd.loc.y - n0.loc.y) < 1 ) {
            minor = n0;
            if (minor.loc.x > nd.loc.x) {
              ts = new TrafficSign(new Vec2D(nd.loc.x + 7 * roadWidth / 10, nd.loc.y - roadWidth / 2), 1, nd);
            } else {
              ts = new TrafficSign(new Vec2D(nd.loc.x - 7 * roadWidth / 10, nd.loc.y + roadWidth / 2), 1, nd);
            }
            trafficSigns.push(ts);
            if (minor.loc.x > nd.loc.x) { // Invisible traffic sign on a major road.
              ts = new TrafficSign(new Vec2D(nd.loc.x - roadWidth / 2, nd.loc.y - 7 * roadWidth / 30), 2, nd); // The sign is closer to the intersection than the visible one.
            } else {
              ts = new TrafficSign(new Vec2D(nd.loc.x + roadWidth / 2, nd.loc.y + 7 * roadWidth / 30), 2, nd);
            }
            trafficSigns.push(ts);
            break;
          }
        }
      } else if (count == 2) { // Vertical road is minor.
        for (let n0 of nd.neighbors) {
          if (abs(nd.loc.y - n0.loc.y) > 5 ) {
            minor = n0;
            if (minor.loc.y < nd.loc.y) {
              ts = new TrafficSign(new Vec2D(nd.loc.x - roadWidth / 2, nd.loc.y - 7 * roadWidth / 10), 1, nd);
            } else {
              ts = new TrafficSign(new Vec2D(nd.loc.x + roadWidth / 2, nd.loc.y + 7 * roadWidth / 10), 1, nd);
            }
            trafficSigns.push(ts);
            if (minor.loc.y < nd.loc.y) { // Invisible traffic sign on a major road.
              ts = new TrafficSign(new Vec2D(nd.loc.x - 7 * roadWidth / 30, nd.loc.y + roadWidth / 2), 2, nd);
            } else {
              ts = new TrafficSign(new Vec2D(nd.loc.x + 7 * roadWidth / 30, nd.loc.y - roadWidth / 2), 2, nd);
            }
            trafficSigns.push(ts);
            break;
          }
        }
      }
    }
  }
}

function createCars() {
  cars = [];
  for (let i = 0; i < numCars; i++) {
    let speed = 1.0;
    let f = random(0, 1);
    if (f > 0.9) {
      speed = fast;
    } else if (f < 0.1) {
      speed = slow;
    }
    let c = new Car(speed, 0.2);
    cars.push(c);
  }
}

// This method draws the nodes of roads, traffic signs, and intersections. A road is a link between two nodes.
function drawRoads() {
  for (let nd of nodes) {
    for (let nd0 of nd.neighbors) { // Roads.
      stroke(160);
      strokeWeight(roadWidth);
      line(nd.loc.x, nd.loc.y, nd0.loc.x, nd0.loc.y);
    }
  }

  for (let nd of nodes) {
    for (let nd0 of nd.neighbors) { // Centerlines of roads.
      stroke(255, 255, 200);
      strokeWeight(2);
      line(nd.loc.x, nd.loc.y, nd0.loc.x, nd0.loc.y);
    }
  }

  for (let ts of trafficSigns) { // Traffic signs.
    ts.show();
  }

  for (let nd of nodes) { // Intersections.
    nd.show();
  }
}

function drive() {
  let nearCollidingCars = [];
  // Cars facing near collision act more quickly than other cars.
  for (let c of cars) {
    if (c.nearCollision !== null) {
      nearCollidingCars.push(c);
    }
  }

  for (let c of nearCollidingCars) {
    c.run();
  }

  for (let c of cars) {
    if (!nearCollidingCars.includes(c)) {
      c.run();
    }
  }
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
    function start() {
      let slider = select('#numCars');
      numCars = slider.elt.value;
      createCars();
      if (select('#2').elt.checked) {
        stopSignType = 2;
      }
      if (select('#4').elt.checked) {
        stopSignType = 4;
      }
      createTrafficSigns();
      pause = false;
      button0.elt.disabled = true;
    }
  }
}

function keyPressed() {
  if (key == 'R') {//restart
    pause = false;
    create();
  }
  if (key == 'P') { // pause/resume
    pause = !pause;
  }
}
