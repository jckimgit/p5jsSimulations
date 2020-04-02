class CalcImpulse {
  constructor (p, q, restitution) {//Formular for calculating one dimensional impulse.
    this.p = p;
    this.q = q;
    this.restitution = restitution;
    this.findUnitVectors();
  }

  findUnitVectors() {
    let n = this.q.loc.sub(this.p.loc);
    this.normal = n.scale(1.0 / n.magnitude());
    this.tangent = new Vec2D(-this.normal.y, this.normal.x);
  }

  findImpulse() {
    //Decompse velocity by projecting it on the normal and the tange vetor.
    let np = this.normal.dot(this.p.vel); // The magnitude of projected vector on unit normal vector or the speed into the direction of the normal vector.
    let tp = this.tangent.dot(this.p.vel);
    let nq = this.normal.dot(this.q.vel);
    let tq = this.tangent.dot(this.q.vel);
    // New velocity after one dmensional collision along the direction of the nomal vector
    let newSpeedNormal = (np * (this.p.mass - this.q.mass)
    + this.q.mass * ((1.0 - this.restitution) * np
    + (1 + this.restitution) *  nq)) / (this.p.mass + this.q.mass);
    let newVelNormal = this.normal.scale(newSpeedNormal);
    // New velocity along the direction of the nomal vector, which is not affected by collision
    let newVelTangent = this.tangent.scale(tp);
    let newVel = newVelNormal.add(newVelTangent);
    let imp = newVel.sub(this.p.vel).scale(this.p.mass);
    return imp;

    /* Formular for calculating one dimensional impulse. v1 = ((m1 - m2) * u1 + m2 * ((1 - e) * u1 + u2 * (1 + e)) / (m1 + m2). e: restitution
    */
  }
}
