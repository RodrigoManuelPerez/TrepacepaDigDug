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
    this._ShootEnable=true;

    this._HookDistanceX=0;
    this._HookDistanceY=0;


    //ENTRADA TACTIL
    this._pulsandoBoton=false;
    this._pulsandoDerecha=false;
    this._pulsandoIzquierda=false;
    this._pulsandoArriba=false;
    this._pulsandoAbajo=false;
    }

    Player.prototype = Object.create(Movable.prototype);
    Player.prototype.constructor = Player;

Player.prototype.Input = function() //Mueve el jugador a la izquierda
    {
    //Comprobación de cursores de Phaser
    if(this._MovementEnable){
        if ((this._cursors.left.isDown || this._pulsandoIzquierda) && this.x > 20 && this._Enableleft)
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
        else if ((this._cursors.right.isDown || this._pulsandoDerecha) && this.x < this._LimiteDerecho - 20 && this._Enableright)
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
        else if ((this._cursors.down.isDown || this._pulsandoAbajo) && this.y < 612 - this.height && this._Enabledown)
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
        else if ((this._cursors.up.isDown || this._pulsandoIzquierda) && this.y > this.height + 24 && this._Enableup)
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

    if ((this._HookThrow.isDown || this._pulsandoBoton) && !this._Hooking && this._MovementEnable && this._readyToShoot && this._ShootEnable){
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