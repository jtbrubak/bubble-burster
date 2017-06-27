//12 across, 13 down

class Board {
  constructor() {
    this.grid = []
  }

  setupGrid() {
    for (var i = 0; i < 13; i++) {
      this.grid[i] = []
      if (i % 2 === 0) { this.setupEvenRow(i) }
      else { this.setupOddRow(i) }
    }
  }
}

module.exports = Bubble;
