/*
Finite difference methods for wave equations by Hans Petter Langtangen and Svein Linge3
http://hplgit.github.io/wavebc/doc/pub/._wavebc_cyborg002.html
*/

let num = 0;
let startTime; // The time when the 'run' button is clicked and a simulation starts
let speed = 30;
let pause = true  ;
let cnv;

let c = 1;
let dt = 0.5;
let dv = 1; // dv = dx = dy
let C  = c * dt / dv;
let C2 = C * C;
let L = 120;
let W = 120;
let Nx = Math.floor(L / dv); // No. of columns
let Ny = Math.floor(W / dv); // No.of rows
let u_0 = [];
let u_1 = [];
let u_2 = [];
let scl = 4;
let zScl;

let angleX;// = Math.radians(188);
let angleY;// = Math.radians(50); //Math.PI / 4;
let persp0 = true;
let noImpulse = true;
let uncorr = true;
let center = true;

function setup() {
  frameRate(speed); // adjust speed of displaying
  cnv = createCanvas(1000, 700, WEBGL); // Create signals.
  cnv.parent('canvas');

  for (let i = 0; i < Ny + 1; i++) {
    u_0[i] = [];
    u_1[i] = [];
    u_2[i] = [];
    for (let j = 0; j < Nx + 1; j++) {
      u_0[i][j] = 0;
      u_1[i][j] = 0;
      u_2[i][j] = 0;
    }
  }
  background(0);
}

function draw() {
  gui();
  if (!pause) {
    background(0);
    if (frameCount - startTime == 1) { // Initialize
      IC0(); // Time step 0
      IC1(); // Time step 1
    }
    ICn();
    show();
    updateData();
  }
}

function IC0() {
  if (noImpulse) {
    for (let i = 0; i < Ny + 1; i++) {
      for (let j = 0; j < Nx + 1; j++) {
        u_2[i][j] = Gaussian2D(i * dv, j * dv);
      }
    }
  } else {
    for (let i = 0; i < Ny + 1; i++) {
      for (let j = 0; j < Nx + 1; j++) {
        u_2[i][j] = rest(i * dv, j * dv);
      }
    }
  }
}

function IC1() {
  for (let i = 1; i < Ny; i++) {
    for (let j = 1; j < Nx; j++) {
      let uij = u_2[i][j] + 0.5 * C2 * (u_2[i + 1][j] + u_2[i - 1][j] + u_2[i][j + 1] + u_2[i][j - 1] - 4 * u_2[i][j]);
      if (noImpulse) {
        u_1[i][j] = uij;
      } else {
        u_1[i][j] = uij +  +  dt * box_v(i * dv, j * dv);
      }
      u_1[0][j] = 0;
      u_1[Ny][j] = 0;
    }
    u_1[i][0] = 0;
    u_1[i][Nx] = 0;
  }
  u_1[0][0] = 0;
  u_1[0][Nx] = 0;
  u_1[Ny][0] = 0;
  u_1[Ny][Nx] = 0;
}


function ICn() {
  for (let i = 1; i < Ny; i++) {
    for (let j = 1; j < Nx; j++) {
      u_0[i][j] = -u_2[i][j] + 2 * u_1[i][j] + C2 * (u_1[i + 1][j] + u_1[i - 1][j] + u_1[i][j + 1] + u_1[i][j - 1] - 4 * u_1[i][j]);
      u_0[0][j] = 0;
      u_0[Ny][j] = 0;
    }
    u_0[i][0] = 0;
    u_0[i][Nx] = 0;
  }
  u_0[0][0] = 0;
  u_0[0][Nx] = 0;
  u_0[Ny][0] = 0;
  u_0[Ny][Nx] = 0;
}

function updateData() {
  for (let i = 0; i < Ny + 1; i++) {
    u_2[i] = u_1[i].slice(0);
  }
  for (let i = 0; i < Ny + 1; i++) {
    u_1[i] = u_0[i].slice(0);
  }
}

function Gaussian2D(x, y) {
  let v12 = 0;
  if (!uncorr) {
    v12 = 120;
  }
  let s1 =  L / 10;
  let s2 = W / 10;
  let rho = v12 / (s1 * s2);
  let mu1 = L / 2;
  let mu2 = W / 2;

  let z = (x - mu1) ** 2 / s1 ** 2  + (y - mu2) ** 2 / s2 ** 2 - 2 * rho * (x - mu1) * (y - mu2) / (s1 * s2);
  let val = exp(-z / (2 * (1 - rho ** 2))) / (2 * PI * s1 * s2 * sqrt(1 - rho ** 2));
  let max = 1 / (2 * PI * s1 * s2 * sqrt(1 - rho ** 2));
  zScl = -200 / max;
  return val;
}

function rest(x, y) {
  zScl = 0;
  return 0;
}

function box_v(x, y) {
  let x0 = L / 2 - L / 20;
  let x1 = L / 2 + L / 20;
  let y0 = W / 2 - W / 20;
  let y1 = W / 2 + W / 20;

  if (!center) {
    x0 = W /2 - W / 20;
    x1 = W / 2 + W / 20;
    y0 = 0;
    y1 = L / 20;
  }
  zScl = 30;
  if (x > x0 && x < x1 && y > y0 && y < y1) {
    return 1;
  } else {
    return 0;
  }
}

function show() {
  stroke(250);
  strokeWeight(2);
  fill(100, 230);
  if (persp0) {
    translate( -scl * L / 2 - 80,  -30, -scl * W / 2 + 250);
  } else {
    translate( -scl * L / 2 - 50,  0, -scl * W / 2 + 350);
  }
  rotateX(-angleX);
  rotateY(angleY);

  for (let j = 0; j < Nx - 1; j++) {
    beginShape(TRIANGLE_STRIP);
    for (let i = 0; i < Ny; i++) {
      vertex(i * dv * scl, -zScl * u_2[i][j], j * dv * scl);
      vertex(i * dv * scl, -zScl * u_2[i][j + 1], (j + 1) * dv * scl);
    }
    endShape();
  }
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
  let slider1 = select('#speed');
  speed = map(slider1.elt.value, 0, 1, 1, 60);
  frameRate(speed);

  if (select('#noImpulse').elt.checked) {
    select('#center').elt.disabled = true;
    select('#edge').elt.disabled = true;
    select('#uncorr').elt.disabled = false;
    select('#corr').elt.disabled = false;
  }
  if (select('#impulse').elt.checked) {
    select('#center').elt.disabled = false;
    select('#edge').elt.disabled = false;
    select('#uncorr').elt.disabled = true;
    select('#corr').elt.disabled = true;
  }
}

function start() {
  startTime = frameCount;
  pause = false;

  if (select('#persp0').elt.checked) {
    persp0 = true;
    angleX = radians(200);
    angleY = radians(45);
  } else {
    persp0 = false;
    angleX = radians(190);
    angleY = radians(35);
  }

  if (select('#noImpulse').elt.checked) {
    noImpulse = true;
  } else {
    noImpulse = false;
  }

  if (select('#uncorr').elt.checked) {
    uncorr = true;
  } else {
    uncorr = false;
  }
  if (select('#corr').elt.checked) {
    uncorr = false;
  } else {
    uncorr = true;
  }
  if (select('#center').elt.checked) {
    center = true;
  } else {
    center = false;
  }
  if (select('#edge').elt.checked) {
    center = false;
  } else {
    center = true;
  }
}

function keyPressed() {
  if (key === 'R') {
    start();
  }
  if (key == 'P') {
    pause = !pause;
  }
}
