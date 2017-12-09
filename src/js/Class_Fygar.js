'use strict';

var Enemy = require('./Class_Enemy.js');

var Fygar = function(game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet){
    Enemy.apply(this, [game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet]);

    //PARA MONTAR LAS ANIMACIONES DEL DRAGON
    this._animWalk =this.animations.add('Walking');
    this._animWalk.play(6,true);
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    Fygar.prototype.PlayerRock = function() {
        this._Enable=false;
    }

module.exports = Fygar;