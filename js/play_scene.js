'use strict';

var PlayScene = {
  create: function () {
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'DigDug');
    logo.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable(logo);
    logo.body.collideWorldBounds = true;
    var cursors = this.game.input.keyboard.createCursorKeys();

  },
  update: function(){
        
    /*logo.body.velocity.x = 0;
    logo.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
      logo.body.velocity.x = -250;
    }
    else if (cursors.right.isDown)
    {
      logo.body.velocity.x = 250;
    }
    else if (cursors.up.isDown)
    {
      logo.body.velocity.y = -250;
    }
    else if (cursors.down.isDown)
    {
      logo.body.velocity.y = 250;
    }*/
  },
  render: function(){
  }
};

module.exports = PlayScene;
