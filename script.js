//=====  Fuctions
function setCanvas() {
  canvas.width = window.innerWidth * 0.4;
  canvas.height = window.innerHeight * 0.4;
}
//Animation
// function setCanvasAndAnimate() {
//   setCanvas();
//   animate2();
// }
//Random number between min and max
const randomMinMax = (min, max) =>
  Math.floor((max + 1 - min) * Math.random() + min);
//Round to 'digits' digits
const roundTo = (number, digits) =>
  Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
// Initiation
function init() {}

//*** Transformations Screen <-> Real coordinates.
//    p0 - transformation vector (in Screen scale)
//    scale = Real(m) / Screen (pixels)
//Transform from Real-world  coornates to Screen coordinates
const transformRealToScreen = (pr, p0, scale) => ({
  x: pr.x / scale + p0.x,
  y: pr.y / scale + p0.y,
});
const trs = transformRealToScreen;
//Transform from Screen coornates to Real-world coordinates
const tranformScreenToReal = (ps, p0, scale) => ({
  x: (ps.x - p0.x) * scale,
  y: (ps.y - p0.y) * scale,
});
const tsr = tranformScreenToReal;
//Draw a circle
function drawCircle(x, y, r, color) {
  c.beginPath();
  c.arc(x, y, r, 0, 2 * pi, false);
  c.fillStyle = color;
  c.fill();
}
//Draw a ftrame on canvas
function drawFrame(bodies) {
  // c.clearRect(0, 0, canvas.width, canvas.height);
  bodies.forEach((el) => el.draw());
}
//Calculation if and when bodies to be displayed
function step(calcsPerFrame) {
  let cpf = calcsPerFrame; //number of calc circles per frame
  function stopwatch() {
    if (count <= countMax) {
      if (!(count % cpf)) {
        drawFrame(bodies);
      }
      let logStringA = `${count}; ax=${bodies[1].ax.toExponential(2)}, ay=${bodies[1].ay.toExponential(2)} `;
      let logStringV = `vx=${bodies[1].vx.toExponential(2)}, vy=${bodies[1].vy.toExponential(2)}`;
      let logString = `x=${bodies[1].x.toExponential(2)}, y=${bodies[1].y.toExponential(2)}`;

      console.log(logStringA + '; ' + logStringV + '; ' + logString);
      count++;
      bodies.forEach((el) => {
        el.updateA();
        el.update();
      });
    } else {
      clearInterval(setIntId);
      console.log("continue");
    }
  }
  return stopwatch;
}
//==== End of Functions

//==== Listeneres
// window.addEventListener("mousemove", (event) => {
//   mouse.x = event.x;
//   mouse.y = event.y;
// });
window.addEventListener("resize", () => {
  setCanvas();
  init();
});

//==== Classes
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Body {
  constructor(id, name, R, M, x, y, vx, vy, color, exist) {
    this.id = id;
    this.name = name;
    this.R = R;
    this.M = M;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.exist = exist;
  }

  ax = 0;
  ay = 0;
  exist = true;

  draw() {
    const ps = trs({ x: this.x, y: this.y }, p0, scale);
    let R = this.R / scale;
    R = R >= minR ? R : minR;
    c.fillStyle = this.color;
    // c.font = "8px Arial";
    // c.fillText(
    //   `Real: x: ${this.x.toExponential(2)}, y: ${this.y.toExponential(2)}`,
    //   ps.x + R + 2,
    //   ps.y - 1
    // );
    // c.fillText(
    //   `Screen: x: ${ps.x.toPrecision(3)}, y: ${ps.y.toPrecision(3)}`,
    //   ps.x + R + 2,
    //   ps.y + 7
    // );
    drawCircle(ps.x, ps.y, R, 0, 2 * pi, false);
  }

  updateA() {
    let tmpAx = 0;
    let tmpAy = 0;

    bodies.forEach((el) => {
      if (el.id != this.id) {
        const distance2 = (el.x - this.x) ** 2 + (el.y - this.y) ** 2;
        tmpAx += (this.M * (el.x - this.x)) / distance2 ** 1.5;
        tmpAx += (this.M * (el.y - this.y)) / distance2 ** 1.5;
      }
    });
    this.ax = 0; //tmpAx;
    this.ay = 0; //tmpAy;
  }

  update() {
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
  updateDraw() {
    // this.update();
    // this.draw();
  }
}
//==== End of Classes

//==== Constants
//General constants
const pi = Math.PI;
const G = 6.6743e-11;
//Get canvas, contex and size it
const canvas = document.querySelector("canvas");
setCanvas();
const c = canvas.getContext("2d");
//Temporary project constants
const countMax = 10;
let count = 0;
const numberOfBodies = 1;

let dt = 2.6e6; //step for calculation (real world)
const interval = 1000;

const minR = 5; // 10px, min radius of the circle (on Screen)
const scaleMtoPX = 5.9e3; // Number of px in 1 m (for 150ppi)
const scaleRealToM = 1; // scale from Real World to 1 m
const scale = (2 * 3e11) / Math.min(canvas.width, canvas.height); //scaleRealToM * scaleMtoPX;
//Scele from Real World to 1 px, must be: = scaleRealToM * scaleMtoPX
const p0 = { x: canvas.width / 2 - 0, y: canvas.height / 2 };

//==== End of Constants

//==== Code to run

//Create array of bodies
const bodies = [];
// for (let i = 0; i < numberOfBodies; i++) {
//   const body = new Body(
//     i, // id
//     `Body${i}`, // mame
//     10, // R
//     1, // M
//     0, // x
//     0, // y
//     0, // vx
//     0, // vy
//     "red" // color
//   );
//   // body.draw();
//   bodies.push(body);
// }

bodies[0] = new Body(
  0, // id
  "Sun", // mame
  6.96e8, // R, in m
  2e30, // M, kg
  0, // x
  0, // y
  0, // vx
  0, // vy
  "red" // color
);
bodies[1] = new Body(
  1, // id
  "Earth", // mame
  6.376e6, // R, m
  2e30, // M, kg
  1.48e11, // x, m
  0, // y, m
  0, // vx, m/s
  -1e10, // vy, m/s
  "blue" // color
);

const stepVar = step(2);
const setIntId = setInterval(stepVar, interval);

// runCalcFrame();
//Mouse
// let mouse = {
//   x: undefined,
//   y: undefined,
// };
//const n = 0;

// for (let i = 0; i < 10; i++) {
//   console.log(
//     i,
//     "ax:",
//     bodies[n].ax,
//     "ay:",
//     bodies[n].ay,
//     "vx:",
//     bodies[n].vx,
//     "vy:",
//     bodies[n].vy,
//     "x:",
//     bodies[0].x,
//     "y:",
//     bodies[0].y
//   );

//   bodies.forEach((el) => el.updateA());

//   // console.log(
//   //   "ax:",
//   //   bodies[n].ax,
//   //   "ay:",
//   //   bodies[n].ay,
//   //   "vx:",
//   //   bodies[n].vx,
//   //   "vy:",
//   //   bodies[n].vy,
//   //   "x:",
//   //   bodies[0].x,
//   //   "y:",
//   //   bodies[0].y
//   // );

//   bodies.forEach((el) => el.update());
// }

// bodies.forEach((el) => el.draw());

// init();
