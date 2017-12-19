
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

var playerMusic;

var Vegetable;
var PuntosVegetables = [400,600,800,1000,1000,2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,7000,7000,8000];

var PosCentral = new Par(258, 298);
var Fondo;

var cargado=false;

var PlayScene = {

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
        Fondo=new Phaser.Sprite(this.game,0,0,"Fondo");
        this.game.world.addChild(Fondo);

        //Rocas para vegetal
        rocasParaVegetal=2;
        rocasCaidas=0;
        VegetalGenerado=false;
        
        //Control de puntuaciones
        scoreStringA = 'HI -';
        scoreStringB = ' SCORE';
        scoreTextA = this.game.add.text(556, 44, scoreStringA, { font: '34px Arial', fill: '#fff' });
        scoreTextB = this.game.add.text(599, 87, scoreStringB, { font: '34px Arial', fill: '#fff' });
            // Puesto el texto 'Score' en la posicion (x, y) con la fuente y color que se quiera
        score = this.game.add.text(599, 259, puntuacion, { font: '34px Arial', fill: '#fff' });
        highScoreText = this.game.add.text(599, 130, maxPuntuacion, { font: "bold 34px Arial", fill: "#46c0f9", align: "center" });


        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Construimos el player
        var PosPlayer = new Par(493, 60);   //AÑADO 18 UNIDADES A LA X POR LA POSICION DEL ANCHOR Y A LA Y
        player = new Player(this.game,PosPlayer, 'Player',cursors, limiteDerecho, limiteSuperior, PosCentral, 'DigDugWalking'); //Le pongo la referencia al objeto Hook NO TENDRA REFERENCIA A HOOK
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
        var PosHook = new Par(5,10);
        Hook = new Hook(this.game,PosHook,'Gancho','Hook',player); //Le pongo una referencia sobre quien es su padre para que pueda influencia sobre él
        this.game.physics.enable(Hook, Phaser.Physics.ARCADE);
        Hook.anchor.x = 1;
        Hook.anchor.y = 1;
    
        player.Hook=Hook;
        player.addChild(Hook);


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
                Vegetable.frame = nivel;
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
        //obj1._animWalk.stop();      //ES NECESARIO QUE LAS ANIMACIONES DE MOVIMIENTO DE TODOS LOS PERSONAJES SE LLAMEN IGUAL
        if(obj1.angle!=0)
            obj1.angle=0;
        
        obj2.addChild(obj1);    //Ponemos el objeto que choca hijo de la roca
        obj1.x=20;              //En la posicion correcta
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
                        var enemigo = new Enemy(g,PosEne,'Slime','Enemigo',limiteDerecho, limiteSuperior, player);
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