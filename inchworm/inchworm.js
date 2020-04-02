class Inchworm {

  constructor() {
    this.len = 40;
    this.pushAnchor = null;
    this.pullAnchor = null;
    this.segments =  [];
    this.leftward = true;
    this.bPush = true;
    this.xPush = 1;
    this.xPull = 1;
    this.makeBodies();
  }

  makeBodies() {
    let s = new Segment(new p5.Vector(width/2, height/2));
    s.end = s.start.copy().add(new p5.Vector(this.len, 0));
    this.segments[0] = s;
    for (let i = 1; i < 4; i++) {
      s = new Segment(this.segments[i-1].end);
      s.end = p5.Vector.add(s.start, new p5.Vector(this.len, 0));
      this.segments[i] = s;
    }
  }

  push() {
    let idxAnchor = 0;
    let idxPush = 0;
    let idxTail = 0;
    let shift = 0;
    if (this.leftward) {
      idxAnchor = 1;
      idxPush = 2;
      idxTail = 3;
      shift = -this.xPush;
    } else {
      idxAnchor = 2;
      idxPush = 1;
      idxTail = 0;
      shift = this.xPush;
    }
    this.pushAnchor = this.segments[idxAnchor].start;
    this.segments[idxPush].end =
    p5.Vector.add(this.segments[idxPush].end, new p5.Vector(shift, 0));
    let lenBetween = (p5.Vector.sub(this.segments[idxPush].end, this.pushAnchor).mag()) / 2.0;
    let angle = Math.acos(lenBetween/this.len);
    if (this.leftward) {
      angle += PI;
    } else {
      angle *= -1;
    }
    this.segments[idxPush].start = p5.Vector.add(this.segments[idxPush].end,
      new p5.Vector(this.len*Math.cos(angle), this.len*Math.sin(angle)));
      this.segments[idxAnchor].end.x = this.segments[idxPush].start.x;
      this.segments[idxAnchor].end.y = this.segments[idxPush].start.y;
      this.segments[idxTail].start.x = this.segments[idxPush].end.x;
      this.segments[idxTail].start.y = this.segments[idxPush].end.y;
      this.segments[idxTail].end = p5.Vector.add(this.segments[idxTail].end, new p5.Vector(shift, 0));
      if (lenBetween < 0.15* this.len) {
        this.pullAnchor = this.segments[idxPush].end;
        this.bPush = false;
      }
    }

    pull() {
      let idxAnchor = 0;
      let idxPull = 0;
      let idxHead = 0;
      let shift = 0;
      if (this.leftward) {
        idxAnchor = 2;
        idxPull = 1;
        idxHead = 0;
        shift = -this.xPull;
      } else {
        idxAnchor = 1;
        idxPull = 2;
        idxHead = 3;
        shift = this.xPull;
      }
      this.pullAnchor = this.segments[idxAnchor].end;
      this.segments[idxPull].start = p5.Vector.add(this.segments[idxPull].start, new p5.Vector(shift, 0)); //move body 1's start to the left by y
      this.segments[idxHead].end.x = this.segments[idxPull].start.x;
      this.segments[idxHead].end.y = this.segments[idxPull].start.y;
      this.segments[idxHead].start = p5.Vector.add(this.segments[idxHead].start, new p5.Vector(shift, 0));
      let lenBetween = (p5.Vector.sub(this.segments[idxPull].start, this.pullAnchor).mag())/2;
      let angle = Math.acos(lenBetween/this.len);
      if (this.leftward)
      angle *= -1;
      else
      angle += PI;
      this.segments[idxPull].end = p5.Vector.add(this.segments[idxPull].start, new p5.Vector(this.len*cos(angle), this.len*sin(angle)));
      this.segments[idxAnchor].start.x = this.segments[idxPull].end.x;
      this.segments[idxAnchor].start.y = this.segments[idxPull].end.y;
      if (lenBetween > this.len*0.92) {
        this.bPush = true;
        this.pushAnchor = this.segments[idxPull].start;
      }
    }

    borders() {
      if (this.segments[0].start.x <= 0)
      this.leftward = false;
      else if (this.segments[3].start.x >= width)
      this.leftward = true;
      if (this.segments[0].start.x <= 0 || this.segments[3].start.x >= width) {
        this.bPush = true;
        this.backward();
      }
    }

    backward() {
      let temp = [];
      for (let i = 0; i < 4; i++) {
        let t = new p5.Vector(this.segments[i].end.x, this.segments[i].end.y);
        temp[i] = t;
        this.segments[i].end.x = this.segments[i].start.x;
        this.segments[i].end.y = this.segments[i].start.y;
        this.segments[i].start.x = temp[i].x;
        this.segments[i].start.y = temp[i].y;
      }
    }

    run() {
      if (this.bPush)
      this.push();
      else
      this.pull();
      if (this.leftward) {
        for (let i = 0; i < 4; i++) {
          this.segments[i].show();
        }
      } else {
        for (let i = 3; i >= 0; i--) {
          this.segments[i].show();
        }
      }
      this.borders();
    }
  }
