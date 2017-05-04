BUBBLE_COLORS = { 1: 'yellow', 2: 'gray', 3: 'red', 4: 'purple',
                  5: 'orange', 6: 'green', 7: 'blue', 8: 'black'};

function init() {
  stage = new createjs.Stage("demoCanvas");
  keys = {};
  bubbleCount = 0;
  bubbles = {};
  movingObjects = [];
  addCannon();
  loadBubble();
  createjs.Ticker.addEventListener("tick", () => tick());
  createjs.Ticker.setFPS(90);
  this.document.onkeydown = keydown;
  this.document.onkeyup = keyup;
  stage.update();
}

function addCannon() {
  cannon = new createjs.Bitmap("./sprites/cannon.png");
  cannon.x = 200;
  cannon.y = 485;
  cannon.regX = 10;
  cannon.regY = 60;
  stage.addChild(cannon);
}

function keydown(event) {
    keys[event.keyCode] = true;
    if (keys[37] && cannon.rotation >= -75) cannon.rotation -= 3;
    if (keys[39] && cannon.rotation <= 75) cannon.rotation += 3;
    if (keys[38]) cannon.rotation = 0;
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
  return Bubble(Math.floor(Math.random() * (9 - 1)) + 1);
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
    if (wallDetect(obj)) obj.speed[0] *= -1;
    if (collisionDetect()) {
      bubbles[newBubble.id] = newBubble;
      movingObjects = [];
      loadBubble();
    }
    if (ceilingDetect()) {
      bubbles[newBubble.id] = newBubble;
      movingObjects = [];
      loadBubble();
    }
  })
}

checkNeighbors() {
  newBubble.neighbors.forEach
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
  if (cannon.rotation <= -45) return -5;
  else if (cannon.rotation >= 45) return 5;
  else return (cannon.rotation / 45) * 5;
}

function calculateYSpeed() {
  if (cannon.rotation >= -45 && cannon.rotation <= 45) return -5;
  else if (cannon.rotation < -45) return ((90 + cannon.rotation) / 45) * -5;
  else return ((90 - cannon.rotation) / 45) * -5;
}

function fireBubble() {
  newBubble.speed = [calculateXSpeed(), calculateYSpeed()];
  movingObjects.push(newBubble);
}

function tick() {
  move();
  stage.update();
}
