// function ft(x) {
//   let X = [];
//   for (let k = 0; k < numSamples; k++) {
//     let re = 0;
//     let im = 0;
//     for (let n = 0; n < numSamples; n++) {
//       let phi = (-TWO_PI * k * n) / numSamples;
//       re += x[n] * cos(phi);
//       im += x[n] * sin(phi);
//     }
//
//     let freq = k;
//     let amp = sqrt(re * re + im * im);
//     let phase = atan2(im, re);
//     X[k] = {re, im, freq, amp, phase};
//   }
//   return X;
// }

function ft(x) {
  let X = [];
  for (let k = 0; k < x.length; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < x.length; n++) {
      let phi = (-TWO_PI * k * n) / x.length;
      re += x[n] * cos(phi);
      im += x[n] * sin(phi);
    }

    let freq = k;
    let amp = sqrt(re * re + im * im);
    let phase = atan2(im, re);
    X[k] = {re, im, freq, amp, phase};
  }
  return X;
}

function ift(X) {
  const x = [];

  for (let n = 0; n < numSamples; n++) {
    let re = 0;
    let im = 0;
    for (let k = 0; k < numSamples; k++) {
      const psi = (TWO_PI * k * n) / numSamples;
      re += X[k].re * cos(psi) - X[k].im * sin(psi);
      im += X[k].re * sin(psi) + X[k].im * cos(psi);
    }

    re /= numSamples;
    im /= numSamples;
    x[n] = {re, im};
  }
  return x;
}
