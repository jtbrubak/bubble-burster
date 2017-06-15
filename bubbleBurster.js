const Game = require("./game.js");

document.addEventListener("DOMContentLoaded", function() {
  const stage = new createjs.Stage("demoCanvas");
  const game = new Game(stage);
  const title = new createjs.Text("Bubble Burster", "36px Courier", "white");
  const play = new createjs.Text("PLAY", "36px Courier", "white");
  stage.enableMouseOver();
  play.addEventListener("mouseover", playMouseover);
  play.addEventListener("mouseout", playMouseout);
  play.addEventListener("click", game.startGame);
  title.x = 50;
  title.y = 200;
  play.x = 155;
  play.y = 300;
  stage.addChild(title);
  stage.addChild(play);
  stage.update();

  function playMouseover() {
    play.color = "green";
    stage.update();
  }

  function playMouseout() {
    play.color = "white";
    stage.update();
  }
});
