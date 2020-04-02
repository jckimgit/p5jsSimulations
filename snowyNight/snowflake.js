class Snowflake extends VerletParticle2D {

  constructor(loc, size, birth) {
    super(loc);
    this.size = size;
    this.birth = birth;
    this.death = frameCount + Math.round(random(3000, 4000));
    this.grabbings = Math.round(random(2, 5));
    this.angle = random(0, PI);
  }

  coalesce(p) {
    let delta = this.sub(p);
    let dist = delta.magnitude(); // Distance between grabber and p
    if (dist < minDist) { // If p is close enoguh, grab it by a spring.
      let springs = getSprings(this);
      if (springs.length < this.grabbings) {
        let s = new VerletSpring2D(this, p, restLength, strength);
          physics.addSpring(s);
      }
    }
  }

  show() {
    fill(255);
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    star(0, 0, this.size / 3, this.size / 2.2, 6);
    pop();
  }
}
