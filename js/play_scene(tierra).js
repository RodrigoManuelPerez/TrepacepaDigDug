'use strict';

var posx=0;
var posy=600;

var PlayScene = {
  create: function () {

    

    for (var i = 0; i < 12; i++) {
      for (var j = 0; j < 12; j++) {
        var ground = new Tierra(this.game, 0, 0, 'ground');
        this.game.world.addChild(ground);
        posx+=47;
      }
      posy-=47;
      posx=0;
    }
  },
  update: function(){

  },

  render: function(){

  }
};

function Tierra(game) {
  Phaser.Sprite.call(this, game, posx, posy, 'ground');
}
Tierra.prototype = Object.create(Phaser.Sprite.prototype);
Tierra.constructor = Tierra;

Tierra.prototype.update = function () {
  //this.y += 2;
}

module.exports = PlayScene;
