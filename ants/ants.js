let monitor;
let angleToFood = Math.PI / 2;
let angleToNest = Math.PI / 2;
let foodSite;
let foodSites;
let foodColors;
let numFood = 30;
let maxNumFoodSites = 50;
let maxFoodSize = 6;
let minFoodSize = 2;
let nest;
let nestX;
let nestY;
let nestWidth = 100;
let nestHeight = 80;
let nestColor;
let ants;
let numAnts = 20;
let antSize = 0.04;
let antOrigColor;
let antChangedColor;
let pheroColorToFood;
let pheroColorToNest;
let colorCount = 0;
let num = 0;
let pause = true;
let cnv;

function setup(){
  cnv = createCanvas(640, 640);
  cnv.parent('canvas');
  colors();
  create();
  background(200, 230, 170);

}


function draw(){
  gui();
  if (!pause) {
    background(200, 230, 170);
    monitor.run();
    nest.run();
    for (let f of foodSite) {
      f.display();
    }
    for (let a of ants) {
      a.run();
    }
  }
}

function colors() {
  nestColor = color(200, 200, 200);

  foodColors = [];
  for (let i = 0; i < 10; i++) {
    if (i < 5)
    foodColors[i] = color(100 + 35*i, 250 - 60*i, 60*i);
    else
    foodColors[i] = color(100 + 35*(i-5), 250 - 60*(i-5), 60*(i-5));
  }

  pheroColorToFood = color(20, 0, 250);
  pheroColorToNest = color(20, 0, 250);

  antOrigColor = color(20, 0, 0);
  antChangedColor = color(120, 60, 10);
}

function create() {
  colorCount = 0;
  monitor = new Monitor();

  nestX = width / 2;
  nestY = height / 2;
  nest = new Nest();

  foodSite = [];
  foodSites = [];
  ants = [];
  for (let i = 0; i < numAnts;i++) {
    let a = new Ant(nestX, nestY);
    a.changeAntSize(antSize);
    ants.push(a);
  }
}

function provideFood(loc) {
  if (!monitor.inNest(loc)) {
    for (let i = 0; i < numFood; i++) {
      let x = random(loc.x - 15, loc.x + 15);
      let y = random(loc.y - 15, loc.y + 15);
      let foodLoc = new p5.Vector(x, y);
      if (!monitor.inNest(foodLoc)) {
        let w = random(minFoodSize, maxFoodSize);
        let h = random(minFoodSize, maxFoodSize);
        let f = new Food(x, y, w, h, colorCount % 10);
        foodSite.push(f);
      }
    }
    colorCount++;
  }
  foodSites.push(foodSite);
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
}

function start() {
  pause = false;
  document.getElementById('start').disabled = true;
}

function run() {
  pause = false;
  runBtn.attribute("disabled", true);
  setup();
}

function mousePressed() {
  let mouseLoc = new p5.Vector(mouseX, mouseY);
  if ((foodSites.length + 1) * numFood  < nest.rows * nest.cols) {
    provideFood(mouseLoc);
  }
}

function keyPressed() {
  if (key == 'R') {
    colors();
    create();
  }
  else if (key == 'P') { // pause/resume
    pause = !pause;
  }
}
