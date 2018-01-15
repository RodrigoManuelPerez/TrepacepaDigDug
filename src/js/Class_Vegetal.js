'use strict';

var GameObject = require('./Class_GameObject.js');

var Vegetal = function(game, position, sprite, id, puntos) {
    
    GameObject.apply(this, [game, position, sprite, id]);
    this._puntos = puntos;
    this._timer = this.game.time.create(false);
}

    Vegetal.prototype = Object.create(GameObject.prototype);
    Vegetal.prototype.constructor = Vegetal;

    Vegetal.prototype.Desaparece = function() {
        this._timer.loop(7500, Destruirse, this);
        this._timer.start();
    }

    function Destruirse(){
        this.destroy();
    }

module.exports = Vegetal;