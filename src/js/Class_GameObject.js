'use strict';

var GameObject = function(game, position, sprite,id,spriteSheet){
    
    if(id=='Player')
        Phaser.Sprite.apply(this,[game ,position._x, position._y, spriteSheet, 1]);
    else
        Phaser.Sprite.apply(this,[game ,position._x, position._y, sprite]);

    this._id=id;
    this._posX=position._x;
    this._posY=position._y;

}
GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

GameObject.prototype.Destroy = function()
{
    this.destroy();
}

module.exports = GameObject;