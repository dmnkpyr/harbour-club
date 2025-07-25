let canvas;
let resizeTimeout;

let tile;
let tiles = [];

const gridSpacing = 20;
const tileSize = 15;

let rows;
let cols;

let cellWidth;
let cellHeight;


function preload() {
  tile = loadImage("assets/pattern.svg");
}

function setup() {
  imageMode(CENTER);
  canvasSetup();

}

function draw() {
  background("#F8F4F0");

  for (let t of tiles) {
    t.update();
    t.show();
  }
}

document.getElementById("container").style.background = "#F8F4F0";

class PatternTile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.scaleFactor = 1;
  }
  show() {
    image(
      tile,
      this.x,
      this.y,
      tileSize * this.scaleFactor,
      tileSize * this.scaleFactor
    );
  }
  update() {
    let mouseDistance = dist(mouseX, mouseY, this.x, this.y);
    let targetFactor = 1 + 1.9 * exp(- mouseDistance * 0.006);
    if (targetFactor < this.scaleFactor) {
      this.scaleFactor = lerp(this.scaleFactor, targetFactor, 0.025);
    } else {
      this.scaleFactor = targetFactor;
    }
  }
}




function windowResized() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    canvasSetup();
  }, 100);
}


function canvasSetup() {
    //Canvas setup
    noCanvas(); // Remove any existing canvas
    canvas = createCanvas(windowWidth, 400);
    canvas.parent('container');


  rows = height / gridSpacing;
  cols = width / gridSpacing;
  cellWidth = width / cols;
  cellHeight = height / rows;

  for (let i = 0; i < rows; i++) {
    let y = i * cellHeight + cellHeight / 2;
    for (let j = 0; j < cols+2; j++) {
      let offset = i % 2 === 0 ? 0 : -cellWidth/2;
      let x = j * cellWidth + offset;
      tiles.push(new PatternTile(x, y));
    }
  }
}