//=====  Fuctions
function setCanvas() {
  // canvas.width = graph.offsetWidth;
  // canvas.height = graph.offsetHeight;
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
function playFromLastPoint() {
  //Get canvas, contex and size it
  graph = document.getElementById("graph");
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth * 0.5;
  canvas.height = window.innerHeight * 0.5;
  c = canvas.getContext("2d");
  //Set  main viewPort
  viewPortMain = new ViewPort(
    canvas.width,
    canvas.height,
    10,
    10,
    10,
    10,
    "#000011",
    1,
    "#dddddd"
  );
  setProjectData();
  viewPortMain.draw();

  console.log(viewPortMain);
  stepVar = step(calcsPerFrame);
  setIntId = setInterval(stepVar, interval);
}

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

//General transform from B to A (up)
//scale = unit_segmentB / unit_segmentA
//Перетворення координат з коорд. системи В в коорд. систему А
//scale - відношення одиничного відрізка в В до одиничного в А
//рВ - радіус-вектор точки в системі В
//р0 - радіус-вектор початку коорд. системи В в системі А
//dirX, dirY = 1 або -1 (співнаправлені або протилежно направлені осі)
const transformBtoA = (pB, p0, scale, dirX, dirY) => ({
  x: p0.x + (dirX * pB.x) / scale,
  y: p0.y + (dirY * pB.y) / scale,
});

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
        viewPortMain.draw();
        drawFrame(bodies);
        outputBodyParams(
          bodies[1].name,
          out1,
          "x / y / r (m): ",
          bodies[1].x,
          bodies[1].y,
          out2,
          "vx / vy / v (m/s): ",
          bodies[1].vx,
          bodies[1].vy,
          out3,
          "ax / ay / a (m/s^2): ",
          bodies[1].ax,
          bodies[1].ay,
          out4
        );
      }
      // let logStringA = `${count}; ax=${bodies[1].ax.toExponential(2)}, ay=${bodies[1].ay.toExponential(2)} `;
      // let logStringV = `vx=${bodies[1].vx.toExponential(2)}, vy=${bodies[1].vy.toExponential(2)}`;
      // let logString = `x=${bodies[1].x.toExponential(2)}, y=${bodies[1].y.toExponential(2)}`;

      // console.log(logStringA + '; ' + logStringV + '; ' + logString);
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
function output2numbers(lable, numberX, numberY, destination, precision) {
  const strX = numberX.toExponential(precision);
  const strY = numberY.toExponential(precision);
  const strR = Math.sqrt(numberX ** 2 + numberY ** 2).toExponential(precision);
  destination.innerHTML = lable + strX + " / " + strY + " / " + strR;
}
function outputBodyParams(
  bodyName,
  outName,
  lableR,
  x,
  y,
  outR,
  lableV,
  vx,
  vy,
  out2,
  lableA,
  ax,
  ay,
  out3,
  precision
) {
  outName.innerHTML = bodyName;
  output2numbers(lableR, x, y, outR, 2);
  output2numbers(lableV, bodies[1].vx, bodies[1].vy, out2, 2);
  output2numbers(lableA, bodies[1].ax, bodies[1].ay, out3, 2);
}

//==== End of Functions

//==== Listeneres
// window.addEventListener("mousemove", (event) => {
//   mouse.x = event.x;
//   mouse.y = event.y;
// });
window.addEventListener("resize", () => {
  playFromLastPoint();
});

//==== Classes
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class ViewPort {
  constructor(
    canvasWidth,
    canvasHeight,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    backgroundColor,
    lineWidth,
    lineColor
  ) {
    this.backgroundColor = backgroundColor;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.topLeft = new Point(paddingLeft + lineWidth, paddingTop + lineWidth);
    this.width = canvasWidth - paddingLeft - paddingRight - 2 * lineWidth;
    this.height = canvasHeight - paddingTop - paddingBottom - 2 * lineWidth;
  }
  draw() {
    c.fillStyle = this.backgroundColor;
    c.strokeStyle = this.lineColor;
    c.lineWidth = this.lineWidth;
    c.rect(
      this.topLeft.x - this.lineWidth / 2,
      this.topLeft.y - this.lineWidth / 2,
      this.width + this.lineWidth,
      this.height + this.lineWidth
    ); //Так товщини лінії додаються до paddings
    c.stroke();
    c.fillRect(this.topLeft.x, this.topLeft.y, this.width, this.height); //Заливка тільки для vewPort
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
    const ps = transformBtoA({ x: this.x, y: this.y }, p0, scale, 1, -1);
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
        tmpAx += (el.M * G * (el.x - this.x)) / distance2 ** 1.5;
        tmpAy += (el.M * G * (el.y - this.y)) / distance2 ** 1.5;
        // console.log(count);
      }
    });
    this.ax = tmpAx;
    this.ay = tmpAy;
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
//General project constants
const numberOfBodies = 2;
const countMax = 360;
let minR = 30; // 10px, min radius of the circle (on Screen)

//Temporary project constants

let count = 0;

let dt = 8.64e4; //step for calculation (real world)
const interval = 100;
const calcsPerFrame = 5;

//Variables to be resized
let graph;
let canvas;
let c; // = canvas.getContext("2d");

let viewPortMain;
// = 3; // 10px, min radius of the circle (on Screen)
let scaleMtoPX; // = 5.9e3; // Number of px in 1 m (for 150ppi)
let scaleRealToM; // = 1; // scale from Real World to 1 m
let scale; // = (1.2 * 3e11) / Math.min(viewPortMain.width, viewPortMain.height); //scaleRealToM * scaleMtoPX;
//Scele from Real World to 1 px, must be: = scaleRealToM * scaleMtoPX
let p0 = { x: 0, y: 0 };

function setProjectData() {
  scaleMtoPX = 5.9e3; // Number of px in 1 m (for 150ppi)
  scaleRealToM = 1; // scale from Real World to 1 m
  scale = (1.2 * 3e11) / Math.min(viewPortMain.width, viewPortMain.height); //scaleRealToM * scaleMtoPX;
  //Scele from Real World to 1 px, must be: = scaleRealToM * scaleMtoPX
  p0 = { x: canvas.width / 2 - 0, y: canvas.height / 2 };
}

let data = {
  timing: {
    dt: 8.64e4, //step for calculation (real world)
    interval: 100, //interval in function setInterval
    calcsPerFrame: 5, //calculations per a drawing frame
  },
  
  scale: {
    scaleMtoPX: 5.9e3, // Number of px in 1 m (for 150ppi)
    scaleRealToM: 1, // scale from Real World to 1 m
    scale: (1.2 * 3e11) / Math.min(viewPortMain.width, viewPortMain.height), //scaleRealToM * scaleMtoPX;
    //Scele from Real World to 1 px, must be: = scaleRealToM * scaleMtoPX
      
  },
    canvas:{},
  position: {
    p0: { x: canvas.width / 2 - 0, y: canvas.height / 2 },

  },

  viewPort: {
    paddingTop: 10, 
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: "#000011",
    lineWidth: 1,
    lineColor: "#dddddd",
  },
};
//==== End of Constants

//==== Code to run
let stepVar = step(calcsPerFrame);
playFromLastPoint();
const out1 = document.getElementById("out1");
const out2 = document.getElementById("out2");
const out3 = document.getElementById("out3");
const out4 = document.getElementById("out4");

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
  10 * 6.96e8, // R, in m
  2e30, // M, kg
  0, // x
  0, // y
  0, // vx
  0, // vy
  "yellow" // color
);
bodies[1] = new Body(
  1, // id
  "Earth", // mame
  6.376e6, // R, m
  6e24, // M, kg
  1.48e11, // x, m
  0, // y, m
  0, // vx, m/s
  3e4, // vy, m/s
  "lightblue" // color
);

//____________   Test section

// viewPortMain.draw();

//____________   End of Test section

var setIntId; // = setInterval(stepVar, interval);

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
