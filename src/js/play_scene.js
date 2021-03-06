
 'use strict';

var GO = require('./Class_GameObject.js');
var Roca = require('./Class_Roca.js');
var Vegetal = require('./Class_Vegetal.js');
var Movable = require('./Class_Movable.js');
var Player = require('./Class_Player.js');
var Enemy = require('./Class_Enemy.js');
var Fygar = require('./Class_Fygar.js');
var BloqueTierra = require('./Class_Tierra.js');
var Flower = require('./Class_Flor.js');


var player;
var cursors;
var limiteDerecho = 513;
var limiteSuperior = 44;
var tierra, tierraH, tierraV;
var GrupoRocas, rocasCaidas, VegetalGenerado;

var tamañoGrupoRocas=0;
var GrupoBanderas;

var mapaNivel;
var CuboHuida;
var CuboDestruccion;
var BloqTierraleft;

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
var FullScreenButton;
var MuteButton;

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
var winSound;
var itemSound;

var Vegetable;
var PuntosVegetables = [400,600,800,1000,1000,2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,7000,7000,8000];

var PosCentral;

//BOOLEANOS DE CONTROL
var cargado;
var NextLevel;
var timerControl;


//INPUT
var pulsando;
var DistX=0;
var DistY=0;
var PAD;
var InputButton;
var distPulsacion=60;


//NUMEROS MAGICOS
var posicionCentralX=258;
var posicionCentralY=298;
var tamañofuente=30;
var posPlayerIniX=358; var posPlayerIniY=60;
var puntuacionVida=20000;

//PARA LA COLISION CON LA ROCA
var minimo=20; var maximo=21;




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
        this.game.load.text('level6', 'levels/level6.json');
        this.game.load.text('level7', 'levels/level7.json');
        this.game.load.text('level8', 'levels/level8.json');
        this.game.load.text('level9', 'levels/level9.json');
        this.game.load.text('level10', 'levels/level10.json');
        this.game.load.text('level11', 'levels/level11.json');
        this.game.load.text('level12', 'levels/level12.json');
        this.game.load.text('level13', 'levels/level13.json');
        this.game.load.text('level14', 'levels/level14.json');
        this.game.load.text('level15', 'levels/level15.json');
        this.game.load.text('level16', 'levels/level16.json');
        this.game.load.text('level17', 'levels/level17.json');
        this.game.load.text('level18', 'levels/level18.json');
        this.game.load.text('level19', 'levels/level19.json');
        this.game.load.text('level20', 'levels/level20.json');
        this.game.load.text('level21', 'levels/level21.json');
        this.game.load.text('level22', 'levels/level22.json');
        this.game.load.text('level23', 'levels/level23.json');
        this.game.load.text('level24', 'levels/level24.json');
        this.game.load.text('level25', 'levels/level25.json');


    },

    create: function() {

        if(nivel==1)
            vidas=3;

        //TIMER PARA LA PAUSA
        var timerPause = this.game.time.create(false);
        timerPause.loop(500,switchPause,this);
        timerPause.start();

        //TIMER PARA EL PASO DE NIVEL 
        timerControl= this.game.time.create(false);
        NextLevel=false;

        //MUSICA PARA EL PLAYER AL MOVERSE
        playerMusic=this.game.add.audio('MusicGame',0.25,true);    //key, volume, loop
        playerMusic.play();
        playerMusic.pause();

        winSound = this.game.add.audio('Win',0.4);
        itemSound = this.game.add.audio('Item',1);

        //Activar las físicas de Phaser.
        this.game.physics.startSystem(Phaser.ARCADE);
    
        //Poner variables a los limites.
        
        
        PosCentral = new Par(posicionCentralX, posicionCentralY);

        //Rocas para vegetal
        cargado=false;
        rocasCaidas=0;
        VegetalGenerado=false;
        
        //Control de puntuaciones
        if(nivel==1){
            puntuacion=0;
            puntuacionControl=0;
        }
        scoreStringA = 'HI-';
        scoreStringB = ' SCORE';
        pauseString = 'PAUSED';
        levelString = ' ROUND ';

        
        scoreTextA = this.game.add.text(546, 44, scoreStringA);
        scoreTextA.font = 'Press Start 2P';
        scoreTextA.fontSize = tamañofuente;
        scoreTextA.fill = '#fff';


        scoreTextB = this.game.add.text(589, 87, scoreStringB);
        scoreTextB.font = 'Press Start 2P';
        scoreTextB.fontSize = tamañofuente;
        scoreTextB.fill = '#fff';


        pauseText = this.game.add.text(580, 190, pauseString);
        pauseText.font = 'Press Start 2P';
        pauseText.fontSize = tamañofuente;
        pauseText.fill = '#fff';
        pauseText.visible=false;
        
        score = this.game.add.text(589, 269, puntuacion);
        score.font = 'Press Start 2P';
        score.fontSize = tamañofuente;
        score.fill = '#fff';

        highScoreText = this.game.add.text(589, 130, maxPuntuacion);
        highScoreText.font = 'Press Start 2P';
        highScoreText.fontSize = tamañofuente;
        highScoreText.fill = '#fff';

        levelText = this.game.add.text(503, 517, levelString + nivel);
        levelText.font = 'Press Start 2P';
        levelText.fontSize = tamañofuente;
        levelText.fill = '#fff';

        score.text=puntuacion;
        

        //FLORES
        var thisFlor = this.flor;
        thisFlor = this.game.add.group();

        var contFB = Math.floor(nivel/10);
        var contFN = nivel%10;
        var cont = contFB + contFN;
        for (i = 0; i < cont; i++)
        {
            if(contFB>0){
                contFB--;
                spriteFlor = new Flower(this.game,470 - (43 * i), 34, 'FlorBlancaSpriteSheet')        //FlorBlancaSpriteSheet       
                thisFlor.addChild(spriteFlor);
            }
            else if(contFN>0){
                contFN--;
                spriteFlor = new Flower(this.game,470 - (43 * i), 34, 'FlorSpriteSheet')        //FlorBlancaSpriteSheet
                thisFlor.addChild(spriteFlor);
            }
        }

        //CUBO DE HUIDA
        CuboHuida = new Phaser.Sprite(this.game,40*7-2,60,'tierraSuperficie');      
        this.game.physics.enable(CuboHuida, Phaser.Physics.ARCADE);
        CuboHuida.anchor.x = 0.5;
        CuboHuida.anchor.y = 0.5;
        CuboHuida.visible = false;
        CuboHuida.body.enable=true;
        this.game.world.addChild(CuboHuida);

        //CUBO DE MUERTE
        CuboDestruccion = new Phaser.Sprite(this.game,-60,60,'tierraSuperficie');
        this.game.physics.enable(CuboDestruccion, Phaser.Physics.ARCADE);
        CuboDestruccion.anchor.x = 0.5;
        CuboDestruccion.anchor.y = 0.5;
        CuboDestruccion.visible = false;
        CuboDestruccion.body.enable=true;
        this.game.world.addChild(CuboDestruccion);

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Construimos el player
        var PosPlayer = new Par(posPlayerIniX, posPlayerIniY);
        player = new Player(this.game,PosPlayer, 'Player',cursors, limiteDerecho, limiteSuperior, 278, 318, 'DigDugWalking'); 
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        player.body.enable=true;
        this.game.world.addChild(player);

        if(nivel==25)
            player._ShootEnable=false;

        ///////////////////////Vidas//////////////////////////////
        thisLifes = this.lifes;
        thisLifes = this.game.add.group()
        this.game.add.text(599, 345, 'LIVES ', { font: '30px Press Start 2P', fill: '#fff' });

        ActualizaHUD(this.game);

        //Añadir la tierra.
        tierra = this.game.add.physicsGroup();
        //Poner fisicas a la tierra horizontal.
        tierraH = this.game.add.physicsGroup();
        //Poner fisicas a la tierra vertical.
        tierraV = this.game.add.physicsGroup();
        //Grupo de las rocas
        GrupoRocas = this.game.add.physicsGroup();
        //Grupo de los enemigos
        GrupoEnemigos = this.game.add.physicsGroup();
        //Grupo de las banderas de control
        GrupoBanderas = this.game.add.physicsGroup();
        //Grupo de las balas de los Fygar
        GrupoFireBullets = this.game.add.physicsGroup();
        
        //PARA UN CORRECTO FULLSCREEN
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        FullScreenButton = this.game.add.button(750, 20, 'NormalScreenButton', FullScreen, this);
        MuteButton = this.game.add.button(710, 20, 'MuteButton', Mute, this);


        LoadMap(nivel,this.game);

        //INPUT

        PAD = new Phaser.Sprite(this.game,200, 450,'PAD');
        PAD.visible=false;
        PAD.anchor.x = 0.5;
        PAD.anchor.y = 0.5;
        this.game.world.addChild(PAD);

        InputButton = new Phaser.Sprite(this.game,600, 450,'BOTON');
        InputButton.visible=false;
        InputButton.anchor.x = 0.5;
        InputButton.anchor.y = 0.5;
        InputButton.width=2*InputButton.width;
        InputButton.height=2*InputButton.height;
        this.game.world.addChild(InputButton);

        player._GrupoTierra=tierra;
        player._GrupoEnemigos=GrupoEnemigos;

        StopEnemies();

},
    update: function(){

        //PLAYER
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra,null, {this:this, g:this.game});
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);
        this.game.physics.arcade.collide(player, GrupoRocas, onCollisionRoca);

        //ROCAS
        this.game.physics.arcade.collide(tierra, GrupoRocas, onCollisionPara);
        this.game.physics.arcade.collide(GrupoRocas, tierraH, onCollisionTierra);

            //COLISION ROCAS CON ENEMIGOS Y PLAYER
            this.game.physics.arcade.collide(GrupoEnemigos, GrupoRocas, onCollisionAplasta);
            this.game.physics.arcade.collide(player, GrupoRocas, onCollisionAplasta);

        //ENEMIGOS
        this.game.physics.arcade.collide(tierra, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraH, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraV, GrupoEnemigos, onCollisionEnemyTierra);
        
        //ENEMIGOS CON BANDERITAS DE CONTROL
        this.game.physics.arcade.collide(GrupoBanderas, GrupoEnemigos, onCollisionBandera);

        //ENEMIGOS CON EL PLAYER
        if(player._MovementEnable){ //Si el player ya se puede mover
            this.game.physics.arcade.collide(GrupoEnemigos, player._core, MuertePlayer);
        }

        //PLAYER CON VEGETAL
        if(VegetalGenerado){
            this.game.physics.arcade.collide(player, Vegetable, onCollisionVegetable,null, {this:this, g:this.game});
        }

        //ENEMIGOS CON EL CUBO DE HUIDA
        this.game.physics.arcade.collide(GrupoEnemigos, CuboHuida, onCollisionHuidaEnemigo);
        this.game.physics.arcade.collide(GrupoEnemigos, CuboDestruccion, onCollisionEliminacionEnemigo);

        
        //INPUT TACTIL

        if(this.game.input.pointer1.isDown){        //pointer1
            if(this.game.input.pointer1.positionDown.x<350){    //pointer1

                PAD.position=this.game.input.pointer1.positionDown;     //pointer1
                PAD.visible=true;

                DistX = (this.game.input.pointer1.position.x-this.game.input.pointer1.positionDown.x);      //pointer1
                DistY = (this.game.input.pointer1.position.y-this.game.input.pointer1.positionDown.y);      //pointer1

                if(DistY<-distPulsacion){
                    player._pulsandoArriba = true;
                    player._pulsandoDerecha=false;
                    player._pulsandoIzquierda=false;
                    player._pulsandoAbajo=false;
                }
                else if(DistY>distPulsacion){
                    player._pulsandoAbajo = true;
                    player._pulsandoDerecha=false;
                    player._pulsandoIzquierda=false;
                    player._pulsandoArriba=false;
                }else if(DistX>distPulsacion){
                    player._pulsandoDerecha = true;
                    player._pulsandoIzquierda=false;
                    player._pulsandoArriba=false;
                    player._pulsandoAbajo=false;
                }
                else if(DistX<-distPulsacion){
                    player._pulsandoIzquierda = true;
                    player._pulsandoDerecha=false;
                    player._pulsandoArriba=false;
                    player._pulsandoAbajo=false;
                }
            }
        }
        else{
            PAD.visible=false;
            player._pulsandoDerecha=false;
            player._pulsandoIzquierda=false;
            player._pulsandoArriba=false;
            player._pulsandoAbajo=false;
        }
        
        //Pongo restricciones a la pulsacion entre lados de la pantalla
        if(this.game.input.pointer1.isDown && this.game.input.pointer1.positionDown.x<350){    //Si se esta usando el pointer 1 ya, usamos el pointer 2
            if(this.game.input.pointer2.isDown){    //pointer2
                if(this.game.input.pointer2.positionDown.x>450 && this.game.input.pointer2.positionDown.y>80){   //pointer2
                    InputButton.position=this.game.input.pointer2.positionDown;     //pointer2
                    InputButton.visible=true;
                    player._pulsandoBoton=true;
                }
            }
            else{
                InputButton.visible=false;
                player._pulsandoBoton=false;
            }
        }else{  //si no, usamos el pointer 1
            if(this.game.input.pointer1.isDown){    //pointer1
                if(this.game.input.pointer1.positionDown.x>450 && this.game.input.pointer1.positionDown.y>80){   //pointer1
                    InputButton.position=this.game.input.pointer1.positionDown;     //pointer1
                    InputButton.visible=true;
                    player._pulsandoBoton=true;
                }
            }
            else{
                InputButton.visible=false;
                player._pulsandoBoton=false;
            }
        }
        


        if(GrupoEnemigos.length==1){
            if(!GrupoEnemigos.children[0]._Huyendo){
                GrupoEnemigos.children[0]._Huyendo=true;
                playerMusic.stop();
                playerMusic=this.game.add.audio('MusicGameSpeedUp',0.25,true);    //key, Incluyendo la musica pero a mas velocidad
                playerMusic.play();
                playerMusic.pause();
            }
        }

        if(player._AnimMuerto){
            StopEnemies();
            StopRocks();
        }

        this.game.input.keyboard.game.input.keyboard.onUpCallback = function(key){

            ///////////////////////HACKS//////////////////////////////////////
            // //////////////////PRUEBA CAMBIO LEVEL///////////////
            // if(key.keyCode === 48){     //El 0
            //     LevelComplete(this.game);
            // }

            // ///////////////////NIVEL 1 A FULL VIDAS//////////////////
            // if(key.keyCode === 49){     //El 1
            //     ComenzarJuego(this.game);
            // }

            if(key.keyCode === Phaser.KeyCode.P && !player._AutomaticMovement && !player._AnimMuerto && !player._Muerto && !player._EsperandoComenzar){ //LO NECESARIO PARA RESETEAR LA ESCENA PERDIENDO UNA VIDA
                if(!PAUSED){
                    player._MovementEnable=false;
                    player._animWalk.paused=true;
                    StopEnemies();
                    StopRocks();
                    PAUSED=true;
                    pauseText.visible=true;
                }
                else{
                    player._MovementEnable=true;
                    player._animWalk.paused=false;
                    StartEnemies();
                    StartRocks();
                    PAUSED=false;
                    pauseText.visible=false;
                }
            }

            if(key.keyCode === Phaser.KeyCode.U){
                for(var gh = GrupoEnemigos.length-1;gh>=0; gh--){
                    GrupoEnemigos.children[gh]._MovementEnable=false;
                    GrupoEnemigos.children[gh].destroy();
                }
            }
        }



        //BOTON DE FULLSCREEN
        if (this.game.scale.isFullScreen)
        {
            if(FullScreenButton.texture!='NormalScreenButton')
                FullScreenButton.loadTexture('NormalScreenButton');
        }
        else
        {
            if(FullScreenButton.texture!='FullScreenButton')
                FullScreenButton.loadTexture('FullScreenButton');
        }

        //BOTON DE MUTE
        if(this.game.sound.mute && MuteButton.texture!='DeMuteButton'){
            MuteButton.loadTexture('DeMuteButton');
        }
        else if(this.game.sound.mute && MuteButton.texture!='MuteButton'){
            MuteButton.loadTexture('MuteButton');
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
            if(GrupoRocas.length<tamañoGrupoRocas){     
                rocasCaidas++;                     
                tamañoGrupoRocas=GrupoRocas.length;
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
        for(var k =0; k<GrupoRocas.length; k++){

            if (GrupoRocas.children[k]._PuntosActualizados && !GrupoRocas.children[k]._PuntosContabilizados){  //SI NO SE HA LLAMADO AL PLAYER, YA SE HAN AÑADIDO LOS PUNTOS DE MATAR A X ENEMIGOS Y NO SE HAN AÑADIDO A LA PUNTUACION GLOBAL
                GrupoRocas.children[k]._PuntosContabilizados=true;
                sumaPuntos(GrupoRocas.children[k]._PuntosConseguidos,this.game);
            }
        }

        //PUNTOS QUE DAN LOS ENEMIGOS
        for(var k =0; k<GrupoEnemigos.length; k++){

            if (GrupoEnemigos.children[k]._State==5 && !GrupoEnemigos.children[k]._PuntosContabilizados){  //SI NO SE HA LLAMADO AL PLAYER, YA SE HAN AÑADIDO LOS PUNTOS DE MATAR A X ENEMIGOS Y NO SE HAN AÑADIDO A LA PUNTUACION GLOBAL
                GrupoEnemigos.children[k]._PuntosContabilizados=true;
                sumaPuntos(GrupoEnemigos.children[k]._Puntos,this.game);
            }
        }


        if(player._EnPosicion){
            StartEnemies();
            StartRocks();
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

        if(player._MovementEnable && PAUSED)
            player._MovementEnable=false;

        //MUSICA
        if((player._Movingdown || player._Movingup || player._Movingleft || player._Movingright)&&(player._MovementEnable || player._AutomaticMovement))
            playerMusic.resume();
        else
            playerMusic.pause();

    },
    render: function(){
        
    }
}

module.exports = PlayScene;

function EnemyHooked(obj1,obj2){
    if(obj2._State<4){
        obj2._animWalk.stop();
        obj2._State++;
    }
    obj1.destroy_in_next_tick= true;
    player._Hooking = false;
    if(!player._AnimMuerto && !player._Muerto && player._GrupoEnemigos.length!=0)
        player._MovementEnable=true;
}

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
            obj1.y-=15;     //colocamos al player para que su animacion de muerte no quede por detras de la tierra debido al orden de creacion de los objetos
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
            if(obj1._animBreathFire!=undefined)
                obj1._animBreathFire.stop();
            obj1._Aplastado=true;
            obj1.Aplastado(4);
            obj2.addChild(obj1);    //Ponemos el objeto que choca hijo de la roca
            obj1.x=20;              //En la posicion correcta
            obj1.y=35;
            obj1.body.enable=false;
        }
        
        obj1._MovementEnable=false;     //en cualquier caso impedimos el movieminto al objeto que ha colisionado
        
        if(obj1.angle!=0)
            obj1.angle=0;
          
    }
}

function onCollisionRoca(obj1, obj2)    //Colision del player con la roca que restringe el movimiento
{
    
    if ((obj1.x-minimo == obj2.x && obj1.y<obj2.y+maximo)||(obj1.x-minimo > obj2.x && obj1.y==obj2.y+maximo)||(obj1.x-minimo < obj2.x && obj1.y==obj2.y+maximo)){ //COLISION CON LA PARTE SUPERIOR DE LA ROCA

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
     else if (obj1.x-minimo == obj2.x && obj1.y>obj2.y+58){ //COLISION CON LA PARTE INFERIOR DE LA ROCA
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
            obj2.destroy(); //Llamamos la la destructora de la tierra
        else {
            if ((obj1.x-minimo)>obj2._posX && (obj1.y-minimo)==obj2._posY){       //ENTRANDO POR LA DERECHA
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-minimo)<obj2._posX && (obj1.y-minimo)==obj2._posY){
                obj2.x = obj2.x+1;
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-minimo)==obj2._posX && (obj1.y-minimo)<obj2._posY){
                obj2.y = obj2.y + 1;
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-minimo)==obj2._posX && (obj1.y-minimo)>obj2._posY){
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            if (obj2.width<4 || obj2.height<4){     //Si el ancho de la tierra que queda es menor a 4, destruimos la tierra que queda
                obj2.destroy();
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
    if (obj1._Falling && obj1._id=='Roca' && obj1.y<obj2.y && obj1.y<540)  //Destruimos la tierra fina con la roca al caer, pero no la más inferior       
        obj2.destroy();
}

function onCollisionPara(obj1, obj2){
    if(obj2._Falling && obj1.y>obj2.y+maximo){
        if(obj2.y != obj2._posY)
            obj2.Para();
        else
            obj2._Falling=false;
    }
}

function onCollisionVegetable(obj1,obj2){
    itemSound.play();
    sumaPuntos(obj2._puntos, this.g);
    obj2.destroy();
}

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function sumaPuntos (x,g) {
    puntuacion += x;
    puntuacionControl += x;
    if(puntuacionControl>=puntuacionVida){
        puntuacionControl-=puntuacionVida;
        if(vidas<8){
            vidas++;
            ActualizaHUD(g);
        }
    }
    score.text = puntuacion;
} 

function LoadMap (lvl,g) {
    g.mapaNivel = JSON.parse(g.cache.getText('level'+lvl));

    var posX=-3, posY=80;
    var anchoCasillaConTierraFina=43;
    
    var V1 = new Par(posX, posY-anchoCasillaConTierraFina);
    var V2 = new Par(513, posY-anchoCasillaConTierraFina);     //COLOCAMOS LA DOS TIERRAS FINAS VERTICALES A LOS LATERALES DE LA SUPERFICIE INVISIBLES PARA GENERAR COLISION 

    BloqTierraleft = new GO(g, V1, 'tierraVInferior', 'tierraV');  
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
    

    for(var h=0; h<12; h++){    //NUMERO DE COLUMNAS
        var PosTierraH = new Par(posX, posY-anchoCasillaConTierraFina);
        var BloqTierraH = new GO(g, PosTierraH, 'tierraHInferior','tierraH');
        BloqTierraH.visible=false;
        g.physics.arcade.enable(BloqTierraH);
        BloqTierraH.body.immovable = true;
        g.world.addChild(BloqTierraH);
        tierraH.add(BloqTierraH);

        var PosCentralTierra = new Par (posX+23, posY-minimo);
        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
        BanderaControl.anchor.x = 0.5;
        BanderaControl.anchor.y = 0.5;
        BanderaControl.visible=false;
        g.world.addChild(BanderaControl);
        GrupoBanderas.add(BanderaControl);
        BanderaControl.body.immovable = true;

        posX+=anchoCasillaConTierraFina;
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

                        posX+=anchoCasillaConTierraFina;
                    }
                    else{
                        posX+=anchoCasillaConTierraFina;
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

                        posX+=anchoCasillaConTierraFina;
                    }
                    else{
                        posX+=anchoCasillaConTierraFina;
                    }
                }
                else    //AQUI PARA LAS COLUMNAS IMPARES QUE PUEDEN SER DE TIERRA, TIERRA CON ROCA, VACIA, VACIA CON MONSTRUO
                {
                    if(fila[i]=='0'){    //Bloque de Tierra
                        
                        var PosCentralTierra = new Par(posX-minimo, posY-23);
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
                        
                        var PosTierra = new Par(posX-40, posY-anchoCasillaConTierraFina);
                        var PosCentralTierra = new Par(posX-minimo, posY-23);

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
                        
                        var PosTierra = new Par(posX-40, posY-anchoCasillaConTierraFina);
                        var PosCentralTierra = new Par(posX-minimo, posY-23);
                        
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
                        GrupoRocas.add(Rock);     //AÑADIMOS AL GRUPO

                        
                        
                    }
                    else if(fila[i]=='5'){    //Enemigo Pooka
                        
                        var PosEne = new Par(posX-minimo,posY-23);
                        var enemigo = new Enemy('P', CuboHuida, g, PosEne, 'Enemigo', limiteDerecho, limiteSuperior,player);
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);

                        var PosCentralTierra = new Par(posX-minimo, posY-23);
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

                        var PosEne = new Par(posX-minimo,posY-23);
                        var enemigo = new Fygar('FygarSpriteSheet', CuboHuida, g, PosEne, 'Enemigo', limiteDerecho, limiteSuperior,player, tierra);
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);

                        var PosCentralTierra = new Par(posX-minimo, posY-23);
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
            posY+=anchoCasillaConTierraFina;
    }
    tamañoGrupoRocas=GrupoRocas.length;
    cargado=true;
} 

function ResetPosition(){       //Coloca al todos los personajes en el lugar original
    
    if(Vegetable!=undefined)
        Vegetable.destroy();

    for (var i=0; i< GrupoEnemigos.length; i++){
        GrupoEnemigos.children[i].x = GrupoEnemigos.children[i]._posOriginalX;
        GrupoEnemigos.children[i].y = GrupoEnemigos.children[i]._posOriginalY;
        GrupoEnemigos.children[i]._distanceX=0;
        GrupoEnemigos.children[i]._distanceY=0;
        GrupoEnemigos.children[i]._Fantasma=false;
        GrupoEnemigos.children[i]._giros=0;
        GrupoEnemigos.children[i]._posicionInicial=0;
        GrupoEnemigos.children[i]._bufferBounce=1;
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

function StopRocks(){
    for (var t=0; t<GrupoRocas.length; t++){
        GrupoRocas.children[t]._FallEnable=false;
    }
}

function StartEnemies(){
    for (var t=0; t<GrupoEnemigos.length; t++){
        if(!GrupoEnemigos.children[t]._Fantasma)
            GrupoEnemigos.children[t]._animWalk.play(6,true);
        else
            GrupoEnemigos.children[t]._animFant.play(4,true);
        GrupoEnemigos.children[t]._MovementEnable=true;
        GrupoEnemigos.children[t]._giros=0;
        GrupoEnemigos.children[t]._posicionInicial=0;
        GrupoEnemigos.children[t]._bufferBounce=1;
        if(GrupoEnemigos.children[t]._playerBurnt!=undefined)
            GrupoEnemigos.children[t]._playerBurnt=false;
    }
}
function StartRocks(){
    for (var t=0; t<GrupoRocas.length; t++){
        GrupoRocas.children[t]._FallEnable=true;
    }
}

function LevelComplete(g){
    nivel++;
    g.state.restart('play', false, false);
}

function ActualizaHUD(g){       //ACTUALIZA EL HUD DE LAS VIDAS LAS VARIABLES SON DE COLOCACION EN EL HUD

    for (i = 0; i < thisLifes.length; i++) 
    {
        thisLifes.removeChildren();
    }
    var j=0;
    for (i = 0; i < vidas; i++) 
    {
        if(i<4){
            spriteVidas = thisLifes.create(562 + (43 * i), 390, 'DigDugWalking');
            spriteVidas.frame=0;
            spriteVidas.alpha = 0.7;
        }
        else{
            spriteVidas = thisLifes.create(562 + (43 * j), 445, 'DigDugWalking');
            spriteVidas.frame=0;
            spriteVidas.alpha = 0.7;
            j++;
        }
    }
}

function LevelWin(g){    //Para el sonido de victoria
    if(!player._Muerto || !player._AnimMuerto){
        playerMusic.stop();
        winSound.play();
        player._animDig.stop();
        player._animWalk.stop();
        player._MovementEnable=false;
        timerControl.add(3500,LevelComplete,this,g);
        timerControl.start();
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
    StartRocks();
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

function MuertePlayer(obj1,obj2){
    if(!obj2._Fantasma && obj2._State==0){
        if(!player._AnimMuerto){
            player.Muerte();
            StopEnemies();
            StopRocks();
        }
    }
}

function onCollisionHuidaEnemigo(obj1,obj2){
    if(obj2._Huyendo && !obj2._ultimoGiro){
        obj2.angle=0;
        if(obj2.width>0)
            obj2.width=-obj2.width;
        obj2._ultimoGiro=true;
        BloqTierraleft.destroy();
        CuboHuida.destroy();
    }
}

function onCollisionEliminacionEnemigo(obj1,obj2){
    
    obj2._MovementEnable=false;
    obj2.destroy();
}

function FullScreen(){

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
        FullScreenButton.loadTexture('FullScreenButton');
    }
    else
    {
        this.game.scale.startFullScreen(false);
        FullScreenButton.loadTexture('NormalScreenButton');
    }
}

function Mute(){
    if(this.game.sound.mute){
        this.game.sound.mute=false;
        MuteButton.loadTexture('MuteButton');
    }
    else if(!this.game.sound.mute){
        this.game.sound.mute=true;
        MuteButton.loadTexture('DeMuteButton');
    }
}