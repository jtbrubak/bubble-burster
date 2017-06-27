//12 across, 13 down

class Board {
  constructor() {
    this.grid = []
  }

  setupGrid() {
    for (var row = 0; row < 13; row++) {
      this.grid[row] = []
      if (row % 2 === 0) { this.setupEvenRow(row) }
      else { this.setupOddRow(row) }
    }
  }

  setupEvenRow(y) {
    for (var col = 0; col < 12; col++) {
      this.grid[row][col].x = col * 33
      this.grid[row][col].y = y * 33
      this.grid[row][col].bubble = null
    }
  }

  setupOddRow(y) {
    for (var col = 0; col < 12; col++) {
      this.grid[row][col].x = col * 33
      this.grid[row][col].y = (y * 33) + 16
      this.grid[row][col].bubble = null
    }
  }
}

module.exports = Board;
