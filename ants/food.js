class Food {


  //   constructor() {
  //   //   this.x;
  //   //   this.y;
  //   //   this.w;
  //   //   this.h;
  //   // this.spotted;
  //   // this.foodColorNum;
  // }
  constructor(x, y, w, h, foodColorNum) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.foodColorNum = foodColorNum;
    this.spotted = false;
  }

  display() {
    stroke(0);
    fill(foodColors[this.foodColorNum]);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}
