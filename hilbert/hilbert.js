let order;
let off, size;
let hMatrix, positions; // elements of hMatrix are converted into positions on the canvas
let drawingType;
let prevs = []; // for drawing successive drawing
let randomness;
let square = true;
let numStop = 0; // # of successive lines drawn
let hMatrixGenerated = false;
let converted = false;
let pause = true;
let init = 0;
let initTime;
let cnv;

function setup() {
    cnv = createCanvas(600, 600);
    cnv.parent('canvas');
}

function draw() {
    background(0);
    let button = select('#run');
    button.mousePressed(run);
    if (!pause) {
        strokeWeight(1);
        revs = [];
        if (drawingType == 1 && frameCount == positions.length + initTime) {
            noLoop();
        }
        drawLines();
    }
}

function run() {
    if (init == 0) {
        let slider = select('#order');
        order = slider.elt.value;
        select('#order').elt.disabled = true;
        slider = select('#randomness');
        randomness = slider.elt.value;
        select('#randomness').elt.disabled = true;
        let square0 = select('#s0');
        let triangle = select('#s1');
        square = (square0.elt.checked) ? square = true : square = false;
        let allAtOnce = select('#d0');
        let successive = select('#d1');
        drawingType = (allAtOnce.elt.checked) ? 0 : 1;
        square0.elt.disabled = true;
        triangle.elt.disabled = true;
        allAtOnce.elt.disabled = true;
        successive.elt.disabled = true;

        off = width * 0.05;
        size = (width - 2 * off) / (pow(2, order) - 1);
        generateHMatrix(order);
        if (converted) {
            hMatrix = [];
        }
        select('#run').elt.disabled = true;
        pause = false;
        init++;
        initTime = frameCount;
    }
    
}

function keyPressed() {
    if (key == 'R') {
        background(0);
        draw();
    }
    if (key == 'P') {
        pause = !pause;
    }
}

function generateHMatrix(ord) {
    if (ord > 1) {
        generateHMatrix(ord - 1);
        let { hMatrix0, hMatrix1, hMatrix2, hMatrix3 } = createSubMatrices();
        hMatrix = conjoin(hMatrix0, hMatrix1, hMatrix2, hMatrix3);
    } else {
        hMatrix = [[1, 2], [0, 3]]; // initially, lines move from 0 to 1, 1 to 2 and 2 to 3, that is, up, right and down on the Cartesian coordinates
    }
    if (hMatrixGenerated) {// if the hmatrix is generated, determine positions on the canvas to draw connecting lines
        convertPositions();
    }
}

function createSubMatrices() { // top left, top right, bottom left, bottom right submatrices
    let len = hMatrix.length;;
    let num = len * len;
    let hMatrix0 = clone(hMatrix); // top left
    let hMatrix1 = clone(hMatrix); // top right
    let hMatrix2 = transpose(hMatrix, 1); // bottom left
    for (let i = 0; i < len; i++) { // modify the elements of bottom left submatrix 
        for (let j = 0; j < len; j++) {
            hMatrix2[i][j] = num - 1 - hMatrix2[i][j];
        }
    }
    let hMatrix3 = transpose(hMatrix, 0); // bottom right
    hMatrix0 = add(hMatrix0, num); // add numbers to elements of submatrices 0, 1, and 3 to make them consecutive
    hMatrix1 = add(hMatrix1, 2 * num);
    hMatrix3 = add(hMatrix3, 3 * num);
    return { hMatrix0, hMatrix1, hMatrix2, hMatrix3 };
}

function conjoin(m0, m1, m2, m3) { // put together four square submatrices into a larger square matrix
    let len = m0.length;
    let matrix = createMatrix(2 * len, 2 * len);
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            matrix[i][j] = m0[i][j];
        }
        for (let j = len; j < 2 * len; j++) {
            matrix[i][j] = m1[i][j - len];
        }
    }
    for (let i = len; i < 2 * len; i++) {
        for (let j = 0; j < len; j++) {
            matrix[i][j] = m2[i - len][j];
        }
        for (let j = len; j < 2 * len; j++) {
            matrix[i][j] = m3[i - len][j - len];
        }
    }
    hMatrixGenerated = true;
    return matrix;
}

function convertPositions() {
    let num = hMatrix.length * hMatrix.length;
    positions = [];
    for (let i = 0; i < num; i++) { // find row and column positions of elements of conjoined matrix, hMatrix 
        let pos = findPosition(i);
        positions.push(pos); //console.log(i, pos, positions);
    }
    for (let pos of positions) { // convert a position in hMatrix into a point on cartesian coordinates. row number represents the distance on y coordinate amd column number that on x coordinate.
        let temp;
        temp = pos[0];
        pos[0] = pos[1];
        pos[1] = temp;
    }

    for (let i = 0; i < positions.length; i++) { // strectch coordinates to fit the canvas. size: horizontal or vertical distance between two points. off: the distance between the edges of the canvas and the hilbert curve. For example, start point corresponds to (3, 0) of hMatrix. If size = 100 and off = 30, on the Cartesian plane, its coordinate is (30, 330) 
        let rnd = random(-randomness / order, randomness / order);
        positions[i] = positions[i].map((val) => (val + rnd) * size + (off + rnd));
    }

    if (!square) {
        triangularize();
    }
}

function createMatrix(numRows, numCols) { // make a matrix with 0's filled
    return new Array(numRows).fill(0).map(() => new Array(numCols).fill(0))
}

function clone(matrix) { // (deep)copy a matrix
    return matrix.map((row) => row.map(ele => ele));
}

function add(matrix, num) { // add num to each element of matrix
    return matrix.map((row) => row.map(ele => ele + num));
}

function transpose(matrix, type) { // transpose a matrix
    if (type == 0) {
        return newMatrix = matrix[0].map((_, i) => matrix.map(row => row[i])); // normal
    } else if (type == 1) {
        return newMatrix = matrix[0].map((_, i) => matrix.map(row => row[i]).reverse()); // reverse
    }
}

function findPosition(num) { // row and column numbers of an element of hMatrix
    let pos = [];
    let len = hMatrix.length;
    loop:
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (hMatrix[i][j] == num) {
                pos.push(i);
                pos.push(j);
                break loop;
            }
        }
    }
    return pos;
}

function linearCombination(arr0, arr1, a, b) { // linear combination of two arrays
    let vec0 = createVector(arr0[0], arr0[1]);
    let vec1 = createVector(arr1[0], arr1[1]);
    vec0.mult(a);
    vec1.mult(b);
    vec0.add(vec1);
    return [vec0.x, vec0.y];
}

function triangularize() {
    for (let i = 1; i < positions.length; i += 4) {
        if (i % 4 == 1) {
            let temp = linearCombination(positions[i], positions[i + 1], 0.5, 0.5);
            positions[i] = temp;
            positions[i + 1] = temp;
        }
    }
}

function drawLines() {
    let len = (drawingType == 0) ? positions.length : frameCount - initTime; 
    for (let i = 0; i < len - 1; i++) {
        let iprime = i % 4;
        let from = color(255);
        let to = color(0, 255, 0);
        let inter = lerpColor(from, to, iprime / 3);
        stroke(inter);
        let prev = positions[i];
        let curr = positions[i + 1];
        line(prev[0], prev[1], curr[0], curr[1]);
    }
}
