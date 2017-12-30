
'use strict';

var PlayScene = require('./play_scene.js');

var musicaMenu;
var menu;
var Flechita;
var cursors;  //cursores
var PosicionSuperior, PosicionInferior;    //Coordenadas
var PosicionFlecha = true;    //Posicion de la Flecha true para arriba, false para abajo
var timerControl;
var Eleccion=false;

var MenuScene = {

    preload: function(){

    },

    create: function() {

    this.game.time.create(false);

    PosicionSuperior = new Par(350,400);
    PosicionInferior = new Par(350,500);
    ///////////////////////////////////////////////////MUSICA PARA EL PLAYER AL MOVERSE
    //musicaMenu=this.game.add.audio('running90s');
    //musicaMenu.play();

    /*PUEDE SER UTIL PARA PONERLO EN EL MENU
        
    //Control de puntuaciones
    scoreStringA = 'HI -';
    scoreStringB = ' SCORE';
    //scoreStringC = ' SCORE';
    levelString = ' ROUND ';
    scoreTextA = this.game.add.text(556, 44, scoreStringA, { font: '34px Arial', fill: '#fff' });
    scoreTextB = this.game.add.text(599, 87, scoreStringB, { font: '34px Arial', fill: '#fff' });
    //scoreTextC = this.game.add.text(599, 216, scoreStringC, { font: '34px Arial', fill: '#fff' });
        // Puesto el texto 'Score' en la posicion (x, y) con la fuente y color que se quiera
    score = this.game.add.text(599, 259, puntuacion, { font: '34px Arial', fill: '#fff' });
    highScoreText = this.game.add.text(599, 130, maxPuntuacion, { font: "bold 34px Arial", fill: "#46c0f9", align: "center" });
        
    */

    //Inicializar los cursores.
    cursors = this.game.input.keyboard.createCursorKeys();
    
    menu = new Phaser.Sprite(this.game, 0, 800, 'MenuFondo');
    menu.anchor.x = 0;
    menu.anchor.y = 0;
    Flechita = new Phaser.Sprite(this.game, PosicionSuperior._x, PosicionSuperior._y, 'MenuFlecha');
    Flechita.anchor.x = 0;
    Flechita.anchor.y = 0;
    this.game.world.addChild(menu);
    this.game.world.addChild(Flechita);   
    

},
    update: function(){

        if(menu.y>0)
            menu.y--;


        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onUpCallback = function(key){

            ////////////////////MOVIMIENTO FLECHAS/////////////////
            if(menu.y==0 && !Eleccion){
                if(key.keyCode === cursors.up){
                    if(Flechita.y == PosicionInferior._y){
                        Flechita.y = PosicionSuperior._y;
                        PosicionFlecha=true;
                    }
                }
                if (key.keyCode === cursors.down){
                    if(Flechita.y == PosicionSuperior._y){
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
                    Eleccion=true;
                    timerControl.add(1000,Comienzo,this,this.game);
                    timerControl.start();
                }
            }
        }


        //PUNTUACION
        // highScoreText.text = localStorage.getItem("highscore"); {
        //     if (puntuacion > localStorage.getItem("highscore")) { 
        //         localStorage.setItem("highscore", puntuacion);
        //     }
        // }

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
    if(PosicionFlecha)
        g.state.start('play');
}