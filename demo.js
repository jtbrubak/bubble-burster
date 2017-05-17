BUBBLE_COLORS = { 1: 'yellow', 2: 'gray', 3: 'red',
                  4: 'purple', 5: 'orange', 6: 'green'};

function init() {
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
  stage.removeAllChildren();
  keys = {};
  bubbleCount = 0;
  bubbles = {};
  movingObjects = [];
  this.setupBubbles();
  loadCannon();
  loadBubble();
  createjs.Ticker.addEventListener("tick", () => tick());
  createjs.Ticker.setFPS(60);
  this.document.onkeydown = keydown;
  this.document.onkeyup = keyup;
  stage.update();
}

function setupBubbles() {
  for (x = 0; x < 1; x++) {
    for (y = 0; y < 12; y++) {
      let bubble = Bubble(1);
      bubble.x = y * 33;
      bubble.y = x * 33;
      setupNeighbors(bubble);
      bubbles[bubble.id] = bubble;
      stage.addChild(bubble);
    }
  }
}

function setupNeighbors(bubble) {
  if (bubble.id % 12 !== 0) { bubble.neighbors.push(bubble.id - 1) }
  if (bubble.id % 12 !== 11) { bubble.neighbors.push(bubble.id + 1) }
  // if (bubble.id > 11) { bubble.neighbors.push(bubble.id - 12) }
  // if (bubble.id < 48) { bubble.neighbors.push(bubble.id + 12) }
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

function Bubble(num) {
  bubble = new createjs.Bitmap(`./sprites/bubbles/${num}.png`);
  bubble.color = BUBBLE_COLORS[num];
  bubble.id = bubbleCount;
  bubble.neighbors = [];
  bubbleCount += 1;
  return bubble;
}

function randomBubble() {
  // return Bubble(Math.floor(Math.random() * (7 - 1)) + 1);
  return Bubble(1)
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
    removeNeighbors(bubble)
    stage.removeChild(bubbles[bubble])
    delete bubbles[bubble]
  })
  debugger
  if (Object.keys(bubbles).length === 0) { endGame(); }
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
  movingObjects.push(newBubble);
  createjs.Ticker.setFPS(200);
}

function endGame() {
  debugger
  stage.removeAllChildren();
}

function tick() {
  if (keys[37] && cannon.rotation >= -75) cannon.rotation -= 3;
  if (keys[39] && cannon.rotation <= 75) cannon.rotation += 3;
  if (keys[38]) cannon.rotation = 0;
  move();
  stage.update();
}
