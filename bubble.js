class Bubble {
  constructor(color, pos, id) {
    this.sprite = new createjs.Bitmap(`./sprites/bubbles/${color}.png`);
    this.color = color;
    this.id = id;
    this.neighbors = [];
    this.sprite.x = pos[0];
    this.sprite.y = pos[1];
  }
}

module.exports = Bubble;
