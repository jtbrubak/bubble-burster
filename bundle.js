/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var Game = __webpack_require__(1);
	
	document.addEventListener("DOMContentLoaded", function () {
	  var stage = new createjs.Stage("demoCanvas");
	  var game = new Game(stage);
	  var title = new createjs.Text("Bubble Burster", "36px Courier", "white");
	  var play = new createjs.Text("PLAY", "36px Courier", "white");
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Bubble = __webpack_require__(2);
	var Util = __webpack_require__(3);
	var Board = __webpack_require__(4);
	
	var Game = function () {
	  function Game(stage) {
	    _classCallCheck(this, Game);
	
	    this.stage = stage;
	    this.move = this.move.bind(this);
	    this.startGame = this.startGame.bind(this);
	    this.keydown = this.keydown.bind(this);
	    this.keyup = this.keyup.bind(this);
	    this.checkNeighbors = this.checkNeighbors.bind(this);
	    this.collisionDetect = this.collisionDetect.bind(this);
	  }
	
	  _createClass(Game, [{
	    key: "setupVariables",
	    value: function setupVariables() {
	      this.keys = {};
	      this.colorsRemaining = { "yellow": 0, "red": 0, "purple": 0,
	        "blue": 0, "green": 0, "gray": 0 };
	      this.bubbleCount = 0;
	      this.bubbles = {};
	      this.movingObjects = [];
	      this.newBubble = null;
	      this.board = new Board();
	    }
	  }, {
	    key: "startGame",
	    value: function startGame() {
	      var _this = this;
	
	      this.setupVariables();
	      this.stage.removeAllChildren();
	      this.setupLine();
	      this.board.setupGrid();
	      this.setupBubbles();
	      this.loadCannon();
	      this.loadBubble();
	      createjs.Ticker.addEventListener("tick", function () {
	        return _this.tick();
	      });
	      createjs.Ticker.setFPS(60);
	      document.onkeydown = this.keydown;
	      document.onkeyup = this.keyup;
	      this.stage.update();
	    }
	  }, {
	    key: "setupLine",
	    value: function setupLine() {
	      var g = new createjs.Graphics();
	      g.setStrokeStyle(1);
	      g.beginStroke("white");
	      g.moveTo(0, 413).lineTo(400, 413);
	      var line = new createjs.Shape(g);
	      this.stage.addChild(line);
	    }
	  }, {
	    key: "setupBubbles",
	    value: function setupBubbles() {
	      var colorArray = Object.keys(this.colorsRemaining);
	      for (var x = 0; x < 5; x++) {
	        var rowLength = x % 2 === 0 ? 12 : 11;
	        var offset = x % 2 === 0 ? 0 : 16;
	        for (var y = 0; y < rowLength; y++) {
	          var rand = Math.floor(Math.random() * Object.keys(this.colorsRemaining).length);
	          var bubble = new Bubble(Object.keys(this.colorsRemaining)[rand], [offset + y * 33, x * 33], this.bubbleCount);
	          bubble.pos = [x, y];
	          this.board.grid[x][y].bubble = bubble.id;
	          this.colorsRemaining[bubble.color] += 1;
	          this.setupNeighbors(bubble);
	          this.bubbles[bubble.id] = bubble;
	          this.stage.addChild(bubble.sprite);
	          this.bubbleCount += 1;
	        }
	      }
	      this.deleteMissingColors();
	    }
	  }, {
	    key: "deleteMissingColors",
	    value: function deleteMissingColors() {
	      var colorArray = Object.keys(this.colorsRemaining);
	      for (var i = 0; i < colorArray.length; i++) {
	        if (this.colorsRemaining[colorArray[i]] === 0) {
	          delete this.colorsRemaining[colorArray[i]];
	        }
	      }
	    }
	  }, {
	    key: "setupNeighbors",
	    value: function setupNeighbors(bubble) {
	      var rowLength = bubble.pos[0] % 2 === 0 ? 11 : 10;
	      if (bubble.pos[1] !== 0) {
	        bubble.neighbors.push(bubble.id - 1);
	      }
	      if (bubble.pos[1] !== rowLength) {
	        bubble.neighbors.push(bubble.id + 1);
	      }
	      if (bubble.pos[0] !== 0) {
	        if (bubble.pos[1] !== rowLength || rowLength === 10) {
	          bubble.neighbors.push(bubble.id - 11);
	        }
	        if (bubble.pos[1] !== 0 || rowLength === 10) {
	          bubble.neighbors.push(bubble.id - 12);
	        }
	      }
	      if (bubble.pos[0] !== 4) {
	        if (bubble.pos[1] !== rowLength || rowLength === 10) {
	          bubble.neighbors.push(bubble.id + 12);
	        }
	        if (bubble.pos[1] !== 0 || rowLength === 10) {
	          bubble.neighbors.push(bubble.id + 11);
	        }
	      }
	    }
	  }, {
	    key: "loadCannon",
	    value: function loadCannon() {
	      this.cannon = new createjs.Bitmap("./sprites/cannon.png");
	      this.cannon.x = 200;
	      this.cannon.y = 485;
	      this.cannon.regX = 10;
	      this.cannon.regY = 60;
	      this.stage.addChild(this.cannon);
	    }
	  }, {
	    key: "keydown",
	    value: function keydown(event) {
	      this.keys[event.keyCode] = true;
	      if (this.keys[32]) this.fireBubble();
	    }
	  }, {
	    key: "keyup",
	    value: function keyup(event) {
	      delete this.keys[event.keyCode];
	    }
	  }, {
	    key: "loadBubble",
	    value: function loadBubble() {
	      var rand = Math.floor(Math.random() * Object.keys(this.colorsRemaining).length);
	      this.newBubble = new Bubble(Object.keys(this.colorsRemaining)[rand], [184, 465], this.bubbleCount);
	      this.bubbleCount += 1;
	      this.stage.addChild(this.newBubble.sprite);
	    }
	  }, {
	    key: "move",
	    value: function move() {
	      var _this2 = this;
	
	      this.movingObjects.forEach(function (obj) {
	        obj.sprite.x += obj.speed[0];
	        obj.sprite.y += obj.speed[1];
	        _this2.stage.update();
	        if (Util.wallDetect(_this2.newBubble)) obj.speed[0] *= -1;
	        if (_this2.collisionDetect()) {
	          _this2.bubbles[_this2.newBubble.id] = _this2.newBubble;
	          _this2.gridSnap(_this2.newBubble);
	          var destroy = _this2.checkNeighbors(_this2.newBubble).concat([_this2.newBubble.id]);
	          if (destroy.length >= 3) _this2.destroyBubbles(destroy);
	          _this2.movingObjects = [];
	          createjs.Ticker.setFPS(60);
	          _this2.loadBubble();
	        }
	        if (Util.ceilingDetect(_this2.newBubble)) {
	          _this2.bubbles[_this2.newBubble.id] = _this2.newBubble;
	          _this2.movingObjects = [];
	          createjs.Ticker.setFPS(60);
	          _this2.loadBubble();
	        }
	      }, this);
	    }
	  }, {
	    key: "gridSnap",
	    value: function gridSnap(bubble) {
	      var row = Math.round(bubble.sprite.y / 33);
	      bubble.sprite.y = row * 33;
	      if (row % 2 === 0) {
	        var col = Math.round(bubble.sprite.x / 33);
	        bubble.sprite.x = col * 33;
	      } else {
	        var col = Math.round((bubble.sprite.x - 16) / 33);
	        bubble.sprite.x = col > 10 ? 346 : col * 33 + 16;
	        col = col > 10 ? 10 : col;
	      }
	      bubble.pos = [row, col];
	      this.board.grid[row][col].bubble = bubble.id;
	      this.assignNeighbors(bubble);
	    }
	  }, {
	    key: "assignNeighbors",
	    value: function assignNeighbors(bubble) {
	      var _this3 = this;
	
	      var deltas = bubble.pos[0] % 2 === 0 ? Util.evenDeltas() : Util.oddDeltas();
	      deltas.forEach(function (delta) {
	        var neighborPos = [bubble.pos[0] + delta[0], bubble.pos[1] + delta[1]];
	        if (_this3.validNeighbor(neighborPos)) {
	          var neighborBubble = _this3.getId(neighborPos);
	          if (neighborBubble !== null) {
	            bubble.neighbors.push(neighborBubble);
	            _this3.bubbles[neighborBubble].neighbors.push(bubble.id);
	          }
	        }
	      });
	    }
	  }, {
	    key: "getId",
	    value: function getId(pos) {
	      return this.board.grid[pos[0]][pos[1]].bubble;
	    }
	  }, {
	    key: "validNeighbor",
	    value: function validNeighbor(pos) {
	      if (pos[0] < 0 || pos[1] < 0 || pos[1] > 11 || pos[0] % 2 === 1 && pos[1] > 10) {
	        return false;
	      } else {
	        return true;
	      }
	    }
	  }, {
	    key: "destroyBubbles",
	    value: function destroyBubbles(destroy) {
	      var _this4 = this;
	
	      destroy.forEach(function (bubble) {
	        if (_this4.bubbles[bubble]) {
	          _this4.removeNeighbors(bubble);
	          _this4.colorsRemaining[_this4.bubbles[bubble].color] -= 1;
	          _this4.stage.removeChild(_this4.bubbles[bubble].sprite);
	          var gridPos = _this4.bubbles[bubble].pos;
	          _this4.board.grid[gridPos[0]][gridPos[1]].bubble = null;
	          delete _this4.bubbles[bubble];
	        }
	      }, this);
	      this.deleteMissingColors();
	    }
	  }, {
	    key: "removeNeighbors",
	    value: function removeNeighbors(bubble) {
	      var _this5 = this;
	
	      if (this.bubbles[bubble]) {
	        this.bubbles[bubble].neighbors.forEach(function (neighbor) {
	          if (_this5.bubbles[neighbor]) {
	            var i = _this5.bubbles[neighbor].neighbors.indexOf(bubble);
	            _this5.bubbles[neighbor].neighbors.splice(i, 1);
	          }
	        });
	      }
	    }
	  }, {
	    key: "checkNeighbors",
	    value: function checkNeighbors(bubble) {
	      var _this6 = this;
	
	      var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	      var sameColorNeighbors = [];
	      bubble.neighbors.forEach(function (neighbor) {
	        if (bubble.color === _this6.bubbles[neighbor].color && !skip.includes(neighbor)) {
	          sameColorNeighbors.push(neighbor);
	          skip.push(bubble.id);
	          sameColorNeighbors = sameColorNeighbors.concat(_this6.checkNeighbors(_this6.bubbles[neighbor], skip));
	        }
	      }, this);
	      return sameColorNeighbors;
	    }
	  }, {
	    key: "collisionDetect",
	    value: function collisionDetect() {
	      var _this7 = this;
	
	      var collision = false;
	      Object.values(this.bubbles).forEach(function (bubble) {
	        if (ndgmr.checkPixelCollision(_this7.newBubble.sprite, bubble.sprite)) {
	          collision = true;
	        }
	      }, this);
	      return collision;
	    }
	  }, {
	    key: "fireBubble",
	    value: function fireBubble() {
	      this.newBubble.speed = [Util.calculateXSpeed(this.cannon), Util.calculateYSpeed(this.cannon)];
	      this.colorsRemaining[this.newBubble.color] += 1;
	      this.movingObjects.push(this.newBubble);
	      createjs.Ticker.setFPS(200);
	    }
	  }, {
	    key: "endGame",
	    value: function endGame(status) {
	      createjs.Ticker.removeAllEventListeners();
	      this.stage.removeAllChildren();
	      var title = new createjs.Text("YOU " + status, "36px Courier", "white");
	      title.x = status === "LOSE" ? 110 : 120;
	      title.y = 200;
	      this.stage.addChild(title);
	      this.renderPlayAgain();
	      this.stage.update();
	    }
	  }, {
	    key: "renderPlayAgain",
	    value: function renderPlayAgain() {
	      var play = new createjs.Text("PLAY AGAIN?", "36px Courier", "white");
	      play.x = 80;
	      play.y = 300;
	      play.addEventListener("click", this.startGame);
	      this.stage.addChild(play);
	    }
	  }, {
	    key: "lineBreach",
	    value: function lineBreach() {
	      var _this8 = this;
	
	      var breach = false;
	      Object.keys(this.bubbles).forEach(function (bubble) {
	        if (_this8.bubbles[bubble].sprite.y >= 380) {
	          breach = true;
	        }
	      }, this);
	      return breach;
	    }
	  }, {
	    key: "tick",
	    value: function tick() {
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
	  }]);
	
	  return Game;
	}();
	
	module.exports = Game;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Bubble = function Bubble(color, pos, id) {
	  _classCallCheck(this, Bubble);
	
	  this.sprite = new createjs.Bitmap("./sprites/bubbles/" + color + ".png");
	  this.color = color;
	  this.id = id;
	  this.neighbors = [];
	  this.sprite.x = pos[0];
	  this.sprite.y = pos[1];
	  this.pos = null;
	};
	
	module.exports = Bubble;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	
	var Util = {
	  evenDeltas: function evenDeltas() {
	    return [[-1, 0], [-1, -1], [0, -1], [0, 1], [1, -1], [1, 0]];
	  },
	  oddDeltas: function oddDeltas() {
	    return [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
	  },
	  ceilingDetect: function ceilingDetect(bubble) {
	    if (bubble.sprite.y <= 0) {
	      bubble.sprite.y = 0;
	      return true;
	    }
	  },
	  wallDetect: function wallDetect(bubble) {
	    return bubble.sprite.x <= 10 || bubble.sprite.x >= 375;
	  },
	  calculateXSpeed: function calculateXSpeed(cannon) {
	    if (cannon.rotation <= -45) return -4;else if (cannon.rotation >= 45) return 4;else return cannon.rotation / 45 * 4;
	  },
	  calculateYSpeed: function calculateYSpeed(cannon) {
	    if (cannon.rotation >= -45 && cannon.rotation <= 45) return -4;else if (cannon.rotation < -45) return (90 + cannon.rotation) / 45 * -4;else return (90 - cannon.rotation) / 45 * -4;
	  }
	};
	
	module.exports = Util;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	//12 across, 13 down
	
	var Board = function () {
	  function Board() {
	    _classCallCheck(this, Board);
	
	    this.grid = [];
	  }
	
	  _createClass(Board, [{
	    key: "setupGrid",
	    value: function setupGrid() {
	      for (var row = 0; row < 13; row++) {
	        this.grid[row] = [];
	        if (row % 2 === 0) {
	          this.setupEvenRow(row);
	        } else {
	          this.setupOddRow(row);
	        }
	      }
	    }
	  }, {
	    key: "setupEvenRow",
	    value: function setupEvenRow(row) {
	      for (var col = 0; col < 12; col++) {
	        this.grid[row][col] = {};
	        this.grid[row][col].x = col * 33;
	        this.grid[row][col].y = row * 33;
	        this.grid[row][col].bubble = null;
	      }
	    }
	  }, {
	    key: "setupOddRow",
	    value: function setupOddRow(row) {
	      for (var col = 0; col < 12; col++) {
	        this.grid[row][col] = {};
	        this.grid[row][col].x = col * 33;
	        this.grid[row][col].y = row * 33 + 16;
	        this.grid[row][col].bubble = null;
	      }
	    }
	  }]);
	
	  return Board;
	}();
	
	module.exports = Board;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map