(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var GameObject = function(game, position, sprite,id,spriteSheet){
    
    if(id=='Player')
        Phaser.Sprite.apply(this,[game ,position._x, position._y, spriteSheet, 1]);
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
},{}],2:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Movable = function(game, position, sprite, id, distanceX, distanceY, limiteDerecho, limiteSuperior, spriteSheet){
    
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

    this._distanceX = distanceX;
    this._distanceY = distanceY;

    this._LimiteSuperior = limiteSuperior;
    this._LimiteDerecho = limiteDerecho;
    }

    Movable.prototype = Object.create(GameObject.prototype);
    Movable.prototype.constructor = Movable;

module.exports = Movable;
},{"./Class_GameObject.js":1}],3:[function(require,module,exports){
'use strict';

var Movable = require('./Class_Movable.js');

var playerMusic;
var MusicaCargada=false;

var Player = function(game, position, sprite, id, cursors, distanceX, distanceY, limiteDerecho, limiteSuperior, spriteSheet){
    Movable.apply(this, [game, position, sprite, id, distanceX, distanceY, limiteDerecho, limiteSuperior, spriteSheet]);
    this._cursors = cursors;
    this._animWalk =this.animations.add('Walking');
    this._animWalk.play(6,true);
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
            if(this.y > this.height + 6) {
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
            if(this.y > this.height + 6) {
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
                // if(this.angle!=0)
                //     this.angle=0;
                // if(this.width>0)
                //     this.width=-this.width;
            }
        }
        else if (this._dirX == -1) {
            if(this.x > 2) {
                this.x -= 1;
                this._distanceX -= 1;
                // if(this.angle!=0)
                //     this.angle=0;
                // if(this.width<0)
                //     this.width=-this.width;
            }
        }
    }
    else if (this._cursors.up.isDown && this.y > this.height + 6 && this._Enableup)
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
            // if(this.angle!=90)
            //     this.angle=90;
        }
        else if (this._dirX == 1) {
            if(this.x < this._LimiteDerecho - 20){
                this.x += 1;
                this._distanceX += 1;
                // if(this.angle!=0)
                //     this.angle=0;
                // if(this.width>0)
                //     this.width=-this.width;
            }
        }
        else if (this._dirX == -1) {
            if(this.x > 2) {
                this.x -= 1;
                this._distanceX -= 1;
                // if(this.angle!=0)
                //     this.angle=0;
                // if(this.width<0)
                //     this.width=-this.width;
            }
        }
    }
    else{
        this._Movingleft = false;
        this._Movingright = false;
        this._Movingup = false;
        this._Movingdown = false;
    }

    if (this._distanceX > 42 || this._distanceX < -42)
        this._distanceX = 0;
    if (this._distanceY > 42 || this._distanceY < -42)
        this._distanceY = 0;




    if(!this._Movingdown && !this._Movingup && !this._Movingleft && !this._Movingright){
        this._animWalk.paused=false;
    }
    /*else if(this._Movingright){
        if (this.angle!=0)
            this.angle=0;
        if (this.width>0)
            this.width = -this.width;
    }
    else if(this._Movingleft){
        if (this.angle!=0)
            this.angle=0;
        if (this.width<0)
            this.width = -this.width;
    }
    else if(this._Movingup){
        if (this.angle!=90)
            this.angle = 90;
    }
    else if(this._Movingdown){
        if (this.rotatitio!=-90)
            this.angle = -90;
    }*/
    }
    /*if(this._fireButton.isDown)
    {
        this._playerWeapon.fire();
    }*/
    Player.prototype.update = function() {
        this.Input();
    }
    Player.prototype.PlayerRock = function() {
        this._Enable=false;
    }

module.exports = Player;
},{"./Class_Movable.js":2}],4:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Roca = function(game, position, sprite,id){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    
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
                    if (this._Falling /*&& this._id=='Collider'*/ && this.y<558){
                        this.y ++;
                    }
                }
            }
            if (this.y > 556)
                this.Para();
        }
    
        Roca.prototype.Para=function() {
            
            this._Falling = false;
            this._HasFallen = true;
            this._timer.loop(3500,BreakRock,this);
            this._timer.start();
    
            this.body.enable=false;
            //Y SE LLAMARIA AL DESTRUCTOR DE ESTE OBJETO EL CUAL CONTARA CON UNA ANIMACION SI NO SE ACTIVA UN BOOL DE HABER COGIDO ENEMIGO O SIMPLEMENTE IRA COGIENDO HIJOS Y
            // LOS PARARA Y AL DESTRUIRSE ÉL DESTRUIRA A LOS HIJOS
            
        }
    
        Roca.prototype.EnableFall=function() {
            this._timer.loop(1500,Fall,this);
            this._timer.start();
        }
    
        function Fall() {
            if(!this._HasFallen){
                this._Falling = true;
                this._timer.stop();
            }
        }
        function BreakRock(){
            this.Destroy();
        }

module.exports = Roca;
},{"./Class_GameObject.js":1}],5:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Vegetal = function(game, position, sprite,id, puntos){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    this._puntos = puntos;
    }

    Vegetal.prototype = Object.create(GameObject.prototype);
    Vegetal.prototype.constructor = Vegetal;

    Vegetal.prototype.AumentaPuntos=function() {

        puntuacion+=this._puntos;
        this.Destroy();
    }

module.exports = Vegetal;
},{"./Class_GameObject.js":1}],6:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    //this.game.load.baseURL = 'https://rodrigomanuelperez.github.io/TrepacepaDigDug/src/';
    //this.game.load.crossOrigin = 'anonymous';
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
    

    this.game.load.baseURL = 'https://rodrigomanuelperez.github.io/TrepacepaDigDug/src/';
    this.game.load.crossOrigin = 'anonymous';

    this.game.load.audio('running90s', ['music/Initial_D_Running_in_The_90s.mp3', 'music/Initial_D_Running_in_The_90s.ogg']);
    // TODO: load here the assets for the game

    this.game.load.spritesheet('DigDugWalking', 'images/WalkAnim.png', 36, 36, 2);

    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('DigDug', 'images/DigDugC.png');
    this.game.load.image('latDer', 'images/latDerecho.png');
    this.game.load.image('latSup', 'images/latSuperior.png');
    this.game.load.image('tierra', 'images/TierraC.png');
    this.game.load.image('tierraH', 'images/LaminaTierra.png');
    this.game.load.image('tierraV', 'images/LaminaTierraV.png');
    this.game.load.image('Roca', 'images/RocaC.png');
    this.game.load.image('RocaColl', 'images/RocaColl.png');

    this.game.load.image('RocaCompleta', 'images/PiedraColl.png');
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
},{"./play_scene.js":7}],7:[function(require,module,exports){

'use strict';

var GO = require('./Class_GameObject.js');
var Roca = require('./Class_Roca.js');
var Vegetal = require('./Class_Vegetal.js');
var Movable = require('./Class_Movable.js');
var Player = require('./Class_Player.js');
/*var Enemy = require('./Class_Enemy.js');
var Fygar = require('./Class_Fygar.js');
*/

var player;
var arma;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var roca, rocaColl;
var distanceX, distanceY;
var paredDerecha, paredSuperior;

var puntuacion;

var playerMusic;

var PlayScene = {
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

        //Distancias recorridas por DigDag.
        distanceX = 0;
        distanceY = 0;

        //Arma DigDag
        //Arma = 

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Añadir la tierra.
        tierra = this.game.add.physicsGroup();
        //Poner fisicas a la tierra horizontal.
        tierraH = this.game.add.physicsGroup();
        //Poner fisicas a la tierra vertical.
        tierraV = this.game.add.physicsGroup();

        roca = this.game.add.physicsGroup();
        
        /*
        //CREAMOS LA MATRIZ DE 12 * 12.       
        //Los saltos entre cuadrados son de  43 uds.
        */

        for(var i = 0; i < limiteDerecho; i += 43)
        {           
            for(var j = 83; j < 593; j += 43) //84
            {
                //TIERRA
                
                var PosTierra = new Par(i, j);
                var VelTierra = new Par(0, 0);
                var BloqTierra = new GO(this.game, PosTierra, 'tierra', 'tierra'); 

                this.game.physics.arcade.enable(BloqTierra);
                BloqTierra.body.immovable = true;
    
                this.game.world.addChild(BloqTierra);
                tierra.add(BloqTierra);

                //ROCAS

                var a = Math.random();
                if (a<0.03){
                    var PosColl = new Par(i, j-1);
                    var VelColl = new Par(0, 0);
                    var Coll = new Roca(this.game, PosColl, 'RocaCompleta', 'Collider');
                    this.game.physics.arcade.enable(Coll); 
                    
                    roca.add(Coll);     //AÑADIMOS AL GRUPO 
                    //roca.add(RocaBlock);    //AÑADIMOS AL GRUPO 
                }
            }
        }
        this.game.world.add(roca);

        //CREAMOS LA TIERRA HORIZONTAL

        for(var i = -3; i < limiteDerecho; i+=43)
        {
            for(var j = 80; j < 599; j+=43)
            {
                var PosTierraH = new Par(i, j);
                var VelTierraH = new Par(0, 0);
                var BloqTierraH = new GO(this.game, PosTierraH, 'tierraH','tierraH'); 
                
                this.game.physics.arcade.enable(BloqTierraH);
                BloqTierraH.body.immovable = true;
    
                this.game.world.addChild(BloqTierraH);
                tierraH.add(BloqTierraH);
            }
        }

        //CREAMOS LA TIERRA VERTICAL

        var cont = 0;
        for(var i = 40; i < limiteDerecho; i += 43)
        {
            if (cont<11){
                for(var j = 83; j < 599; j += 43)
                {   
                    var PosTierraV = new Par(i, j);
                    var VelTierraV = new Par(0, 0);
                    var BloqTierraV = new GO(this.game, PosTierraV, 'tierraV', 'tierraV'); 
                    
                    this.game.physics.arcade.enable(BloqTierraV);
                    BloqTierraV.body.immovable = true;
        
                    this.game.world.addChild(BloqTierraV);
                    tierraV.add(BloqTierraV);
                }
                cont++;
            }
        }

        //Pared de la derecha y la superior
        paredDerecha = new Phaser.Sprite(this.game, limiteDerecho, 0, 'latDer')
        paredDerecha.anchor.x = 0;
        paredDerecha.anchor.y = 0;
        paredSuperior = new Phaser.Sprite(this.game, 0, 0, 'latSup')
        paredSuperior.anchor.x = 0;
        paredSuperior.anchor.y = 0;
        paredSuperior.visible=false;
        this.game.world.addChild(paredDerecha);
        this.game.world.addChild(paredSuperior);

        //paredDerecha.visible=false;
        //paredSuperior.visible=false;



        //Cualidad de la posicion del player
        var PosPlayer = new Par(493, 60);   //AÑADO 18 UNIDADES A LA X POR LA POSICION DEL ANCHOR Y A LA Y
        var VelPlayer = new Par(0, 0);
        var DirPlayer = new Par(0, 0);
        player = new Player(this.game,PosPlayer, 'DigDug', 'Player',cursors, distanceX, distanceY, limiteDerecho, limiteSuperior, 'DigDugWalking');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        //Comprobar a meter esto en el player y comprobar las colisiones del update
        
        this.game.world.addChild(player);   
        

    },
    update: function(){
        //this.game.physics.arcade.overlap(ball, pared1, collisionHandler, null, this);   
        //COLISION HANDLER ES UNA AUXILIAR PARA LA COLISION DE LA PELOTA CON EL RESTO DE COSAS, HABRIA QUE HACER UN METODO PARA LAS COLISIONES CON LA ROCA POR EJEMPLO
        
        
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);
        this.game.physics.arcade.collide(player, roca, onCollisionRoca);
        this.game.physics.arcade.collide(tierra, roca, onCollisionPara);
        this.game.physics.arcade.collide(roca, tierraH, onCollisionTierra);
        
        if(player._Movingdown || player._Movingup || player._Movingleft || player._Movingright) playerMusic.resume();
        else playerMusic.pause();

    },
    render: function(){

    }
}

module.exports = PlayScene;

function onCollisionRoca(obj1, obj2)    //Colision del player con la roca que restringe el movimiento
{

    if ((obj1.x-20 == obj2.x && obj1.y<obj2.y+21)||(obj1.x-20 > obj2.x && obj1.y==obj2.y+21)||(obj1.x-20 < obj2.x && obj1.y==obj2.y+21)){ //COLISION CON LA PARTE SUPERIOR DE LA ROCA

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
            obj1._dirY = 1
        }
    }
    else {
        obj2.EnableFall();
    }
}

function onCollisionTierra (obj1, obj2)
{
    if (obj1._id=='Player'){
        if(obj2._id == 'tierraH' || obj2._id == 'tierraV')
            obj2.Destroy(); //Llamamos la la destructora de la tierra
        else {
            if ((obj1.x-20)>obj2._posX && (obj1.y-20)==obj2._posY){       //ENTRANDO POR LA DERECHA
                obj2.width = obj2.width-2;
            }
            else if ((obj1.x-20)<obj2._posX && (obj1.y-20)==obj2._posY){
                obj2.x = obj2.x+2;
                obj2.width = obj2.width-2;
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)<obj2._posY){
                obj2.y = obj2.y + 2;
                obj2.height = obj2.height-2;
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)>obj2._posY){
                obj2.height = obj2.height-2;
            }
            if (obj2.width<4 || obj2.height<4)
                obj2.Destroy();
        }
    }
    if (obj1._Falling && obj1._id=='Collider' && obj1.y<obj2.y)         
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

function onColisionAñadeEnemigoHijo(obj1, obj2){

    obj2._Enable = false; //Para parar al enemigo
    obj1.addChild(obj2);
}

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function Enemy(game, position, sprite, id, distanceX, distanceY, limiteDerecho, limiteSuperior)
    {
    Movable.apply(this, [game, position, sprite, id, distanceX, distanceY, limiteDerecho, limiteSuperior]);

    //variables de enemy
    }

    Enemy.prototype = Object.create(Movable.prototype);
    Enemy.prototype.constructor = Enemy;

    //Funciones de los enemigos

    Enemy.prototype.update = function() {
    
    }

function Fygar(game, position, sprite, id, cursors, distanceX, distanceY, limiteDerecho, limiteSuperior)
    {
    Movable.apply(this, [game, position, sprite, id, distanceX, distanceY, limiteDerecho, limiteSuperior]);

    //variables de enemy
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    //Funciones de los enemigos

    Fygar.prototype.update = function() {
    
    }



},{"./Class_GameObject.js":1,"./Class_Movable.js":2,"./Class_Player.js":3,"./Class_Roca.js":4,"./Class_Vegetal.js":5}]},{},[6]);
