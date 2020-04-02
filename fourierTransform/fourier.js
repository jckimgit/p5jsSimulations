let numSamples;
let s; // nixed series
let series;
let wave;
let fts;
let ifts;
let startTime;
let time = 0;
let ftType;
let num = 0;
let pause  = true;
let cnv;

function setup() {
  cnv = createCanvas(800, 600); // Create signals.
  cnv.parent('canvas');
  s = [];
  makeSeries();
  background(50);
}

function makeSeries() {
  numSamples = 201;
  series = [];
  let ind0 = [];
  for (let i = 0; i < numSamples; i ++) {
    if (i < numSamples / 2) { // signalType 0: step function
      ind0[i] = 30;
    } else {
      ind0[i] = -30;
    }
  }
  series.push(ind0); //console.log(series);
  let ind1 = [];
  for (let i = 0; i < numSamples; i ++) {
    ind1[i] = i / 2; // signalType 1: linear function
  }
  series.push(ind1);
  let ind2 = [];
  for (let i = 0; i < numSamples; i ++) {
    ind2[i] = pow((i - numSamples / 2), 2) /100; // signalType 2: quadratic function
  }
  series.push(ind2);
  let ind3 = [];
  for (let i = 0; i < numSamples; i ++) {
    ind3[i] = 30 * log(i + 0.01); // signalType 3: natrual log function
  }
  series.push(ind3);
  let ind4 = [];
  for (let i = 0; i < numSamples; i ++) {
    ind4[i] = sin(0.01 * 2* PI * i) * 50; // signalType 4: sine function
  }
  series.push(ind4);
  let ind5 = [];
  for (let i = 0; i < numSamples; i ++) {
    ind5[i] = cos(0.01 * 2* PI * i) * 50; // signalType 5: cosine function
  }
  series.push(ind5);
  let ind6 = [];
  for (let i = 0; i < numSamples; i ++) {
    ind6[i] = random(-50, 50);
  }
  series.push(ind6);
}

function draw() {
  gui();
  if (!pause) {
    background(0);
    translate(width / 4, height / 2);

    textFont(12);
    textAlign(LEFT);
    stroke(255, 255, 0, 150);
    strokeWeight(1);
    text('0', 100, 20);
    text('200', 300, 20);

    let y = 0;
    if (ftType == 0) { // Use frequency domain information.
      // For drawing circles (x, y) and the signal value (y).
      let x = 0;
      let XY = epicycle(x, y);
      show(XY.y);
      stroke(255);
      strokeWeight(1);
      line(XY.x - (width / 2 - (width / 4 + s.length / 2)), XY.y, 0, wave[0]);
      const dt = 1 / numSamples;
      time += dt;
    } else if (ftType == 1){ // Use directly Inverse Fourier Transform
      let t = (frameCount - 1 - startTime) % numSamples;
      y = ifts[t].re;
      show(y);
    }
  }
}

function show(y) {
  show_coordinate();
  show_raw();
  if (ftType == 0) {
    wave.unshift(y); // Store signal value, the most recent at the very front.
  } else if (ftType == 1) {
    wave.push(y);
  }
  beginShape();
  stroke(255, 255, 0);
  strokeWeight(2);
  noFill();
  for (let i = 0; i < wave.length - 1; i++) {
    vertex(i, wave[i]);
  }
  endShape();
  stroke(255, 0,0);
  strokeWeight(5);
  point(0, wave[0]);
  if (wave.length > numSamples) {
    noLoop();
  }
}

function show_raw() {
  translate(width / 2 - (width / 4 + numSamples / 2), 0);
  beginShape();
  stroke(0, 0, 255);
  strokeWeight(2);
  noFill();
  for (let i = 0; i < numSamples; i++) {
    vertex(i, s[i]);
  }
  endShape();
}

function show_coordinate() {
  stroke(0, 255, 255, 150);
  strokeWeight(1);
  line(50, 0, 400, 0);
}

function epicycle(x, y) {
  for (let k = 0; k < numSamples; k++) {
    let centerx = x;
    let centery = y;
    let freq = k;
    let radius = fts[k].amp / numSamples;
    let phase = fts[k].phase;
    x += radius * cos(2 * PI * freq * time - phase + PI / 2);
    y += radius * sin(2 * PI * freq * time - phase + PI / 2);
    stroke(255, 100);
    noFill();
    ellipse(centerx, centery, radius * 2);
    stroke(255);
    line(centerx, centery, x, y);
  }
  let XY = {x, y};
  return XY;
}

function gui() {
  if (num == 0) {
    num++;
    let button0 = select('#start');
    button0.mousePressed(start);
  }
  if (select('#d0').elt.checked) {
    ftType = 0;
  } else if (select('#d1').elt.checked) {
    ftType = 1;
  }
  fts = ft(s); // Fourier Transform
  if (ftType == 1) {
    ifts = ift(fts); // Inverse Transform
  }
}

function start() {
  mix();
  select('#start').elt.disabled = true;
  let d = document.getElementsByClassName('drawing');
  for (let i = 0; i < d.length; i++) {
    d[i].disabled = true;
  }
  startTime = frameCount;
  wave = [];
  circlePath = [];
  pause = false;
}

function mix() {
  for (let i = 0; i < numSamples; i++) {
    s[i] = 0;
  }
  select('#start').elt.disabled = false;
  let ss = document.getElementById('signals').options;
  let ts = [];

  for (let i = 0; i < ss.length; i++) {
    if (ss[i].selected) {
      ts.push(series[i]);
    }
  }
  for (let j = 0; j < ts.length; j++) {
    for (let i = 0; i < numSamples; i++) {
      s[i] += ts[j][i]; //console.log(frameCount, s[i], ts[j][i]);
    }
  }
}

function keyPressed() {
  if (key === 'R') {
    start();
  }
  if (key == 'P') { // pause/resume
    pause = !pause;
  }
}
