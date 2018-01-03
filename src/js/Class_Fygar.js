'use strict';

var Enemy = require('./Class_Enemy.js');

var Fygar = function(spritesheet, game, position, id, limiteDerecho, limiteSuperior, player, fireBullet){
    Enemy.apply(this, [spritesheet, game, position, id, limiteDerecho, limiteSuperior, player]);

    //this._animBreathFire = this.animations.add('Breathing',[9,10,11],3,false);   //animacion de coger fuego con 3 frames y sin loop

    this._TimerFuego = game.time.create(false);
    this._TimeToFire= Math.random() * (5000) + 5000;

    this._TimerFuego.add(this._TimeToFire,StopToFire,this);
    this._TimerFuego.start();

    this._ThrowingFire=false;
    
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    Fygar.prototype.update = function() {

        if(this._ThrowingFire){
            
        }


    }

    function StopToFire(){
        if(this._MovementEnable){
            this._MovementEnable=false;
            this._animWalk.stop();
            //this._animBreathFire.play(3,false);
            this._TimerFuego.add(2000,ThrowFire,this);//tiempo hay que calcularlo segun la animacion y como quiera que quede
            this._TimerFuego.start();
        }
    }

    function ThrowFire(){
        this._ThrowingFire=true;
    }

module.exports = Fygar;