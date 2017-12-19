(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Movable = require('./Class_Movable.js');

var Enemy = function(game, position, sprite, id, limiteDerecho, limiteSuperior, player, spriteSheet){
    Movable.apply(this, [game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet]);
    this._IntentosDeGiro=2;
    this._distanceXtoPlayer;
    this._distanceYtoPlayer;
    this._Movingright=true;
    this._posOriginal = position;

    this._player=player;

    this._limiteDerecho=limiteDerecho;
    this._limiteSuperior=limiteSuperior;

    this._bufferBounce=1;

    this._MovementEnable=true;
    //this._animWalk =this.animations.add('Walking');
    //this._animWalk.play(6,true);
    }

    Enemy.prototype = Object.create(Movable.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.update = function() 
    {
    if(this._MovementEnable){
        if(this._Movingleft && this.x>15){
            this.x--;
            this._distanceX--;
        }
        else if(this._Movingright && this.x<this._limiteDerecho-15){
            this.x++;
            this._distanceX++;
        }
        else if(this._Movingup && this.y>this._limiteSuperior+10){
            this.y--;
            this._distanceY--;
        }
        else if(this._Movingdown && this.y<585){
            this.y++;
            this._distanceY++;
        }

        if (this._distanceX > 42 || this._distanceX < -42){
            this._distanceX = 0;
            if(this._bufferBounce==0){
                this.ChangeDirVer();
            }
            else{
                this._bufferBounce--;
            }
        }
        if (this._distanceY > 42 || this._distanceY < -42){
            this._distanceY = 0;
            if(this._bufferBounce==0){
                this.ChangeDirHor();
            }
            else{
                this._bufferBounce--;
            }
        }
        // if(!this._Movingdown && !this._Movingup && !this._Movingleft && !this._Movingright){
        //     this._animWalk.paused=false;
        //     }

        }
    }



    Enemy.prototype.ChangeDirHor = function() {
        
        this.y-=this._distanceY;
        this._distanceY=0;
        this._bufferBounce=1;
        
        if(this._player.x > this.x){
            this._Movingright=true;
            this._Movingleft=false;
            this._Movingup=false;
            this._Movingdown=false;
        }
        else if (this._player.x < this.x){
            this._Movingright=false;
            this._Movingleft=true;
            this._Movingup=false;
            this._Movingdown=false;
        }
    }

    Enemy.prototype.ChangeDirVer = function() {

        this.x-=this._distanceX;
        this._distanceX=0;
        this._bufferBounce=1;

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

    Enemy.prototype.resetPos = function() {
        this.x=this._posOriginal.x;
        this.y=this._posOriginal.y;
    }

module.exports = Enemy;
},{"./Class_Movable.js":5}],2:[function(require,module,exports){
'use strict';

var Enemy = require('./Class_Enemy.js');

var Fygar = function(game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet){
    Enemy.apply(this, [game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet]);

    //PARA MONTAR LAS ANIMACIONES DEL DRAGON
    this._animWalk =this.animations.add('Walking');
    this._animWalk.play(6,true);
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    Fygar.prototype.PlayerRock = function() {
        this._Enable=false;
    }

module.exports = Fygar;
},{"./Class_Enemy.js":1}],3:[function(require,module,exports){
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

GameObject.prototype.Destroy = function()
{
    this.destroy();
}

module.exports = GameObject;
},{}],4:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Hook = function(game, position, sprite,id, player){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    
        //this.animations.add('Shaking', [0, 1], 5, true);
        //this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        //this._animShake.play(5,true);

        this._Thrown = false;       //Denota el estado de si está lanzado o recogido por DigDug
        this._Hooked = false;       //Denota cuando el gancho ha codigo a un enemigo
        this._Distance=0;           //Distancia recorrida por el gancho
        this._MaxDistance=43*1.5;     //Distancia máxima que puede recorrer
        
        this._posOriginal=position;
        /*this._HasFallen = false;
        this._FallEnable = false;
        this._timer = this.game.time.create(false);*/
        }
    
        Hook.prototype = Object.create(GameObject.prototype);
        Hook.prototype.constructor = Hook;
    
        Hook.prototype.update=function(){

            if(this._Hooked)        //Coloco primero el estado de enganchado porque es el que tiene prioridad
            {

            }
            else if(this._Thrown)    //Cuando el gancho está volando
            {
                this.width+=2;
                this.x--;
            }
            else                //Cuando el gancho está quiero en dig dug
            {
                if(this.x!=this._posOriginal.x)
                    this.x=this._posOriginal.x;
                if(this.y!=this._posOriginal.y)
                    this.y=this._posOriginal.y;
                //En verdad se queda en la posicion sin mas, posicion hija del player en el 0 0 aprox
            }
            if(this.x>this._MaxDistance){
                this._Thrown=false;
            }

        }
    
        Hook.prototype.Para=function() {
            
          
            
        }
    
        Hook.prototype.EnableFall=function() {

        }
    
        function Fall() {
        
        }
        function BreakRock(){

        }

module.exports = Hook;
},{"./Class_GameObject.js":3}],5:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Movable = function(game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet){
    
    GameObject.apply(this, [game ,position, sprite, id, spriteSheet]);

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

module.exports = Movable;
},{"./Class_GameObject.js":3}],6:[function(require,module,exports){
'use strict';

var Movable = require('./Class_Movable.js');
var GO = require('./Class_GameObject.js');

var playerMusic;
var MusicaCargada=false;

var Player = function(game, position, id, cursors, limiteDerecho, limiteSuperior,posOriginal, spriteSheet){
    Movable.apply(this, [game, position, spriteSheet[0], id, limiteDerecho, limiteSuperior, spriteSheet]);
    this._cursors = cursors;
    this._animWalk =this.animations.add('Walking');
    this._animWalk.play(6,true);
    this._MovementEnable=false;    //NO DEBERIA HACER FALTA PORQUE LO HEREDA DE MOVABLE
    this._AutomaticMovement=true;

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
},{"./Class_GameObject.js":3,"./Class_Movable.js":5}],7:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Roca = function(game, position,id, spritesheet){
    
    GameObject.apply(this, [game ,position, spritesheet[0], id, spritesheet]);
    
        this.animations.add('Shaking', [0, 1], 5, true);
        this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        

        this._PlayerAplastado = false;



        this._Falling = false;
        this._HasFallen = false;
        this._FallEnable = false;
        this._timer = this.game.time.create(false);
        }
    
        Roca.prototype = Object.create(GameObject.prototype);
        Roca.prototype.constructor = Roca;
    
        Roca.prototype.update=function(){
            if(this._Falling){
                for(var i=0; i<6; i++){
                    if (this._Falling && this.y<558){
                        this.y ++;
                    }
                }
            }
            if (this.y > 556)
                this.Para();
        }
    
        Roca.prototype.Para=function() {
            
            this.animations.stop('Shaking');
            this.animations.play('Breaking');
            this._Falling = false;
            this._HasFallen = true;
            this._timer.loop(4000,BreakRock,this);
            //DENTRO DE UNA FUNCION PROPIA DE LA ROCA A LO MEJOR SI FUNCIONA PORQUE UNA FUNCION EXTERNA A LO MEJOR NO PUEDE ACCEDER
            this._timer.start();
    
            this.body.enable=false;
            //Y SE LLAMARIA AL DESTRUCTOR DE ESTE OBJETO EL CUAL CONTARA CON UNA ANIMACION SI NO SE ACTIVA UN BOOL DE HABER COGIDO ENEMIGO O SIMPLEMENTE IRA COGIENDO HIJOS Y
            // LOS PARARA Y AL DESTRUIRSE ÉL DESTRUIRA A LOS HIJOS
            
        }
    
        Roca.prototype.EnableFall=function() {
            this.animations.play('Shaking');
            this._timer.loop(2000,Fall,this);
            this._timer.start();
        }
    
        function Fall() {
            if(!this._HasFallen){
                this._Falling = true;
                this._timer.stop();

            }
        }
        function BreakRock(){

            

            if(this._PlayerAplastado){
                for (var i=0; i<this.children.length; i++){
                    if(this.children[i]._id=='Player'){
                        
                        this.children[i]._vidas--;
                    }

                }
            }
            this.Destroy();
        }

module.exports = Roca;
},{"./Class_GameObject.js":3}],8:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Vegetal = function(game, position, sprite,id, puntos){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    this._puntos = puntos;
    this._timer = this.game.time.create(false);
    }

    Vegetal.prototype = Object.create(GameObject.prototype);
    Vegetal.prototype.constructor = Vegetal;

    Vegetal.prototype.Desaparece = function() 
    {
        this._timer.loop(7500,Destruirse,this);
        this._timer.start();
    }

    function Destruirse(){
        this.Destroy();
    }

module.exports = Vegetal;
},{"./Class_GameObject.js":3}],9:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');

var BootScene = {
  preload: function () {
    //this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
     
    // this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    // this.loadingBar.anchor.setTo(0, 0.5);
    // this.load.setPreloadSprite(this.loadingBar);
    

    this.game.load.baseURL = 'https://raw.githubusercontent.com/RodrigoManuelPerez/TrepacepaDigDug/master/src/';
    this.game.load.crossOrigin = 'anonymous';

    this.game.load.audio('running90s', ['music/Initial_D_Running_in_The_90s.mp3', 'music/Initial_D_Running_in_The_90s.ogg']);
    // TODO: load here the assets for the game

    this.game.load.spritesheet('DigDugWalking', 'images/WalkAnim.png', 36, 36, 2);
    this.game.load.spritesheet('SlimeSpritesheet', 'images/SlimeSpriteSheet.png', 36, 36, 2);
    this.game.load.spritesheet('RocaCompletaSpriteSheet', 'images/RocaCompleta.png', 40, 47, 6);

    this.game.load.spritesheet('Bufos', 'images/Bufos.png', 40, 40, 18);  //SpriteSheet de los buffos, se cogeran segun el nivel
    //this.game.load.text('level0', 'levels/level0.json');

    this.game.load.image('Saco', 'images/SacoMonedas.png');
    //this.game.load.image('DigDug', 'images/DigDugC.png');
    this.game.load.image('latDer', 'images/latDerecho.png');
    this.game.load.image('latSup', 'images/latSuperior.png');

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

    this.game.load.image('Slime', 'images/Slime.png');

    this.game.load.image('Gancho', 'images/Gancho.png');
    
    //this.game.load.image('Fondo', 'images/Fondo.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
},{"./play_scene.js":10}],10:[function(require,module,exports){

 'use strict';

var GO = require('./Class_GameObject.js');
var Roca = require('./Class_Roca.js');
var Vegetal = require('./Class_Vegetal.js');
var Movable = require('./Class_Movable.js');
var Player = require('./Class_Player.js');
var Enemy = require('./Class_Enemy.js');
var Fygar = require('./Class_Fygar.js');
var Hook = require('./Class_Hook.js');


var player;
var Hook;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var roca, rocasCaidas, rocasParaVegetal, VegetalGenerado;
var distanceX, distanceY;
var paredDerecha, paredSuperior;

var tamañoGrupoRocas=0;

var mapaNivel;

var GrupoEnemigos;

var puntuacion=0;
var scoreTextA, scoreTextB, score;
var maxPuntuacion, highScoreText;
var scoreStringA = '';
var scoreStringB = '';
//var vidas=3;
var spriteVidas;
var lifes;
var i;

var nivel=1;    //Podemos utilizar el nivel para acceder a un array de los sprites de los vegetales segun el nivel facilmente
var levelText;
var levelString = '';

var playerMusic;

var Vegetable;
var PuntosVegetables = [400,600,800,1000,1000,2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,7000,7000,8000];

var PosCentral = new Par(258, 298);
var Fondo;

var cargado=false;

var PlayScene = {

    init: function(){

    },

    preload: function(){
        //this.load.text('level'+ nivel, 'levels/level'+nivel+'1.json');
        this.game.load.text('level1', 'levels/level1.json'); //CAMBIAR ESTO POR EL NUMERO 1 PARA QUE VAYA SEGUN EL VALOR
        this.game.load.text('level2', 'levels/level2.json');
        // this.game.load.text('level3', 'levels/level3.json');
        // this.game.load.text('level4', 'levels/level4.json');
        // this.game.load.text('level5', 'levels/level5.json');
        // this.game.load.text('level6', 'levels/level6.json');
        // this.game.load.text('level7', 'levels/level7.json');
        // this.game.load.text('level8', 'levels/level8.json');
        // this.game.load.text('level9', 'levels/level9.json');

    },

    create: function() {

        //MUSICA PARA EL PLAYER AL MOVERSE
        playerMusic=this.game.add.audio('running90s');
        playerMusic.play();
        playerMusic.pause();
        playerMusic.volume -= 0.8;

        //Activar las físicas de Phaser.
        this.game.physics.startSystem(Phaser.ARCADE);
    
        //Poner variables a los limites.
        limiteDerecho = 513;
        limiteSuperior = 44;
        //Fondo=new Phaser.Sprite(this.game,0,0,"Fondo");
        //this.game.world.addChild(Fondo);

        //Rocas para vegetal
        rocasParaVegetal=2;
        rocasCaidas=0;
        VegetalGenerado=false;
        
        //Control de puntuaciones
        scoreStringA = 'HI -';
        scoreStringB = ' SCORE';
        levelString = ' ROUND ';
        scoreTextA = this.game.add.text(556, 44, scoreStringA, { font: '34px Arial', fill: '#fff' });
        scoreTextB = this.game.add.text(599, 87, scoreStringB, { font: '34px Arial', fill: '#fff' });
            // Puesto el texto 'Score' en la posicion (x, y) con la fuente y color que se quiera
        score = this.game.add.text(599, 259, puntuacion, { font: '34px Arial', fill: '#fff' });
        highScoreText = this.game.add.text(599, 130, maxPuntuacion, { font: "bold 34px Arial", fill: "#46c0f9", align: "center" });
        levelText = this.game.add.text(513, 517, levelString + nivel, { font: "bold 34px Arial", fill: "#fff", align: "center" });
        

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Construimos el player
        var PosPlayer = new Par(493, 60);
        player = new Player(this.game,PosPlayer, 'Player',cursors, limiteDerecho, limiteSuperior, PosCentral, 'DigDugWalking');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        this.game.world.addChild(player); 

        //Vidas
        var thisLifes = this.lifes;
        thisLifes = this.game.add.group()
        this.game.add.text(599, 345, 'Lives: ', { font: '34px Arial', fill: '#fff' });

        for (i = 0; i < player._vidas; i++) 
        {
            spriteVidas = thisLifes.create(556 + (43 * i), 388, 'DigDugWalking');
            spriteVidas.frame=0;
            spriteVidas.alpha = 0.7;
        }

        //Construyo el arma que ahora pasa a ser de tipo Hook   VER COMO HACERLO BIEN
        /*var PosHook = new Par(5,10);
        Hook = new Hook(this.game,PosHook,'Gancho','Hook',player); //Le pongo una referencia sobre quien es su padre para que pueda influencia sobre él
        this.game.physics.enable(Hook, Phaser.Physics.ARCADE);
        Hook.anchor.x = 1;
        Hook.anchor.y = 1;
    
        player.Hook=Hook;
        player.addChild(Hook);
*/

        //Añadir la tierra.
        tierra = this.game.add.physicsGroup();
        //Poner fisicas a la tierra horizontal.
        tierraH = this.game.add.physicsGroup();
        //Poner fisicas a la tierra vertical.
        tierraV = this.game.add.physicsGroup();
        //Grupo de las rocas
        roca = this.game.add.physicsGroup();
        //Grupo de los enemigos
        GrupoEnemigos = this.game.add.physicsGroup();
        
        
        LoadMap(nivel,this.game);
        cargado=true
        //Pared de la derecha y la superior
        paredDerecha = new Phaser.Sprite(this.game, limiteDerecho, 0, 'latDer')
        paredDerecha.anchor.x = 0;
        paredDerecha.anchor.y = 0;
        paredDerecha.visible=false;
        paredSuperior = new Phaser.Sprite(this.game, 0, 0, 'latSup')
        paredSuperior.anchor.x = 0;
        paredSuperior.anchor.y = 0;
        paredSuperior.visible=false;
        this.game.world.addChild(paredDerecha);
        this.game.world.addChild(paredSuperior);   
    
    },
    update: function(){ 
        
        //PLAYER
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);
        this.game.physics.arcade.collide(player, roca, onCollisionRoca);

        //ROCAS
        this.game.physics.arcade.collide(tierra, roca, onCollisionPara);
        this.game.physics.arcade.collide(roca, tierraH, onCollisionTierra);

            //COLISION ROCAS CON ENEMIGOS Y PLAYER
            this.game.physics.arcade.collide(GrupoEnemigos, roca, onCollisionAplasta);
            this.game.physics.arcade.collide(player, roca, onCollisionAplasta);

        //ENEMIGOS
        this.game.physics.arcade.collide(tierra, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraH, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraV, GrupoEnemigos, onCollisionEnemyTierra);
        

        //NIVEL COMPLETADO
        //if(GrupoEnemigos.length==0 && cargado)
        //    LevelComplete(this.game);

        //ROCAS CAIDAS
        //Comprobacion de la rotura de rocas
        if(roca.length!=tamañoGrupoRocas){
            rocasCaidas++;
            tamañoGrupoRocas=roca.length;
        }

        if(rocasCaidas==rocasParaVegetal && !VegetalGenerado){
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

        if(VegetalGenerado){
            this.game.physics.arcade.collide(player, Vegetable, onCollisionVegetable);
        }

        //Comprobacion de la rotura de rocas
        if(roca.length!=tamañoGrupoRocas){
            rocasCaidas++;
            tamañoGrupoRocas=roca.length;
        }

        //PUNTUACION
        // highScoreText.text = localStorage.getItem("flappyhighscore"); {
        //     if (puntuacion > localStorage.getItem("flappyhighscore")) { 
        //         localStorage.setItem("flappyhighscore", puntuacion);
        //     }
        // }

        //VIDAS
        

        //MUSICA
        if(player._Movingdown || player._Movingup || player._Movingleft || player._Movingright)
            playerMusic.resume();
        else
            playerMusic.pause();

    },
    render: function(){
        
    }
}

module.exports = PlayScene;

function onCollisionEnemyTierra(obj1,obj2){
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

function onCollisionAplasta(obj1, obj2){
    if(obj2._Falling){
        if(obj1._id=='Player')  //Si el objeto es el digdug es necesario para su movimiento y asi pausar la cancion
        {
            obj1._Movingdown=false;     //Pongo todas las variables que dicen que se esta moviendo el player a false
            obj1._Movingleft=false;
            obj1._Movingright=false;
            obj1._Movingup=false;
            obj2._PlayerAplastado=true;
            obj1._animWalk.stop(); 
        }
        
        obj1._MovementEnable=false;

        console.debug('aplasta');

        if(obj1._id=='Player')
            obj1.frame = 3      //ES NECESARIO QUE LAS ANIMACIONES DE MOVIMIENTO DE TODOS LOS PERSONAJES SE LLAMEN IGUAL
        else if(obj1._id=='Enemigo')
            obj1.frame = 2;     //TEMPORAL HASTA TENER UN SPRITESHEET FINAL PARA EL ENEMIGO
        
            if(obj1.angle!=0)
            obj1.angle=0;
        
        obj2.addChild(obj1);    //Ponemos el objeto que choca hijo de la roca
        //obj1.x=20;              //En la posicion correcta
        obj1.y=35;
/*
        life = lifes.getFirstAlive();

        if (live)
        {
            live.kill();
        }
*/        
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
            obj2.Destroy(); //Llamamos la la destructora de la tierra
        else {
            if ((obj1.x-20)>obj2._posX && (obj1.y-20)==obj2._posY){       //ENTRANDO POR LA DERECHA
                obj2.width = obj2.width-2;
                sumaPuntos(1);
            }
            else if ((obj1.x-20)<obj2._posX && (obj1.y-20)==obj2._posY){
                obj2.x = obj2.x+2;
                obj2.width = obj2.width-2;
                sumaPuntos(1);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)<obj2._posY){
                obj2.y = obj2.y + 2;
                obj2.height = obj2.height-2;
                sumaPuntos(1);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)>obj2._posY){
                obj2.height = obj2.height-2;
                sumaPuntos(1);
            }
            if (obj2.width<4 || obj2.height<4)
                obj2.Destroy();
        }
    }
    if (obj1._Falling && obj1._id=='Roca' && obj1.y<obj2.y)         
        obj2.Destroy();
}

function onCollisionPara(obj1, obj2)
{
    if(obj2._Falling && obj1.y>obj2.y+21){
        if(obj2.y != obj2._posY)
            obj2.Para();
        else
            obj2._Falling=false;
    }
}

function onCollisionVegetable(obj1,obj2){
    sumaPuntos(obj2._puntos);
    obj2.Destroy();
}

function onColisionAñadeEnemigoHijo(obj1, obj2){

    obj2._Enable = false; //Para parar al enemigo
    obj1.addChild(obj2);
}

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function sumaPuntos (x) {
    puntuacion += x;
    score.text = puntuacion;
} 

function LoadMap (lvl,g) {
    g.mapaNivel = JSON.parse(g.cache.getText('level'+lvl));

    var posX=-3, posY=80;

    for(var h=0; h<12; h++){
        var PosTierraH = new Par(posX, posY-43);
        var BloqTierraH = new GO(g, PosTierraH, 'tierraHInferior','tierraH');
        BloqTierraH.visible=false;
        g.physics.arcade.enable(BloqTierraH);
        BloqTierraH.body.immovable = true;
        g.world.addChild(BloqTierraH);
        tierraH.add(BloqTierraH);
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
                        var VelTierraV = new Par(0, 0);

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
                    if(fila[i]=='3'){    //Bloque de Tierra
                        
                        var PosTierra = new Par(posX-40, posY-43);

                        if(j<9)
                            var BloqTierra = new GO(g, PosTierra, 'tierraSuperficie', 'tierra'); 
                        else if(j<17)
                            var BloqTierra = new GO(g, PosTierra, 'tierraIntermedia', 'tierra'); 
                        else
                            var BloqTierra = new GO(g, PosTierra, 'tierraInferior', 'tierra');  
                        
                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                    }
                    else if(fila[i]=='4'){    //Bloque de Tierra + Roca
                        
                        var PosTierra = new Par(posX-40, posY-43);
                        
                        if(j<9)
                            var BloqTierra = new GO(g, PosTierra, 'tierraSuperficie', 'tierra'); 
                        else if(j<17)
                            var BloqTierra = new GO(g, PosTierra, 'tierraIntermedia', 'tierra'); 
                        else
                            var BloqTierra = new GO(g, PosTierra, 'tierraInferior', 'tierra');  

                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                        var PosRock = new Par(posX-40, posY-44);
                        var Rock = new Roca(g, PosRock, 'Roca', 'RocaCompletaSpriteSheet');
                        g.physics.arcade.enable(Rock); 
                        roca.add(Rock);     //AÑADIMOS AL GRUPO

                        tamañoGrupoRocas++;
                        
                    }
                    else if(fila[i]=='5'){    //Enemigo
                        
                        var PosEne = new Par(posX-20,posY-23);
                        var enemigo = new Enemy(g,PosEne,'Slime','Enemigo',limiteDerecho, limiteSuperior, player, 'SlimeSpriteSheet');
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);

                    }
                }
            }
        }
        posX=-3;
        if (j%2==0)
            posY+=43;
    }
} 

function ResetPosition(){       //Coloca al todos los personajes en el lugar original
    for (var i=0; i< GrupoEnemigos.length; i++){
        GrupoEnemigos[i].x = GrupoEnemigos[i]._posOriginal.x;
        GrupoEnemigos[i].y = GrupoEnemigos[i]._posOriginal.y;
    }
    player.x=player._posOriginal.x;
    player.y=player._posOriginal.y;
}

function LoadLevel(n){          //Carga un nuevo nivel y coloca al player en el sitio de spawn

    LoadMap(n);

    player.x=player._posInicial.x;
    player.y=player._posInicial.y;

    player._MovementEnable=false;  
    player._AutomaticMovement=true;

}

function LevelComplete(g){
    g.state.restart('play',false, false);       //RESETEAR LA ESCENA
}
},{"./Class_Enemy.js":1,"./Class_Fygar.js":2,"./Class_GameObject.js":3,"./Class_Hook.js":4,"./Class_Movable.js":5,"./Class_Player.js":6,"./Class_Roca.js":7,"./Class_Vegetal.js":8}]},{},[9]);
