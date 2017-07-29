const Bubble = require("./bubble.js")
const Util = require("./util.js")
const Board = require("./board.js")

class Game {

  constructor(stage) {
    this.stage = stage;
    this.move = this.move.bind(this)
    this.startGame = this.startGame.bind(this)
    this.keydown = this.keydown.bind(this)
    this.keyup = this.keyup.bind(this)
    this.checkNeighbors = this.checkNeighbors.bind(this)
    this.collisionDetect = this.collisionDetect.bind(this)
  }

  setupVariables() {
    this.keys = {};
    this.colorsRemaining = { "yellow": 0, "red": 0, "purple": 0,
                             "blue": 0, "green": 0, "gray": 0 };
    this.bubbleCount = 0;
    this.bubbles = {};
    this.movingObjects = [];
    this.newBubble = null;
    this.board = new Board();
  }

  startGame() {
    this.setupVariables();
    this.stage.removeAllChildren();
    this.setupLine();
    this.board.setupGrid();
    this.setupBubbles();
    this.loadCannon();
    this.loadBubble();
    createjs.Ticker.addEventListener("tick", () => this.tick());
    createjs.Ticker.setFPS(60);
    document.onkeydown = this.keydown;
    document.onkeyup = this.keyup;
    this.stage.update();
  }

  setupLine() {
    const g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke("white");
    g.moveTo(0, 413).lineTo(400, 413);
    const line = new createjs.Shape(g);
    this.stage.addChild(line);
  }

  setupBubbles() {
    const colorArray = Object.keys(this.colorsRemaining);
    for (let x = 0; x < 5; x++) {
      let rowLength = x % 2 === 0 ? 12 : 11
      let offset = x % 2 === 0 ? 0 : 16
      for (let y = 0; y < rowLength; y++) {
        var rand = Math.floor(Math.random() * Object.keys(this.colorsRemaining).length);
        var bubble = new Bubble(Object.keys(this.colorsRemaining)[rand], [offset + (y*33), x*33], this.bubbleCount);
        bubble.pos = [x, y]
        this.board.grid[x][y].bubble = bubble.id
        this.colorsRemaining[bubble.color] += 1;
        this.setupNeighbors(bubble);
        this.bubbles[bubble.id] = bubble;
        this.stage.addChild(bubble.sprite);
        this.bubbleCount += 1;
      }
    }
    this.deleteMissingColors();
  }

  deleteMissingColors() {
    var colorArray = Object.keys(this.colorsRemaining);
    for (let i = 0; i < colorArray.length; i++) {
      if (this.colorsRemaining[colorArray[i]] === 0)  {
        delete this.colorsRemaining[colorArray[i]];
      }
    }
  }

  setupNeighbors(bubble) {
    var rowLength = bubble.pos[0] % 2 === 0 ? 11 : 10
    if (bubble.pos[1] !== 0) { bubble.neighbors.push(bubble.id - 1) }
    if (bubble.pos[1] !== rowLength) { bubble.neighbors.push(bubble.id + 1) }
    if (bubble.pos[0] !== 0) {
      if (bubble.pos[1] !== rowLength || rowLength === 10) { bubble.neighbors.push(bubble.id - 11) }
      if (bubble.pos[1] !== 0 || rowLength === 10) { bubble.neighbors.push(bubble.id - 12) }
    }
    if (bubble.pos[0] !== 4) {
      if (bubble.pos[1] !== rowLength || rowLength === 10) { bubble.neighbors.push(bubble.id + 12) }
      if (bubble.pos[1] !== 0 || rowLength === 10) { bubble.neighbors.push(bubble.id + 11) }
    }
  }

  loadCannon() {
    this.cannon = new createjs.Bitmap("./sprites/cannon.png");
    this.cannon.x = 200;
    this.cannon.y = 485;
    this.cannon.regX = 10;
    this.cannon.regY = 60;
    this.stage.addChild(this.cannon);
  }

  keydown(event) {
      this.keys[event.keyCode] = true;
      if (this.keys[32]) this.fireBubble();
  }

  keyup(event) {
      delete this.keys[event.keyCode];
  }

  loadBubble() {
    var rand = Math.floor(Math.random() * Object.keys(this.colorsRemaining).length)
    this.newBubble = new Bubble(Object.keys(this.colorsRemaining)[rand], [184, 465], this.bubbleCount);
    this.bubbleCount += 1;
    this.stage.addChild(this.newBubble.sprite);
  }

  move() {
    this.movingObjects.forEach((obj) => {
      obj.sprite.x += obj.speed[0];
      obj.sprite.y += obj.speed[1];
      this.stage.update()
      if (Util.wallDetect(this.newBubble)) obj.speed[0] *= -1;
      if (this.collisionDetect()) {
        this.bubbles[this.newBubble.id] = this.newBubble;
        this.gridSnap(this.newBubble)
        let destroy = this.checkNeighbors(this.newBubble).concat([this.newBubble.id])
        if (destroy.length >= 3) this.destroyBubbles(destroy)
        this.movingObjects = [];
        createjs.Ticker.setFPS(60)
        this.loadBubble();
      }
      if (Util.ceilingDetect(this.newBubble)) {
        this.bubbles[this.newBubble.id] = this.newBubble;
        this.movingObjects = [];
        createjs.Ticker.setFPS(60)
        this.loadBubble();
      }
    }, this)
  }

  gridSnap(bubble) {
    var row = Math.round(bubble.sprite.y / 33)
    bubble.sprite.y = row * 33
    if (row % 2 === 0) {
      var col = Math.round(bubble.sprite.x / 33)
      bubble.sprite.x = col * 33
    } else {
      var col = Math.round((bubble.sprite.x - 16) / 33)
      bubble.sprite.x = (col * 33) + 16
    }
    bubble.pos = [row, col]
    this.board.grid[row][col].bubble = bubble.id
    this.assignNeighbors(bubble)
  }

  assignNeighbors(bubble) {
    var deltas = bubble.pos[0] % 2 === 0 ? Util.evenDeltas() : Util.oddDeltas()
    debugger
    deltas.forEach((delta) => {
      var neighborPos = [(bubble.pos[0] + delta[0]), (bubble.pos[1] + delta[1])]
      var neighborBubble = this.board.grid[neighborPos[0]][neighborPos[1]].bubble
      if (neighborPos[0] >= 0 && neighborPos[1] >= 0 && neighborBubble !== null) {
        bubble.neighbors.push(neighborBubble)
        this.bubbles[neighborBubble].neighbors.push(bubble.id)
      }
    })
  }

  destroyBubbles(destroy) {
    destroy.forEach((bubble) => {
      if (this.bubbles[bubble]) {
        this.removeNeighbors(bubble)
        this.colorsRemaining[this.bubbles[bubble].color] -= 1;
        this.stage.removeChild(this.bubbles[bubble].sprite)
        var gridPos = this.bubbles[bubble].pos
        this.board.grid[gridPos[0]][gridPos[1]].bubble = null
        delete this.bubbles[bubble]
      }
    }, this)
    this.deleteMissingColors();
  }

  removeNeighbors(bubble) {
    if (this.bubbles[bubble]) {
      this.bubbles[bubble].neighbors.forEach(neighbor => {
        if (this.bubbles[neighbor]) {
          let i = this.bubbles[neighbor].neighbors.indexOf(bubble)
          this.bubbles[neighbor].neighbors.splice(i, 1)
        }
      })
    }
  }

  checkNeighbors(bubble, skip = []) {
    var sameColorNeighbors = []
    bubble.neighbors.forEach((neighbor) => {
      if (bubble.color === this.bubbles[neighbor].color && !skip.includes(neighbor)) {
        sameColorNeighbors.push(neighbor)
        skip.push(bubble.id)
        sameColorNeighbors = sameColorNeighbors.concat(this.checkNeighbors(this.bubbles[neighbor], skip))
      }
    }, this)
    return sameColorNeighbors;
  }

  collisionDetect() {
    let collision = false;
    Object.values(this.bubbles).forEach((bubble) => {
      if (ndgmr.checkPixelCollision(this.newBubble.sprite, bubble.sprite)) {
        collision = true;
      }
    }, this)
    return collision;
  }

  fireBubble() {
    this.newBubble.speed = [Util.calculateXSpeed(this.cannon), Util.calculateYSpeed(this.cannon)];
    this.colorsRemaining[this.newBubble.color] += 1;
    this.movingObjects.push(this.newBubble);
    createjs.Ticker.setFPS(200);
  }

  endGame(status) {
    createjs.Ticker.removeAllEventListeners()
    this.stage.removeAllChildren();
    var title = new createjs.Text(`YOU ${status}`, "36px Courier", "white");
    title.x = status === "LOSE" ? 110 : 120;
    title.y = 200;
    this.stage.addChild(title);
    this.renderPlayAgain();
    this.stage.update();
  }

  renderPlayAgain() {
    var play = new createjs.Text("PLAY AGAIN?", "36px Courier", "white");
    play.x = 80;
    play.y = 300;
    play.addEventListener("click", this.startGame);
    this.stage.addChild(play);
  }

  lineBreach() {
    let breach = false;
    Object.keys(this.bubbles).forEach((bubble) => {
      if (this.bubbles[bubble].sprite.y >= 380) { breach = true; }
    }, this);
    return breach;
  }

  tick() {
    if (this.keys[37] && this.cannon.rotation >= -75) this.cannon.rotation -= 3;
    if (this.keys[39] && this.cannon.rotation <= 75) this.cannon.rotation += 3;
    if (this.keys[38]) this.cannon.rotation = 0;
    this.move();
    this.stage.update();
    if (Object.keys(this.bubbles).length === 0) {
      this.endGame("WIN");
    } else if (this.lineBreach()) {
      this.endGame("LOSE");
    }
  }

}

module.exports = Game;
