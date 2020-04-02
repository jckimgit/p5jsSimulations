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
let d = 0.8;
let dt = 0.1;
let dx = 0.1;
let C  = c * dt / dx;
let D = d * dt / dx;
let C2 = C * C;
let D2 = D * D;
let L = 25;
let Nx = Math.floor(L / dx);
let nx  = Math.floor(Nx / 2);
//let rv = Math.floor(Math.random(0, 10) * 10);
let xScale = 30;

let u_0 = [];
let u_1 = [];
let u_2 = [];
let time;

let fixed = false;
let reflecting = false;
let open = false;
let periodic = false;
let feeding = false;
let homogeneous = false;

function setup() {
  frameRate(30); // adjust speed of displaying
  cnv = createCanvas(1000, 600); // Create signals.
  cnv.parent('canvas');
  for (let i = 0; i < Nx + 1; i++) {
    u_0[i] = 0;
    u_1[i] = 0;
    u_2[i] = 0;
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
  for (let i = 0; i < Nx + 1; i++) {
    u_2[i] = F(i * dx);
  }
}

function IC1() {
  for (let i = 1; i < Nx; i++) {
    if (homogeneous) {
      u_1[i] = u_2[i] + 0.5 * C2 * (u_2[i + 1] - 2 * u_2[i] + u_2[i - 1]) + dt * G(i * dx);
    } else {
      if (i < nx) {
        u_1[i] = u_2[i] + 0.5 * C2 * (u_2[i + 1] - 2 * u_2[i] + u_2[i - 1]) + dt * G(i * dx);
      } else {
        u_1[i] = u_2[i] + 0.5 * D2 * (u_2[i + 1] - 2 * u_2[i] + u_2[i - 1]) + dt * G(i * dx);
      }
    }
  }
  if (fixed) {
    u_1[0] = 0;
    u_1[Nx] = 0;
  }
  if (reflecting) {
    u_1[0] = 0;
    //  u_1[0] = u_1[1];
    u_1[Nx] = u_1[Nx - 1];
  }
  if (open) {
    //  u_1[0] = (c * dt * u_1[1] + dx * u_2[0]) / (dx + c * dt);
    u_1[0] = 0;
    u_1[Nx] = (c * dt * u_1[Nx - 1] + dx * u_2[Nx]) / (dx + c * dt);
  }
}

function ICn() {
  for (let i = 1; i < Nx; i++) {
    if (homogeneous) {
      u_0[i] = -u_2[i] + 2 * u_1[i] + C2 * (u_1[i + 1] - 2 * u_1[i] + u_1[i - 1]);
    } else {
      if (i < nx) {
        u_0[i] = -u_2[i] + 2 * u_1[i] + C2 * (u_1[i + 1] - 2 * u_1[i] + u_1[i - 1]);
      } else {
        u_0[i] = -u_2[i] + 2 * u_1[i] + D2 * (u_1[i + 1] - 2 * u_1[i] + u_1[i - 1]);
      }
    }
  }
  if (fixed) {
    u_0[0] = 0;
    u_0[Nx] = 0;
  } else if (reflecting) {
    u_0[0] = 0;
    //u_0[0] = u_0[1];
    u_0[Nx] = u_0[Nx - 1];
  } else if (open) {
    u_0[Nx] = (dx * u_1[Nx] + c * dt * u_0[Nx - 1]) / (dx + c * dt);
    if (!periodic) {
      u_0[0] = 0;

      // u_0[0] = (dx * u_1[0] +c * dt * u_0[1]) / (dx + c * dt);
    } else  {
      u_0[0] = u_0[Nx];
    }
  }
  // if (feeding) {
  //   if (frameCount > 10 && frameCount < 50) {
  //     u_0[0] = sine(frameCount);
  //   }
  // }
}
function updateData() {
  u_2 = u_1.slice(0);
  u_1 = u_0.slice(0);
}

function F(x) {
  select('#start').elt.disabled = false;
  let ix = document.getElementById('i(x)').options;
  let fx = [];

  for (let i = 0; i < ix.length; i++) {
    if (ix[i].selected) {
      fx.push(i);
    }
  }

  let val = 0;
  for (let i = 0; i < fx.length; i++) {
    if (fx[i] == 0) {
      val += Gaussian(x);
    }
    if (fx[i] == 1) {
      val += cosine(x);
    }
    if (fx[i] == 2) {
      val += sine(x);
    }
    if (fx[i] == 3) {
      val += box0(x);
    }
    if (fx[i] == 4) {
      val += triangle0(x);
    }
    if (fx[i] == 5) {
      val += quadratic(x);
    }
  }
  return val;
}

function rest(x) {
  return 0;
}

function quadratic(x) {
  return  -0.1 * x * x * (L - x); //
}

function Gaussian(x) { // with boundary conditions
  let v = -400 * exp(-((x -  L / 4) ** 2) / (2 * 1)) / sqrt(2 * Math.PI * 1);
  return v;
}

function cosine(x) {
  return 50 * cos(8 * PI / L * x);
}

function sine(x) {
  return 50 * sin(8 * PI / L * x);
}

function box0(x) {
  if (x >= floor(L / 4) && x <= floor(3 * L / 4)) {
    return -100;
  } else {
    return 0;
  }
}

function triangle0(x) { // with boundary conditions
  let d = L / 10;
  let x0 = (L - d) / 2;
  let x1 = x0 + d;
  let xc = x0 + d / 2;
  if (x >= x0 && x < xc) {
    return -300 * (x - x0) / d;
  } else if (x >= xc && x < x1) {
    return 300 * ( x - x1) / d;
  } else {
    return 0;
  }
}

function G(x) {
  select('#start').elt.disabled = false;
  let vx = document.getElementById('v(x)').options;
  let gx = [];

  for (let i = 0; i < vx.length; i++) {
    if (vx[i].selected) {
      gx.push(i);
    }
  }

  let val = 0;
  for (let i = 0; i < gx.length; i++) {
    if (gx[i] == 0) {
      val += Gaussian_v(x);
    }
    if (gx[i] == 1) {
      val += cosine_v(x);
    }
    if (gx[i] == 2) {
      val += sine_v(x);
    }
    if (gx[i] == 3) {
      val += box_v(x);
    }
    if (gx[i] == 4) {
      val += triangle_v(x);
    }
    if (gx[i] == 5) {
      val += quadratic_v(x);
    }
  }
  return val / gx.length;
}

function Gaussian_v(x) { // with boundary conditions
  if (x < L / 10 ) {
    return -150 * exp(-((x -  L / 20) ** 2) / (2 * 0.1)) / sqrt(2 * Math.PI * 0.1);
  } else if (x >= 9 * L / 10 && x < L) {
    return -150 * exp(-((x -  19 * L / 20) ** 2) / (2 * 0.1)) / sqrt(2 * Math.PI * 0.1);
  }  else {
    return 0;
  }
}

function quadratic_v(x) {
  if (x < L / 10) {
    return  -50 * x * (L / 10 - x);
  } else if (x >= 9 * L / 10 && x < L) {
    return  -50 * (x - 9 * L / 10) * (L - x);
  } else {
    return 0;
  }
}

function cosine_v(x) {
  if ( x < L / 10 || (x >= 9 * L / 10 && x < L)) {
    return -50 * cos(20 * PI / L * x);
  } else {
    return 0;
  }
}

function sine_v(x) {
  if ( x < L / 10 || (x >= 9 * L / 10 && x < L)) {
    return -50 * sin(20 * PI / L * x);
  } else {
    return 0;
  }
}

function box_v(x) { // with boundary conditions
  if ( x < L / 10 || (x >= 9 * L / 10 && x < L)) {
    return 50;
  } else {
    return 0;
  }
}

function triangle_v(x) { // with boundary conditions
  let d = L / 10;
  let x0 = 0;
  let x1 = L / 10;
  let xc = L / 20;
  if (x >= 9 * L / 10 && x < L) {
    x0 = 9 * L / 10;
    x1 = L;
    xc = 19 * L / 20;
  }
  if (x >= x0 && x < xc) {
    return -300 * (x - x0) / d;
  } else if (x >= xc && x < x1) {
    return 300 * ( x - x1) / d;
  } else {
    return 0;
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
  if (!document.getElementById('open').checked) {
    document.getElementById('divShape3-1').style.visibility = "hidden"
  } else {
    document.getElementById('divShape3-1').style.visibility = "visible"
  }
}

function start() {
  startTime = frameCount;
  pause = false;
  select('#start').elt.disabled = true;

  if (select('#fixed').elt.checked) {
    fixed = true;
    reflecting = false;
    open = false;
  } else if (select('#reflecting').elt.checked) {
    fixed = false;
    reflecting = true;
    open = false;
  } else if (select('#open').elt.checked) {
    fixed = false;
    reflecting = false;
    open = true;
    if (select('#periodic').elt.checked) {
      periodic = true;
    } else {
      periodic = false;
    }
  }
  if (select('#homo').elt.checked) {
    homogeneous = true;
  } else {
    homogeneous = false;
  }
}

function show() {
  translate(width / 2 - xScale * L / 2, height / 2);
  stroke(255);
  noFill();
  let n = floor(Nx / 2);

  if (homogeneous) {
    beginShape();
    strokeWeight(2);
    for (let i = 0; i < Nx + 1; i++) {
      vertex(i * dx * xScale, u_0[i]);
    }
    endShape();
  } else {
    beginShape();
    strokeWeight(2);
    for (let i = 0; i < n; i++) {
      vertex(i * dx * xScale, u_0[i]);
    }
    endShape();

    beginShape();
    strokeWeight(4);
    for (let i = n; i < Nx + 1; i++) {
      vertex(i * dx * xScale, u_0[i]);
    }
    endShape();
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
