(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Movable = require('./Class_Movable.js');

var Enemy = function(spritesheet,cube, game, position, id, limiteDerecho, limiteSuperior, player){
    Movable.apply(this, [game, position, id, limiteDerecho, limiteSuperior, spritesheet]);
    
    this._animWalk =this.animations.add('Walking', [0,1], 6, true);
    this._animFant =this.animations.add('Digging', [2,3], 6, true);

    this._animWalk.play(6,true);
    this._game=game;

    this._distanceXtoPlayer;
    this._distanceYtoPlayer;
    this._Movingright=true;

    this._giros=0;

    this._posOriginalX = position._x;
    this._posOriginalY = position._y;

    this._Fantasma=false;
    this._SemiVelocidad=0;
    this._posicionInicial=0;

    this._player=player;
    this._cubohuida = cube;
    this._Aplastado=false;

    this._limiteDerecho=limiteDerecho;
    this._limiteSuperior=limiteSuperior;

    this._bufferBounce=1;
    this._NumberOfGiros= Math.floor(Math.random() * (10) + 20);

    this._MovementEnable=true;

    //MUERTE
    this._Puntos = 300;
    this._PuntosContabilizados = false;
    this._Muerto = false;
    this._Sound = game.add.audio('Points',1);
    this._SoundMuerte = game.add.audio('Pop',1);
    this._timerMuerte;
    
    //HUIDA
    this._Huyendo=false;
    this._ultimoGiro=false;

    //ENGANCHADO
    this._State=0;
    this._TimerState = game.time.create(false);
    this._TimerState.add(1500,ReduceState,this);
    this._timerStarted=false;

    }

    Enemy.prototype = Object.create(Movable.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.update = function() 
    {
        if(this._MovementEnable && this._State==0){

            if(this._giros>this._NumberOfGiros && !this._Fantasma){         //HACER QUE EL NUMERO DE GIROS SEA RANDOM CON UN MINIMO
                this._giros=0;
                if(!this._Huyendo)
                    this._NumberOfGiros= Math.floor(Math.random() * (15) + 15);
                else
                    this._NumberOfGiros= Math.floor(Math.random() * (10) + 5);
                this._animWalk.stop();
                this._animFant.play(4,true);
                this._Fantasma=true;
                this.angle=0;
                if(this.width<0)
                    this.width=-this.width;
                this.ChangeDirPhantom();
            }

            if((this._Fantasma && this._SemiVelocidad==0) || !this._Fantasma){

                if(this._Movingleft && (this.x>15 || this._ultimoGiro)){
                    this.x--;
                    this._distanceX--;
                    if(!this._Fantasma){
                        if(this.width>0)
                            this.width=-this.width;
                        if(this.angle!=0)
                            this.angle=0;
                    }
                }
                else if(this._Movingright && this.x<this._limiteDerecho-15){
                    this.x++;
                    this._distanceX++;
                    if(!this._Fantasma){
                        if(this.width<0)
                            this.width=-this.width;
                        if(this.angle!=0)
                            this.angle=0;
                    }
                }
                if(this._Movingup && this.y>this._limiteSuperior+10){
                    this.y--;
                    this._distanceY--;
                    if(!this._Fantasma){
                        if(this.angle!=-90)
                            this.angle=-90;
                        if(this.width<0)
                            this.width=-this.width;
                    }
                }
                else if(this._Movingdown && this.y<585){
                    this.y++;
                    this._distanceY++;
                    if(!this._Fantasma){
                        if(this.angle!=90)
                            this.angle=90;
                        if(this.width<0)
                            this.width=-this.width;
                    }
                }
                if(this._Fantasma)
                    this._SemiVelocidad++;
            }
            else{
                if(this._SemiVelocidad>=1){
                    this._SemiVelocidad=0;
                }
                else
                    this._SemiVelocidad++;
            }


            if (this._distanceX > 42 || this._distanceX < -42){

                if(this._ultimoGiro){
                    this._Movingright=false;
                    this._Movingleft=true;
                    this._Movingup=false;
                    this._Movingdown=false;
                    this._distanceX = 0;
                    this._giros++;
                }
                else if(this._Fantasma){
                    if(this._posicionInicial<2)
                        this._posicionInicial++;
                    this.ChangeDirPhantom();
                    this._distanceX = 0;
                }
                else{
                    this._distanceX = 0;
                    if(this._bufferBounce==0){
                        this.ChangeDirVer();
                        this._giros++;
                    }
                    else{
                        this._bufferBounce--;
                    }
                }
            }
            if (this._distanceY > 42 || this._distanceY < -42){
                
                if(this._ultimoGiro){
                    this._Movingright=false;
                    this._Movingleft=true;
                    this._Movingup=false;
                    this._Movingdown=false;
                    this._distanceY = 0;
                    this._giros++;
                }
                else if(this._Fantasma){
                    if(this._posicionInicial<2)
                        this._posicionInicial++;
                    this.ChangeDirPhantom();
                    this._distanceY = 0;
                }
                else{
                    this._distanceY = 0;
                    if(this._bufferBounce==0){
                        this.ChangeDirHor();
                        this._giros++;
                    }
                    else{
                        this._bufferBounce--;
                    }
                }
            }            
        }
        else if(this._State>0 && !this._timerStarted){
            this._timerStarted=true;
            this._TimerState = this._game.time.create(false);
            this._TimerState.add(1500,ReduceState,this);
            this._TimerState.start();
        }

        if(this._State>0 && this._State<5){
            if(this.frame!=(4+this._State))
                this.frame=(4+this._State);
        }

        if(!this._Fantasma && !this.body.enable && this._State==0){
            this.body.enable=true;
            console.debug('he corregido un fantasma');
        }

    }


    Enemy.prototype.ChangeDirHor = function() {
        
        this.y-=this._distanceY;
        this._distanceY=0;
        this._bufferBounce=1;
        if(!this._ultimoGiro){
            if(!this._Huyendo){
                if(this._player.x > this.x){
                    this._Movingright=true;
                    this._Movingleft=false;
                    this._Movingup=false;
                    this._Movingdown=false;
                }
                else if(this._player.x < this.x){
                    this._Movingright=false;
                    this._Movingleft=true;
                    this._Movingup=false;
                    this._Movingdown=false;
                }
            }
            else{
                if(this._cubohuida.x > this.x){
                    this._Movingright=true;
                    this._Movingleft=false;
                    this._Movingup=false;
                    this._Movingdown=false;
                }
                else if(this._cubohuida.x < this.x){
                    this._Movingright=false;
                    this._Movingleft=true;
                    this._Movingup=false;
                    this._Movingdown=false;
                }
            }
        }
    }

    Enemy.prototype.ChangeDirVer = function() {

        this.x-=this._distanceX;
        this._distanceX=0;
        this._bufferBounce=1;
        if(!this._ultimoGiro){
            if(!this._Huyendo){
                if(this._player.y > this.y){
                    this._Movingright=false;
                    this._Movingleft=false;
                    this._Movingup=false;
                    this._Movingdown=true;
                }
                else if(this._player.y < this.y){
                    this._Movingright=false;
                    this._Movingleft=false;
                    this._Movingup=true;
                    this._Movingdown=false;
                }
            }
            else{
                if(this._cubohuida.y > this.y){
                    this._Movingright=false;
                    this._Movingleft=false;
                    this._Movingup=false;
                    this._Movingdown=true;
                }
                else if(this._cubohuida.y < this.y){
                    this._Movingright=false;
                    this._Movingleft=false;
                    this._Movingup=true;
                    this._Movingdown=false;
                }
            }
        }
    }

    Enemy.prototype.ChangeDirTierra = function() {

        this._giros++;
        if(!this._ultimoGiro){
            if (this._Movingleft){
                this._Movingleft=false;
                this._Movingright=true;
            }
            else if(this._Movingright){
                this._Movingleft=true;
                this._Movingright=false;
            }
            else if(this._Movingup){
                this._Movingdown=true;
                this._Movingup=false;
            }
            else if(this._Movingdown){
                this._Movingup=true;
                this._Movingdown=false;
            }
        }
    }


    Enemy.prototype.ChangeDirPhantom = function() {
        if(!this._ultimoGiro){
            if(!this._Huyendo){
                if(this._player.x > this.x){
                    this._Movingright=true;
                    this._Movingleft=false;
                }
                else if (this._player.x < this.x){
                    this._Movingright=false;
                    this._Movingleft=true;
                }
                if(this._player.y > this.y){
                    this._Movingup=false;
                    this._Movingdown=true;
                }
                else if(this._player.y < this.y){
                    this._Movingup=true;
                    this._Movingdown=false;
                }
            }
            else{
                if(this._cubohuida.x > this.x){
                    this._Movingright=true;
                    this._Movingleft=false;
                }
                else if (this._cubohuida.x < this.x){
                    this._Movingright=false;
                    this._Movingleft=true;
                }
                if(this._cubohuida.y > this.y){
                    this._Movingup=false;
                    this._Movingdown=true;
                }
                else if(this._cubohuida.y < this.y){
                    this._Movingup=true;
                    this._Movingdown=false;
                }
            }
        }
    }

    Enemy.prototype.BackToNormal = function(Px,Py) {
        this._Fantasma=false;
        this._animFant.stop();
        this.body.enable=true;
        this._giros=0;
        this._posicionInicial=0;
        this._distanceX=0;
        this._distanceY=0;
        this.x=Px;
        this.y=Py;
        this._animWalk.play(6,true);
    }



    function ReduceState(){

        if(this._State>0 && this._State<4){
            this._State--;
            this._TimerState.stop();
        } 

        if(this._State>0 && this._State<4){
            this._TimerState = this._game.time.create(false);
            this._TimerState.add(1250,ReduceState,this);
            this._TimerState.start();
        }
        else if(this._State==0){
            this._TimerState.stop();
            this._animWalk.play(6,true);
            this._timerStarted=false;
            this._MovementEnable=true;
        }
        else if(this._State==4){
            this._TimerState.stop();
            this.body.enable=false;
            this._Muerto=true;
            this._SoundMuerte.play();
            this._timerMuerte = this._game.time.create(false);
            this._timerMuerte.add(1000,Sonido,this);
            this._timerMuerte.start();
        }
        
    }
    function Sonido(){
        this._State++;
        this.angle=0;
        if(this.width<0)
            this.width=-this.width;
        if(this._Puntos==400)   //A ESTAS ALTURAS NO ME DA TIEMPO A PENSAR EN POLIMORFISMO
            this.frame=10;
        else
            this.frame=9;
        this._Sound.play();
        this._timerMuerte = this._game.time.create(false);
        this._timerMuerte.add(1000,Muerte,this);
        this._timerMuerte.start();

    }

    function Muerte(){
        this.destroy();
    }


module.exports = Enemy;
},{"./Class_Movable.js":5}],2:[function(require,module,exports){
'use strict';

var Flower = function(game, posx, posy, spriteSheet) {
    
    Phaser.Sprite.apply(this, [game ,posx, posy, spriteSheet, 0]);

    this._Anim =this.animations.add('Move', [0, 1], 2, true);
    this._Anim.play(2, true);
}

Flower.prototype = Object.create(Phaser.Sprite.prototype);
Flower.prototype.constructor = Flower;

module.exports = Flower;
},{}],3:[function(require,module,exports){
'use strict';

var Enemy = require('./Class_Enemy.js');

// Numeros Magicos
var DisparoAuxiliarDistanciaMax = 120;
var DisparoAuxMovimiento = 2

var FuegoDistanciaMax = 115;
var FuegoDistanciaMedia = 75;
var FuegoDistanciaMin = 30;

var FuegoCentroLargo = 70
var FuegoCentroMedio = 50;
var FuegoCentroCorto = 32;

var Fygar = function(spritesheet, cube, game, position, id, limiteDerecho, limiteSuperior, player, grupoTierra) {
    Enemy.apply(this, [spritesheet, cube, game, position, id, limiteDerecho, limiteSuperior, player]);

    this._Puntos=400;
    this._animBreathFire = this.animations.add('Breathing', [1, 9], 5, true);   

    this._TimerFuego = game.time.create(false);
    this._TimeToFire = Math.random() * (5000) + 10000;
    this._TimerFuego.add(this._TimeToFire, StopToFire, this);
    this._TimerFuego.start();

    this._ThrowingBullet = false;
    this._ThrowingFire = false;
    this._playerBurnt = false;

    this._player = player;
    this._game = game;
    this._GrupoTierra = grupoTierra;
    this._FireBullet;

    this._distanciaX = 0;
    this._distanciaY = 0;

    this._Fire;

    this._2FiresAnim;
    this._3FiresAnim;

    this._FireSound = game.add.audio('Dragon', 7);
}

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    // Lanzar una bala para medir la distancia que hay hasta un objetivo
    //y asi saber que tipo de fuego lanzar: de 1 casilla, 2 o 3 casillas
    //de longitud
    Fygar.prototype.update = function() {
        if (this._ThrowingBullet) {
            if (this._Movingleft) {
                if (this._distanciaX > -DisparoAuxiliarDistanciaMax) {
                    this._distanciaX -= DisparoAuxMovimiento;
                    this._FireBullet.x -= DisparoAuxMovimiento;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
            else if (this._Movingright) {
                if (this._distanciaX < DisparoAuxiliarDistanciaMax) {
                    this._distanciaX += DisparoAuxMovimiento;
                    this._FireBullet.x += DisparoAuxMovimiento;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
            else if (this._Movingup) {
                if (this._distanciaY > -DisparoAuxiliarDistanciaMax) {
                    this._distanciaY -= DisparoAuxMovimiento;
                    this._FireBullet.y -= DisparoAuxMovimiento;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
            else if (this._Movingdown) {
                if (this._distanciaY < DisparoAuxiliarDistanciaMax) {
                    this._distanciaY += DisparoAuxMovimiento;
                    this._FireBullet.y += DisparoAuxMovimiento;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
        }
        
        if (this._game.physics.arcade.collide(this._FireBullet, this._GrupoTierra))
            onCollisionBulletTierra.call(this);

        if (this._game.physics.arcade.collide(this._player, this._Fire))
            onCollisionFirePlayer.call(this);

        Enemy.prototype.update.call(this);
    }

    function onCollisionFirePlayer() {
        if (!this._playerBurnt && !this._player._animMuerto && !this._player._Muerto) {
            this._playerBurnt = true;
            this._player.Muerte();
        }
    }

    function onCollisionBulletTierra() {
        this._ThrowingBullet = false;
        this._FireBullet.destroy();
    }

    function StopToFire() {
        if (this._MovementEnable && !this._Fantasma && this != undefined && this._State==0 && !this._Aplastado) {

            this._MovementEnable = false;
            this._animWalk.stop();
            this._animBreathFire.play(5, true);

            this._TimerFuego.add(1000, ThrowFire, this);
            this._TimerFuego.start();

            this._FireBullet = new Phaser.Sprite(this._game, this.x, this.y, 'Banderita');
            this._game.physics.enable(this._FireBullet, Phaser.Physics.ARCADE);
            
            this._FireBullet.height = this._FireBullet.height / 4;
            this._FireBullet.width = this._FireBullet.width / 4;
            this._FireBullet.visible = true;
            this._FireBullet.anchor.x = 0.5;
            this._FireBullet.anchor.y = 0.5;
            this._game.world.add(this._FireBullet);

            this._ThrowingBullet = true;
        }
        else {
            this._TimeToFire = Math.random() * (5000) + 10000;
            this._TimerFuego.add(this._TimeToFire, StopToFire, this);
            this._TimerFuego.start();
        }
    }

    function ThrowFire() {
        // Comprobar cual es la distancia que se ha recibido de la bala auxiliar
        if(!this._Aplastado && this._State==0){
            if (Math.abs(this._distanciaX) > FuegoDistanciaMax || Math.abs(this._distanciaY) > FuegoDistanciaMax) {
                

                // Colocar la posicion del fuego en la mitad de lo que ocupa el fuego
                //+ 10 para que parezca que lo lanza el Fygar
                if (this._Movingleft) {
                    
                    this._3FireSpritesheet = '3';
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, this._3FireSpritesheet[0]);
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('3FramesFire', [0, 1, 2], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);
                    
                    this._Fire.x -= FuegoCentroLargo;
                    this._Fire.width = -this._Fire.width;

                }
                else if (this._Movingright) {

                    this._3FireSpritesheet = '3';
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, this._3FireSpritesheet[0]);
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('3FramesFire', [0, 1, 2], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);

                    this._Fire.x += FuegoCentroLargo;
                }
                else if (this._Movingup) {

                    this._3FireSpritesheet = 'B';
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, this._3FireSpritesheet[0]);
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('3FramesFire', [0, 1, 2], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);

                    this._Fire.angle = 180;
                    this._Fire.y -= FuegoCentroLargo;
                }
                else if (this._Movingdown) {

                    this._3FireSpritesheet = 'B';
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, this._3FireSpritesheet[0]);
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('3FramesFire', [0, 1, 2], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);

                    this._Fire.y += FuegoCentroLargo;
                }

                this._FireSound.play();
            }
            else if (Math.abs(this._distanciaX) > FuegoDistanciaMedia || Math.abs(this._distanciaX) > FuegoDistanciaMedia) {
                
                if (this._Movingleft) {
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, '2');
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('2FramesFire', [0, 1], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);
                    
                    this._Fire.x -= FuegoCentroMedio;
                    this._Fire.width = -this._Fire.width;
                }
                else if (this._Movingright) {
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, '2');
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('2FramesFire', [0, 1], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);

                    this._Fire.x += FuegoCentroMedio;
                }
                else if (this._Movingup) {
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, 'V');
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('2FramesFire', [0, 1], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);

                    this._Fire.angle = 180;
                    this._Fire.y -= FuegoCentroMedio;
                }
                else if (this._Movingdown) {
                    this._Fire = new Phaser.Sprite(this._game, this.x, this.y, 'V');
                    this._Fire.anchor.x = 0.5;
                    this._Fire.anchor.y = 0.5;
                    this._FireAnim = this._Fire.animations.add('2FramesFire', [0, 1], 10, false);
                    this._FireAnim.play(10, false);
                    this._game.world.add(this._Fire);

                    this._Fire.y += FuegoCentroMedio;
                }
                this._FireSound.play();
            }
            else if (Math.abs(this._distanciaX) > FuegoDistanciaMin || Math.abs(this._distanciaX) > FuegoDistanciaMin) {
                this._Fire = new Phaser.Sprite(this._game, this.x, this.y, '1Fire');
                this._Fire.anchor.x = 0.5;
                this._Fire.anchor.y = 0.5;
                this._game.world.add(this._Fire);

                if (this._Movingleft) {    
                    this._Fire.width = -this._Fire.width;            
                    this._Fire.x -= 32;
                }
                else if (this._Movingright) {
                    this._Fire.x += FuegoCentroCorto;
                }
                else if (this._Movingup) {
                    this._Fire.angle = -90;
                    this._Fire.y -= FuegoCentroCorto;
                }
                else if(this._Movingdown) {
                    this._Fire.angle = 90;
                    this._Fire.y += FuegoCentroCorto;
                }
                this._FireSound.play();
            }
            
            this._animBreathFire.stop();
            this._ThrowingFire = true;

            if (this._Fire  != undefined) {
                this._TimerFuego.add(150, ActiveFireCollider, this);
                this._TimerFuego.start();
            }
            
            this._TimerFuego.add(400, Continue, this);
            this._TimerFuego.start();
        }
    }

    function ActiveFireCollider() {
        this._game.physics.enable(this._Fire, Phaser.Physics.ARCADE);
    }

    function Continue() {
        if (!this._playerBurnt && !this._Aplastado) {
            this._MovementEnable = true;
            this._animWalk.play(6, true);
        }
        if (this._Fire != undefined)
            this._Fire.destroy();
        this._ThrowingFire = false;
        if(!this._Aplastado){
            this._TimeToFire = Math.random() * (5000) + 10000;
            this._TimerFuego.add(this._TimeToFire, StopToFire, this);
            this._TimerFuego.start();
            this._distanciaX = 0;
            this._distanciaY = 0;
        }
    }

module.exports = Fygar;
},{"./Class_Enemy.js":1}],4:[function(require,module,exports){
'use strict';

var GameObject = function(game, position, sprite,id,spriteSheet){
    
    if(id=='Player' || id=='Roca')
        Phaser.Sprite.apply(this,[game ,position._x, position._y, spriteSheet, 0]);
    else
        Phaser.Sprite.apply(this,[game ,position._x, position._y, sprite]);

    this._id=id;
    this._posX=position._x;
    this._posY=position._y;

}
GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

module.exports = GameObject;
},{}],5:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Movable = function(game, position, id, limiteDerecho, limiteSuperior, spritesheet){
    
    GameObject.apply(this, [game ,position, spritesheet[0], id, spritesheet]);

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
    }
module.exports = Movable;
},{"./Class_GameObject.js":4}],6:[function(require,module,exports){
'use strict';

var Movable = require('./Class_Movable.js');
var GO = require('./Class_GameObject.js');


var Player = function(game, position, id, cursors, limiteDerecho, limiteSuperior,posOriginalX,posOriginalY, spriteSheet){
    Movable.apply(this, [game, position, id, limiteDerecho, limiteSuperior, spriteSheet]);
    
    this._game=game;
    this._GrupoTierra;
    this._GrupoEnemigos;
    this._cursors = cursors;

    this._DeathMusic=this._game.add.audio('Death',0.4);
    this._TaserSound=this._game.add.audio('Taser',0.4);

    this._animWalk =this.animations.add('Walking', [0,1], 6, true);
    this._animDig =this.animations.add('Digging', [2,3], 6, true);
    this._animDie =this.animations.add('Diying', [5,6,7,8,9], 2, false);

    this._animWalk.play(6,true);
    //this._animDig.play(6,true);

    this._core = new Phaser.Sprite(this._game, 0, 0, 'Banderita');
    this._game.physics.enable(this._core, Phaser.Physics.ARCADE);
    this._core.anchor.x = 0.5;
    this._core.anchor.y = 0.5;
    this._core.width = this._core.width/4;
    this._core.height = this._core.height/4;
    this.addChild(this._core);

    this._Muerto=false;
    this._AnimMuerto=false;

    this._MovementEnable=false;
    this._AutomaticMovement=true;
    this._EnPosicion=false;
    this._EsperandoComenzar=false;

    this._posOriginalX=posOriginalX;
    this._posOriginalY=posOriginalY;

    this._posInicial =position;

    this._timer = this._game.time.create(false); //TIMER PARA CONTROLAR MUERTE REAL
    this._timerReload = this._game.time.create(false);

    this._Hook;
    this._Hooked = false; //ESTADO A TRUE CUANDO EL GANCHO HA COGIDO A UN ENEMIGO
    this._Hooking=false;  //LANZANDO EL GANCHO
    this._HookThrow = this._game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this._reloadTime=500;
    this._readyToShoot=true;

    this._HookDistanceX=0;
    this._HookDistanceY=0;
    }

    Player.prototype = Object.create(Movable.prototype);
    Player.prototype.constructor = Player;

Player.prototype.Input = function() //Mueve el jugador a la izquierda
    {
    //Comprobación de cursores de Phaser
    if(this._MovementEnable){
        if (this._cursors.left.isDown && this.x > 20 && this._Enableleft)
        {
            if (this._Movingright == true)
                this._Movingright = false;
            else if (this._Movingdown == true)
                this._Movingdown = false;
            else if (this._Movingup == true)
                this._Movingup = false;

            if (this._Movingleft == false)
                this._Movingleft = true;

            if (this._Enableright == false)
                this._Enableright = true;
            else if (this._Enabledown==false)
                this._Enabledown = true;
            else if (this._Enableup == false)
                this._Enableup = true;

            this._dirX = -1;

            if (this._distanceY == 0) {
                this.x -= 1;
                this._distanceX -= 1;
                if(this.angle!=0)
                    this.angle=0;
                if(this.width<0)
                    this.width=-this.width;

            }
            else if (this._dirY == 1) {
                if(this.y < 612 - this.height) {
                    this.y += 1;
                    this._distanceY += 1;
                    if(this.angle!=-90)
                        this.angle=-90;
                    if(this.width<0)
                        this.width=-this.width;
                }
            }
            else if (this._dirY == -1) {
                if(this.y > this.height + 24) {
                    this.y -= 1;
                    this._distanceY -= 1;
                    if(this.angle!=90)
                        this.angle=90;
                    if(this.width<0)
                        this.width=-this.width;
                }
            }
        }
        else if (this._cursors.right.isDown && this.x < this._LimiteDerecho - 20 && this._Enableright)
        {
            if (this._Movingleft == true)
                this._Movingleft = false;
            else if (this._Movingdown == true)
                this._Movingdown = false;
            else if (this._Movingup == true)
                this._Movingup = false;

            if(this._Movingright == false)
                this._Movingright = true;

            if (this._Enableleft == false)
                this._Enableleft = true;
            else if (this._Enabledown == false)
                this._Enabledown = true;
            else if (this._Enableup == false)
                this._Enableup = true;

            this._dirX = 1;

            if(this._distanceY == 0){
                this.x += 1;
                this._distanceX += 1;
                if(this.angle!=0)
                    this.angle=0;
                if(this.width>0)
                    this.width=-this.width;
            }
            else if (this._dirY == 1){
                if(this.y < 612 - this.height){
                    this.y += 1;
                    this._distanceY += 1;
                    if(this.angle!=90)
                        this.angle=90;
                    if(this.width>0)
                        this.width=-this.width;
                }
            }
            else if (this._dirY == -1) {
                if(this.y > this.height + 24) {
                    this.y -= 1;
                    this._distanceY -= 1;
                    if(this.angle!=-90)
                        this.angle=-90;
                    if(this.width>0)
                        this.width=-this.width;
                }
            }
        }
        else if (this._cursors.down.isDown && this.y < 612 - this.height && this._Enabledown)
        {   

            if (this._Movingright == true)
            this._Movingright = false;
            else if (this._Movingleft == true)
            this._Movingleft = false;
            else if (this._Movingup == true)
            this._Movingup = false;

            if (this._Movingdown == false)
                this._Movingdown = true;

            if (this._Enableright == false)
                this._Enableright = true;
            else if (this._Enableleft == false)
                this._Enableleft=true;
            else if (this._Enableup == false)
                this._Enableup = true;

            this._dirY = 1;

            if (this._distanceX == 0) {
                this.y += 1;
                this._distanceY += 1;
                if(this.width<0)
                    this.width=-this.width;
                if(this.angle!=-90)
                    this.angle=-90;
            }
            else if (this._dirX == 1) {
                if (this.x < this._LimiteDerecho - 20) {
                    this.x += 1;
                    this._distanceX += 1;
                }
            }
            else if (this._dirX == -1) {
                if(this.x > 2) {
                    this.x -= 1;
                    this._distanceX -= 1;
                }
            }
        }
        else if (this._cursors.up.isDown && this.y > this.height + 24 && this._Enableup)
        {   

            if (this._Movingright == true)
            this._Movingright = false;
            else if (this._Movingleft == true)
            this._Movingleft = false;
            else if (this._Movingdown == true)
            this._Movingdown = false;

            if(this._Movingup == false)
                this._Movingup = true;

            if (this._Enableright == false)
                this._Enableright = true;
            else if (this._Enableleft == false)
                this._Enableleft=true;
            else if (this._Enabledown == false)
                this._Enabledown = true;

            this._dirY =- 1;

            if (this._distanceX == 0) {
                this.y -= 1;
                this._distanceY -= 1;
                if(this.width<0)
                    this.width=-this.width;
                if(this.angle!=90)
                    this.angle=90;
            }
            else if (this._dirX == 1) {
                if(this.x < this._LimiteDerecho - 20){
                    this.x += 1;
                    this._distanceX += 1;
                }
            }
            else if (this._dirX == -1) {
                if(this.x > 2) {
                    this.x -= 1;
                    this._distanceX -= 1;
                }
            }
        }
        else{
            this._Movingleft = false;
            this._Movingright = false;
            this._Movingup = false;
            this._Movingdown = false;
        }
    }


    if (this._distanceX > 42 || this._distanceX < -42)
        this._distanceX = 0;
    if (this._distanceY > 42 || this._distanceY < -42)
        this._distanceY = 0;

        
        


    //PARTE DEL GANCHO 

    if (this._HookThrow.isDown && !this._Hooking && this._MovementEnable && this._readyToShoot){
        this._TaserSound.play();
        this._MovementEnable=false;
        this._Hook = new Phaser.Sprite(this._game, this.x, this.y, 'Gancho');
        this._game.physics.arcade.enable(this._Hook);
        this._Hooking=true;
        this._HookDistanceX=0;
        this._HookDistanceY=0;
        this.frame=10;  //Frame de lanzando
        this._Hook.visible=true;
        this._Hook.anchor.x = 0.5;
        this._Hook.anchor.y = 0.5;
        this._game.world.add(this._Hook);
    }    
}
    Player.prototype.update = function() {
        if (this._MovementEnable)
            this.Input();
        else if(this._AutomaticMovement)
            this.AutomaticMovement();

        if(this._AnimMuerto || this._Muerto){
            if(this._MovementEnable)
                this._MovementEnable=false;
        }            
        
        if(this._Hooking && !this._Hooked){
            if(this.width>0 && this.angle==0){
                if(this._HookDistanceX<50){
                    this._HookDistanceX+=2;
                    this._Hook.x-=2;
                }
                else{
                    this._Hook.destroy();
                    this._Hooking=false;
                    this._MovementEnable=true;
                }
            }
            else if(this.width<0 && this.angle==0){
                if(this._HookDistanceX<50){
                    if(this._Hook.width>0)
                    this._Hook.width=-this._Hook.width;
                    this._HookDistanceX+=2;
                    this._Hook.x+=2;
                    
                }
                else{
                    this._Hook.destroy();
                    this._Hooking=false;
                    this._MovementEnable=true;
                }
            }
            else if(this.angle==90){
                if(this._HookDistanceY<60){
                    if(this._Hook.angle!=90)
                        this._Hook.angle=90;
                    this._HookDistanceY+=2;
                    this._Hook.y-=2;
                }
                else{
                    this._Hook.destroy();
                    this._Hooking=false;
                    this._MovementEnable=true;
                }
            }
            else if(this.angle==-90){
                if(this._HookDistanceY<60){
                    if(this._Hook.angle!=-90)
                        this._Hook.angle=-90;
                    this._HookDistanceY+=2;
                    this._Hook.y+=2;
                }
                else{
                    this._Hook.destroy();
                    this._Hooking=false;
                    this._MovementEnable=true;
                }
            }
        }

        if(this._game.physics.arcade.collide(this._Hook, this._GrupoTierra))
            this._Hook.destroy();

        if(this._Hooking && this._Hook!=null){
            this._game.physics.arcade.overlap(this._Hook, this._GrupoEnemigos,EnemyHooked, null, this);
        }
            
        if(!this._Movingdown && !this._Movingup && !this._Movingleft && !this._Movingright){
            this._animWalk.paused=false;
        }
    }
    Player.prototype.AutomaticMovement = function() {
        
        if(this.x > (42*7 - 16)){
            if(this._Movingleft!=true)
                this._Movingleft=true;
            this.x--;
        }
        else if (this.y<(42*8 - 18)){
            if(this._Movingdown!=true)
                this._Movingdown=true;
            if(this.angle!=-90)
                this.angle=-90;
            this.y++;
        }
        else{
            if(this.width>0)
                this.width=-this.width;
            if(this.angle!=0)
                this.angle=0;
            if(!this._EsperandoComenzar){
                this._timer.add(2000, StartGame, this)
                this._timer.start();
                this._animWalk.paused=true;
                this._EsperandoComenzar=true;    
            }
        }
    }

    Player.prototype.Muerte = function() {
        this._MovementEnable=false;
        this._AnimMuerto=true;      //Se está realizando la animacion de morir
        this._animDie.play(2,false);
        this._DeathMusic.play();
        this._timer.add(2750,PlayerMuerto,this);
        this._timer.start();
    }
    
    function PlayerMuerto(){
        this._Muerto=true;
    }

    function StartGame(){
        this._MovementEnable=true;  //Esto tiene que activar una funcion contador para lanzar el juego todo a la vez permitiendo a todos los personajes moverse
        this._AutomaticMovement=false;
        this._EnPosicion=true;
        this._animWalk.paused=false;
        this._EsperandoComenzar=false;
    }

    function EnemyHooked(obj1,obj2){
        if(obj2._State<4){
            obj2._animWalk.stop();
            obj2._State++;
        }
        obj1.visible=false;
        this._Hooking = false;
        this._readyToShoot=false;
        this._timerReload.add(this._reloadTime,Reload,this);
        this._timerReload.start();
        if(!this._AnimMuerto && !this._Muerto && this._GrupoEnemigos.length!=0)
            this._MovementEnable=true;
        
    }
    function Reload(){
        this._readyToShoot=true;
    }

    

module.exports = Player;
},{"./Class_GameObject.js":4,"./Class_Movable.js":5}],7:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');
var PlayScene = require('./play_scene.js');

var Roca = function(game, position, id, spritesheet) {
    
    GameObject.apply(this, [game ,position, spritesheet[0], id, spritesheet]);
    
        this.animations.add('Shaking', [0, 1], 5, true);
        this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        
        this._PuntosEnemigos = [1000, 2500, 4000, 6000, 80000, 10000, 12000, 15000];

        this._Broken = false;
        this._PuntosConseguidos = 0;
        this._PuntosActualizados = false;
        this._PuntosContabilizados = false;

        this._EnemigosDestruidos = false;

        this._RefPlayer;
        this._PlayerAplastado = false;
        this._i;
        this._indicePlayer = 0;
        this._PlayerMovido = false;
        this._PlayerMuerto = false;

        this._Falling = false;
        this._HasFallen = false;
        this._FallEnable = true;
        this._timer = this.game.time.create(false);


        this._PointsSound = game.add.audio('Points', 1);
        this._StopSound = game.add.audio('Rock', 1);
        }
    
        Roca.prototype = Object.create(GameObject.prototype);
        Roca.prototype.constructor = Roca;
    
        Roca.prototype.update = function() {
            if (this._Falling && this._FallEnable) {
                for (var i = 0; i < 6; i++) {
                    if (this._Falling && this.y < 558) {
                        this.y ++;
                        if (this._PlayerAplastado)
                            this._RefPlayer.y++;
                    }
                    else if (this._Falling && this.y > 556)
                        this.Para();
                }
            }
        }
    
        Roca.prototype.Para = function() {
            
            this._StopSound.play();
            this.animations.stop('Shaking');
            this._Falling = false;
            this._HasFallen = true;

            this._timer.add(4000, BreakRock, this);

            //Si la roca no ha cogido ningun monstruo se llama a la cinemática normal de romperse
            if (this.children.length == 0 && !this._PlayerAplastado) { 
                this.animations.play('Breaking');
            }
            else
            {
                if (this._PlayerAplastado && !this._PlayerMuerto) {
                    this._PlayerMuerto = true;
                    this._RefPlayer.Muerte();
                    this._timer.add(100, BreakRock, this);
                }
                else
                {
                    this._i = this.children.length + 5;
                    if (this._i < 14) {
                        this._PuntosConseguidos = this._PuntosEnemigos[this.children.length - 1];
                        this._PuntosActualizados = true;
                    }
                    else
                    {
                        this._PuntosConseguidos = this._PuntosEnemigos[7];
                        this._PuntosActualizados = true;               
                    }
                    if (!this._EnemigosDestruidos) {
                        this._timer.add (2000, DestroyEnemies, this, this._i);
                        this._EnemigosDestruidos = true;
                    }
                }
            }
            this._timer.start();
            this.body.enable = false;
        }
    
        Roca.prototype.EnableFall = function() {
            this.animations.play('Shaking');
            this._timer.add(2000, Fall, this);
            this._timer.start();
        }
    
        function Fall() {
            if (!this._HasFallen && this._FallEnable) {
                this._Falling = true;
                this._timer.stop();
            }
        }
        function BreakRock() {
            if (this._PlayerAplastado && !this._PlayerMovido) {
                this._RefPlayer.y -= 25;
                this._RefPlayer.x = this.x + this.width / 2;
                this._PlayerMovido = true;
            }
            this.destroy();
        }

        function DestroyEnemies(I) {
            for (var j = this.children.length - 1; j >= 0; j--) {
                this.children[j].destroy();
            }
            if (I < 14)
                this.frame = I;
            else
                this.frame = 13;

            this._PointsSound.play();
        }
module.exports = Roca;
},{"./Class_GameObject.js":4,"./play_scene.js":12}],8:[function(require,module,exports){
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
},{"./Class_GameObject.js":4}],9:[function(require,module,exports){
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
},{"./Class_GameObject.js":4}],10:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var MenuScene = require('./menu.js');

var BootScene = {
  preload: function () {
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.game.load.baseURL = 'https://raw.githubusercontent.com/RodrigoManuelPerez/TrepacepaDigDug/master/src/';
    this.game.load.crossOrigin = 'anonymous';

    //AUDIO
        //SAMPLES
    this.game.load.audio('Death', ['music/Sounds/Death.ogg']);
    this.game.load.audio('Item', ['music/Sounds/Item.ogg']);
    this.game.load.audio('Win', ['music/Sounds/Win.ogg']);
    this.game.load.audio('Acept', ['music/Sounds/Acept.ogg']);
    this.game.load.audio('Switch', ['music/Sounds/Switch.ogg']);
    this.game.load.audio('Points', ['music/Sounds/Points.ogg']);
    this.game.load.audio('Dragon', ['music/Sounds/Dragon.ogg']);
    this.game.load.audio('Rock', ['music/Sounds/Rock.ogg']);
    this.game.load.audio('Taser', ['music/Sounds/Taser.ogg']);
    this.game.load.audio('Pop', ['music/Sounds/Pop.ogg']);

        //MUSICA
    this.game.load.audio('MusicGame', ['music/Music/GameSong.ogg']);
    this.game.load.audio('MusicGameSpeedUp', ['music/Music/GameSongSpeedUp.ogg']);
    this.game.load.audio('MenuSong', ['music/Music/MenuSong.ogg']);
    
    //IMAGENES Y SPRITESHEETS

    this.game.load.spritesheet('DigDugWalking', 'images/WalkAnim.png', 36, 36, 11);
    this.game.load.spritesheet('P', 'images/PookaSpriteSheet.png', 36, 36, 10);  
    this.game.load.spritesheet('F', 'images/FygarSpriteSheet.png', 36, 36, 11);
    this.game.load.spritesheet('RocaCompletaSpriteSheet', 'images/RocaCompleta.png', 40, 47, 14);
    this.game.load.spritesheet('Bufos', 'images/Bufos.png', 40, 40, 18);  
    this.game.load.spritesheet('FlorSpriteSheet', 'images/florAnim.png', 42, 46, 2);
    this.game.load.spritesheet('FlorBlancaSpriteSheet', 'images/florAnimBlanca.png', 42, 46, 2);

    this.game.load.image('1Fire', 'images/1FrameFire.png');
    this.game.load.spritesheet('2', 'images/2FramesFire.png', 80, 40, 2);
    this.game.load.spritesheet('3', 'images/3FramesFire.png', 120, 40, 3);
    this.game.load.spritesheet('V', 'images/2FramesFireVertical.png', 40, 80, 2);    //HAY QUE INCLUIR LOS CASOS CONCRETOS EN LOS QUE EL FUEGO ESTÁ VERTICAL PORQUE
    this.game.load.spritesheet('B', 'images/3FramesFireVertical.png', 40, 120, 3);   //AUNQUE SE ROTE EL SPRITE NO SE ROTA SU BOUNDING BOX Y GENERA PROBLEMAS AL INTENTAR GENERAR COLISION
  

    //DIFERENTES TIPOS DE TIERRA
    this.game.load.image('tierraSuperficie', 'images/TierraCSuperrficie.png');
    this.game.load.image('tierraHSuperficie', 'images/LaminaTierraSuperficial.png');
    this.game.load.image('tierraVSuperficie', 'images/LaminaTierraVSuperficial.png');

    this.game.load.image('tierraIntermedia', 'images/TierraCIntermedia.png');
    this.game.load.image('tierraHIntermedia', 'images/LaminaTierraIntermedia.png');
    this.game.load.image('tierraVIntermedia', 'images/LaminaTierraVIntermedia.png');

    this.game.load.image('tierraInferior', 'images/TierraCInferior.png');
    this.game.load.image('tierraHInferior', 'images/LaminaTierraInferior.png');
    this.game.load.image('tierraVInferior', 'images/LaminaTierraVInferior.png');

    //BOTONES FULLSCREEN
    this.game.load.image('FullScreenButton', 'images/GoFullScreen.png');
    this.game.load.image('NormalScreenButton', 'images/ExitFullScreen.png');

    //BOTONES MUTE
    this.game.load.image('MuteButton', 'images/MuteButton.png');
    this.game.load.image('DeMuteButton', 'images/DeMuteButton.png');

    this.game.load.image('Gancho', 'images/Gancho.png');

    this.game.load.image('Banderita', 'images/Bandera.png');

    this.game.load.image('Controles', 'images/Controles.png')


    //COSAS DEL MENU
    this.game.load.image('MenuFondo', 'images/Menu.png');
    this.game.load.image('MenuFlecha', 'images/Flecha.png');
  },

  create: function () {
    this.game.state.start('menu');
    //this.game.state.start('play');
  }
};

window.localStorage.setItem('highscore', '0');

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', MenuScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
},{"./menu.js":11,"./play_scene.js":12}],11:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');

var _SwitchSound;
var _AceptSound;
var _AtControls=false;
var _PosicionSuperior; 
var _PosicionInferior;
var _PosicionFlecha = true;

var _timerControl;
var _Eleccion = false;
var _menu;
var _Flechita;
var _Controls

var _RockSprite;
var _RockAnim;
var _PlayerSprite
var _PlayerWalking;
var _VegetableSprite;
var _VegetablePop;
var _EnemySprite; 
var _EnemyWalking;
var _FygarSprite;
var _FygarWalking;
var _musicaMenu;


// Numeros magicos:
var RockSpritePosX = 665;
var RockSpritePosY = 130;
var RockSpriteDimensions = 2.2;

var PlayerSpritePosX = 160;
var PlayerSpritePosY = 205;
var PlayerSpriteDimensions = 1.8;

var VegetableSpritePosX = 125;
var VegetableSpritePosY = 430;
var VegetableSpriteDimensions = 3;

var EnemySpritePosX = 550;
var EnemySpritePosY = 390;
var EnemySpriteDimensions = 3;

var FygarSpritePosX = 675;
var FygarSpritePosY = 390;
var FygarSpriteDimensions = 3;

var MenuScene = {

    preload: function () { },

    create: function () {

    //DECLARACION DE VARIABLES                
    this._parpadeando=false;
    this._cursors;
    this._FullScreenButton;
    this._ButtonCreated = false;
    _AtControls=false;
    _PosicionFlecha=true;
    _Eleccion=false;
    

    this._scoreStringA;
    this._scoreTextA;
    this._highScoreText;

    _timerControl = this.game.time.create(false);

    _PosicionSuperior = new Par(300,330);
    _PosicionInferior = new Par(300,400);

    _musicaMenu = this.game.add.audio('MenuSong', 1, true); //key, volume, loop
    _musicaMenu.play();

    //SOUNDS
    _SwitchSound = this.game.add.audio('Switch');
    _AceptSound = this.game.add.audio('Acept');

    //Inicializar los cursores.
    this._cursors = this.game.input.keyboard.createCursorKeys();
    
    _menu = new Phaser.Sprite(this.game, 0, 600, 'MenuFondo');
    _menu.anchor.x = 0;
    _menu.anchor.y = 0;
    _Flechita = new Phaser.Sprite(this.game, _PosicionSuperior._x, _PosicionSuperior._y, 'MenuFlecha');
    _Flechita.anchor.x = 0;
    _Flechita.anchor.y = 0;
    _Flechita.visible = false;
    this.game.world.addChild(_menu);
    this.game.world.addChild(_Flechita);
    
    //Control de puntuaciones
    this._scoreStringA = 'HI - SCORE: ';
    this._scoreTextA = this.game.add.text(20, 20, this._scoreStringA, { font: '25px Arial', fill: '#fff' });
    this._scoreTextA.visible = false;
    this._highScoreText = this.game.add.text(180, 20, '0', { font: "bold 25px Arial", fill: "#46c0f9", align: "center" });
    this._highScoreText.visible = false;
    this._highScoreText.text = localStorage.getItem("highscore");
    
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;


    


},
    update: function() {

        if(_menu.y > 0){
            _menu.y -= 2;
        }
        else if(!this._parpadeando){
            this._parpadeando = true;
            this._scoreTextA.visible = true;
            this._highScoreText.visible = true;
            var timerFlecha = this.game.time.create(false);
            timerFlecha.loop(250, switchFlechita, this);
            timerFlecha.start();
        }

        this.game.input.keyboard.game.input.keyboard.onDownCallback = function(key){

            ////////////////////MOVIMIENTO FLECHAS/////////////////
                if (_menu.y == 0 && !_Eleccion && !_AtControls){
                    if (key.keyCode === Phaser.KeyCode.W || key.keyCode === 38){
                        if (_Flechita.y == _PosicionInferior._y){
                            _SwitchSound.play();
                            _Flechita.y = _PosicionSuperior._y;
                            _PosicionFlecha = true;
                        }
                    }
                    if (key.keyCode === Phaser.KeyCode.S || key.keyCode === 40){
                        if (_Flechita.y == _PosicionSuperior._y){
                            _SwitchSound.play();
                            _Flechita.y = _PosicionInferior._y;
                            _PosicionFlecha = false;
                        }
                    }
                }
        
                //////////////////ELECCION//////////////
                if (!_AtControls) {
                    if (key.keyCode === Phaser.KeyCode.ENTER || key.keyCode === Phaser.KeyCode.SPACEBAR){
                        if (_menu.y > 0)
                            _menu.y = 0;
                        else {
                            if (!_Eleccion)
                                _AceptSound.play();  //The acept sound will sound
                            _Eleccion = true;
                            _timerControl.add(1500,Comienzo,this,this.game);
                            _timerControl.start();
                        }
                    }
                }
                else {
                    if (key.keyCode === Phaser.KeyCode.ESC) {
                        this.game.state.start('menu');
                    }
                }
            }
        
        if (_menu.y <= 0 && !this._ButtonCreated){
            this._ButtonCreated = true;
            this._FullScreenButton = this.game.add.button(20, 60, 'FullScreenButton', FullScreen, this);
        }
        
        if (this._ButtonCreated) {
            if (this.game.scale.isFullScreen)
            {
                this._FullScreenButton.loadTexture('NormalScreenButton');
            }
            else
            {
                this._FullScreenButton.loadTexture('FullScreenButton');
            }
        }



        if (_Eleccion) {
            if (_musicaMenu.volume > 0)
            _musicaMenu.volume -= 0.012;
        }
       
    },
    render: function() {
        
    }
}

module.exports = MenuScene;

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function Comienzo (g) {
    if (_PosicionFlecha) {
        _AceptSound.destroy();       //NO seria asi pero no consigo eliminar el sonido
        _musicaMenu.stop();
        g.state.start('play');
        
    }
    else {       //Los creditos o controles
        _AtControls = true;
        Controles(g);
    }
}

function Controles(g) {
    
    _Controls = new Phaser.Sprite(g, 0, 0, 'Controles');
    _Controls.anchor.x = 0;
    _Controls.anchor.y = 0;
    g.world.addChild(_Controls);

    _RockSprite = new Phaser.Sprite(g, RockSpritePosX, RockSpritePosY, 'RocaCompletaSpriteSheet');
    _RockSprite.frame = 1;
    _RockSprite.width = RockSpriteDimensions * _RockSprite.width;
    _RockSprite.height = RockSpriteDimensions * _RockSprite.height;
    _RockSprite.anchor.x = 0.5;
    _RockSprite.anchor.y = 0.5;
    g.world.addChild(_RockSprite);

    _PlayerSprite = new Phaser.Sprite(g, PlayerSpritePosX, PlayerSpritePosY, 'DigDugWalking');
    _PlayerSprite.frame = 1;
    _PlayerSprite.width = PlayerSpriteDimensions * _PlayerSprite.width;
    _PlayerSprite.height = PlayerSpriteDimensions * _PlayerSprite.height;
    _PlayerSprite.anchor.x = 0.5;
    _PlayerSprite.anchor.y = 0.5;
    g.world.addChild(_PlayerSprite);

    _VegetableSprite = new Phaser.Sprite(g, VegetableSpritePosX, VegetableSpritePosY, 'Bufos');
    _VegetableSprite.frame = 1;
    _VegetableSprite.width = VegetableSpriteDimensions * _VegetableSprite.width;
    _VegetableSprite.height = VegetableSpriteDimensions * _VegetableSprite.height;
    _VegetableSprite.anchor.x = 0.5;
    _VegetableSprite.anchor.y = 0.5;
    g.world.addChild(_VegetableSprite);

    _EnemySprite = new Phaser.Sprite(g, EnemySpritePosX, EnemySpritePosY, 'P');
    _EnemySprite.frame = 1;
    _EnemySprite.width = -EnemySpriteDimensions * _EnemySprite.width;
    _EnemySprite.height = EnemySpriteDimensions * _EnemySprite.height;
    _EnemySprite.anchor.x = 0.5;
    _EnemySprite.anchor.y = 0.5;
    g.world.addChild(_EnemySprite);

    _FygarSprite = new Phaser.Sprite(g, FygarSpritePosX, FygarSpritePosY, 'F');
    _FygarSprite.frame = 1;
    _FygarSprite.width = -FygarSpriteDimensions * _FygarSprite.width;
    _FygarSprite.height= FygarSpriteDimensions * _FygarSprite.height;
    _FygarSprite.anchor.x = 0.5;
    _FygarSprite.anchor.y = 0.5;
    g.world.addChild(_FygarSprite);

    _RockAnim = _RockSprite.animations.add('Shaking', [0, 1], 5, true);
    _RockAnim.play();
    _PlayerWalking = _PlayerSprite.animations.add('Walking', [0, 1], 6, true);
    _PlayerWalking.play();
    _VegetablePop = _VegetableSprite.animations.add('ShowVegetables', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
    _VegetablePop.play();
    _EnemyWalking = _EnemySprite.animations.add('Walking', [0, 1], 6, true);
    _EnemyWalking.play();
    _FygarWalking = _FygarSprite.animations.add('Walking', [0, 1], 6, true);
    _FygarWalking.play();

}

function switchFlechita() {
    if (!_Eleccion)
        _Flechita.visible = !_Flechita.visible;
    else
        _Flechita.visible = true;
}

function FullScreen() {

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
        this._FullScreenButton.loadTexture('FullScreenButton');
    }
    else
    {
        this.game.scale.startFullScreen(false);
        this._FullScreenButton.loadTexture('NormalScreenButton');
    }
}
},{"./play_scene.js":12}],12:[function(require,module,exports){

 'use strict';

var GO = require('./Class_GameObject.js');
var Roca = require('./Class_Roca.js');
var Vegetal = require('./Class_Vegetal.js');
var Movable = require('./Class_Movable.js');
var Player = require('./Class_Player.js');
var Enemy = require('./Class_Enemy.js');
var Fygar = require('./Class_Fygar.js');
var BloqueTierra = require('./Class_Tierra.js');
var Flower = require('./Class_Flor.js');


var player;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var GrupoRocas, rocasCaidas, VegetalGenerado;

var tamañoGrupoRocas=0;
var GrupoBanderas;

var mapaNivel;
var CuboHuida;
var CuboDestruccion;
var BloqTierraleft;

var GrupoEnemigos;
var PuntosEnemigos = [1000, 2500, 4000, 6000, 80000, 10000, 12000, 15000];
var Fire, GrupoFireBullets;

var puntuacion, puntuacionControl;
var scoreTextA, scoreTextB, scoreTextC, score, pauseText;
var maxPuntuacion = 0, highScoreText;
var scoreStringA = '';
var scoreStringB = '';
var scoreStringC = '';
var pauseString = '';
var PAUSED=false;
var FullScreenButton;
var MuteButton;

var vidas=3;
var spriteVidas;
var thisLifes
var lifes;
var i;

var nivel=1;    //Podemos utilizar el nivel para acceder a un array de los sprites de los vegetales segun el nivel facilmente
var levelText;
var levelString = '';
var spriteFlor, flor;

var playerMusic;
var winSound;
var itemSound;

var Vegetable;
var PuntosVegetables = [400,600,800,1000,1000,2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,7000,7000,8000];

var PosCentral;

//BOOLEANOS DE CONTROL
var cargado;
var NextLevel;

var timerControl;

var PlayScene = {

    init: function(){
        //rocasCaidas=0;
    },

    preload: function(){
        //this.load.text('level'+ nivel, 'levels/level'+nivel+'1.json');
        this.game.load.text('level1', 'levels/level1.json'); //CAMBIAR ESTO POR EL NUMERO 1 PARA QUE VAYA SEGUN EL VALOR
        this.game.load.text('level2', 'levels/level2.json');
        this.game.load.text('level3', 'levels/level3.json');
        this.game.load.text('level4', 'levels/level4.json');
        this.game.load.text('level5', 'levels/level5.json');
        // this.game.load.text('level6', 'levels/level6.json');
        // this.game.load.text('level7', 'levels/level7.json');
        // this.game.load.text('level8', 'levels/level8.json');
        // this.game.load.text('level9', 'levels/level9.json');

    },

    create: function() {

        if(nivel==1)
            vidas=3;

        //TIMER PARA LA PAUSA
        var timerPause = this.game.time.create(false);
        timerPause.loop(500,switchPause,this);
        timerPause.start();

        //TIMER PARA EL PASO DE NIVEL 
        timerControl= this.game.time.create(false);
        NextLevel=false;

        //MUSICA PARA EL PLAYER AL MOVERSE
        playerMusic=this.game.add.audio('MusicGame',0.25,true);    //key, volume, loop
        playerMusic.play();
        playerMusic.pause();

        winSound = this.game.add.audio('Win',0.4);
        itemSound = this.game.add.audio('Item',1);

        //Activar las físicas de Phaser.
        this.game.physics.startSystem(Phaser.ARCADE);
    
        //Poner variables a los limites.
        limiteDerecho = 513;
        limiteSuperior = 44;
        PosCentral = new Par(258, 298);

        //Rocas para vegetal
        cargado=false;
        rocasCaidas=0;
        VegetalGenerado=false;
        
        //Control de puntuaciones
        if(nivel==1){
            puntuacion=0;
            puntuacionControl=0;
        }
        scoreStringA = 'HI -';
        scoreStringB = ' SCORE';
        pauseString = 'PAUSED';

        levelString = ' ROUND ';
        scoreTextA = this.game.add.text(556, 44, scoreStringA, { font: '34px Arial', fill: '#fff' });
        scoreTextB = this.game.add.text(599, 87, scoreStringB, { font: '34px Arial', fill: '#fff' });
        pauseText = this.game.add.text(590, 190, pauseString, { font: '34px Arial', fill: '#fff' });
        pauseText.visible=false;
        
            // Puesto el texto 'Score' en la posicion (x, y) con la fuente y color que se quiera
        score = this.game.add.text(599, 259, puntuacion, { font: '34px Arial', fill: '#fff' });
        highScoreText = this.game.add.text(599, 130, maxPuntuacion, { font: "bold 34px Arial", fill: "#46c0f9", align: "center" });
        levelText = this.game.add.text(513, 517, levelString + nivel, { font: "bold 34px Arial", fill: "#fff", align: "center" });    
        score.text=puntuacion;
        

        //FLORES
        var thisFlor = this.flor;
        thisFlor = this.game.add.group();

        var contFB = Math.floor(nivel/10);
        var contFN = nivel%10;
        var cont = contFB + contFN;
        for (i = 0; i < cont; i++)
        {
            if(contFB>0){
                contFB--;
                spriteFlor = new Flower(this.game,470 - (43 * i), 34, 'FlorBlancaSpriteSheet')        //FlorBlancaSpriteSheet
                thisFlor.addChild(spriteFlor);
            }
            else if(contFN>0){
                contFN--;
                spriteFlor = new Flower(this.game,470 - (43 * i), 34, 'FlorSpriteSheet')        //FlorBlancaSpriteSheet
                thisFlor.addChild(spriteFlor);
            }
        }

        //CUBO DE HUIDA
        CuboHuida = new Phaser.Sprite(this.game,40*7-2,60,'tierraSuperficie');
        this.game.physics.enable(CuboHuida, Phaser.Physics.ARCADE);
        CuboHuida.anchor.x = 0.5;
        CuboHuida.anchor.y = 0.5;
        CuboHuida.visible = false;
        CuboHuida.body.enable=true;
        this.game.world.addChild(CuboHuida);

        //CUBO DE MUERTE
        CuboDestruccion = new Phaser.Sprite(this.game,-60,60,'tierraSuperficie');
        this.game.physics.enable(CuboDestruccion, Phaser.Physics.ARCADE);
        CuboDestruccion.anchor.x = 0.5;
        CuboDestruccion.anchor.y = 0.5;
        CuboDestruccion.visible = false;
        CuboDestruccion.body.enable=true;
        this.game.world.addChild(CuboDestruccion);

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Construimos el player
        var PosPlayer = new Par(358, 60);
        player = new Player(this.game,PosPlayer, 'Player',cursors, limiteDerecho, limiteSuperior, 278, 318, 'DigDugWalking');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        player.body.enable=true;
        this.game.world.addChild(player);

        ///////////////////////Vidas//////////////////////////////
        thisLifes = this.lifes;
        thisLifes = this.game.add.group()
        this.game.add.text(599, 345, 'LIVES ', { font: '34px Arial', fill: '#fff' });

        ActualizaHUD(this.game);

        //Añadir la tierra.
        tierra = this.game.add.physicsGroup();
        //Poner fisicas a la tierra horizontal.
        tierraH = this.game.add.physicsGroup();
        //Poner fisicas a la tierra vertical.
        tierraV = this.game.add.physicsGroup();
        //Grupo de las rocas
        GrupoRocas = this.game.add.physicsGroup();
        //Grupo de los enemigos
        GrupoEnemigos = this.game.add.physicsGroup();
        //Grupo de las banderas de control
        GrupoBanderas = this.game.add.physicsGroup();
        //Grupo de las balas de los Fygar
        GrupoFireBullets = this.game.add.physicsGroup();
        
        //PARA UN CORRECTO FULLSCREEN
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Actualizacion automática de los botones de pantalla completa
        if (this.game.scale.isFullScreen)
            FullScreenButton = this.game.add.button(760, 560, 'NormalScreenButton', FullScreen, this);
        else
            FullScreenButton = this.game.add.button(760, 560, 'FullScreenButton', FullScreen, this);

        MuteButton = this.game.add.button(720, 560, 'MuteButton', Mute, this);

        LoadMap(nivel,this.game);

        player._GrupoTierra=tierra;
        player._GrupoEnemigos=GrupoEnemigos;

        StopEnemies();

},
    update: function(){

        //PLAYER
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra,null, {this:this, g:this.game});
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);
        this.game.physics.arcade.collide(player, GrupoRocas, onCollisionRoca);

        //ROCAS
        this.game.physics.arcade.collide(tierra, GrupoRocas, onCollisionPara);
        this.game.physics.arcade.collide(GrupoRocas, tierraH, onCollisionTierra);

            //COLISION ROCAS CON ENEMIGOS Y PLAYER
            this.game.physics.arcade.collide(GrupoEnemigos, GrupoRocas, onCollisionAplasta);
            this.game.physics.arcade.collide(player, GrupoRocas, onCollisionAplasta);

        //ENEMIGOS
        this.game.physics.arcade.collide(tierra, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraH, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraV, GrupoEnemigos, onCollisionEnemyTierra);
        
        //ENEMIGOS CON BANDERITAS DE CONTROL
        this.game.physics.arcade.collide(GrupoBanderas, GrupoEnemigos, onCollisionBandera);

        //ENEMIGOS CON EL PLAYER
        this.game.physics.arcade.collide(GrupoEnemigos, player._core, MuertePlayer);

        //PLAYER CON VEGETAL
        if(VegetalGenerado){
            this.game.physics.arcade.collide(player, Vegetable, onCollisionVegetable,null, {this:this, g:this.game});
        }

        //ENEMIGOS CON EL CUBO DE HUIDA
        this.game.physics.arcade.collide(GrupoEnemigos, CuboHuida, onCollisionHuidaEnemigo);
        this.game.physics.arcade.collide(GrupoEnemigos, CuboDestruccion, onCollisionEliminacionEnemigo);

        
        

        if(GrupoEnemigos.length==1){
            if(!GrupoEnemigos.children[0]._Huyendo){
                //sonido del ultimo enemigo
                GrupoEnemigos.children[0]._Huyendo=true;
                playerMusic.stop();
                playerMusic=this.game.add.audio('MusicGameSpeedUp',0.25,true);    //key, Incluyendo la musica pero a mas velocidad
                playerMusic.play();
                playerMusic.pause();
            }
        }

        if(player._AnimMuerto){
            StopEnemies();
            StopRocks();
        }

        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onUpCallback = function(key){

            //////////////////PRUEBA CAMBIO LEVEL///////////////
            if(key.keyCode === 48){     //El 0
                LevelComplete(this.game);
            }

            ///////////////////NIVEL 1 A FULL VIDAS//////////////////
            if(key.keyCode === 49){     //El 1
                ComenzarJuego(this.game);
            }

            if(key.keyCode === Phaser.KeyCode.P && !player._AutomaticMovement && !player._AnimMuerto && !player._Muerto && !player._EsperandoComenzar){ //LO NECESARIO PARA RESETEAR LA ESCENA PERDIENDO UNA VIDA
                if(!PAUSED){
                    player._MovementEnable=false;
                    player._animWalk.paused=true;
                    StopEnemies();
                    StopRocks();
                    PAUSED=true;
                    pauseText.visible=true;
                }
                else{
                    player._MovementEnable=true;
                    player._animWalk.paused=false;
                    StartEnemies();
                    StartRocks();
                    PAUSED=false;
                    pauseText.visible=false;
                }
            }

            if(key.keyCode === Phaser.KeyCode.U){
                for(var gh = GrupoEnemigos.length-1;gh>=0; gh--){
                    GrupoEnemigos.children[gh]._MovementEnable=false;
                    GrupoEnemigos.children[gh].destroy();
                }
            }
        }



        //BOTON DE FULLSCREEN
        if (this.game.scale.isFullScreen)
        {
            if(FullScreenButton.texture!='NormalScreenButton')
                FullScreenButton.loadTexture('NormalScreenButton');
        }
        else
        {
            if(FullScreenButton.texture!='FullScreenButton')
                FullScreenButton.loadTexture('FullScreenButton');
        }

        //BOTON DE MUTE
        if(this.game.sound.mute && MuteButton.texture!='DeMuteButton'){
            MuteButton.loadTexture('DeMuteButton');
        }
        else if(this.game.sound.mute && MuteButton.texture!='MuteButton'){
            MuteButton.loadTexture('MuteButton');
        }

        //NIVEL COMPLETADO
        if(GrupoEnemigos.length==0 && !NextLevel){
            NextLevel=true;
            timerControl.add(1500,LevelWin,this, this.game);
            timerControl.start();
        }

        //ROCAS CAIDAS
        //Comprobacion de la rotura de rocas
        if(cargado){
            if(GrupoRocas.length<tamañoGrupoRocas){       //////////////////////////////////////////////////////////
                rocasCaidas++;                      //CUANDO CARGAMOS LA ESCENA DE OTRO NIVEL ESTO SE LLAMA UNA PRIMERA VEZ Y AUMENTA 1
                tamañoGrupoRocas=GrupoRocas.length;
            }
        }

        if(rocasCaidas==2 && !VegetalGenerado){
            if(nivel<18){
                Vegetable = new Vegetal(this.game,PosCentral,'Bufos','vegetal',PuntosVegetables[nivel-1]);
                Vegetable.frame = nivel-1;
            }
            else{
                Vegetable = new Vegetal(this.game,PosCentral,'Bufos'[PuntosVegetables.length-1],'vegetal',PuntosVegetables[PuntosVegetables.length-1]);
                Vegetable.frame = PuntosVegetables.length-1;
            }
            this.game.physics.enable(Vegetable, Phaser.Physics.ARCADE);
            this.game.world.addChild(Vegetable);
            Vegetable.Desaparece();
            VegetalGenerado=true;
        }

        

        //PUNTUACION
        highScoreText.text = localStorage.getItem("highscore"); {
            if (puntuacion > localStorage.getItem("highscore")) { 
                localStorage.setItem("highscore", puntuacion);
            }
        }

        //PUNTOS QUE DAN LAS ROCAS
        for(var k =0; k<GrupoRocas.length; k++){

            if (GrupoRocas.children[k]._PuntosActualizados && !GrupoRocas.children[k]._PuntosContabilizados){  //SI NO SE HA LLAMADO AL PLAYER, YA SE HAN AÑADIDO LOS PUNTOS DE MATAR A X ENEMIGOS Y NO SE HAN AÑADIDO A LA PUNTUACION GLOBAL
                GrupoRocas.children[k]._PuntosContabilizados=true;
                sumaPuntos(GrupoRocas.children[k]._PuntosConseguidos,this.game);
            }
        }

        //PUNTOS QUE DAN LOS ENEMIGOS
        for(var k =0; k<GrupoEnemigos.length; k++){

            if (GrupoEnemigos.children[k]._State==5 && !GrupoEnemigos.children[k]._PuntosContabilizados){  //SI NO SE HA LLAMADO AL PLAYER, YA SE HAN AÑADIDO LOS PUNTOS DE MATAR A X ENEMIGOS Y NO SE HAN AÑADIDO A LA PUNTUACION GLOBAL
                GrupoEnemigos.children[k]._PuntosContabilizados=true;
                sumaPuntos(GrupoEnemigos.children[k]._Puntos,this.game);
            }
        }


        if(player._EnPosicion){
            StartEnemies();
            StartRocks();
            player._EnPosicion=false;
        }

        if (player._Muerto){
            if (vidas>0){
                ContinuarLevel(this.game, thisLifes); //El player se muere y se restaura su posicion restandole una vida
            }
            else{
                nivel=1;
                this.game.state.start('menu');
            }
        }

        if(player._MovementEnable && PAUSED)
            player._MovementEnable=false;

        //MUSICA
        if((player._Movingdown || player._Movingup || player._Movingleft || player._Movingright)&&(player._MovementEnable || player._AutomaticMovement))
            playerMusic.resume();
        else
            playerMusic.pause();

    },
    render: function(){
    }
}

module.exports = PlayScene;

function EnemyHooked(obj1,obj2){
    if(obj2._State<4){
        obj2._animWalk.stop();
        obj2._State++;
    }
    obj1.destroy_in_next_tick= true;
    player._Hooking = false;
    if(!player._AnimMuerto && !player._Muerto && player._GrupoEnemigos.length!=0)
        player._MovementEnable=true;
}

function switchPause(){
    if(PAUSED){
        pauseText.visible=!pauseText.visible;
    }
}

function onCollisionBandera(obj1,obj2){
    if(obj2._Fantasma && obj2._posicionInicial>0){
        obj2.BackToNormal(obj1.x,obj1.y);
    }
}

function onCollisionEnemyTierra(obj1,obj2){
    if(!obj2._Fantasma){
        if(obj1._id=='tierra')
            obj2.ChangeDirTierra();
        else if(obj1._id=='tierraH'){
            if(obj2._bufferBounce==0)
                obj2.ChangeDirHor();
            else{
                obj2.ChangeDirTierra();
                obj2._bufferBounce--;
            }
        }
        else if(obj1._id=='tierraV'){
            if(obj2._bufferBounce==0)
                obj2.ChangeDirVer();
            else{
                obj2.ChangeDirTierra();
                obj2._bufferBounce--;
            }
        }
    }
}

function onCollisionAplasta(obj1, obj2){
    if(obj2._Falling){
        if(obj1._id=='Player')  //Si el objeto es el digdug es necesario para su movimiento y asi pausar la cancion
        {
            obj1.y-=15;
            obj1._Movingdown=false;     
            obj1._Movingleft=false;
            obj1._Movingright=false;
            obj1._Movingup=false;
            obj2._PlayerAplastado=true;
            obj2._RefPlayer=player;
            obj1._animWalk.stop();
            obj1._animDig.stop();
            obj1.Aplastado(4);
            obj1.body.enable=false;
        }
        else if(obj1._id=='Enemigo')
        {
            obj1._animWalk.stop();
            obj1._animFant.stop();
            if(obj1._animBreathFire!=undefined)
                obj1._animBreathFire.stop();
            obj1._Aplastado=true;
            obj1.Aplastado(4);
            obj2.addChild(obj1);    //Ponemos el objeto que choca hijo de la roca
            obj1.x=20;              //En la posicion correcta
            obj1.y=35;
            obj1.body.enable=false;
        }
        
        obj1._MovementEnable=false;
        
        if(obj1.angle!=0)
            obj1.angle=0;
          
    }
}

function onCollisionRoca(obj1, obj2)    //Colision del player con la roca que restringe el movimiento
{

    if ((obj1.x-20 == obj2.x && obj1.y<obj2.y+21)||(obj1.x-20 > obj2.x && obj1.y==obj2.y+21)||(obj1.x-20 < obj2.x && obj1.y==obj2.y+21)/*||(obj1.x-20 == obj2.x && obj1.y>obj2.y+58)*/){ //COLISION CON LA PARTE SUPERIOR DE LA ROCA

        if (obj1._Movingleft) {
            obj1._Enableleft = false;
            obj1._dirX = 1;
        }
        else if (obj1._Movingright) {
            obj1._Enableright = false;
            obj1._dirX = -1;
        }
        else if (obj1._Movingdown) {
            obj1._Enabledown = false;
            obj1._dirY = -1
        }
    }
     else if (obj1.x-20 == obj2.x && obj1.y>obj2.y+58){
         if (obj1._Movingup) {
             obj1._Enableup = false;
         }
    }
    else {
        obj2.EnableFall();
    }
}

function onCollisionTierra (obj1, obj2){
    if (obj1._id=='Player'){

        if(obj2._id == 'tierraH' || obj2._id == 'tierraV')
            obj2.destroy(); //Llamamos la la destructora de la tierra
        else {
            if ((obj1.x-20)>obj2._posX && (obj1.y-20)==obj2._posY){       //ENTRANDO POR LA DERECHA
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)<obj2._posX && (obj1.y-20)==obj2._posY){
                obj2.x = obj2.x+1;
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)<obj2._posY){
                obj2.y = obj2.y + 1;
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)>obj2._posY){
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            if (obj2.width<4 || obj2.height<4){
                obj2.destroy();
                var PosCentralTierra = new Par (obj2._posCentralX, obj2._posCentralY);
                var BanderaControl = new GO(this.g, PosCentralTierra, 'Banderita', 'Bandera'); 

                this.g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                BanderaControl.anchor.x = 0.5;
                BanderaControl.anchor.y = 0.5;
                BanderaControl.visible=false;
                this.g.world.addChild(BanderaControl);
                GrupoBanderas.add(BanderaControl);
                BanderaControl.body.immovable = true;
            }
        }
    }
    if (obj1._Falling && obj1._id=='Roca' && obj1.y<obj2.y && obj1.y<540)         
        obj2.destroy();
}

function onCollisionPara(obj1, obj2){
    if(obj2._Falling && obj1.y>obj2.y+21){
        if(obj2.y != obj2._posY)
            obj2.Para();
        else
            obj2._Falling=false;
    }
}

function onCollisionVegetable(obj1,obj2){
    itemSound.play();
    sumaPuntos(obj2._puntos, this.g);
    obj2.destroy();
}

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function sumaPuntos (x,g) {
    puntuacion += x;
    puntuacionControl += x;
    if(puntuacionControl>=20000){
        puntuacionControl-=20000;
        if(vidas<8){
            vidas++;
            ActualizaHUD(g);
        }
    }
    score.text = puntuacion;
} 

function LoadMap (lvl,g) {
    g.mapaNivel = JSON.parse(g.cache.getText('level'+lvl));

    var posX=-3, posY=80;
    
    var V1 = new Par(-3, posY-43);
    var V2 = new Par(513, posY-43);

    BloqTierraleft = new GO(g, V1, 'tierraVInferior', 'tierraV');  
    g.physics.arcade.enable(BloqTierraleft);
    BloqTierraleft.body.immovable = true;
    BloqTierraleft.visible=false;
    g.world.addChild(BloqTierraleft);
    tierraV.add(BloqTierraleft);

    var BloqTierraright = new GO(g, V2, 'tierraVInferior', 'tierraV');  
    g.physics.arcade.enable(BloqTierraright);
    BloqTierraright.body.immovable = true;
    BloqTierraright.visible=false;
    g.world.addChild(BloqTierraright);
    tierraV.add(BloqTierraright);
    

    for(var h=0; h<12; h++){
        var PosTierraH = new Par(posX, posY-43);
        var BloqTierraH = new GO(g, PosTierraH, 'tierraHInferior','tierraH');
        BloqTierraH.visible=false;
        g.physics.arcade.enable(BloqTierraH);
        BloqTierraH.body.immovable = true;
        g.world.addChild(BloqTierraH);
        tierraH.add(BloqTierraH);

        var PosCentralTierra = new Par (posX+23, posY-20);
        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
        BanderaControl.anchor.x = 0.5;
        BanderaControl.anchor.y = 0.5;
        BanderaControl.visible=false;
        g.world.addChild(BanderaControl);
        GrupoBanderas.add(BanderaControl);
        BanderaControl.body.immovable = true;

        posX+=43;
    }
    
    posY=83;
    posX=-3;

    for (var j = 0; j < 25; j++){
        for (var i = 0; i < 25; i++){

            var fila = g.mapaNivel.nivel[j].fila;

            if (j%2==0){   //Si estasmos en una fila par
                if(i%2!=0){     //Si estamos en una columna impar deberia ser 2 para lleno o 0 para vacio
                    if(fila[i]=='2'){

                        var PosTierraH = new Par(posX, posY-3);
                        if(j<9)
                            var BloqTierraH = new GO(g, PosTierraH, 'tierraHSuperficie','tierraH');
                        else if(j<17)
                            var BloqTierraH = new GO(g, PosTierraH, 'tierraHIntermedia','tierraH');
                        else 
                            var BloqTierraH = new GO(g, PosTierraH, 'tierraHInferior','tierraH');

                        g.physics.arcade.enable(BloqTierraH);
                        BloqTierraH.body.immovable = true;
                        g.world.addChild(BloqTierraH);
                        tierraH.add(BloqTierraH);

                        posX+=43;
                    }
                    else{
                        posX+=43;
                    }
                }
            }
            else{   //Si estasmos en una fila impar
                if(i%2==0){     //Si estamos en una columna par 
                    if(fila[i]=='1'){

                        var PosTierraV = new Par(posX, posY-46);

                        if(j<9)
                            var BloqTierraV = new GO(g, PosTierraV, 'tierraVSuperficie', 'tierraV');
                        else if(j<17)
                            var BloqTierraV = new GO(g, PosTierraV, 'tierraVIntermedia', 'tierraV'); 
                        else
                            var BloqTierraV = new GO(g, PosTierraV, 'tierraVInferior', 'tierraV');  
                        g.physics.arcade.enable(BloqTierraV);
                        BloqTierraV.body.immovable = true;
                        g.world.addChild(BloqTierraV);
                        tierraV.add(BloqTierraV);

                        posX+=43;
                    }
                    else{
                        posX+=43;
                    }
                }
                else    //AQUI PARA LAS COLUMNAS IMPARES QUE PUEDEN SER DE TIERRA, TIERRA CON ROCA, VACIA, VACIA CON MONSTRUO
                {
                    if(fila[i]=='0'){    //Bloque de Tierra
                        
                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;
                    }
                    else if(fila[i]=='3'){    //Bloque de Tierra
                        
                        var PosTierra = new Par(posX-40, posY-43);
                        var PosCentralTierra = new Par(posX-20, posY-23);

                        if(j<9)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraSuperficie', 'tierra',PosCentralTierra); 
                        else if(j<17)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraIntermedia', 'tierra', PosCentralTierra); 
                        else
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraInferior', 'tierra', PosCentralTierra);  
                        
                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                    }
                    else if(fila[i]=='4'){    //Bloque de Tierra + Roca
                        
                        var PosTierra = new Par(posX-40, posY-43);
                        var PosCentralTierra = new Par(posX-20, posY-23);
                        
                        if(j<9)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraSuperficie', 'tierra', PosCentralTierra); 
                        else if(j<17)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraIntermedia', 'tierra', PosCentralTierra); 
                        else
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraInferior', 'tierra', PosCentralTierra);  

                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                        var PosRock = new Par(posX-40, posY-44);
                        var Rock = new Roca(g, PosRock, 'Roca', 'RocaCompletaSpriteSheet');
                        g.physics.arcade.enable(Rock); 
                        GrupoRocas.add(Rock);     //AÑADIMOS AL GRUPO

                        
                        
                    }
                    else if(fila[i]=='5'){    //Enemigo Pooka
                        
                        var PosEne = new Par(posX-20,posY-23);
                        var enemigo = new Enemy('P', CuboHuida, g, PosEne, 'Enemigo', limiteDerecho, limiteSuperior,player);
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);

                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;

                    }
                    else if(fila[i]=='6'){    //Enemigo Fygar

                        var PosEne = new Par(posX-20,posY-23);
                        var enemigo = new Fygar('FygarSpriteSheet', CuboHuida, g, PosEne, 'Enemigo', limiteDerecho, limiteSuperior,player, tierra);
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);

                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;

                    }
                }
            }
        }
        posX=-3;
        if (j%2==0)
            posY+=43;
    }
    tamañoGrupoRocas=GrupoRocas.length;
    cargado=true;
} 

function ResetPosition(){       //Coloca al todos los personajes en el lugar original
    
    Vegetable.destroy();

    for (var i=0; i< GrupoEnemigos.length; i++){
        GrupoEnemigos.children[i].x = GrupoEnemigos.children[i]._posOriginalX;
        GrupoEnemigos.children[i].y = GrupoEnemigos.children[i]._posOriginalY;
        GrupoEnemigos.children[i]._distanceX=0;
        GrupoEnemigos.children[i]._distanceY=0;
        GrupoEnemigos.children[i]._Fantasma=false;
        GrupoEnemigos.children[i]._giros=0;
        GrupoEnemigos.children[i]._posicionInicial=0;
        GrupoEnemigos.children[i]._bufferBounce=1;
    }
    player.x=player._posOriginalX;
    player.y=player._posOriginalY;
    player._distanceX=0;
    player._distanceY=0;
    player._Enableright = true;
    player._Enableleft = true;
    player._Enabledown = true;
    player._Enableup = true;
    player._animDig.stop();
    player._animDie.stop();
    player._animWalk.play(6,true);


    if(player.width<0)
        player.width=-player.width;
    if(player.angle!=0)
        player.angle=0;
}

function StopEnemies(){
    for (var t=0; t<GrupoEnemigos.length; t++){
        GrupoEnemigos.children[t]._MovementEnable=false;
        GrupoEnemigos.children[t]._animWalk.stop();
    }
}

function StopRocks(){
    for (var t=0; t<GrupoRocas.length; t++){
        GrupoRocas.children[t]._FallEnable=false;
    }
}

function StartEnemies(){
    for (var t=0; t<GrupoEnemigos.length; t++){
        if(!GrupoEnemigos.children[t]._Fantasma)
            GrupoEnemigos.children[t]._animWalk.play(6,true);
        else
            GrupoEnemigos.children[t]._animFant.play(4,true);
        GrupoEnemigos.children[t]._MovementEnable=true;
        GrupoEnemigos.children[t]._giros=0;
        GrupoEnemigos.children[t]._posicionInicial=0;
        GrupoEnemigos.children[t]._bufferBounce=1;
        if(GrupoEnemigos.children[t]._playerBurnt!=undefined)
            GrupoEnemigos.children[t]._playerBurnt=false;
    }
}
function StartRocks(){
    for (var t=0; t<GrupoRocas.length; t++){
        GrupoRocas.children[t]._FallEnable=true;
    }
}

function LevelComplete(g){
    nivel++;
    g.state.restart('play', false, false);
}

function ActualizaHUD(g){       //ACTUALIZA EL HUD DE LAS VIDAS

    for (i = 0; i < thisLifes.length; i++) 
    {
        thisLifes.removeChildren();
    }
    var j=0;
    for (i = 0; i < vidas; i++) 
    {
        if(i<4){
            spriteVidas = thisLifes.create(562 + (43 * i), 390, 'DigDugWalking');
            spriteVidas.frame=0;
            spriteVidas.alpha = 0.7;
        }
        else{
            spriteVidas = thisLifes.create(562 + (43 * j), 445, 'DigDugWalking');
            spriteVidas.frame=0;
            spriteVidas.alpha = 0.7;
            j++;
        }
    }
}

function LevelWin(g){    //Para el sonido de victoria
    if(!player._Muerto || !player._AnimMuerto){
        playerMusic.stop();
        winSound.play();
        player._animDig.stop();
        player._animWalk.stop();
        player._MovementEnable=false;
        timerControl.add(3500,LevelComplete,this,g);
        timerControl.start();
    }    
}

function ContinuarLevel(g,lfs){
    player.body.enable=true;
    player._Muerto=false;
    player._AnimMuerto=false;
    player._MovementEnable=true;
    vidas--;
    PAUSED=false;
    ResetPosition();
    StartEnemies();
    StartRocks();
    ActualizaHUD(g,lfs);
}

function ComenzarJuego(g){
    playerMusic.stop();
    nivel=1;
    vidas=3;
    puntuacion=0;
    VegetalGenerado=false;
    g.state.restart('play', false, false);
}

function MuertePlayer(obj1,obj2){
    if(!obj2._Fantasma && obj2._State==0){
        if(!player._AnimMuerto){
            player.Muerte();
            StopEnemies();
            StopRocks();
        }
    }
}

function onCollisionHuidaEnemigo(obj1,obj2){
    if(obj2._Huyendo && !obj2._ultimoGiro){
        obj2.angle=0;
        if(obj2.width>0)
            obj2.width=-obj2.width;
        obj2._ultimoGiro=true;
        BloqTierraleft.destroy();
        CuboHuida.destroy();
    }
}

function onCollisionEliminacionEnemigo(obj1,obj2){
    
    obj2._MovementEnable=false;
    obj2.destroy();
}

function FullScreen(){

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
        FullScreenButton.loadTexture('FullScreenButton');
    }
    else
    {
        this.game.scale.startFullScreen(false);
        FullScreenButton.loadTexture('NormalScreenButton');
    }
}

function Mute(){
    if(this.game.sound.mute){
        this.game.sound.mute=false;
        MuteButton.loadTexture('MuteButton');
    }
    else if(!this.game.sound.mute){
        this.game.sound.mute=true;
        MuteButton.loadTexture('DeMuteButton');
    }
}
},{"./Class_Enemy.js":1,"./Class_Flor.js":2,"./Class_Fygar.js":3,"./Class_GameObject.js":4,"./Class_Movable.js":5,"./Class_Player.js":6,"./Class_Roca.js":7,"./Class_Tierra.js":8,"./Class_Vegetal.js":9}]},{},[10]);
