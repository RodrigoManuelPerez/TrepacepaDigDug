'use strict';

var GameObject = require('./Class_GameObject.js');

var Vegetal = function(game, position, sprite,id, puntos){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    this._puntos = puntos;
    }

    Vegetal.prototype = Object.create(GameObject.prototype);
    Vegetal.prototype.constructor = Vegetal;

    Vegetal.prototype.AumentaPuntos=function() {

        puntuacion+=this._puntos;
        this.Destroy();
    }

module.exports = Vegetal;