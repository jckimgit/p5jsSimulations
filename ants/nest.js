class Nest {
  constructor() {
    this.storageSize = 4;
    this.rows = floor(nestHeight / this.storageSize);
    this.cols = floor(nestWidth / this.storageSize);
    this.storages = new Array(this.rows).fill(null).map(row => new Array(this.cols).fill(null)); // define two dimensional array
    this.unoccupied = [];
  }

  run() {
    this.display();
    this.displayStorages();
  }

  store(f) {
    if (this.storages[0][0] === null) {
      f.x = nestX - nestWidth/2 +2;
      f.y = nestY + nestHeight/2 - this.storageSize -2;
      this.storages[0][0] = f;
      this.unoccupied[0] = 0;
      this.unoccupied[1] = 1;
    }
    else {
      f.x = nestX - nestWidth / 2 + this.storageSize * this.unoccupied[1] +2;
      f.y = nestY + nestHeight/2 - this.storageSize * this.unoccupied[0] - this.storageSize -2;
      this.storages[this.unoccupied[0]][this.unoccupied[1]] = f;
      this.unoccupied[1]++;
      if (this.unoccupied[1] == this.cols-1 ) {
        this.unoccupied[0]++;
        this.unoccupied[1] = 0;
      }
    }
  }

  display(){
    stroke(0);
    fill(nestColor);
    rectMode(CENTER);
    rect(nestX, nestY, nestWidth, nestHeight);
  }

  displayStorages() {
    for (let j = 0; j < this.cols - 1; j++) {
      for (let i = 0; i < this.rows - 1; i++) {
        if (this.storages[i][j] !== null) {
          let f = this.storages[i][j];
          fill(foodColors[f.foodColorNum]);
          rectMode(CORNER);
          rect(f.x, f.y, f.w, f.h);
        }
      }
    }
  }
}
