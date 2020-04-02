class Ant {
  constructor(x, y) {
    this.states = []; // 0: wandering, 1: food found, 2: food reached, 3: phero found, 4: phero reached, // 5: nest reached
    this.states[0] = true;
    this.states[1] = false;
    this.states[2] = false;
    this.states[3] = false;
    this.states[4] = false;
    this.states[5] = false;

    this.target = null;
    this.location = new p5.Vector(x, y);
    this.velocity = new p5.Vector(cos(random(TWO_PI)), sin(random(TWO_PI)));
    this.acceleration = new p5.Vector(0, 0);
    this.desired = null;

    this.antColor = antOrigColor;
    this.maxSpeed = 1.5;
    this.maxForce = 0.4;
    this.totalNumWandering = 0;// while an ant wanders, it drops pheromone for a certain period of time, then stops for a while and later resumes pheromone dropping
    this.movingDistance = 0; // needed for determining phero dropping interval
    this.numWandering = 0;
    this.maxNumWandering = 0; // an ant randomly changes moving direcions after a certain number of steps
    this.foodGathered = null;

    this.found; // food or phero found
    this.reached; // food or phero reached
    this.gathered; // food gathered
    this.near; // near the nest

    if (!this.gathered) {
      this.angleToNest = PI / 2;
    }

    //drawing ants
    //head, chest, body
    this.head = [-25, 20, -40, -40, 40, -40, 25, 20, 10, 80, -10, 80, -25, 20];
    this.chest = [0, 115, 20, 108];
    this.body = [35, 200, -20, 155, 20, 155, 35, 200, 80, 335, -80, 335, -35, 200];

    //left side
    this.antennaL = [-25, -10, -70, -5, -75, -40, -80, -50];
    this.leg0LU = [-8, 75, -20, 75, -40, 75, -75, 55];
    this.leg0LD = [-8, 75, -20, 75, -40, 75, -80, 70];

    this.leg1LU = [-11, 100, -15, 100, -85, 100, -120, 80];
    this.leg1LD = [-11, 100, -15, 100, -85, 100, -130, 140];

    this.leg2LU = [-8, 150, -20, 150, -150, 180, -180, 220];
    this.leg2LD = [-8, 150, -20, 170, -140, 200, -120, 340];

    //right side
    this.antennaR = [25, -10, 70, -5, 75, -40, 80, -50];
    this.leg0RU = [8, 75, 20, 75, 40, 75, 75, 55];
    this.leg0RD = [8, 75, 20, 75, 40, 75, 80, 70];

    this.leg1RU = [11, 100, 15, 100, 85, 100, 120, 80];
    this.leg1RD = [11, 100, 15, 100, 85, 100, 130, 140];

    this.leg2RU = [8, 150, 20, 150, 150, 180, 180, 220];
    this.leg2RD = [8, 150, 20, 170, 140, 200, 120, 340];
  }

  run() {
    if (this.gathered) {
      this.dropPhero(this.location, "nest"); // an ant with food drops pheromones while trying to return to the nest
    }
    else {
      this.dropPhero(this.location, "food"); // an ant without food drops pheromones while trying to find food
    }

    this.separate(ants); // an ant dodges if it encounters another

    if (this.states[0]) {// an ant wanders
      this.wander();
      if (!(monitor.inNest(this.location))) {// if the ant is outside the nest
        if (!this.gathered) {// if the ant has no food
          this.searchForFood(); // the ant searches for food
          if (this.found) {// if the ant finds food
            this.setTrue(this.states, 1); // state changes to 1
          }
          else { // if the ant does not find food
            this.searchForPheroToNest(); // the ant searches for pheromones which were dropped by another ant
            // while delivering food to the nest
            if (this.found) { // if the ant finds a pheromone
              this.setTrue(this.states, 3);  // state changes to 3
            }
          }
        }
        else{// if the ant carries food
          this.searchForPheroToNest();
          if (this.found) { // if the ant finds a pheromone
            this.setTrue(this.states, 3);  // state changes to 3
          }
        }
      }
    }

    else if (this.states[1]) {// an ant knows where the food is
      this.goToFood(); // the ant goes to the food
      if (this.reached) { // if the ant reaches the food
        this.setTrue(this.states, 2); // state changes to 2
      }
    }

    else if (this.states[2]) { // an ant reaches the food
      this.antColor = antChangedColor; // the color of the ant with the food changes
      this.checkNearNest();
      if (this.near) { // if the ant with the food is near the nest
        this.goToNest(); // the ant goes to the nest
        if (this.reached) {// if the ant with the food reaches the nest,
          this.setTrue(this.states, 5); // state changes to 5
        }
      }
      else { // if the ant with the food is far from the nest
        this.turnAround(); // the ant turns around to where it came from
        this.searchForPheroToNest();
        if (this.found) { // if the ant find a pheromone
          this.setTrue(this.states, 3); // state changes to 3
        }
        else { // if the ant does not find a pheromone
          this.searchForPheroToFood(); // the ant searches for pheromones which were dropped probably by itself
          // while searching for food
          if (this.found) { // if the ant find a pheromone
            this.setTrue(this.states, 3);
          }
          else { // if the ant does not find a pheromone
            this.setTrue(this.states, 0); // state changes to 0 (the ant with the food wanders)
          }
        }
      }
    }

    else if (this.states[3]) {// an ant knows where a pheromone is
      this.goToPhero(); // the ant goes to the pheromone
      if (this.reached) { // if the ant reaches the pheromone
        this.setTrue(this.states, 4); // state changes to 4
      }
    }

    else if (this.states[4]) { // an ant reahces the pheromone
      if (this.gathered) {// if the ant has food
        this.checkNearNest();
        if (this.near) {// if the ant is near the nest
          this.goToNest(); // the ant goes to the nest
          if (this.reached) { // if the ant reaches the nest,
            this.setTrue(this.states, 5); // state changes to 5
          }
        }
        else { // if the ant with the food is far from the nest
          this.searchForPheroToFood();
          if (this.found) { // if the ant find a pheromone
            this.setTrue(this.states, 3); // state changes to 3
          }
          else {
            this.searchForPheroToNest();
            if (this.found) { // if the ant find a pheromone
              this.setTrue(this.states, 3);
            }
            else { // if the ant does not find a pheromone
              this.setTrue(this.states, 0); // state changes to 0 (the ant with the food wanders)
            }
          }
        }
      }
      else { // an ant has no food
        this.searchForFood();
        if (this.found) {// if the ant finds food
          this.setTrue(this.states, 1); // state changes to 1
        }
        else{// the ant does not find food
          this.searchForPheroToNest(); //
          if (this.found) { // if the ant finds a pheromone
            this.setTrue(this.states, 3); // state changes to 3
          }
        }
      }
    }

    else if (this.states[5]) {// an ant reaches the nest
      this.deliverFood(this.foodGathered); // the ant stores food gathered at the nest
      this.turnAround(); // the chance of finding more food is higher at the food site it visited than anywhere else
      this.totalNumWandering = 0;
      this.setTrue(this.states, 0); // state changes to 0
    }

    this.update();
    this.display();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.velocity = this.wiggle(this.velocity);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    this.movingDistance += this.velocity.mag();
    this.inBoundary(); //make sure ants are within the display
  }

  steer(tgt) {// turn to the target
    this.desired = p5.Vector.sub(tgt, this.location);
    this.desired.normalize();
    this.desired.setMag(this.maxSpeed);
    this.desired.sub(this.velocity);
    this.desired.limit(this.maxForce);
    this.acceleration = this.desired;
  }

  wander() {
    this.maxNumWandering = floor(random(300, 500));
    this.numWandering++;
    if (!this.gathered && !this.found && !this.reached) {
      this.totalNumWandering++;
    }

    if (this.numWandering >= this.maxNumWandering) {
      this.target = p5.Vector.random2D(); // random target
      this.target.mult(1500);
      this.steer(this.target);
      this.numWandering = 0;
    }
  }

  searchForFood() {
    this.setFalse(); // set found, reached and near to false
    let f = monitor.findFood(this.location, this.velocity);
    if (f.x != -1 && f.y != -1) { // an ant finds food
      f.spotted = true; // other ants are prevented from gathering the food
      this.foodGathered = f; //
      this.target = new p5.Vector(f.x, f.y);
      this.found = true;
    }
  }

  searchForPheroToFood() {
    this.setFalse();
    let f = monitor.findPhero(this.location, this.velocity, "food");
    if (f.x != -1 && f.y != -1) { // an ant finds food
      this.target = new p5.Vector(f.x, f.y);
      this.found = true;
    }
    else {
      this.setTrue(this.states, 0);
    }
  }

  searchForPheroToNest() {
    this.setFalse(); // set found, reached and near to false
    let f = monitor.findPhero(this.location, this.velocity, "nest");
    if (f.x != -1 && f.y != -1) { // an ant finds pheromone
      this.target = new p5.Vector(f.x, f.y);
      this.found = true;
    }
    else {
      this.setTrue(this.states, 0);
    }

  }

  goToFood() {
    this.steer(this.target);
    this.checkFoodReached();
  }

  goToPhero() {
    this.steer(this.target);
    this.checkPheroReached();
  }

  goToNest() {
    this.steer(this.target);
    this.checkNestReached();
  }

  checkFoodReached() {
    this.setFalse(); // set found, reached and near to false
    this.desired = p5.Vector.sub(this.target, this.location);
    let d = this.desired.mag();
    if (d < 10) {
      this.antColor = antChangedColor;
      this.gathered = true;
      this.reached = true;
      this.updateFood(); // food gathered is removed from a food site
    }
  }

  checkPheroReached() {
    this.setFalse();
    this.desired = p5.Vector.sub(this.target, this.location);
    let d = this.desired.mag();
    if (d < 10) {
      this.reached = true;
    }
  }

  checkNestReached() {
    this.setFalse();
    this.desired =  p5.Vector.sub(this.target, this.location);
    let d = this.desired.mag();
    if (d < 10) {
      this.antColor = antOrigColor; // ant color changes back to the original color
      this.reached = true;
      this.near = false;
    }
  }

  checkNearNest() {
    this.setFalse();
    if (monitor.nearNest(this.location)) {
      this.target = new p5.Vector(nestX, nestY);
      this.near = true;
    }
  }

  dropPhero(loc, s) {
    let steps = 0;
    if (s == "food") {
      steps = 30;
    } else if (s == "nest") {
      steps = 20;
    }
    if (this.totalNumWandering >= 1500) {
      this.totalNumWandering = 0;
    }
    if (floor(this.movingDistance % steps) == 0 && !monitor.inNest(loc)) {
      let pheroLoc = new p5.Vector(loc.x + random(-2, 2), loc.y + random(-2, 2));
      let p = new Pheromon(pheroLoc.x, pheroLoc.y, 4);

      if (s == "food") {
        if (this.totalNumWandering <= 500) {
          monitor.pheroDropsToFood.push(p);
        }
        if (monitor.pheroDropsToFood.length > 800) {
          monitor.pheroDropsToFood.splice(0, 1);
        }
      }
      else if (s == "nest") {
        monitor.pheroDropsToNest.push(p);
        if (monitor.pheroDropsToNest.legth > 1300) {
          monitor.pheroDropsToNest.splice(0,1);
        }
      }
    }
  }

  deliverFood(f) {
    nest.store(f);
    this.gathered = false;
  }

  updateFood() {
    for (let f of foodSite) {
      if (f.x == this.target.x && f.y == this.target.y) {
        let num = foodSite[f];
        foodSite.splice(num, 1);
        break;
      }
    }
  }

  wiggle(vel) {
    let angle = vel.heading();
    let wiggleAngle = PI / 60;
    if (this.states[1] || this.states[2]) {
      wiggleAngle = PI / 15;
    }
    let len = vel.mag();
    let r = random(angle - wiggleAngle, angle + wiggleAngle);
    let newVel = new p5.Vector(len * cos(r), len * sin(r));
    return newVel;
  }

  turnAround() {
    this.velocity.mult(-1);
  }

  inBoundary() {
    if (this.location.x < 20 || this.location.x > width - 20 ) {
      this.velocity.x *= -1;
    }
    if (this.location.y < 20 || this.location.y > height - 20 ) {
      this.velocity.y *= -1;
    }
  }

  setTrue(sts, idx) {
    for (let i = 0; i < sts.length; i++) {
      sts[i] = i == idx ? true : false;
    }
  }

  setFalse() {
    this.found = false;
    this.reached = false;
    this.near = false;
  }

  separate (as) {// adapted from the flocking example
    let desiredSeparation = 15;
    let steer = new p5.Vector(0, 0);
    let count = 0;
    for (let a of as) {
      let d = p5.Vector.dist(this.location, a.location);
      if ((d > 0) && (d < desiredSeparation)) {
        let diff = p5.Vector.sub(this.location, a.location);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.setMag(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
      this.acceleration.add(steer);
    }
  }

  display() {// drawing ants
    let rad = this.velocity.heading() + PI/2;//ant initially points to the north
    push();
    translate(this.location.x, this.location.y);
    rotate(rad);
    if (this.gathered) {// when an ant carrys food
      fill(foodColors[this.foodGathered.foodColorNum]);
      stroke(0);
      rectMode(CENTER);
      rect(0, -this.foodGathered.h, this.foodGathered.w, this.foodGathered.h);
    }

    fill(this.antColor);
    stroke(0);

    //head
    beginShape();
    vertex(this.head[0], this.head[1]); // first point, y = -4x + 120 ((40, -40) and (25, 20))
    bezierVertex(this.head[2], this.head[3], this.head[4], this.head[5], this.head[6], this.head[7]);// y = -4x + 120 ((40, -40) and (25, 20))
    bezierVertex(this.head[8], this.head[9], this.head[10], this.head[11], this.head[12], this.head[13]);
    endShape();

    //chest
    ellipse(this.chest[0], this.chest[1], this.chest[2], this.chest[3]);

    //body
    beginShape();
    vertex(this.body[0], this.body[1]); // first point, y = -3x +95 ((-20, 155) and (-35, 200))
    bezierVertex(this.body[2], this.body[3], this.body[4], this.body[5], this.body[6], this.body[7]);// y = -4x + 120 ((40, -40) and (25, 20))
    bezierVertex(this.body[8], this.body[9], this.body[10], this.body[11], this.body[12], this.body[13]);
    endShape();

    //antenna
    strokeWeight(1);
    noFill();
    beginShape();
    vertex(this.antennaL[0], this.antennaL[1]);
    bezierVertex(this.antennaL[2], this.antennaL[3], this.antennaL[4], this.antennaL[5], this.antennaL[6], this.antennaL[7]);
    endShape();
    beginShape();
    vertex(this.antennaR[0], this.antennaR[1]);
    bezierVertex(this.antennaR[2], this.antennaR[3], this.antennaR[4], this.antennaR[5], this.antennaR[6], this.antennaR[7]);
    endShape();

    //left side
    if (frameCount%30 <= 15) {
      beginShape();
      vertex(this.leg0LU[0], this.leg0LU[1]);
      bezierVertex(this.leg0LU[2], this.leg0LU[3], this.leg0LU[4], this.leg0LU[5], this.leg0LU[6], this.leg0LU[7]);
      endShape();

      beginShape();
      vertex(this.leg0RD[0], this.leg0RD[1]);
      bezierVertex(this.leg0RD[2], this.leg0RD[3], this.leg0RD[4], this.leg0RD[5], this.leg0RD[6], this.leg0RD[7]);
      endShape();

      beginShape();
      vertex(this.leg1LD[0], this.leg1LD[1]);
      bezierVertex(this.leg1LD[2], this.leg1LD[3], this.leg1LD[4], this.leg1LD[5], this.leg1LD[6], this.leg1LD[7]);
      endShape();

      beginShape();
      vertex(this.leg1RU[0], this.leg1RU[1]);
      bezierVertex(this.leg1RU[2], this.leg1RU[3], this.leg1RU[4], this.leg1RU[5], this.leg1RU[6], this.leg1RU[7]);
      endShape();


      beginShape();
      vertex(this.leg2LU[0], this.leg2LU[1]);
      bezierVertex(this.leg2LU[2], this.leg2LU[3], this.leg2LU[4], this.leg2LU[5], this.leg2LU[6], this.leg2LU[7]);
      endShape();

      beginShape();
      vertex(this.leg2RD[0], this.leg2RD[1]);
      bezierVertex(this.leg2RD[2], this.leg2RD[3], this.leg2RD[4], this.leg2RD[5], this.leg2RD[6], this.leg2RD[7]);
      endShape();
    }
    else {
      beginShape();
      vertex(this.leg0LD[0], this.leg0LD[1]);
      bezierVertex(this.leg0LD[2], this.leg0LD[3], this.leg0LD[4], this.leg0LD[5], this.leg0LD[6], this.leg0LD[7]);
      endShape();

      beginShape();
      vertex(this.leg0RU[0], this.leg0RU[1]);
      bezierVertex(this.leg0RU[2], this.leg0RU[3], this.leg0RU[4], this.leg0RU[5], this.leg0RU[6], this.leg0RU[7]);
      endShape();

      beginShape();
      vertex(this.leg1LU[0], this.leg1LU[1]);
      bezierVertex(this.leg1LU[2], this.leg1LU[3], this.leg1LU[4], this.leg1LU[5], this.leg1LU[6], this.leg1LU[7]);
      endShape();

      beginShape();
      vertex(this.leg1RD[0], this.leg1RD[1]);
      bezierVertex(this.leg1RD[2], this.leg1RD[3], this.leg1RD[4], this.leg1RD[5], this.leg1RD[6], this.leg1RD[7]);
      endShape();

      beginShape();
      vertex(this.leg2LD[0], this.leg2LD[1]);
      bezierVertex(this.leg2LD[2], this.leg2LD[3], this.leg2LD[4], this.leg2LD[5], this.leg2LD[6], this.leg2LD[7]);
      endShape();

      beginShape();
      vertex(this.leg2RU[0], this.leg2RU[1]);
      bezierVertex(this.leg2RU[2], this.leg2RU[3], this.leg2RU[4], this.leg2RU[5], this.leg2RU[6], this.leg2RU[7]);
      endShape();
    }
    pop();
  }

  changeAntSize(size) {
    for (let i = 0; i < 14; i++) {
      this.head[i] *= size;
    }
    for (let i = 0; i < 4; i++) {
      this.chest[i] *= size;
    }
    for (let i = 0; i < 14; i++) {
      this.body[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.antennaL[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.antennaR[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg0LU[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg0LD[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg0RU[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg0RD[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg1LU[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg1LD[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg1RU[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg1RD[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg2LU[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg2LD[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg2RU[i] *= size;
    }
    for (let i = 0; i < 8; i++) {
      this.leg2RD[i] *= size;
    }
  }
}
