/*
A willow tree growing simulation using Toxiclibs library. Initially, a root node (generation 0) and then its child nodes (generation 1) are created. At each time, each child node moves toward a random target for certain periods and then stops moving. A branch is created, which is a spring between the root node and a child node. As the child node moves, the branch and therefore tree grow.
After a while when a child node stops moving, it creates its own child (generation 2) or peer nodes (generation 1). (Generation 6 is the last generation in this model.) A branch between a node and its peer node is thicker than that between the node and its child node. Nodes of generation 4 or higher are under gravity force and therefore move downward. As a result, branches also point downward. On each branch of generation 4 or higher, some leaves sprout. A leaf is a node. As time goes by, leaves turn brown and most of them evenutall fall.
*/

let ts;
let physics;
let gravity;
let lastGen = 6;
let initDate = -29; // At frameCount 1, generation 0 node does not move, only creates generation 1 nodes.
let num = 0;
let pause = true;
let falling = false;
let num0 = 0;
let cnv;

function setup() {
  cnv = createCanvas(600, 750);
  cnv.parent('canvas');
  ts = new TreeSystem();
  background(150);

}

function draw() {
  gui();
  if (!pause) {
    background(250);
    physics.update();
    ts.run();
  }
}

function gui() {
  if (num0 == 0) {
    num0++;
    let button0 = select('#start');
    button0.mousePressed(start);
    function start() {
      pause = false;
      createRoot();
      button0.elt.disabled = true;
      select('#no').elt.disabled = true;
      select('#yes').elt.disabled = true;
      if (select('#yes').elt.checked) {
        falling = true;
      }
    }
  }
}

function createRoot() {
  if (num == 0) { // create the root only once.
    let nd = Node.root(new Vec2D(width/2, height - 13), frameCount);
    physics.addParticle(nd);
    num = 1;
  }
}

function keyPressed() {
  if (key == 'R') {//restart
    pause = false;
    ts = new TreeSystem();
    num = 0;
    createRoot();
  }
  if (key == 'P') { // pause/resume
    pause = !pause;
  }
}
