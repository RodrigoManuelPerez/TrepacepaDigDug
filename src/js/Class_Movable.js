'use strict';

var GameObject = require('./Class_GameObject.js');

var Movable = function(game, position, id, limiteDerecho, limiteSuperior, spriteSheet){
    
    GameObject.apply(this, [game ,position, spriteSheet[0], id, spriteSheet]);

    this._MovementEnable = true;

    this._Enableleft = true;
    this._Enableright = true;
    this._Enableup = true;
    this._Enabledown = true;

    this._Movingleft = false;
    this._Movingright = false;
    this._Movingup = false;
    this._Movingdown = false;

    this._distanceX = 0;
    this._distanceY = 0;

    this._LimiteSuperior = limiteSuperior;
    this._LimiteDerecho = limiteDerecho;
    }

    Movable.prototype = Object.create(GameObject.prototype);
    Movable.prototype.constructor = Movable;

    Movable.prototype.Aplastado = function(f) { //Recibe el parametro f que indica el frame
        this.frame=f;
        console.debug(f);
    }
module.exports = Movable;