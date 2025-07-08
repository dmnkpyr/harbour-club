let myp5 = new p5((p) => {
  let canvas;
  let bgColor;

  let resizeTimeout;
  let mouseHasMoved = false;

  let tile;
  let tiles = [];

  const gridSpacing = 20;
  const tileSize = 15;

  let rows;
  let cols;
  let cellWidth;
  let cellHeight;

  // Load the tile image asset
  p.preload = () => {
    tile = p.loadImage("assets/pattern.svg");
  };

  // Initial setup for canvas
  p.setup = () => {
    p.imageMode(p.CENTER);
    p.pixelDensity(3);
    canvasSetup();
  };

  p.draw = () => {
    p.background(bgColor); // match container background
    for (let t of tiles) {
      t.update();
      t.show();
    }
  };

  class PatternTile {
    constructor(x, y) {
      this.x = x;   
      this.y = y;   
      this.ox = x;  // original x position
      this.oy = y;  // original y position
    }

    // Draw the tile image
    show() {
      p.image(tile, this.x, this.y, tileSize, tileSize);
    }

    // Update position based on mouse interaction
    update() {
      if (!mouseHasMoved) return; // return if mouse has not been moved
      let dx = this.ox - p.mouseX;
      let dy = this.oy - p.mouseY;
      let distance = p.sqrt(dx * dx + dy * dy);
      let minDistance = 300;
      
      if (distance < minDistance) {
        // Displace based on proximity and direction
        let strength = 1 - distance / minDistance;
        let force = 20 * strength * strength;
        let angle = p.atan2(dy, dx);
        this.x = this.ox + p.cos(angle) * force;
        this.y = this.oy + p.sin(angle) * force;
      } else {
        // Return to original position when far from cursor
        this.x = this.ox;
        this.y = this.oy;
      }
    }
  }

  // Check if mouse has been moved
  p.mouseMoved = () => {
  mouseHasMoved = true;
};

  // Recalculate canvas and grid when window size changes
  p.windowResized = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      canvasSetup();
    }, 100);
  };

  // Set up canvas size, grid layout, and populate tiles
  function canvasSetup() {
    p.noCanvas(); // remove previous canvas
    tiles = [];   // reset tiles array

    // Match canvas to container dimensions and color
    const container = document.getElementById("p5container");
    bgColor = getComputedStyle(container).backgroundColor;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    canvas = p.createCanvas(containerWidth, containerHeight);
    canvas.parent("p5container");

    // Calculate number of rows and columns
    rows = p.height / gridSpacing;
    cols = p.width / gridSpacing;
    cellWidth = p.width / cols;
    cellHeight = p.height / rows;

    // Create grid pattern
    for (let i = 1; i < rows - 1; i++) {
      let y = i * cellHeight + cellHeight / 2;
      for (let j = 0; j < cols + 2; j++) {
        let offset = i % 2 === 0 ? 0 : -cellWidth / 2;
        let x = j * cellWidth + offset;
        tiles.push(new PatternTile(x, y));
      }
    }
  }
});