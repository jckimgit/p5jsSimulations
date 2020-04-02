class Monitor {
  constructor() {
    this.pheroDropsToFood = [];
    this.pheroDropsToNest = [];
  }

  run() {
    for (let p of this.pheroDropsToFood) {
      p.display(pheroColorToFood);
    }
    for (let p of this.pheroDropsToNest) {
      p.display(pheroColorToNest);
    }
    this.updatePhero();
  }

  findFood(loc, vel) {
    let foodFound = new Food();

    foodFound.x = -1;
    foodFound.y = -1;
    for (let f of foodSite) {
      if (!f.spotted) {
        let fLoc = new p5.Vector(f.x, f.y);
        if (p5.Vector.dist(fLoc, loc) < 80 && vel.angleBetween(fLoc.sub(loc)) < PI / 2) {
          foodFound = f;
          break;
        }
      }
    }
    return foodFound;
  }

  updatePhero() { // pheromone is completely evaporated if evaporation > 255
    for (let i = this.pheroDropsToFood.length - 1; i >= 0; i--) {
      let p = this.pheroDropsToFood[i];
      p.evaporate();
      if (p.evaporation >= 255) {
        this.pheroDropsToFood.splice(i, 1);
      }
    }
    for (let i = this.pheroDropsToNest.length - 1; i >= 0; i--) {
      let p = this.pheroDropsToNest[i];
      p.evaporate();
      if (p.evaporation >= 255) {
        this.pheroDropsToNest.splice(i, 1);
      }
    }
  }

  findPhero(loc, vel, s) {
    let pheroFound = new Pheromon();
    pheroFound.x = -1.0;
    pheroFound.y = -1.0;

    if (s == "food") {
      for (let p of this.pheroDropsToFood) {
        if (p.evaporation < 150) {
          let pLoc = new p5.Vector(p.x, p.y);
          if (p5.Vector.dist(pLoc, loc)  < 100 && vel.angleBetween(p5.Vector.sub(pLoc, loc)) < angleToFood) {//
            pheroFound = p;
            break;
          }
        }
      }
    }
    else if (s == "nest") {
      for (let p of this.pheroDropsToNest) {
        if (p.evaporation < 150) {
          let pLoc = new p5.Vector(p.x, p.y);
          if (p5.Vector.dist(pLoc, loc)  < 70 && vel.angleBetween(p5.Vector.sub(pLoc, loc)) <= angleToNest) {
            pheroFound = p;
            break;
          }
        }
      }
    }
    return pheroFound;
  }

  inNest(tgt) {
    let x0 = nestX - nestWidth / 2;
    let x1 = nestX + nestWidth / 2;
    let y0 = nestY - nestHeight / 2;
    let y1 = nestY + nestHeight / 2;

    if (tgt.x > x0 && tgt.x < x1 && tgt.y > y0 && tgt.y < y1) {
      return true;
    }
    else {
      return false;
    }
  }

  nearNest(loc) {
    let l = new p5.Vector(nestX, nestY);

    if (p5.Vector.dist(loc, l) < 70) {
      return true;
    }
    else {
      return false;
    }
  }


  //boolean inNest(p5.Vector tgt) {
  //  boolean in = false;
  //  //float x = nestX;
  //  //float y = nestY;
  //  //float w = nestWidth;
  //  //float h = nestHeight;

  //  float x0 = nestX - nestWidth/2;
  //  float x1 = nestX + nestWidth/2;
  //  float y0 = nestY - nestHeight/2;
  //  float y1 = nestY + nestHeight/2;

  //  //x = nestX;
  //  //y = nestY;
  //  //w = nestWidth;
  //  //h = nestHeight;

  //  if (tgt.x >= x0 && tgt.x <= x1 && tgt.y >= y0 && tgt.y <= y1) {
  //    in = true;
  //  }
  //  return in;
  //}

  ////boolean inNest(p5.Vector tgt) {
  ////  boolean in = false;
  ////  float x =0;
  ////  float y = 0;
  ////  float w = 0;
  ////  float h = 0;

  ////  x = nestX;
  ////  y = nestY;
  ////  w = nestWidth;
  ////  h = nestHeight;

  ////  if (tgt.x >= x - w/2 && tgt.x <= x + w/2
  ////    && tgt.y >= y - h/2 && tgt.y <= y + h/2) {
  ////    in = true;
  ////    }
  ////  return in;
  ////}

  //boolean nearNest(p5.Vector loc) {
  //  boolean near = false;
  //  if (p5.Vector.dist(loc, new p5.Vector(nestX, nestY)) < 70)
  //    near = true;
  //    return near;
  //}
}
