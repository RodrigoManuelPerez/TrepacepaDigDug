
 'use strict';

var GO = require('./Class_GameObject.js');
var Roca = require('./Class_Roca.js');
var Vegetal = require('./Class_Vegetal.js');
var Movable = require('./Class_Movable.js');
var Player = require('./Class_Player.js');
var Enemy = require('./Class_Enemy.js');
var Fygar = require('./Class_Fygar.js');
//var Canvas = require('./Canvas.js');


var player;
var arma;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var roca, rocaColl;
var distanceX, distanceY;
var paredDerecha, paredSuperior;

var GrupoEnemigos;

var puntuacion=0;
var scoreTextA, scoreTextB, score;
var maxPuntuacion, highScoreText;
var scoreStringA = '';
var scoreStringB = '';
var vidas=3;

var playerMusic;

var RocasCaidas=0;

var Vegetable;
var PosVegetable = new Par(258, 298);

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
        
        //Control de puntuaciones
        scoreStringA = 'HI -';
        scoreStringB = ' SCORE';
        scoreTextA = this.game.add.text(556, 44, scoreStringA, { font: '34px Wingdings', fill: '#fff' });
        scoreTextB = this.game.add.text(599, 87, scoreStringB, { font: '34px Wingdings', fill: '#fff' });
            // Puesto el texto 'Score' en la posicion (x, y) con la fuente y color que se quiera
        score = this.game.add.text(599, 259, puntuacion, { font: '34px Times New Roman', fill: '#fff' });
        highScoreText = this.game.add.text(599, 130, maxPuntuacion, { font: "bold 34px Lato", fill: "#46c0f9", align: "center" });

        //Arma DigDag
        //Arma = 

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Cualidad de la posicion del player
        var PosPlayer = new Par(493, 60);   //AÑADO 18 UNIDADES A LA X POR LA POSICION DEL ANCHOR Y A LA Y
        player = new Player(this.game,PosPlayer, 'DigDug', 'Player',cursors, limiteDerecho, limiteSuperior, 'DigDugWalking');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        this.game.world.addChild(player); 


        //Añadir la tierra.
        tierra = this.game.add.physicsGroup();
        //Poner fisicas a la tierra horizontal.
        tierraH = this.game.add.physicsGroup();
        //Poner fisicas a la tierra vertical.
        tierraV = this.game.add.physicsGroup();

        roca = this.game.add.physicsGroup();

        GrupoEnemigos = this.game.add.physicsGroup();
        
        var posX;
        var posy;

        var cont=0;
        //CREAMOS LA MATRIZ DE 12 * 12.       
        //Los saltos entre cuadrados son de  43 uds.
        for(var i = 0; i < limiteDerecho; i += 43)
        {           
            for(var j = 83; j < 600; j += 43) //84
            {
               
                if(!((i==215 && j==298) || (i==258 && j==298) || (i==301 && j==298))){

                        //TIERRA
                        var PosTierra = new Par(i, j);
                        var BloqTierra = new GO(this.game, PosTierra, 'tierra', 'tierra'); 

                        this.game.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
            
                        this.game.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                    
                }
                else if(i==215 && j==298){

                    var PosEne = new Par(i+20,j+20);
                    var enemigo = new Enemy(this.game,PosEne,'Slime','Enemigo',limiteDerecho, limiteSuperior,player);
                    this.game.physics.arcade.enable(enemigo);
                    enemigo.anchor.x = 0.5;
                    enemigo.anchor.y = 0.5;
                    this.game.world.addChild(enemigo);
                    GrupoEnemigos.add(enemigo);
                
                }
                if(!((i==215 && j==298) || (i==258 && j==298))){
                    //TIERRA VERTICAL
                    if (cont<12){
                        var PosTierraV = new Par(i+40, j);
                        var VelTierraV = new Par(0, 0);
                        var BloqTierraV = new GO(this.game, PosTierraV, 'tierraV', 'tierraV'); 
                        
                        this.game.physics.arcade.enable(BloqTierraV);
                        BloqTierraV.body.immovable = true;
            
                        this.game.world.addChild(BloqTierraV);
                        tierraV.add(BloqTierraV);
                    }
                }
                
                        //TIERRA HORIZONTAL
                    
                        var PosTierraH = new Par(i-3, j-3);
                        var BloqTierraH = new GO(this.game, PosTierraH, 'tierraH','tierraH'); 
                        
                        this.game.physics.arcade.enable(BloqTierraH);
                        BloqTierraH.body.immovable = true;
            
                        this.game.world.addChild(BloqTierraH);
                        tierraH.add(BloqTierraH);
                    
                

                    //ROCAS
                    if(!((i==215 && j==298) || (i==258 && j==298) || (i==301 && j==298))){
                        var a = Math.random();
                        if (a<0.03 && i!=258){
                            var PosColl = new Par(i, j-1);
                            var Coll = new Roca(this.game, PosColl, 'RocaCompleta', 'Roca', 'RocaCompletaSpriteSheet');
                            this.game.physics.arcade.enable(Coll); 
                            
                            roca.add(Coll);     //AÑADIMOS AL GRUPO 
                            //roca.add(RocaBlock);    //AÑADIMOS AL GRUPO 
                        }
                    }
            }
            cont++;
        }
        this.game.world.add(roca);

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
        //this.game.physics.arcade.overlap(ball, pared1, collisionHandler, null, this);   
        //COLISION HANDLER ES UNA AUXILIAR PARA LA COLISION DE LA PELOTA CON EL RESTO DE COSAS, HABRIA QUE HACER UN METODO PARA LAS COLISIONES CON LA ROCA POR EJEMPLO
        
        //PLAYER
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);
        this.game.physics.arcade.collide(player, roca, onCollisionRoca);

        //ROCAS
        this.game.physics.arcade.collide(tierra, roca, onCollisionPara);
        this.game.physics.arcade.collide(roca, tierraH, onCollisionTierra);

            //COLISION ROCAS CON ENEMIGOS Y PLAYER
            this.game.physics.arcade.collide(roca, GrupoEnemigos, onCollisionAplasta);
            this.game.physics.arcade.collide(roca, player, onCollisionAplasta);

        //ENEMIGOS
        this.game.physics.arcade.collide(tierra, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraH, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraV, GrupoEnemigos, onCollisionEnemyTierra);
        
        //PUNTUACION
        /*
        highScoreText.text = localStorage.getItem("flappymaxPuntuacion"); {
            if (puntuacion > localStorage.getItem("flappymaxPuntuacion")) { 
                localStorage.setItem("flappymaxPuntuacion", puntuacion);
            }
        }
        */

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
        obj1._MovementEnable=false;
        obj1._animWalk.stop();      //ES NECESARIO QUE LAS ANIMACIONES DE MOVIMIENTO DE TODOS LOS PERSONAJES SE LLAMEN IGUAL
        if(obj1.angle!=0)
            obj1.angle=0;
        
        obj2.addChild(obj1);
        obj1.x=20;
        obj1.y=35;
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