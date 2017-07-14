const Util = {
  evenDeltas() {
    return [[-1, 0], [-1, -1], [0, -1], [0, 1], [1, -1], [1, 0]]
  },

  oddDeltas() {
    return [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]]
  },

  ceilingDetect(bubble) {
    if (bubble.sprite.y <= 0) {
      bubble.sprite.y = 0
      return true
    }
  },

  wallDetect(bubble) {
    return bubble.sprite.x <= 10 || bubble.sprite.x >= 375;
  },

  calculateXSpeed(cannon) {
    if (cannon.rotation <= -45) return -4;
    else if (cannon.rotation >= 45) return 4;
    else return (cannon.rotation / 45) * 4;
  },

  calculateYSpeed(cannon) {
    if (cannon.rotation >= -45 && cannon.rotation <= 45) return -4;
    else if (cannon.rotation < -45) return ((90 + cannon.rotation) / 45) * -4;
    else return ((90 - cannon.rotation) / 45) * -4;
  },
};

module.exports = Util;
