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

  setupEvenRow(row) {
    for (var col = 0; col < 12; col++) {
      this.grid[row][col] = {}
      this.grid[row][col].x = col * 33
      this.grid[row][col].y = row * 33
      this.grid[row][col].bubble = null
    }
  }

  setupOddRow(row) {
    for (var col = 0; col < 12; col++) {
      this.grid[row][col] = {}
      this.grid[row][col].x = col * 33
      this.grid[row][col].y = (row * 33) + 16
      this.grid[row][col].bubble = null
    }
  }
}

module.exports = Board;
