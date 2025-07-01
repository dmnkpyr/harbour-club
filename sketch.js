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
    this.ox = x; // original x
    this.oy = y; // original y
  }
  show() {
    image(tile, this.x, this.y, tileSize, tileSize);
  }
  update() {
    let dx = this.ox - mouseX;
    let dy = this.oy - mouseY;
    let distance = sqrt(dx * dx + dy * dy);
    let minDistance = 300;

    if (distance < minDistance) {
      let strength = 1 - distance / minDistance;
      let force = 20 * strength * strength;
      let angle = atan2(dy, dx);
      this.x = this.ox + cos(angle) * force;
      this.y = this.oy + sin(angle) * force;
    } else {
      // Return to original position
      this.x = this.ox;
      this.y = this.oy;
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

  for (let i = 1; i < rows-1; i++) {
    let y = i * cellHeight + cellHeight / 2;
    for (let j = 0; j < cols+2; j++) {
      let offset = i % 2 === 0 ? 0 : -cellWidth/2;
      let x = j * cellWidth + offset;
      tiles.push(new PatternTile(x, y));
    }
  }
}