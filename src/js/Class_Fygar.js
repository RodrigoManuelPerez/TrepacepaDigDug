'use strict';

var Enemy = require('./Class_Enemy.js');

var Fygar = function(spritesheet, game, position, id, limiteDerecho, limiteSuperior, player, grupoTierra){
    Enemy.apply(this, [spritesheet, game, position, id, limiteDerecho, limiteSuperior, player]);

    this._animBreathFire = this.animations.add('Breathing',[1,9],5,true);   //animacion de coger fuego con 2 frames y 3 loops

    this._TimerFuego = game.time.create(false);
    this._TimeToFire= Math.random() * (5000) + 10000;
    this._TimerFuego.add(this._TimeToFire,StopToFire,this);
    this._TimerFuego.start();

    this._ThrowingFire=false;

    this._game = game;
    this._GrupoTierra = grupoTierra;
    this._FireBullet;
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    Fygar.prototype.update = function() 
    {
        this._game.physics.arcade.collide(this._FireBullet, this._GrupoTierra, onCollisionBulletTierra);

        

        Enemy.prototype.update.call(this);
    }

    function onCollisionBulletTierra(){

    }

    function StopToFire(){
        if(this._MovementEnable && !this._Fantasma){
            console.debug('Pueh Me paro');
            this._MovementEnable=false;
            this._animWalk.stop();
            this._animBreathFire.play(5,true);
            this._TimerFuego.add(1000,ThrowFire,this);//tiempo hay que calcularlo segun la animacion y como quiera que quede
            this._TimerFuego.start();

            this._FireBullet = new Phaser.Sprite(this._game, 0, 0, 'Banderita');
            this._game.physics.enable(this._FireBullet, Phaser.Physics.ARCADE);
            this._FireBullet.anchor.x = 0.5;
            this._FireBullet.anchor.y = 0.5;
            this._FireBullet.width = this._FireBullet.width/4;
            this._FireBullet.height = this._FireBullet.height/4;
        }
        else{
            this._TimeToFire= Math.random() * (5000) + 10000;
            this._TimerFuego.add(this._TimeToFire,StopToFire,this);
            this._TimerFuego.start();
        }
    }

    function ThrowFire(){
        console.debug('Te escupofuego LK');
        this._animBreathFire.stop();
        this._ThrowingFire=true;
        this._TimerFuego.add(500,Continue,this);
        this._TimerFuego.start();
    }

    function Continue(){
        console.debug('Continúo');
        this._MovementEnable=true;
        this._ThrowingFire=false;
        this._animWalk.play(6,true);
        this._TimeToFire= Math.random() * (5000) + 10000;
        this._TimerFuego.add(this._TimeToFire,StopToFire,this);
        this._TimerFuego.start();
    }

module.exports = Fygar;