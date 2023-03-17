//Get canvas, contex and size it
const canvas = document.querySelector("canvas");
setCanvas();

const c = canvas.getContext("2d");
const header = document.getElementById("header");
header.innerHTML = 'Circles animation'
const pi = Math.PI;
function setCanvas() {
  canvas.width = window.innerWidth - 30;
  canvas.height = window.innerHeight - 80;
}
function setCanvasAndAnimate() {
  setCanvas();
  animate2();
}

//Listeneres
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});
window.addEventListener("resize", () => {
  setCanvas();
  init();
});

//Functions
const roundRandomProduct = (multiplier = 1) =>
  Math.round(Math.random() * multiplier);

const roundTo = (number, digits) =>
  Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
// -----  Create array of circles
function init() {
  circles = [];
  for (let i = 0; i < numberOfCircles; i++) {
    let r = roundRandomProduct(maxR);
    if (r < minR) r = minR;
    let x = roundRandomProduct(canvas.width);
    let y = roundRandomProduct(canvas.height);
    if (x < r + lineWidth / 2 + 1) x = r + lineWidth / 2 + 1;
    if (x > canvas.width - r - lineWidth / 2 - 1)
      x = canvas.width - r - lineWidth / 2 - 1;
    if (y < r + lineWidth / 2 + 1) y = r + lineWidth / 2 + 1;
    if (y < r + lineWidth / 2 + 1) y = r + lineWidth / 2 + 1;
    if (y > canvas.height - r - lineWidth / 2 - 1)
      y = canvas.height - r - lineWidth / 2 - 1;
    const dx = (Math.random() - 0.5) * maxVelocity;
    const dy = (Math.random() - 0.5) * maxVelocity;
    const color = colorSet[roundRandomProduct(colorSet.length - 1)];
    const cicle = new Circle(x, y, dx, dy, r, color, color, lineWidth);
    circles.push(cicle);
  }
}
//Classes
class Circle {
  constructor(
    x = defaultCircle.x,
    y = defaultCircle.y,
    dx = defaultCircle.dx,
    dy = defaultCircle.dy,
    r = defaultCircle.r,
    lineColor = defaultCircle.lineColor,
    fillColor = defaultCircle.fillColor,
    lineWidth = defaultCircle.lineWidth
  ) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.rInit = r;
    this.lineColor = lineColor;
    this.fillColor = fillColor;
    this.lineWidth = lineWidth;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * pi, false);
    c.strokeStyle = this.lineColor;
    c.fillStyle = this.fillColor;
    c.lineWidth = this.lineWidth;
    c.stroke();
    c.fill();
  }
  update() {
    if (
      this.x + this.r + this.lineWidth / 2 >= canvas.width ||
      this.x - this.r - this.lineWidth / 2 <= 0
    )
      this.dx = -this.dx;
    this.x += this.dx;
    if (
      this.y + this.r + this.lineWidth / 2 > canvas.height ||
      this.y - this.r - this.lineWidth / 2 <= 0
    )
      this.dy = -this.dy;
    this.y += this.dy;

    if (
      mouse.x > safetyRange &&
      mouse.x < canvas.width - safetyRange &&
      mouse.y > safetyRange &&
      mouse.y < canvas.height - safetyRange &&
      Math.abs(this.x - mouse.x) < distance &&
      Math.abs(this.y - mouse.y) < distance
    ) {
      if (this.r < limR) {
        this.r += 10;
      }
    } else if (this.r > minR) {
      this.r -= 2;
    }
  }

  updateDraw() {
    this.update();
    this.draw();
  }
}

//General parameters
const lineWidth = 5;
const numberOfCircles = 400;
const maxVelocity = 10;
const colorSet = ["#73122C", "#BFB30F", "#BE3156", "#1F98BF", "#185C73"];
const maxR = 15;
const minR = 2;
const limR = 50;
const distance = 50;
const fps = 20;
const timeFrame = Math.round(1000 / fps);
const safetyRange = 10;

//Default settings
const defaultCircle = {
  x: Math.round(canvas.width / 2),
  y: Math.round(canvas.height / 2),
  dx: 1,
  dy: 1,
  r: 10,
  lineColor: "black",
  fillColor: "black",
  lineWidth: 1,
};

let mouse = {
  x: undefined,
  y: undefined,
};

//Animation
let circles = [];
init();
//const start = Date.now();

function animate2() {
  setTimeout(() => {
    window.requestAnimationFrame(animate2);
    c.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach((element) => element.updateDraw());
    // console.log((Date.now() - start) / 1000);
  }, timeFrame);
}

animate2();
