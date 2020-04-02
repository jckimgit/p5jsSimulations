/* Out of numbers from 0 to n - 1, r numbers are randomly selected. */

class Combination {
  constructor(n, r) {
    this.n = n;
    this.r = r;
    this.combinations = [];
    this.arr = [];
  }

  getCombination() { // A randomly selected combination from all this.combinations.
    this.findCombinations(0, this.r, 0);
    let combi = null;
    let num = this.getNumCombinations(this.n, this.r);
    let r = random(1);
    let interval = 1.0 / num;
    for (let i = 0; i < num; i++) {
      if (r >= i * interval && r < (i + 1) * interval) {
        combi = this.combinations[i];
        break;
      }
    }
    return combi;
  }

  findCombinations(index, r, target) {
    if (r == 0) {
      let a = this.arr.slice();
      this.combinations.push(a);
    } else {
      if (target == this.n) {
        return;
      } else {
        this.arr[index] = target;
        this.findCombinations(index + 1, r - 1, target + 1);
        this.findCombinations(index, r, target + 1);
      }
    }
  }

  getNumCombinations(n, r) { // The number of all possible combinations.
    let num = 0;
    if (n == r || r == 0) {
      num =  1;
    } else {
      num = this.getNumCombinations(n - 1, r - 1) + this.getNumCombinations(n - 1, r);
    }
    return num;
  }
}
