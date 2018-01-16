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
            console.debug(this._State);
            this._timerStarted=true;
            this._TimerState = this._game.time.create(false);
            this._TimerState.add(1500,ReduceState,this);
            this._TimerState.start();
        }

        if(this._State>0 && this._State<5){
            if(this.frame!=(4+this._State))
                this.frame=(4+this._State);
            
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
            console.debug(this._State);
            this._State--;
            this._TimerState.stop();
            console.debug(this._State);
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