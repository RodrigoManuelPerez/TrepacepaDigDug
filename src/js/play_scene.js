
 'use strict';

var GO = require('./Class_GameObject.js');
var Roca = require('./Class_Roca.js');
var Vegetal = require('./Class_Vegetal.js');
var Movable = require('./Class_Movable.js');
var Player = require('./Class_Player.js');
var Enemy = require('./Class_Enemy.js');
var Fygar = require('./Class_Fygar.js');
var Hook = require('./Class_Hook.js');
var BloqueTierra = require('./Class_Tierra.js');
var Flower = require('./Class_Flor.js');


var player;
var Hook;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var roca, rocasCaidas, VegetalGenerado;
var distanceX, distanceY;
var paredDerecha, paredSuperior;

var tamañoGrupoRocas=0;
var GrupoBanderas;

var mapaNivel;

var GrupoEnemigos;
var PuntosEnemigos = [1000, 2500, 4000, 6000, 80000, 10000, 12000, 15000];
var Fire, GrupoFireBullets;

var puntuacion, puntuacionControl;
var scoreTextA, scoreTextB, scoreTextC, score, pauseText;
var maxPuntuacion = 0, highScoreText;
var scoreStringA = '';
var scoreStringB = '';
var scoreStringC = '';
var pauseString = '';
var PAUSED=false;

var vidas=3;
var spriteVidas;
var thisLifes
var lifes;
var i;

var nivel=1;    //Podemos utilizar el nivel para acceder a un array de los sprites de los vegetales segun el nivel facilmente
var levelText;
var levelString = '';
var spriteFlor, flor;

var playerMusic;

var Vegetable;
var PuntosVegetables = [400,600,800,1000,1000,2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,7000,7000,8000];

var PosCentral;

//BOOLEANOS DE CONTROL
var cargado;
var NextLevel;

var timerControl;

var PlayScene = {

    init: function(){
        //rocasCaidas=0;
    },

    preload: function(){
        //this.load.text('level'+ nivel, 'levels/level'+nivel+'1.json');
        this.game.load.text('level1', 'levels/level1.json'); //CAMBIAR ESTO POR EL NUMERO 1 PARA QUE VAYA SEGUN EL VALOR
        this.game.load.text('level2', 'levels/level2.json');
        this.game.load.text('level3', 'levels/level3.json');
        this.game.load.text('level4', 'levels/level4.json');
        this.game.load.text('level5', 'levels/level5.json');
        // this.game.load.text('level6', 'levels/level6.json');
        // this.game.load.text('level7', 'levels/level7.json');
        // this.game.load.text('level8', 'levels/level8.json');
        // this.game.load.text('level9', 'levels/level9.json');

    },

    create: function() {

        //TIMER PARA LA PAUSA
        var timerPause = this.game.time.create(false);
        timerPause.loop(500,switchPause,this);
        timerPause.start();

        //TIMER PARA EL PASO DE NIVEL 
        timerControl= this.game.time.create(false);
        NextLevel=false;

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
        PosCentral = new Par(258, 298);

        //Rocas para vegetal
        cargado=false;
        rocasCaidas=0;
        VegetalGenerado=false;
        
        //Control de puntuaciones
        if(nivel==1){
            puntuacion=0;
            puntuacionControl=0;
        }
        scoreStringA = 'HI -';
        scoreStringB = ' SCORE';
        //scoreStringC = ' SCORE';
        pauseString = 'PAUSED';

        levelString = ' ROUND ';
        scoreTextA = this.game.add.text(556, 44, scoreStringA, { font: '34px Arial', fill: '#fff' });
        scoreTextB = this.game.add.text(599, 87, scoreStringB, { font: '34px Arial', fill: '#fff' });
        //scoreTextC = this.game.add.text(599, 216, scoreStringC, { font: '34px Arial', fill: '#fff' });
        pauseText = this.game.add.text(590, 190, pauseString, { font: '34px Arial', fill: '#fff' });
        pauseText.visible=false;
        
            // Puesto el texto 'Score' en la posicion (x, y) con la fuente y color que se quiera
        score = this.game.add.text(599, 259, puntuacion, { font: '34px Arial', fill: '#fff' });
        highScoreText = this.game.add.text(599, 130, maxPuntuacion, { font: "bold 34px Arial", fill: "#46c0f9", align: "center" });
        levelText = this.game.add.text(513, 517, levelString + nivel, { font: "bold 34px Arial", fill: "#fff", align: "center" });
        score.text=puntuacion;
        //Niveles
        levelText = this.game.add.text(513, 517, levelString + nivel, { font: "bold 34px Arial", fill: "#fff", align: "center" });

        var thisFlor = this.flor;
        thisFlor = this.game.add.group();

        for (i = 0; i < nivel; i++)
        {
            // spriteFlor = thisFlor.create(470 - (43 * i), 44, 'Flor');
            // spriteFlor.anchor.setTo(-0.1, -0.1);
            // spriteFlor.scale.setTo(0.05, 0.05);

            spriteFlor = new Flower(this.game,470 - (43 * i), 34, 'FlorSpriteSheet')
            thisFlor.addChild(spriteFlor);
        }

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Construimos el player
        var PosPlayer = new Par(358, 60);
        player = new Player(this.game,PosPlayer, 'Player',cursors, limiteDerecho, limiteSuperior, 278, 318, 'DigDugWalking');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        player.body.enable=true;
        this.game.world.addChild(player);

        ///////////////////////Vidas//////////////////////////////
        thisLifes = this.lifes;
        thisLifes = this.game.add.group()
        this.game.add.text(599, 345, 'LIVES ', { font: '34px Arial', fill: '#fff' });

        ActualizaHUD(this.game);

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
        //Grupo de las banderas de control
        GrupoBanderas = this.game.add.physicsGroup();
        //Grupo de las balas de los Fygar
        GrupoFireBullets = this.game.add.physicsGroup();
        
        LoadMap(nivel,this.game);

        StopEnemies();

},
    update: function(){

        //PLAYER
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra,null, {this:this, g:this.game});
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
        
        //ENEMIGOS CON BANDERITAS DE CONTROL
        this.game.physics.arcade.collide(GrupoBanderas, GrupoEnemigos, onCollisionBandera);

        //ENEMIGOS CON EL PLAYER
        this.game.physics.arcade.collide(GrupoEnemigos, player._core, MuertePlayer);

        //PLAYER CON VEGETAL
        if(VegetalGenerado){
            this.game.physics.arcade.collide(player, Vegetable, onCollisionVegetable,null, {this:this, g:this.game});
        }


        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onUpCallback = function(key){

            //////////////////PRUEBA CAMBIO LEVEL///////////////
            if(key.keyCode === 48){     //El 0
                LevelComplete(this.game);
            }

            ///////////////////NIVEL 1 A FULL VIDAS//////////////////
            if(key.keyCode === 49){     //El 1
                ComenzarJuego(this.game);
            }

            if(key.keyCode === Phaser.KeyCode.ENTER){ //LO NECESARIO PARA RESETEAR LA ESCENA PERDIENDO UNA VIDA
                MuertePlayer();
            }

            if(key.keyCode === Phaser.KeyCode.ESC && !player._AutomaticMovement && !player._animMuerto && !player._Muerto && !player._EsperandoComenzar){ //LO NECESARIO PARA RESETEAR LA ESCENA PERDIENDO UNA VIDA
                if(!PAUSED){
                    player._MovementEnable=false;
                    player._animWalk.paused=true;
                    StopEnemies();
                    PAUSED=true;
                    pauseText.visible=true;
                }
                else{
                    player._MovementEnable=true;
                    player._animWalk.paused=false;
                    StartEnemies();
                    PAUSED=false;
                    pauseText.visible=false;
                }
            }

            if(key.keyCode === Phaser.KeyCode.SPACEBAR){
                for(var gh = GrupoEnemigos.length-1;gh>=0; gh--){
                    GrupoEnemigos.children[gh].Destroy();
                }
            }
        }





        
        //NIVEL COMPLETADO
        if(GrupoEnemigos.length==0 && !NextLevel){
            NextLevel=true;
            timerControl.add(1500,LevelWin,this, this.game);
            timerControl.start();
        }

        //ROCAS CAIDAS
        //Comprobacion de la rotura de rocas
        if(cargado){
            if(roca.length<tamañoGrupoRocas){       //////////////////////////////////////////////////////////
                rocasCaidas++;                      //CUANDO CARGAMOS LA ESCENA DE OTRO NIVEL ESTO SE LLAMA UNA PRIMERA VEZ Y AUMENTA 1
                tamañoGrupoRocas=roca.length;
            }
        }

        if(rocasCaidas==2 && !VegetalGenerado){
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

        

        //PUNTUACION
        highScoreText.text = localStorage.getItem("highscore"); {
            if (puntuacion > localStorage.getItem("highscore")) { 
                localStorage.setItem("highscore", puntuacion);
            }
        }

        //PUNTOS QUE DAN LAS ROCAS
        for(var k =0; k<roca.length; k++){

            
            if(roca.children[k]._PlayerAplastado){  //SI SE HA PILLADO AL PLAYER Y ASI NO SUMAMOS PUNTOS POR MATAR A MAS ENEMIGOS SI LOS HUBIERA
                
                //player._muerte();     LLAMARIAMOS A LA FUNCION DE MUERTE DEL PLAYER QUE DEBERIA PARARLO Y HACER LA ANIMACION DE MUERTE Y PONDRIASMOS UN BOOLEANO DE MUERTO A TRUE
            
            }
            else if (roca.children[k]._PuntosActualizados && !roca.children[k]._PuntosContabilizados){  //SI NO SE HA LLAMADO AL PLAYER, YA SE HAN AÑADIDO LOS PUNTOS DE MATAR A X ENEMIGOS Y NO SE HAN AÑADIDO A LA PUNTUACION GLOBAL
                roca.children[k]._PuntosContabilizados=true;
                sumaPuntos(roca.children[k]._PuntosConseguidos,this.game);
            }
        }

        if(player._EnPosicion){
            StartEnemies();
            player._EnPosicion=false;
        }

        if (player._Muerto){
            if (vidas>0){
                ContinuarLevel(this.game, thisLifes); //El player se muere y se restaura su posicion restandole una vida
            }
            else{
                nivel=1;
                this.game.state.start('menu');
            }
        }

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

function switchPause(){
    if(PAUSED){
        pauseText.visible=!pauseText.visible;
    }
}

function onCollisionBandera(obj1,obj2){
    if(obj2._Fantasma && obj2._posicionInicial>0){
        obj2.BackToNormal(obj1.x,obj1.y);
    }
}

function onCollisionEnemyTierra(obj1,obj2){
    if(!obj2._Fantasma){
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
}

function onCollisionAplasta(obj1, obj2){
    if(obj2._Falling){
        if(obj1._id=='Player')  //Si el objeto es el digdug es necesario para su movimiento y asi pausar la cancion
        {
            obj1.y-=15;
            obj1._Movingdown=false;     
            obj1._Movingleft=false;
            obj1._Movingright=false;
            obj1._Movingup=false;
            obj2._PlayerAplastado=true;
            obj2._RefPlayer=player;
            obj1._animWalk.stop();
            obj1._animDig.stop();
            obj1.Aplastado(4);
            obj1.body.enable=false;
        }
        else if(obj1._id=='Enemigo')
        {
            obj1._animWalk.stop();
            obj1._animFant.stop();
            obj1.Aplastado(4);
            obj2.addChild(obj1);    //Ponemos el objeto que choca hijo de la roca
            obj1.x=20;              //En la posicion correcta
            obj1.y=35;
        }
        
        obj1._MovementEnable=false;
        
        if(obj1.angle!=0)
            obj1.angle=0;
          
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
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)<obj2._posX && (obj1.y-20)==obj2._posY){
                obj2.x = obj2.x+1;
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)<obj2._posY){
                obj2.y = obj2.y + 1;
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)>obj2._posY){
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            if (obj2.width<4 || obj2.height<4){
                obj2.Destroy();
                var PosCentralTierra = new Par (obj2._posCentralX, obj2._posCentralY);
                var BanderaControl = new GO(this.g, PosCentralTierra, 'Banderita', 'Bandera'); 

                this.g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                BanderaControl.anchor.x = 0.5;
                BanderaControl.anchor.y = 0.5;
                BanderaControl.visible=false;
                this.g.world.addChild(BanderaControl);
                GrupoBanderas.add(BanderaControl);
                BanderaControl.body.immovable = true;
            }
        }
    }
    if (obj1._Falling && obj1._id=='Roca' && obj1.y<obj2.y)         
        obj2.Destroy();
}

function onCollisionPara(obj1, obj2){
    if(obj2._Falling && obj1.y>obj2.y+21){
        if(obj2.y != obj2._posY)
            obj2.Para();
        else
            obj2._Falling=false;
    }
}

function onCollisionVegetable(obj1,obj2){
    sumaPuntos(obj2._puntos, this.g);
    obj2.Destroy();
}

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function sumaPuntos (x,g) {
    puntuacion += x;
    puntuacionControl += x;
    // timerUP = g.time.create(false);
    // timerUP.add(1500,OneUPOFF)
    if(puntuacionControl>=20000){
        puntuacionControl-=20000;
        if(vidas<6){
            vidas++;
            ActualizaHUD(g);
        }
    }
    score.text = puntuacion;
} 

function LoadMap (lvl,g) {
    g.mapaNivel = JSON.parse(g.cache.getText('level'+lvl));

    var posX=-3, posY=80;
    
    var V1 = new Par(-3, posY-43);
    var V2 = new Par(513, posY-43);

    var BloqTierraleft = new GO(g, V1, 'tierraVInferior', 'tierraV');  
    g.physics.arcade.enable(BloqTierraleft);
    BloqTierraleft.body.immovable = true;
    BloqTierraleft.visible=false;
    g.world.addChild(BloqTierraleft);
    tierraV.add(BloqTierraleft);

    var BloqTierraright = new GO(g, V2, 'tierraVInferior', 'tierraV');  
    g.physics.arcade.enable(BloqTierraright);
    BloqTierraright.body.immovable = true;
    BloqTierraright.visible=false;
    g.world.addChild(BloqTierraright);
    tierraV.add(BloqTierraright);
    

    for(var h=0; h<12; h++){
        var PosTierraH = new Par(posX, posY-43);
        var BloqTierraH = new GO(g, PosTierraH, 'tierraHInferior','tierraH');
        BloqTierraH.visible=false;
        g.physics.arcade.enable(BloqTierraH);
        BloqTierraH.body.immovable = true;
        g.world.addChild(BloqTierraH);
        tierraH.add(BloqTierraH);

        var PosCentralTierra = new Par (posX+23, posY-20);
        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
        BanderaControl.anchor.x = 0.5;
        BanderaControl.anchor.y = 0.5;
        BanderaControl.visible=false;
        g.world.addChild(BanderaControl);
        GrupoBanderas.add(BanderaControl);
        BanderaControl.body.immovable = true;

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
                    if(fila[i]=='0'){    //Bloque de Tierra
                        
                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;
                    }
                    else if(fila[i]=='3'){    //Bloque de Tierra
                        
                        var PosTierra = new Par(posX-40, posY-43);
                        var PosCentralTierra = new Par(posX-20, posY-23);

                        if(j<9)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraSuperficie', 'tierra',PosCentralTierra); 
                        else if(j<17)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraIntermedia', 'tierra', PosCentralTierra); 
                        else
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraInferior', 'tierra', PosCentralTierra);  
                        
                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                    }
                    else if(fila[i]=='4'){    //Bloque de Tierra + Roca
                        
                        var PosTierra = new Par(posX-40, posY-43);
                        var PosCentralTierra = new Par(posX-20, posY-23);
                        
                        if(j<9)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraSuperficie', 'tierra', PosCentralTierra); 
                        else if(j<17)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraIntermedia', 'tierra', PosCentralTierra); 
                        else
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraInferior', 'tierra', PosCentralTierra);  

                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                        var PosRock = new Par(posX-40, posY-44);
                        var Rock = new Roca(g, PosRock, 'Roca', 'RocaCompletaSpriteSheet');
                        g.physics.arcade.enable(Rock); 
                        roca.add(Rock);     //AÑADIMOS AL GRUPO

                        
                        
                    }
                    else if(fila[i]=='5'){    //Enemigo Pooka
                        
                        var PosEne = new Par(posX-20,posY-23);
                        var enemigo = new Enemy('P', g, PosEne, 'Enemigo', limiteDerecho, limiteSuperior,player);
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);

                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;

                    }
                    else if(fila[i]=='6'){    //Enemigo Fygar
                        
                        console.debug('Creacion del Fygar');

                        var FireBullet = new Phaser.Sprite(this.game, 0, 0, 'Banderita');
                        this.game.physics.enable(FireBullet, Phaser.Physics.ARCADE);
                        FireBullet.anchor.x = 0.5;
                        FireBullet.anchor.y = 0.5;
                        FireBullet.width = FireBullet.width/4;
                        FireBullet.height = FireBullet.height/4;
                        GrupoFireBullets.addChild(FireBullet);

                        var PosEne = new Par(posX-20,posY-23);
                        var enemigo = new Fygar('P', g, PosEne, 'Enemigo', limiteDerecho, limiteSuperior,player,FireBullet);
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);
                        enemigo.addChild(FireBullet);

                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;

                    }
                }
            }
        }
        posX=-3;
        if (j%2==0)
            posY+=43;
    }
    tamañoGrupoRocas=roca.length;
    cargado=true;
} 

function ResetPosition(){       //Coloca al todos los personajes en el lugar original
    
    for (var i=0; i< GrupoEnemigos.length; i++){
        GrupoEnemigos.children[i].x = GrupoEnemigos.children[i]._posOriginalX;
        GrupoEnemigos.children[i].y = GrupoEnemigos.children[i]._posOriginalY;
        GrupoEnemigos.children[i]._distanceX=0;
        GrupoEnemigos.children[i]._distanceY=0;
    }
    player.x=player._posOriginalX;
    player.y=player._posOriginalY;
    player._distanceX=0;
    player._distanceY=0;
    player._Enableright = true;
    player._Enableleft = true;
    player._Enabledown = true;
    player._Enableup = true;
    player._animDig.stop();
    player._animDie.stop();
    player._animWalk.play(6,true);


    if(player.width<0)
        player.width=-player.width;
    if(player.angle!=0)
        player.angle=0;
}

function StopEnemies(){
    for (var t=0; t<GrupoEnemigos.length; t++){
        GrupoEnemigos.children[t]._MovementEnable=false;
        GrupoEnemigos.children[t]._animWalk.stop();
    }
}

function StartEnemies(){
    for (var t=0; t<GrupoEnemigos.length; t++){
        GrupoEnemigos.children[t]._animWalk.play(6,true);
        GrupoEnemigos.children[t]._MovementEnable=true;
        GrupoEnemigos.children[t]._Fantasma=false;
        GrupoEnemigos.children[t]._giros=0;
        GrupoEnemigos.children[t]._posicionInicial=0;
        GrupoEnemigos.children[t]._bufferBounce=1;
    }
}

function LevelComplete(g){
    nivel++;
    g.state.restart('play', false, false);
}

function ActualizaHUD(g){       //ACTUALIZA EL HUD DE LAS VIDAS

    for (i = 0; i < thisLifes.length; i++) 
    {
        thisLifes.removeChildren();
    }

    for (i = 0; i < vidas; i++) 
    {
        spriteVidas = thisLifes.create(556 + (43 * i), 388, 'DigDugWalking');
        spriteVidas.frame=0;
        spriteVidas.alpha = 0.7;
    }
}

function LevelWin(g){    //Para el sonido de victoria
    if(!player._Muerto || !player._animMuerto){
        playerMusic.stop();
        player._animDig.stop();
        player._animWalk.stop();
        player._MovementEnable=false;
        //Lanzar la musiquita de victoria (ajustar el timer a cuando se acabe el sonido)
        timerControl.add(2500,LevelComplete,this,g);
        timerControl.start();
    }
    else{
        MuertePlayer();
    }
    
}

function ContinuarLevel(g,lfs){
    player.body.enable=true;
    player._Muerto=false;
    player._AnimMuerto=false;
    player._MovementEnable=true;
    vidas--;
    PAUSED=false;
    ResetPosition();
    StartEnemies();
    ActualizaHUD(g,lfs);
}

function ComenzarJuego(g){
    playerMusic.stop();
    nivel=1;
    vidas=3;
    puntuacion=0;
    VegetalGenerado=false;
    g.state.restart('play', false, false);
}

function MuertePlayer(){
    if(!player._AnimMuerto){
        player.Muerte();
        StopEnemies();
    }
}