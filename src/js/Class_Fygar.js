'use strict';

var Enemy = require('./Class_Enemy.js');

var FireSound;

var Fygar = function(spritesheet,cube, game, position, id, limiteDerecho, limiteSuperior, player, grupoTierra){
    Enemy.apply(this, [spritesheet, cube, game, position, id, limiteDerecho, limiteSuperior, player]);

    this._animBreathFire = this.animations.add('Breathing',[1,9],5,true);   //animacion de coger fuego con 2 frames y 3 loops

    this._TimerFuego = game.time.create(false);
    this._TimeToFire= Math.random() * (5000) + 10000;
    this._TimerFuego.add(this._TimeToFire,StopToFire,this);
    this._TimerFuego.start();

    this._ThrowingBullet=false;
    this._ThrowingFire=false;
    this._playerBurnt=false;

    this._player=player;
    this._game = game;
    this._GrupoTierra = grupoTierra;
    this._FireBullet;

    this._distanciaX=0;
    this._distanciaY=0;

    this._Fire;

    this._2FiresAnim;
    this._3FiresAnim;

    FireSound=game.add.audio('Dragon',7);
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    Fygar.prototype.update = function() 
    {
        
        if(this._ThrowingBullet){
            if(this._Movingleft){
                if(this._distanciaX>-120){
                    this._distanciaX-=2;
                    this._FireBullet.x-=2;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
            else if (this._Movingright){
                if(this._distanciaX<120){
                    this._distanciaX+=2;
                    this._FireBullet.x+=2;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
            else if (this._Movingup){
                if(this._distanciaY>-120){
                    this._distanciaY-=2;
                    this._FireBullet.y-=2;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
            else if(this._Movingdown){
                if(this._distanciaY<120){
                    this._distanciaY+=2;
                    this._FireBullet.y+=2;
                }
                else
                    onCollisionBulletTierra.call(this);
            }
        }
        
        if(this._game.physics.arcade.collide(this._FireBullet, this._GrupoTierra))
            onCollisionBulletTierra.call(this);

        if(this._game.physics.arcade.collide(this._player, this._Fire))
            onCollisionFirePlayer.call(this);

        Enemy.prototype.update.call(this);
    }
    function onCollisionFirePlayer(){
        if(!this._playerBurnt){
            this._playerBurnt=true;
            this._player.Muerte();
        }
    }

    function onCollisionBulletTierra(){
        
        this._ThrowingBullet=false;
        this._FireBullet.destroy();
        
    }

    function StopToFire(){
        
        if(this._MovementEnable && !this._Fantasma && this!=undefined){

            this._MovementEnable=false;
            this._animWalk.stop();
            this._animBreathFire.play(5,true);
            this._TimerFuego.add(1000,ThrowFire,this);//tiempo hay que calcularlo segun la animacion y como quiera que quede
            this._TimerFuego.start();

            this._FireBullet = new Phaser.Sprite(this._game, this.x, this.y, 'Banderita');
            this._game.physics.enable(this._FireBullet, Phaser.Physics.ARCADE);
            
            this._FireBullet.height = this._FireBullet.height/4;
            this._FireBullet.width = this._FireBullet.width/4;
            this._FireBullet.visible=true;
            this._FireBullet.anchor.x = 0.5;
            this._FireBullet.anchor.y = 0.5;
            this._game.world.add(this._FireBullet);

            this._ThrowingBullet=true;
        }
        else{
            this._TimeToFire= Math.random() * (5000) + 10000;
            this._TimerFuego.add(this._TimeToFire,StopToFire,this);
            this._TimerFuego.start();
        }
    }

    function ThrowFire(){

        if(Math.abs(this._distanciaX)>115 || Math.abs(this._distanciaY)>115){
            this._3FireSpritesheet='3';
            this._Fire=new Phaser.Sprite(this._game, this.x, this.y, this._3FireSpritesheet[0] );

            this._Fire.anchor.x=0.5;
            this._Fire.anchor.y=0.5;
            this._FireAnim = this._Fire.animations.add('3FramesFire',[0,1,2],10,false);
            this._FireAnim.play(10,false);
            this._game.world.add(this._Fire);

            if(this._Movingleft){               
                this._Fire.x-=70;
                this._Fire.width = -this._Fire.width;
            }
            else if (this._Movingright){
                this._Fire.x+=70;
            }
            else if (this._Movingup){
                this._Fire.angle = -90;
                this._Fire.y-=70;
            }
            else if(this._Movingdown){
                this._Fire.angle = 90;
                this._Fire.y+=70;
            }

            FireSound.play();

        }
        else if(Math.abs(this._distanciaX)>75 || Math.abs(this._distanciaX)>75){
            this._Fire=new Phaser.Sprite(this._game, this.x, this.y, '2');
            this._Fire.anchor.x=0.5;
            this._Fire.anchor.y=0.5;
            this._FireAnim = this._Fire.animations.add('2FramesFire',[0,1],10,false);
            this._FireAnim.play(10,false);
            this._game.world.add(this._Fire);
            
            if(this._Movingleft){                
                this._Fire.x-=50;
                this._Fire.width = -this._Fire.width;
            }
            else if (this._Movingright){
                this._Fire.x+=50;
            }
            else if (this._Movingup){
                this._Fire.angle = -90;
                this._Fire.y-=50;
            }
            else if(this._Movingdown){
                this._Fire.angle = 90;
                this._Fire.y+=50;
            }

            FireSound.play();

        }
        else if(Math.abs(this._distanciaX)>30 || Math.abs(this._distanciaX)>30){
            this._Fire=new Phaser.Sprite(this._game, this.x, this.y, '1Fire');
            this._Fire.anchor.x=0.5;
            this._Fire.anchor.y=0.5;
            this._game.world.add(this._Fire);
            

            if(this._Movingleft){    
                this._Fire.width = -this._Fire.width;            
                this._Fire.x-=32;
            }
            else if (this._Movingright){
                this._Fire.x+=32;
            }
            else if (this._Movingup){
                this._Fire.angle = -90;
                this._Fire.y-=32;
            }
            else if(this._Movingdown){
                this._Fire.angle = 90;
                this._Fire.y+=32;
            }

            FireSound.play();

        }
        
        this._animBreathFire.stop();
        this._ThrowingFire=true;
        if(this._Fire!=undefined){
            this._TimerFuego.add(150,ActiveFireCollider,this);
            this._TimerFuego.start();
        }
        this._TimerFuego.add(400,Continue,this);
        this._TimerFuego.start();
        
    }

    function ActiveFireCollider(){
        this._game.physics.enable(this._Fire, Phaser.Physics.ARCADE);
    }

    function Continue(){
        if(!this._playerBurnt){
            this._MovementEnable=true;
            this._animWalk.play(6,true);
        }
        if(this._Fire!=undefined)
            this._Fire.destroy();
        this._ThrowingFire=false;
        this._TimeToFire= Math.random() * (5000) + 10000;
        this._TimerFuego.add(this._TimeToFire,StopToFire,this);
        this._TimerFuego.start();
        this._distanciaX=0;
        this._distanciaY=0;

    }

module.exports = Fygar;