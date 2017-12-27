'use strict';

var GameObject = require('./Class_GameObject.js');


var Tierra = function(game, position,sprite, id, posCentral){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    
        this._posCentralX = posCentral._x;
        this._posCentralY = posCentral._y;
        
        }
    
        Tierra.prototype = Object.create(GameObject.prototype);
        Tierra.prototype.constructor = Tierra;


module.exports = Tierra;