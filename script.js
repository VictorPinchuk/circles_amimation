//==== Constants
//General constants
const pi = Math.PI;
const G = 6.6743e-11;
//General project constants
const numberOfBodies = 2;
let minR = 3; // 10px, min radius of the circle (on Screen)
//Temporary project constants
const countMax = 10;
let count = 0;
// let dt = 8.64e4; //step for calculation (real world)
const interval = 100;
const calcsPerFrame = 5;
// const viewPortPadding = 10;
// const viewPortBackgroundColor = "#000011";
// const viewPortlineWidth = 1;
// const viewPortlineColor = "#dddddd";

//Variables to be resized
//let data = {
  // bodies: [],
  // canvas: undefined,
  // origin: {},
  // scaleFactor: undefined,
  // dt: undefined,
  // updateBodiesA() {
  //   this.bodies.forEach((el) => {
  //     let tmpAx = 0;
  //     let tmpAy = 0;
  //     this.bodies.forEach((i) => {
  //       if (el.id != i.id) {
  //         const distance2 = (i.x - el.x) ** 2 + (i.y - el.y) ** 2;
  //         tmpAx += (i.M * G * (i.x - el.x)) / distance2 ** 1.5;
  //         tmpAy += (i.M * G * (i.y - el.y)) / distance2 ** 1.5;
  //       }
  //     });
  //     el.ax = tmpAx;
  //     el.ay = tmpAy;
  //   });
  // },
//   updateBodies() {
//     this.bodies.forEach((el) => el.update());
//   },
//   async drawCanvas() {
//     const c = await this.canvas.getContext("2d");
//     c.fillStyle = "#080808";
//     c.fillRect(0, 0, canvas.width, canvas.height);
//     //console.log("canvas.width in drawCanvas:" + canvas.width);
//   },
//   drawBodies() {
//     this.bodies.forEach((el) => el.draw());
//   },
// };

// //=====  Fuctions

// //General transform from B to A (up)
// //scale = unit_segmentB / unit_segmentA
// //Перетворення координат з коорд. системи В в коорд. систему А
// //scale - відношення одиничного відрізка в В до одиничного в А
// //рВ - радіус-вектор точки в системі В
// //р0 - радіус-вектор початку коорд. системи В в системі А
// //dirX, dirY = 1 або -1 (співнаправлені або протилежно направлені осі)
const transformBtoA = (pB, p0, scale, dirX, dirY) => ({
  x: p0.x + (dirX * pB.x) / scale,
  y: p0.y + (dirY * pB.y) / scale,
});
//Draw a circle
function drawCircle(c, x, y, r, color) {
  c.beginPath();
  c.arc(x, y, r, 0, 2 * pi, false);
  c.fillStyle = color;
  c.fill();
}

// //==== End of Functions

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
  printR() {
    console.log(this.R);
  }
  draw() {
    const scale = data.scaleFactor / Math.min(canvas.width, canvas.height);
    const ps = transformBtoA(
      { x: this.x, y: this.y },
      data.origin,
      scale,
      1,
      -1
    );
    // console.log("ps in draw()= ", ps);
    //console.log("canvas -", data.canvas.width, data.canvas.height);
    const ctx = data.canvas.getContext("2d");

    let R = this.R / scale;
    R = R >= minR ? R : minR;
    ctx.fillStyle = this.color;
    drawCircle(ctx, ps.x, ps.y, R, this.color);
  }

  update() {
    const dt = data.dt;
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}
class Data {
  constructor(bodies, canvas, origin, scaleFactor, dt) {
    (this.bodies = [...bodies]),
      (this.canvas = canvas),
      (this.origin = { ...origin }),
      (this.scaleFactor = scaleFactor),
      (this.dt = dt);
  }
  updateBodiesA() {
    this.bodies.forEach((el) => {
      let tmpAx = 0;
      let tmpAy = 0;
      this.bodies.forEach((i) => {
        if (el.id != i.id) {
          const distance2 = (i.x - el.x) ** 2 + (i.y - el.y) ** 2;
          tmpAx += (i.M * G * (i.x - el.x)) / distance2 ** 1.5;
          tmpAy += (i.M * G * (i.y - el.y)) / distance2 ** 1.5;
        }
      });
      el.ax = tmpAx;
      el.ay = tmpAy;
    });
  }
  updateBodies() {
    this.bodies.forEach((el) => el.update());
  }
  drawCanvas() {
    const c = this.canvas.getContext("2d");
    c.fillStyle = "#080808";
    c.fillRect(0, 0, canvas.width, canvas.height);
    //console.log("canvas.width in drawCanvas:" + canvas.width);
  }
  drawBodies() {
    this.bodies.forEach((el) => el.draw());
  }
}
// //==== End of Classes

// //==== Code to run

function setData(data) {
  // data = (dataDefault);
  // setDataSizeScale(data);
  // setDataBodies(data);
  // setDataTiming(data);
}

function setDataSizeScale(data) {
  const graph = document.getElementById("graph");
  data.canvas = document.getElementById("canvas");
  data.canvas.width = 0.9 * graph.clientWidth;
  data.canvas.height = 0.9 * graph.clientHeight;
  //console.log("graphClientWidth=" + graph.clientWidth);
  //console.log('data.canvas.width= ', data.canvas.width);

  data.origin = { x: data.canvas.width / 2, y: data.canvas.height / 2 };
  data.scaleFactor = 1.2 * 8e11; // scale = scaleFactor / Math.min(viewPortMain.width, viewPortMain.height)
}
function setDataBodies(data) {
  const bodies = [];
  const name0 = "Sun";
  const R0 = 15 * 6.96e8; // R, in m
  const M0 = 2e30; // M, kg
  const x0 = 0; // x, m
  const y0 = 0; // y, m
  const vx0 = 0; // vx, m/s
  const vy0 = 0; // vy, m/s
  const color0 = "yellow";
  let body = new Body(0, name0, R0, M0, x0, y0, vx0, vy0, color0);
  bodies.push(body);
  const name1 = "Earth";
  const R1 = 15 * 6.376e6; // R, in m
  const M1 = 6e24; // M, kg
  const x1 = 1.48e11; // x, m
  const y1 = 0; // y, m
  const vx1 = 0; // vx, m/s
  const vy1 = 3e4; // vy, m/s
  const color1 = "lightblue";
  body = new Body(1, name1, R1, M1, x1, y1, vx1, vy1, color1);
  bodies.push(body);
  const name2 = "PlanetX";
  const R2 = 15 * 8.0e6; // R, in m
  const M2 = 8e24; // M, kg
  const x2 = 2.5e11; // x, m
  const y2 = 0; // y, m
  const vx2 = 0; // vx, m/s
  const vy2 = 2e4; // vy, m/s
  const color2 = "green";
  body = new Body(2, name2, R2, M2, x2, y2, vx2, vy2, color2);
  bodies.push(body);
  data.bodies = bodies;
}
function setDataTiming(data) {
  data.dt = 8.64e4; //step for calculation (real world)
}

function dataSetDraw(data) {
  setData(data);
  data.updateBodiesA();
  data.drawCanvas();
  data.drawBodies();

 
  
}

//======= Code to run

const setBtn = document.getElementById("setBtn");
const resetBtn = document.getElementById("resetBtn");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");

setBtn.addEventListener("click", setBtnHandler);
resetBtn.addEventListener("click", resetBtnHandler);
playBtn.addEventListener("click", playBtnHandler);

const dataDefault = new Data(
  [
    new Body(0, "Sun", 15 * 6.96e8, 2e30, 0, 0, 0, 0, "red", true),
    new Body(
      1,
      "Earth",
      15 * 6.376e6,
      6e24,
      1.48e11,
      0,
      0,
      3e4,
      "lightblue",
      true
    ),
    new Body(2, "PlanetX", 15 * 8.0e6, 8e24, 2.5e11, 0, 0, 2e4, "green", true),
  ],
  document.getElementById("canvas"),
  { x: 0, y: 0 },
  1.5 * 8e11,
  8.64e4
);

let data = Object.assign(dataDefault);
console.log('dataDefoult=', dataDefault);
console.log('data=', data);
data.updateBodiesA();
console.log('data updataed A=', data);
data.drawCanvas();



//  dataSetDraw(data);    

function setBtnHandler(event) {
  event.preventDefault();
  dataSetDraw(data);
}

function resetBtnHandler(event) {
  event.preventDefault();
  console.log("data: ", data);
}

function playBtnHandler(event) {
  console.log("in playHandler()");
  let playBtnClasses = event.currentTarget.classList;
  playBtnClasses.toggle("pause");
  // playBtnClasses = event.currentTarget.classList;
  playBtnClasses.contains("pause")
    ? (event.currentTarget.innerText = "PAUSE")
    : (event.currentTarget.innerText = "PLAY");
  // console.log(playBtnElementClasses.contains('pause'));

  stepVar = step(calcsPerFrame);
  setIntId = setInterval(stepVar, interval);
}
// //Round to 'digits' digits
// const roundTo = (number, digits) =>
//   Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
// // Initiation
//
// }

// class ViewPort {
//   constructor(
//     canvasWidth,
//     canvasHeight,
//     padding,
//     backgroundColor,
//     lineWidth,
//     lineColor
//   ) {
//     this.backgroundColor = backgroundColor;
//     this.lineWidth = lineWidth;
//     this.lineColor = lineColor;
//     this.topLeft = new Point(padding + lineWidth, padding + lineWidth);
//     this.width = canvasWidth - 2 * padding - 2 * lineWidth;
//     this.height = canvasHeight - 2 * padding - 2 * lineWidth;
//   }
//   draw() {
//     c.fillStyle = this.backgroundColor;
//     c.strokeStyle = this.lineColor;
//     c.lineWidth = this.lineWidth;
//     c.rect(
//       this.topLeft.x - this.lineWidth / 2,
//       this.topLeft.y - this.lineWidth / 2,
//       this.width + this.lineWidth,
//       this.height + this.lineWidth
//     ); //Так товщини лінії додаються до paddings
//     c.stroke();
//     c.fillRect(this.topLeft.x, this.topLeft.y, this.width, this.height); //Заливка тільки для vewPort
//   }
// }

//Calculation if and when bodies to be displayed
function step(calcsPerFrame) {
  let cpf = calcsPerFrame; //number of calc circles per frame
  function stopwatch() {
    if (count <= countMax) {
      dataPrevious = JSON.parse(JSON.stringify(data));
      console.log(count);

      // alert('stop i nstep()');
      count++;
      data.updateBodies();
      data.updateBodiesA();
      //console.log(dataPrevious.bodies[1].x - data.bodies[1].x);

      if (!(count % cpf)) {
        data.drawCanvas();
        data.drawBodies();

        // outputBodyParams(
        //   bodies[1].name,
        //   out1,
        //   "x / y / r (m): ",
        //   bodies[1].x,
        //   bodies[1].y,
        //   out2,
        //   "vx / vy / v (m/s): ",
        //   bodies[1].vx,
        //   bodies[1].vy,
        //   out3,
        //   "ax / ay / a (m/s^2): ",
        //   bodies[1].ax,
        //   bodies[1].ay,
        //   out4
        // );
      }
      // let logStringA = `${count}; ax=${bodies[1].ax.toExponential(2)}, ay=${bodies[1].ay.toExponential(2)} `;
      // let logStringV = `vx=${bodies[1].vx.toExponential(2)}, vy=${bodies[1].vy.toExponential(2)}`;
      // let logString = `x=${bodies[1].x.toExponential(2)}, y=${bodies[1].y.toExponential(2)}`;

      // console.log(logStringA + '; ' + logStringV + '; ' + logString);

      // bodies.forEach((el) => {
      //   el.updateA();
      //   el.update();
      // });
    } else {
      clearInterval(setIntId);
      console.log("continue");
    }
  }
  return stopwatch;
}
// function output2numbers(lable, numberX, numberY, destination, precision) {
//   const strX = numberX.toExponential(precision);
//   const strY = numberY.toExponential(precision);
//   const strR = Math.sqrt(numberX ** 2 + numberY ** 2).toExponential(precision);
//   destination.innerHTML = lable + strX + " / " + strY + " / " + strR;
// }
// function outputBodyParams(
//   bodyName,
//   outName,
//   lableR,
//   x,
//   y,
//   outR,
//   lableV,
//   vx,
//   vy,
//   out2,
//   lableA,
//   ax,
//   ay,
//   out3,
//   precision
// ) {
//   outName.innerHTML = bodyName;
//   output2numbers(lableR, x, y, outR, 2);
//   output2numbers(lableV, bodies[1].vx, bodies[1].vy, out2, 2);
//   output2numbers(lableA, bodies[1].ax, bodies[1].ay, out3, 2);
// }

// //==== Listeneres
// // window.addEventListener("mousemove", (event) => {
// //   mouse.x = event.x;
// //   mouse.y = event.y;
// // });
// window.addEventListener("resize", () => {
//   playFromLastPoint();
// });

// let viewPortMain;
// // = 3; // 10px, min radius of the circle (on Screen)
// let scaleMtoPX; // = 5.9e3; // Number of px in 1 m (for 150ppi)
// let scaleRealToM; // = 1; // scale from Real World to 1 m
// let scale; // = (1.2 * 3e11) / Math.min(viewPortMain.width, viewPortMain.height); //scaleRealToM * scaleMtoPX;
// //Scele from Real World to 1 px, must be: = scaleRealToM * scaleMtoPX
// let p0 = { x: 0, y: 0 };

// let stepVar = step(calcsPerFrame);
// playFromLastPoint();
// const out1 = document.getElementById("out1");
// const out2 = document.getElementById("out2");
// const out3 = document.getElementById("out3");
// const out4 = document.getElementById("out4");

// var setIntId; // = setInterval(stepVar, interval);

// // runCalcFrame();
// //Mouse
// // let mouse = {
// //   x: undefined,
// //   y: undefined,
// // };
// //const n = 0;

// // for (let i = 0; i < 10; i++) {
// //   console.log(
// //     i,
// //     "ax:",
// //     bodies[n].ax,
// //     "ay:",
// //     bodies[n].ay,
// //     "vx:",
// //     bodies[n].vx,
// //     "vy:",
// //     bodies[n].vy,
// //     "x:",
// //     bodies[0].x,
// //     "y:",
// //     bodies[0].y
// //   );

// //   bodies.forEach((el) => el.updateA());

// //   // console.log(
// //   //   "ax:",
// //   //   bodies[n].ax,
// //   //   "ay:",
// //   //   bodies[n].ay,
// //   //   "vx:",
// //   //   bodies[n].vx,
// //   //   "vy:",
// //   //   bodies[n].vy,
// //   //   "x:",
// //   //   bodies[0].x,
// //   //   "y:",
// //   //   bodies[0].y
// //   // );

// //   bodies.forEach((el) => el.update());
// // }

// // bodies.forEach((el) => el.draw());

// // init();
