
'use strict';

var PlayScene = require('./play_scene.js');

var musicaMenu;
var menu;
var Flechita, parpadeando=false;
var cursors;  //cursores
var PosicionSuperior, PosicionInferior;    //Coordenadas
var PosicionFlecha = true;    //Posicion de la Flecha true para arriba, false para abajo
var timerControl;
var Eleccion=false;
var FullScreenButton;
var ButtonCreated=false;

var SwitchSound;
var AceptSound;


var scoreStringA,scoreTextA,highScoreText;

var MenuScene = {

    preload: function(){

    },

    create: function() {

    Eleccion=false;
    parpadeando=false;
    PosicionFlecha = true;
    ButtonCreated=false;

    timerControl = this.game.time.create(false);

    PosicionSuperior = new Par(300,330);
    PosicionInferior = new Par(300,400);

    musicaMenu=this.game.add.audio('MenuSong',1,true);    //key, volume, loop
    musicaMenu.play();

    //SOUNDS
    SwitchSound = this.game.add.audio('Switch');
    AceptSound = this.game.add.audio('Acept');

    //Inicializar los cursores.
    cursors = this.game.input.keyboard.createCursorKeys();
    
    menu = new Phaser.Sprite(this.game, 0, 600, 'MenuFondo');
    menu.anchor.x = 0;
    menu.anchor.y = 0;
    Flechita = new Phaser.Sprite(this.game, PosicionSuperior._x, PosicionSuperior._y, 'MenuFlecha');
    Flechita.anchor.x = 0;
    Flechita.anchor.y = 0;
    Flechita.visible=false;
    this.game.world.addChild(menu);
    this.game.world.addChild(Flechita);
    
    //Control de puntuaciones
    scoreStringA = 'HI - SCORE: ';
    scoreTextA = this.game.add.text(20, 20, scoreStringA, { font: '25px Arial', fill: '#fff' });
    scoreTextA.visible=false;
    highScoreText = this.game.add.text(180, 20, '0', { font: "bold 25px Arial", fill: "#46c0f9", align: "center" });
    highScoreText.visible=false;
    highScoreText.text = localStorage.getItem("highscore");
    
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

},
    update: function(){

        if(menu.y>0){
            menu.y-=2;
        }
        else if(!parpadeando){
            parpadeando=true;
            scoreTextA.visible=true;
            highScoreText.visible=true;
            var timerFlecha = this.game.time.create(false);
            timerFlecha.loop(250,switchFlechita,this);
            timerFlecha.start();
        }
        
        if(menu.y<=0 && !ButtonCreated){
            ButtonCreated=true;
            FullScreenButton = this.game.add.button(20, 60, 'FullScreenButton', FullScreen, this);
        }
        
        if(ButtonCreated){
            if (this.game.scale.isFullScreen)
            {
                FullScreenButton.loadTexture('NormalScreenButton');
            }
            else
            {
                FullScreenButton.loadTexture('FullScreenButton');
            }
        }

        if(Eleccion){
            if(musicaMenu.volume>0)
                musicaMenu.volume -= 0.012;
        }


        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onDownCallback = function(key){

            ////////////////////MOVIMIENTO FLECHAS/////////////////
            if(menu.y==0 && !Eleccion){
                if(key.keyCode === Phaser.KeyCode.W || key.keyCode === 38){
                    if(Flechita.y == PosicionInferior._y){
                        SwitchSound.play();
                        Flechita.y = PosicionSuperior._y;
                        PosicionFlecha=true;
                    }
                }
                if (key.keyCode === Phaser.KeyCode.S || key.keyCode === 40){
                    if(Flechita.y == PosicionSuperior._y){
                        SwitchSound.play();
                        Flechita.y = PosicionInferior._y;
                        PosicionFlecha=false;
                    }
                }
            }

            //////////////////ELECCION//////////////
            if(key.keyCode === Phaser.KeyCode.ENTER || key.keyCode === Phaser.KeyCode.SPACEBAR){
                if(menu.y>0)
                    menu.y=0;
                else{
                    if(!Eleccion)
                        AceptSound.play();  //The acept sound will sound
                    Eleccion=true;
                    timerControl.add(1500,Comienzo,this,this.game);
                    timerControl.start();
                }
            }
        }
    },
    render: function(){
        
    }
}

module.exports = MenuScene;


function Par (x, y) {
    this._x = x;
    this._y = y;
}

function Comienzo(g){
    if(PosicionFlecha){
        AceptSound.destroy();       //NO seria asi pero no consigo eliminar el sonido
        musicaMenu.stop();
        g.state.start('play');
        
    }
    else{       //Los creditos o controles

    }
}
function switchFlechita(){
    if(!Eleccion)
        Flechita.visible=!Flechita.visible;
    else
    Flechita.visible=true;
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