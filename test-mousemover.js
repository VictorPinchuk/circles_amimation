const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 500;
const info = document.getElementById("info");
const ctx = canvas.getContext("2d");
console.log(ctx);
let x = canvas.width / 2;
let y = canvas.height / 2;
drawPoint(x, y);

let isMouseOnCanvas = false;
let isMouseDown = false;
let movmentX = 0;
let movmentY = 0;

console.log(`Mouse on canvas - ${isMouseOnCanvas}`);
showInfo();

canvas.addEventListener("mousedown", (event) => {
  // info.innerText = `X: ${event.offsetX} Y: ${event.offsetY}`;
  // console.log(event);
  isMouseDown = true;
  showInfo();
});
document.addEventListener("mouseup", (event) => {
  isMouseDown = false;
  showInfo();
});

canvas.addEventListener("mouseenter", (event) => {
  //   info.innerText = `Mouse over canvas`;
  isMouseOnCanvas = true;
  showInfo();
  console.log(`Mouse on canvas - ${isMouseOnCanvas}`);
});
canvas.addEventListener("mouseleave", (event) => {
  //   info.innerText = ` `;
  isMouseOnCanvas = false;
  showInfo();
  console.log(`Mouse on canvas - ${isMouseOnCanvas}`);
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseOnCanvas && isMouseDown) {
    movmentX = event.movementX;
    movmentY = event.movementY;
    x+= event.movementX;
    y += event.movementY;
    drawPoint(x,y);
    showInfo();
  }
});
function drawPoint(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#0000ff";
  ctx.fillStyle = "#00ff00";
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  // ctx.stroke();
  ctx.fill();
}

function showInfo() {
  info.innerText = `
    isMouseOnCanvas: ${isMouseOnCanvas}

    isMouseDown: ${isMouseDown}

    movmentX: ${movmentX}

    movmentY: ${movmentY} 

    x = ${x}

    y = ${y}
    `;
}
