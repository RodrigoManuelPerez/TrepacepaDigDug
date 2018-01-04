'use strict';

var Enemy = require('./Class_Enemy.js');

var Fygar = function(spritesheet, game, position, id, limiteDerecho, limiteSuperior, player, grupoTierra){
    Enemy.apply(this, [spritesheet, game, position, id, limiteDerecho, limiteSuperior, player]);

    this._animBreathFire = this.animations.add('Breathing',[1,9],5,true);   //animacion de coger fuego con 2 frames y 3 loops

    this._TimerFuego = game.time.create(false);
    this._TimeToFire= Math.random() * (5000) + 10000;
    this._TimerFuego.add(this._TimeToFire,StopToFire,this);
    this._TimerFuego.start();

    this._ThrowingBullet=false;
    this._playerBurnt=false;

    this._game = game;
    this._GrupoTierra = grupoTierra;
    this._FireBullet;

    this._distanciaX=0;
    this._distanciaY=0;

    this._Fire;

    this._2FiresAnim;
    this._3FiresAnim;
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

        this._game.physics.arcade.collide(this._FireBullet, this._GrupoTierra, onCollisionBulletTierra);
        this._game.physics.arcade.collide(this._player, this._Fire, onCollisionFirePlayer);

        Enemy.prototype.update.call(this);
    }
    function onCollisionFirePlayer(){
        this._playerBurnt=true;
        this._playerBurnt.Muerte();
        this._game.StopEnemies.call(this._game);
    }

    function onCollisionBulletTierra(){
        this._ThrowingBullet=false;
        this._FireBullet.destroy();
    }

    function StopToFire(){
        if(this._MovementEnable && !this._Fantasma){
            
            this._MovementEnable=false;
            this._animWalk.stop();
            this._animBreathFire.play(5,true);
            this._TimerFuego.add(1000,ThrowFire,this);//tiempo hay que calcularlo segun la animacion y como quiera que quede
            this._TimerFuego.start();

            this._FireBullet = new Phaser.Sprite(this._game, 0, 0, 'Banderita');
            this._game.physics.enable(this._FireBullet, Phaser.Physics.ARCADE);
            this._FireBullet.anchor.x = 0.5;
            this._FireBullet.anchor.y = 0.5;
            this._FireBullet.width = this._FireBullet.width;
            this._FireBullet.height = this._FireBullet.height;

            this._ThrowingBullet=true;
        }
        else{
            this._TimeToFire= Math.random() * (5000) + 10000;
            this._TimerFuego.add(this._TimeToFire,StopToFire,this);
            this._TimerFuego.start();
        }
    }

    function ThrowFire(){
        console.debug('Te escupofuego LK');

        if(Math.abs(this._distanciaX)>100 || Math.abs(this._distanciaY)>100){
            this._Fire=new Phaser.Sprite(this._game, this.x, this.y, '1Fire');       //CAMBIAR EL 1 FIRE
            // this._Fire.frame=0;
            // this._Fire.animations.add('3FramesFire',[0,1,2],10,false);
            
            console.debug(this._Fire.x);
            console.debug(this._Fire.y);

            if(this._Movingleft){
                this._Fire.anchor.x=0.5;
                this._Fire.anchor.y=0.5;
                this._Fire.width=-this._Fire.width;
                this._Fire.x-=20;
                //this._3FiresAnim.play(10,false);
            }
            else if (this._Movingright){
                this._Fire.anchor.x=0.5;
                this._Fire.anchor.y=0.5;
                this._Fire.x+=20;
                //this._3FiresAnim.play(10,false);
            }
            else if (this._Movingup){
                
            }
            else if(this._Movingdown){
                
            }

        }
        else if(Math.abs(this._distanciaX)>60 || Math.abs(this._distanciaX)>60){
            this._Fire=this.game.add.sprite('2Fires');
            this._2FiresAnim = this._Fire2.animations.add('2FramesFire',[0,1],10,false);
        }
        else{
            this._Fire=this._game.add.sprite('1Fire');
        }

        
        //AQUI HACEMOS LA ANIMACION Y LA ELECCION DE CUAL DE TODAS
        //EL THROWING FIRE SERIA MEJOR UN BOLEANO DE SI HAS PILLADO AL PLAYER POR LO QUE MIENTRAS THROWING FIRE ESTE A TRUE
        //COMPROBAMOS COLISION ENTRE EL FUEGO Y EL PLAYER, SI ES TRUE, SE MUERE EL PLAYER Y SE PONE LA CONDICION
        //DE CONTINUE A QUE NO HAYAS PILLADO AL PLAYER
        //PONEMOS LAS VARIABLES NECESARIAS PARA CONTINUAR CON EL JUEGO

        this._animBreathFire.stop();
        this._ThrowingFire=true;
        this._TimerFuego.add(500,Continue,this);
        this._TimerFuego.start();
    }

    function Continue(){
        if(!this._playerBurnt){
            this._MovementEnable=true;
            this._animWalk.play(6,true);
            this._TimeToFire= Math.random() * (5000) + 10000;
            this._TimerFuego.add(this._TimeToFire,StopToFire,this);
            this._TimerFuego.start();
        }
    }

module.exports = Fygar;