'use strict';

var Enemy = require('./Class_Enemy.js');

var Fygar = function(spritesheet, game, position, id, limiteDerecho, limiteSuperior, player, fireBullet){
    Enemy.apply(this, [spritesheet, game, position, id, limiteDerecho, limiteSuperior, player]);

    //this._animBreathFire = this.animations.add('Breathing',[9,10,11],3,false);   //animacion de coger fuego con 3 frames y sin loop

    this._TimerFuego = game.time.create(false);
    this._TimeToFire= Math.random() * (5000) + 10000;
    this._TimerFuego.add(this._TimeToFire,StopToFire,this);
    this._TimerFuego.start();

    this._ThrowingFire=false;
    this._MovementEnable=true;
    
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;


    function StopToFire(){
        if(this._MovementEnable && !this._Fantasma){
            console.debug('Pueh Me paro');
            this._MovementEnable=false;
            this._animWalk.stop();
            //this._animBreathFire.play(3,false);
            this._TimerFuego.add(1000,ThrowFire,this);//tiempo hay que calcularlo segun la animacion y como quiera que quede
            this._TimerFuego.start();
        }
        else{
            this._TimeToFire= Math.random() * (5000) + 10000;
            this._TimerFuego.add(this._TimeToFire,StopToFire,this);
            this._TimerFuego.start();
        }
    }

    function ThrowFire(){
        console.debug('Te escupofuego LK');
        this._ThrowingFire=true;
        this._TimerFuego.add(1000,Continue,this);
        this._TimerFuego.start();
    }

    function Continue(){
        console.debug(this._id);
        this._MovementEnable=true;
        this._ThrowingFire=false;
        this._animWalk.play(6,true);
        this._TimeToFire= Math.random() * (5000) + 10000;
        this._TimerFuego.add(this._TimeToFire,StopToFire,this);
        this._TimerFuego.start();
    }

module.exports = Fygar;