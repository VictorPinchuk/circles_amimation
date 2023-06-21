//==== Constants
//General constants
const pi = Math.PI;
const G = 6.6743e-11;
const numberOfSecsInDay = 8.64e4;
//General project constants
const numberOfBodies = 3;
let minR = 3; // 10px, min radius of the circle (on Screen)
//Temporary project constants
//let countMax = 365;
let count = 0;
// let dt = 8.64e4; //step for calculation (real world)

const canvasPersetage = 0.95;

//=====  Fuctions

//General transform from B to A (up)
//scale = unit_segmentB / unit_segmentA
//Перетворення координат з коорд. системи В в коорд. систему А
//scale - відношення одиничного відрізка в В до одиничного відрізка в А
//рВ - радіус-вектор точки в системі В
//р0 - радіус-вектор початку коорд. системи В в системі А
//dirX, dirY = 1 або -1 (співнаправлені або протилежно направлені осі)
const transformBtoA = (pB, p0, scale, dirX, dirY) => ({
  x: p0.x + (dirX * pB.x) / scale,
  y: p0.y + (dirY * pB.y) / scale,
});

function drawCircle(c, x, y, r, color) {
  c.beginPath();
  c.arc(x, y, r, 0, 2 * pi, false);
  c.fillStyle = color;
  c.fill();
  c.closePath();
}
//Deep clon of Data
function cloneData(d) {
  return Object.assign(new Data(), JSON.parse(JSON.stringify(d)));
}

function setBtnHandler(event) {
  event.preventDefault();
  console.log("in-setBtnHandler");
  dataInit = readValuesFromForm();
  console.log("dataInit:", dataInit);
  data = cloneData(dataInit);
  console.log("data:", data);
  data.drawCanvas();
  data.drawBodies();
  console.log("data 1:", data);
  isPlaying = false;
  playBtn.innerText = "PLAY";
  count = 0;
}

function resetBtnHandler(event) {
  event.preventDefault();
  console.log("in-resetBtnHandler");
  dataInit = cloneData(dataDefault);
  insertValuesIntoForm(dataInit);
  data = cloneData(dataInit);
  data.drawCanvas();
  data.drawBodies();
  isPlaying = false;
  playBtn.innerText = "PLAY";
  count = 0;
}

function timeScaleRangeHandler(event) {
  const timeScaleInDays = event.target.value;
  timeScaleInDaysOutput.innerText = ` ${timeScaleInDays}`;
  timeScaleHandler(timeScaleInDays);
}

function playBtnHandler(event) {
  console.log("in playHandler()");
  isPlaying = !isPlaying;
  if (isPlaying) {
    playBtn.innerText = "PAUSE";
    stepVariable = step(calcsPerFrame);
    setIntId = setInterval(stepVariable, interval);
  } else {
    playBtn.innerText = "PLAY";
  }
}

function stopBtnHandler(event) {
  console.log("in stopHandler()");
  isPlaying = false;
  playBtn.innerText = "PLAY";
  count = 0;
  data = cloneData(dataInit);
  data.drawCanvas();
  data.drawBodies();
}

function timeScaleHandler(timeScaleInDays) {
  timeScale = timeScaleInDays * numberOfSecsInDay;
  dt = timeScale * intervalS;
  countMax = Math.round((365 * 24 * 60 * 60) / dt);
  // console.log(
  //   `timeScale = ${timeScale}; intervalS = ${intervalS}s; dt = ${dt}s; countMax = ${countMax}`
  // );
  stopBtnHandler();
}

function insertValuesIntoForm(data) {
  for (i = 0; i < numberOfBodies; i++) {
    names[i].value = data.bodies[i].name;
    radii[i].value = data.bodies[i].R.toExponential(2);
    mass[i].value = data.bodies[i].M.toExponential(2);
    xs[i].value = data.bodies[i].x.toExponential(2);
    ys[i].value = data.bodies[i].y.toExponential(2);
    vxs[i].value = data.bodies[i].vx.toExponential(2);
    vys[i].value = data.bodies[i].vy.toExponential(2);
    colors[i].value = data.bodies[i].color;
  }
}

function readValuesFromForm() {
  const data = new Data([{}, {}, {}]);
  for (i = 0; i < numberOfBodies; i++) {
    data.bodies[i].id = i;
    data.bodies[i].name = names[i].value;
    data.bodies[i].R = Number(radii[i].value);
    data.bodies[i].M = Number(mass[i].value);
    data.bodies[i].x = Number(xs[i].value);
    data.bodies[i].y = Number(ys[i].value);
    data.bodies[i].vx = Number(vxs[i].value);
    data.bodies[i].vy = Number(vys[i].value);
    data.bodies[i].color = colors[i].value;
    data.bodies[i].exist = true;
    data.bodies[i].ax = 0;
    data.bodies[i].ay = 0;
  }
  return data;
}

function showInfo() {
  info.innerText = `
    isMouseOnCanvas: ${isMouseOnCanvas}

    isMouseDown: ${isMouseDown}

    origin.x = ${origin.x}

    origin.y = ${origin.y}
    `;
}

function showScale() {
  const ctx = canvas.getContext("2d");
  const paddingRight = 100;
  const paddingBottom = 20;
  const lineLength = 80;
  const tickLenght = 10;
  const textPaddingBottom = 5;
  const textPaddingLeft = 5;
  const color = '#888888'
  ctx.font = '14px sans-serif';
  
  const scale = scaleFactor / Math.min(canvas.width, canvas.height);
  const scaleToShow = `${(lineLength*scale).toExponential(1)} m`;
  
  const startPointX = canvas.width - paddingRight;
  const startPointY = canvas.height - paddingBottom;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(startPointX, startPointY);
  ctx.lineTo(startPointX + lineLength, startPointY);
  ctx.moveTo(startPointX, startPointY);
  ctx.lineTo(startPointX, startPointY - tickLenght);
  ctx.moveTo(startPointX + lineLength, startPointY);
  ctx.lineTo(startPointX + lineLength, startPointY - tickLenght);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(scaleToShow, startPointX + textPaddingLeft, startPointY - textPaddingBottom);
}

function step(calcsPerFrame) {
  let cpf = calcsPerFrame; //number of calc circles per frame
  function stopwatch() {
    if (count <= countMax && isPlaying) {
      // dataPrevious = JSON.parse(JSON.stringify(data));
      //console.log(count);

      count++;
      data.updateBodies();
      data.updateBodiesA();

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
}
class Data {
  constructor(bodies = [new Body(), new Body(), new Body()]) {
    this.bodies = bodies;
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
    this.bodies.forEach((el) => {
      el.vx += el.ax * dt;
      el.vy += el.ay * dt;
      el.x += el.vx * dt;
      el.y += el.vy * dt;
    });
  }
  drawCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showScale();
  }
  drawBodies() {
    const ctx = canvas.getContext("2d");
    this.bodies.forEach((el) => {
      const scale = scaleFactor / Math.min(canvas.width, canvas.height);
      const ps = transformBtoA({ x: el.x, y: el.y }, origin, scale, 1, -1);
      let R = el.R / scale;
      R = R >= minR ? R : minR;
      ctx.fillStyle = el.color;
      drawCircle(ctx, ps.x, ps.y, R, el.color);
    });
  }
  updateAndDrawAll() {
    this.updateBodies();
    this.updateBodiesA();
    this.drawCanvas();
    this.drawBodies();
  }
}
// //==== End of Classes

//======= Code to run
//const canvasId = "canvas";
let canvas = document.getElementById("canvas");
canvas.width = canvasPersetage * canvas.parentElement.clientWidth;
canvas.height = canvasPersetage * canvas.parentElement.clientHeight;

const originInitial = new Point(canvas.width / 2, canvas.height / 2);
let origin = originInitial;
let isMouseOnCanvas = false;
let isMouseDown = false;
let isCrtDown = false;
let isPlaying = false;

const scaleFactorInitial = 1.0 * 8e11;
let scaleFactor = scaleFactorInitial;

// interval*calcPerFrame = 40ms => 25fps
const interval = 20;
const intervalS = interval / 1000;
const calcsPerFrame = 5;

// 1 min in 1s => timeScale = 60
// 1 hours in 1s => timeScale = 3.6e3
// 12 hours in 1s => timeScale = 43.2e3
// 24 hours in 1s => timeScale = 86.4e3
const timeScaleInDaysMinValue = 1;
const timeScaleInDaysMaxValue = 50;
const timeScaleInDaysDefaultValue = 10;
const timeScaleInDaysStep = 1;

const names = document.getElementsByName("name");
const radii = document.getElementsByName("radius");
const mass = document.getElementsByName("mass");
const xs = document.getElementsByName("x");
const ys = document.getElementsByName("y");
const vxs = document.getElementsByName("vx");
const vys = document.getElementsByName("vy");
const colors = document.getElementsByName("color");
const timeScaleInDaysInput = document.getElementById(
  "time-scale-in-days-input"
);
const timeScaleInDaysOutput = document.getElementById(
  "time-scale-in-days-output"
);
const timeScaleInDaysMin = document.getElementById("time-scale-in-days-min");
const timeScaleInDaysMax = document.getElementById("time-scale-in-days-max");

const info = document.getElementById("info");

const setBtn = document.getElementById("setBtn");
const resetBtn = document.getElementById("resetBtn");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");

setBtn.addEventListener("click", setBtnHandler);
resetBtn.addEventListener("click", resetBtnHandler);
timeScaleInDaysInput.addEventListener("input", timeScaleRangeHandler);
playBtn.addEventListener("click", playBtnHandler);
stopBtn.addEventListener("click", stopBtnHandler);

canvas.addEventListener("mousedown", () => {
  isMouseDown = true;
  showInfo();
});
document.addEventListener("mouseup", () => {
  isMouseDown = false;
  showInfo();
});
canvas.addEventListener("mouseenter", () => {
  isMouseOnCanvas = true;
  showInfo();
  // console.log(`Mouse on canvas - ${isMouseOnCanvas}`);
});
canvas.addEventListener("mouseleave", (event) => {
  isMouseOnCanvas = false;
  showInfo();
  // console.log(`Mouse on canvas - ${isMouseOnCanvas}`);
});
canvas.addEventListener("mousemove", (event) => {
  if (isMouseOnCanvas && isMouseDown) {
    origin.x += event.movementX;
    origin.y += event.movementY;
    showInfo();
    data.drawCanvas();
    data.drawBodies();
  }
});
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (isCrtDown) {
    scaleFactor = scaleFactor * (1 + event.deltaY / 1000);
    // console.log(event.deltaY, scaleFactor, event.currentTarget);
    data.drawCanvas();
    data.drawBodies();
  }
});
document.addEventListener("keydown", (event) => {
  if (
    (event.code == "ControlLeft" || event.code == "ControlRight") &&
    isCrtDown == false
  ) {
    canvas.classList.add("zoom");
    isCrtDown = true;
    // console.log(canvas);
  }
});
document.addEventListener("keyup", (event) => {
  if (event.code == "ControlLeft" || event.code == "ControlRight") {
    canvas.classList.remove("zoom");
    isCrtDown = false;
    // console.log(canvas);
  }
});

const dataDefault = new Data([
  //id, name, R, M, x, y, vx, vy, color, exist
  new Body(0, "Sun", 6.96e8, 2e30, 0, 0, 0, 0, "#ff0000", true),
  new Body(1, "Earth", 6.376e6, 6e24, 1.5e11, 0, 0, 2.98e4, "#0000FF", true),
  new Body(2, "PlanetX", 8.0e6, 6e24, 3.0e11, 0, 0, 1.5e4, "#00ff00", true),
]);

let dataInit = cloneData(dataDefault);
//console.log("dataDefault:", dataDefault);
insertValuesIntoForm(dataInit);
//console.log("dataInit:", dataInit);

let data = cloneData(dataInit);
//console.log("data:", data);

data.drawCanvas();
data.drawBodies();

let timeScaleInDays = timeScaleInDaysDefaultValue;

let timeScale, dt, countMax;
timeScaleHandler(timeScaleInDays);

timeScaleInDaysMin.innerText = timeScaleInDaysMinValue;
timeScaleInDaysMax.innerText = timeScaleInDaysMaxValue;

timeScaleInDaysInput.setAttribute("min", timeScaleInDaysMinValue);
timeScaleInDaysInput.setAttribute("max", timeScaleInDaysMaxValue);
timeScaleInDaysInput.setAttribute("value", timeScaleInDays);
timeScaleInDaysInput.setAttribute("step", timeScaleInDaysStep);

timeScaleInDaysOutput.innerText = ` ${timeScaleInDaysInput.value}`;

showScale();

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
