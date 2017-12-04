'use strict';

var GameObject = require('./Class_GameObject.js');

var Movable = function(game, position, sprite, id, distanceX, distanceY, limiteDerecho, limiteSuperior, spriteSheet){
    
    GameObject.apply(this, [game ,position, sprite, id, spriteSheet]);

    this._MovementEnable = true;

    this._Enableleft = true;
    this._Enableright = true;
    this._Enableup = true;
    this._Enabledown = true;

    this._Movingleft = false;
    this._Movingright = false;
    this._Movingup = false;
    this._Movingdown = false;

    this._distanceX = distanceX;
    this._distanceY = distanceY;

    this._LimiteSuperior = limiteSuperior;
    this._LimiteDerecho = limiteDerecho;
    }

    Movable.prototype = Object.create(GameObject.prototype);
    Movable.prototype.constructor = Movable;

module.exports = Movable;