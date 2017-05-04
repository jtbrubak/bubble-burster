function init() {
  stage = new createjs.Stage("demoCanvas");
  cannon = new createjs.Bitmap("./cannon.png");
  keys = {};
  cannon.x = 200;
  cannon.y = 485;
  cannon.regX = 10;
  cannon.regY = 60;
  stage.addChild(cannon);
  createjs.Ticker.addEventListener("tick", () => tick());
  this.document.onkeydown = keydown;
  this.document.onkeyup = keyup;
  stage.update();
}

function keydown(event) {
    keys[event.keyCode] = true;
}

function keyup(event) {
    delete keys[event.keyCode];
}

function tick() {
  if (keys[37] && cannon.rotation >= -75) cannon.rotation -= 5;
  if (keys[39] && cannon.rotation <= 75) cannon.rotation += 5;
  stage.update();
}
