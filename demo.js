function init() {
  main = new Howl({
    src: ['./sounds/main.mp3'],
    loop: true,
    volume: 1.0
  });
  end = new Howl({
    src: ['./sounds/end.mp3'],
    volume: 1.0
  });
  stage = new createjs.Stage("demoCanvas");
  title = new createjs.Text("Bubble Burster", "36px Courier", "white");
  play = new createjs.Text("PLAY", "36px Courier", "white");
  stage.enableMouseOver();
  play.addEventListener("mouseover", playMouseover);
  play.addEventListener("mouseout", playMouseout);
  play.addEventListener("click", startGame);
  title.x = 50;
  title.y = 200;
  play.x = 155;
  play.y = 300;
  stage.addChild(title);
  stage.addChild(play);
  stage.update();
}

function playMouseover() {
  play.color = "green";
  stage.update();
}

function playMouseout() {
  play.color = "white";
  stage.update();
}

function startGame() {
  main.play();
  stage.removeAllChildren();
  keys = {};
  colorsRemaining = { "yellow": 0, "red": 0, "purple": 0,
                      "orange": 0, "green": 0, "gray": 0 };
  bubbleCount = 0;
  bubbles = {};
  movingObjects = [];
  this.setupLine();
  this.setupBubbles();
  loadCannon();
  loadBubble();
  createjs.Ticker.addEventListener("tick", () => tick());
  createjs.Ticker.setFPS(60);
  this.document.onkeydown = keydown;
  this.document.onkeyup = keyup;
  stage.update();
}

function setupLine() {
  g = new createjs.Graphics();
  g.setStrokeStyle(1);
  g.beginStroke("white");
  g.moveTo(0, 413).lineTo(400, 413);
  line = new createjs.Shape(g);
  stage.addChild(line);
}

function setupBubbles() {
  colorArray = Object.keys(colorsRemaining);
  for (x = 0; x < 5; x++) {
    for (y = 0; y < 12; y++) {
      let bubble = randomBubble();
      bubble.x = y * 33;
      bubble.y = x * 33;
      colorsRemaining[bubble.color] += 1;
      setupNeighbors(bubble);
      bubbles[bubble.id] = bubble;
      stage.addChild(bubble);
    }
  }
  deleteMissingColors();
}

function deleteMissingColors() {
  colorArray = Object.keys(colorsRemaining);
  for (i = 0; i < colorArray.length; i++) {
    if (colorsRemaining[colorArray[i]] === 0)  {
      delete colorsRemaining[colorArray[i]];
    }
  }
}

function setupNeighbors(bubble) {
  if (bubble.id % 12 !== 0) { bubble.neighbors.push(bubble.id - 1) }
  if (bubble.id % 12 !== 11) { bubble.neighbors.push(bubble.id + 1) }
  if (bubble.id > 11) { bubble.neighbors.push(bubble.id - 12) }
  if (bubble.id < 48) { bubble.neighbors.push(bubble.id + 12) }
}

function loadCannon() {
  cannon = new createjs.Bitmap("./sprites/cannon.png");
  cannon.x = 200;
  cannon.y = 485;
  cannon.regX = 10;
  cannon.regY = 60;
  stage.addChild(cannon);
}

function keydown(event) {
    keys[event.keyCode] = true;
    if (keys[32]) fireBubble();
}

function keyup(event) {
    delete keys[event.keyCode];
}

function Bubble(color) {
  bubble = new createjs.Bitmap(`./sprites/bubbles/${color}.png`);
  bubble.color = color;
  bubble.id = bubbleCount;
  bubble.neighbors = [];
  bubbleCount += 1;
  return bubble;
}

function randomBubble() {
  rand = Math.floor(Math.random() * Object.keys(colorsRemaining).length)
  return Bubble(Object.keys(colorsRemaining)[rand]);
}

function loadBubble() {
  newBubble = randomBubble();
  newBubble.x = 184;
  newBubble.y = 465;
  stage.addChild(newBubble);
}

function move() {
  movingObjects.forEach((obj) => {
    obj.x += obj.speed[0];
    obj.y += obj.speed[1];
    stage.update()
    if (wallDetect(obj)) obj.speed[0] *= -1;
    if (collisionDetect()) {
      bubbles[newBubble.id] = newBubble;
      let destroy = checkNeighbors(newBubble).concat([newBubble.id])
      if (destroy.length >= 3) destroyBubbles(destroy)
      movingObjects = [];
      createjs.Ticker.setFPS(60)
      loadBubble();
    }
    if (ceilingDetect()) {
      bubbles[newBubble.id] = newBubble;
      movingObjects = [];
      createjs.Ticker.setFPS(60)
      loadBubble();
    }
  })
}

function destroyBubbles(destroy) {
  destroy.forEach((bubble) => {
    if (bubbles[bubble]) {
      removeNeighbors(bubble)
      colorsRemaining[bubbles[bubble].color] -= 1;
      stage.removeChild(bubbles[bubble])
      delete bubbles[bubble]
    }
  })
  deleteMissingColors();
}

function removeNeighbors(bubble) {
  if (bubbles[bubble]) {
    bubbles[bubble].neighbors.forEach(neighbor => {
      if (bubbles[neighbor]) {
        let i = bubbles[neighbor].neighbors.indexOf(bubble)
        bubbles[neighbor].neighbors.splice(i, 1)
      }
    })
  }
}

function checkNeighbors(bubble, skip = []) {
  sameColorNeighbors = []
  bubble.neighbors.forEach((neighbor) => {
    if (bubble.color === bubbles[neighbor].color && !skip.includes(neighbor)) {
      sameColorNeighbors.push(neighbor)
      skip.push(bubble.id)
      sameColorNeighbors = sameColorNeighbors.concat(checkNeighbors(bubbles[neighbor], skip))
    }
  })
  return sameColorNeighbors;
}

function collisionDetect() {
  let collision = false;
  Object.values(bubbles).forEach((bubble) => {
    if (ndgmr.checkPixelCollision(newBubble, bubble)) {
      newBubble.neighbors.push(bubble.id)
      bubble.neighbors.push(newBubble.id)
      collision = true;
    }
  })
  return collision;
}

function ceilingDetect() {
  if (newBubble.y <= 0) {
    newBubble.y = 0;
    return true;
  }
}

function offScreen() {
  return newBubble.y < -40;
}

function wallDetect() {
  return newBubble.x <= 10 || newBubble.x >= 375;
}

function calculateXSpeed() {
  if (cannon.rotation <= -45) return -4;
  else if (cannon.rotation >= 45) return 4;
  else return (cannon.rotation / 45) * 4;
}

function calculateYSpeed() {
  if (cannon.rotation >= -45 && cannon.rotation <= 45) return -4;
  else if (cannon.rotation < -45) return ((90 + cannon.rotation) / 45) * -4;
  else return ((90 - cannon.rotation) / 45) * -4;
}

function fireBubble() {
  newBubble.speed = [calculateXSpeed(), calculateYSpeed()];
  colorsRemaining[newBubble.color] += 1;
  movingObjects.push(newBubble);
  createjs.Ticker.setFPS(200);
}

function endGame(status) {
  main.stop();
  debugger
  end.play();
  createjs.Ticker.removeAllEventListeners()
  stage.removeAllChildren();
  title = new createjs.Text(`YOU ${status}`, "36px Courier", "white");
  title.x = status === "LOSE" ? 110 : 120;
  title.y = 200;
  stage.addChild(title);
  renderPlayAgain();
  stage.update();
}

function renderPlayAgain() {
  play = new createjs.Text("PLAY AGAIN?", "36px Courier", "white");
  play.x = 80;
  play.y = 300;
  play.addEventListener("mouseover", playMouseover);
  play.addEventListener("mouseout", playMouseout);
  play.addEventListener("click", startGame);
  stage.addChild(play);
}

function lineBreach() {
  let breach = false;
  Object.keys(bubbles).forEach((bubble) => {
    if (bubbles[bubble].y >= 380) { breach = true; }
  });
  return breach;
}

function tick() {
  if (keys[37] && cannon.rotation >= -75) cannon.rotation -= 3;
  if (keys[39] && cannon.rotation <= 75) cannon.rotation += 3;
  if (keys[38]) cannon.rotation = 0;
  move();
  stage.update();
  if (Object.keys(bubbles).length === 0) {
    endGame("WIN");
  } else if (lineBreach()) {
    endGame("LOSE");
  }
}
