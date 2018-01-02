'use strict';

var Flower = function(game, posx, posy, spriteSheet){
    
    Phaser.Sprite.apply(this,[game ,posx, posy, spriteSheet, 0]);

    this._Anim =this.animations.add('Move', [0,1], 4, true);
    this._Anim.play(4,true);

}
Flower.prototype = Object.create(Phaser.Sprite.prototype);
Flower.prototype.constructor = Flower;

module.exports = Flower;