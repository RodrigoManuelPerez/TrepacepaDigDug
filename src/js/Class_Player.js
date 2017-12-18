'use strict';

var Movable = require('./Class_Movable.js');
var GO = require('./Class_GameObject.js');

var playerMusic;
var MusicaCargada=false;

var Player = function(game, position, sprite, id, cursors, limiteDerecho, limiteSuperior,posOriginal, spriteSheet){
    Movable.apply(this, [game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet]);
    this._cursors = cursors;
    this._animWalk =this.animations.add('Walking');
    this._animWalk.play(6,true);
    this._MovementEnable=true;    //NO DEBERIA HACER FALTA PORQUE LO HEREDA DE MOVABLE
    this._AutomaticMovement=false;

    this._posOriginal=posOriginal;

    this._posInicial =position;

    this._Hooked = false; //ESTADO A TRUE CUANDO EL GANCHO HA COGIDO A UN ENEMIGO
    this._Hooking=false;  //LANZANDO EL GANCHO
    this._HookThrow = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    this._vidas=3;
    }

    Player.prototype = Object.create(Movable.prototype);
    Player.prototype.constructor = Player;

Player.prototype.Input = function() //Mueve el jugador a la izquierda
    {
    //Comprobación de cursores de Phaser
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

    //PARTE DEL GANCHO QUE VA A HABER QUE CAMBIAR

    /*if (this._HookThrow.isDown && !this._Hooking){
        if(this._MovementEnable){
            this._MovementEnable=false;
            //Pasamos al estado de lanzando con un solo frame
            console.debug(this._Hook._id);
        }
    }*/

    if (this._distanceX > 42 || this._distanceX < -42)
        this._distanceX = 0;
    if (this._distanceY > 42 || this._distanceY < -42)
        this._distanceY = 0;

    if(!this._Movingdown && !this._Movingup && !this._Movingleft && !this._Movingright){
        this._animWalk.paused=false;
        }

    /*if(this._fireButton.isDown)
    {
        this._playerWeapon.fire();
    }*/
}
    Player.prototype.update = function() {
        if (this._MovementEnable)
            this.Input();
        else if(this._AutomaticMovement)
            this.AutomaticMovement();

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
            this._MovementEnable=true;  //Esto tiene que activar una funcion contador para lanzar el juego todo a la vez permitiendo a todos los personajes moverse
            this._AutomaticMovement=false;      
        }
    }
    Player.prototype.PlayerRock = function() {
        this._MovementEnable=false;
    }

    

module.exports = Player;