'use strict';

var Movable = require('./Class_Movable.js');

var Enemy = function(game, position, sprite, id, limiteDerecho, limiteSuperior, player, spriteSheet){
    Movable.apply(this, [game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet]);
    this._IntentosDeGiro=2;
    this._distanceXtoPlayer;
    this._distanceYtoPlayer;
    this._Movingright=true;

    this._vertical=false;
    this._horizontal=false;

    //this._animWalk =this.animations.add('Walking');
    //this._animWalk.play(6,true);
    }

    Enemy.prototype = Object.create(Movable.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.update = function() 
    {

    if(this._Movingleft){
        this.x--;
        this._distanceX--;
    }
    else if(this._Movingright){
        this.x++;
        this._distanceX++;
    }
    else if(this._Movingup){
        this.y--;
        this._distanceY--;
    }
    else if(this._Movingdown){
        this.y++;
        this._distanceY++;
    }

    if (this._distanceX > 42 || this._distanceX < -42){
        this._distanceX = 0;
        this._IntentosDeGiro=2;
        //his.ChangeDir();
    }
    if (this._distanceY > 42 || this._distanceY < -42){
        this._distanceY = 0;
        this._IntentosDeGiro=2;
        //this.ChangeDir();
    }
    // if(!this._Movingdown && !this._Movingup && !this._Movingleft && !this._Movingright){
    //     this._animWalk.paused=false;
    //     }
    }
    Enemy.prototype.AutomaticMovement = function() {
        
    }
    Enemy.prototype.ChangeDir = function() {

        this._distanceXtoPlayer=Math.abs(player.x) - Math.abs(this.x);
        this._distanceYtoPlayer=Math.abs(player.y) - Math.abs(this.y);

        if(this._distanceXtoPlayer > this._distanceYtoPlayer){
            


        }


        if(this._vertical)
        if (this._Movingleft || this._Movingright){
            if(player.y > this.y){



            }
        }

    }
    Enemy.prototype.ChangeDirTierra = function() {
        
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

module.exports = Enemy;