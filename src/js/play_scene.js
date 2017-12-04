
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
        var PosPlayer = new Par(475, 42);
        var VelPlayer = new Par(0, 0);
        var DirPlayer = new Par(0, 0);
        player = new Player(this.game,PosPlayer, 'DigDug', 'Player',cursors, distanceX, distanceY, limiteDerecho, limiteSuperior);
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
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
        
        if(player._Moving) playerMusic.resume();
        else playerMusic.pause();

    },
    render: function(){

    }
}

module.exports = PlayScene;

function onCollisionRoca(obj1, obj2)    //Colision del player con la roca que restringe el movimiento
{

    if ((obj1.x-2 == obj2.x && obj1.y<obj2.y+3)||(obj1.x-2 > obj2.x && obj1.y==obj2.y+3)||(obj1.x-2 < obj2.x && obj1.y==obj2.y+3)){ //COLISION CON LA PARTE SUPERIOR DE LA ROCA

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
    else if (obj1.x-2 == obj2.x && obj1.y>obj2.y+40){
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
            if ((obj1.x-2)>obj2._posX && (obj1.y-2)==obj2._posY){       //ENTRANDO POR LA DERECHA
                obj2.width = obj2.width-2;
            }
            else if ((obj1.x-2)<obj2._posX && (obj1.y-2)==obj2._posY){
                obj2.x = obj2.x+2;
                obj2.width = obj2.width-2;
            }
            else if ((obj1.x-2)==obj2._posX && (obj1.y-2)<obj2._posY){
                obj2.y = obj2.y + 2;
                obj2.height = obj2.height-2;
            }
            else if ((obj1.x-2)==obj2._posX && (obj1.y-2)>obj2._posY){
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
    if(obj2._Falling && obj1.y>obj2.y+3){
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


