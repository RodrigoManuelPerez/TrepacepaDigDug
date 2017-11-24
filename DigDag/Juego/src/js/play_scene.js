'use strict';

var player;
var cursors;
var HUD;
var HUDs;

var posx=0;
var posy=600;

var distanceX=0;
var distanceY=0;

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

    player = new PlayerController(this.game,0,0, 'DigDug');
    this.game.world.addChild(player);

    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    HUD = this.game.add.physicsGroup();
    HUD.create(560, 0, 'HUD');
    HUD.setAll('body.immovable', true);

    cursors = this.game.input.keyboard.createCursorKeys();

    
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
}

function PlayerController(game) {
  Phaser.Sprite.call(this, game, game.world.centerX+125, game.world.centerY-260, 'DigDug');
  var speed=1;
  var dirx=0, diry=0;
}
PlayerController.prototype = Object.create(Phaser.Sprite.prototype);
PlayerController.constructor = PlayerController;

PlayerController.prototype.update = function () {


      this.game.physics.arcade.collide(player, HUD);
  
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
  
      if (cursors.left.isDown)
      {
          this.body.velocity.x = -200;
      }
      else if (cursors.right.isDown)
      {
          this.body.velocity.x = 200;
      }
      else if (cursors.up.isDown)
      {
          this.body.velocity.y = -200;
      }
      else if (cursors.down.isDown)
      {
          this.body.velocity.y = 200;
      }
    /*this.speed=2;
    
    if (cursors.left.isDown)
    {
      this.dirx=-1;
      this.diry=0;
      this.x += this.speed*this.dirx;  //velocidad
      distanceX+=2*this.dirx;
    }
    else if (cursors.right.isDown)
    {
      this.dirx=1;
      this.diry=0;
      this.x += this.dirx*2;
      distanceX+=2*this.dirx;
    }
    else if (cursors.up.isDown)
    {
      this.dirx=0;
      this.diry=-1;
      this.y += this.diry*2;
      distanceY+=2*this.diry;
    }
    else if (cursors.down.isDown)
    {
      /*this.dirx=0;
      this.diry=1;
      this.y += this.diry*2;
      distanceY+=2*this.diry;
    }

    /*if (distanceX>44 || distanceX<-44)
    distanceX=0;
    if (distanceY>44 || distanceY<-44)
    distanceY=0;
*/
    
}

module.exports = PlayScene;
