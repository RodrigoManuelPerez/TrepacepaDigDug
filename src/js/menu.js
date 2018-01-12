'use strict';

var PlayScene = require('./play_scene.js');

var musicaMenu;
var menu;
var Flechita, parpadeando = false;
var cursors;  //cursores
var PosicionSuperior, PosicionInferior;    //Coordenadas
var PosicionFlecha = true;    //Posicion de la Flecha true para arriba, false para abajo
var timerControl;
var Eleccion = false;
var FullScreenButton;
var ButtonCreated = false;

var SwitchSound;
var AceptSound;

var Controls, AtControls = false;
var RockSprite, RockAnim;
var PlayerSprite, PlayerWalking;
var VegetableSprite, VegetablePop;
var EnemySprite, EnemyWalking;
var FygarSprite, FygarWalking;

var scoreStringA, scoreTextA, highScoreText;

// Numeros magicos:
var RockSpritePosX = 665;
var RockSpritePosY = 130;
var RockSpriteDimensions = 2.2;

var PlayerSpritePosX = 160;
var PlayerSpritePosY = 205;
var PlayerSpriteDimensions = 1.8;

var VegetableSpritePosX = 125;
var VegetableSpritePosY = 430;
var VegetableSpriteDimensions = 3;

var EnemySpritePosX = 550;
var EnemySpritePosY = 390;
var EnemySpriteDimensions = 3;

var FygarSpritePosX = 675;
var FygarSpritePosY = 390;
var FygarSpriteDimensions = 3;

var MenuScene = {

    preload: function () { },

    create: function () {

    Eleccion = false;
    parpadeando = false;
    PosicionFlecha = true;
    ButtonCreated = false;
    AtControls = false;

    timerControl = this.game.time.create(false);

    PosicionSuperior = new Par(300,330);
    PosicionInferior = new Par(300,400);

    musicaMenu = this.game.add.audio('MenuSong', 1, true); //key, volume, loop
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
    Flechita.visible = false;
    this.game.world.addChild(menu);
    this.game.world.addChild(Flechita);
    
    //Control de puntuaciones
    scoreStringA = 'HI - SCORE: ';
    scoreTextA = this.game.add.text(20, 20, scoreStringA, { font: '25px Arial', fill: '#fff' });
    scoreTextA.visible = false;
    highScoreText = this.game.add.text(180, 20, '0', { font: "bold 25px Arial", fill: "#46c0f9", align: "center" });
    highScoreText.visible = false;
    highScoreText.text = localStorage.getItem("highscore");
    
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
},
    update: function() {

        if(menu.y > 0){
            menu.y -= 2;
        }
        else if(!parpadeando){
            parpadeando = true;
            scoreTextA.visible = true;
            highScoreText.visible = true;
            var timerFlecha = this.game.time.create(false);
            timerFlecha.loop(250, switchFlechita, this);
            timerFlecha.start();
        }
        
        if (menu.y <= 0 && !ButtonCreated){
            ButtonCreated = true;
            FullScreenButton = this.game.add.button(20, 60, 'FullScreenButton', FullScreen, this);
        }
        
        if (ButtonCreated) {
            if (this.game.scale.isFullScreen)
            {
                FullScreenButton.loadTexture('NormalScreenButton');
            }
            else
            {
                FullScreenButton.loadTexture('FullScreenButton');
            }
        }

        if (Eleccion) {
            if (musicaMenu.volume > 0)
                musicaMenu.volume -= 0.012;
        }


        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onDownCallback = function(key){

            ////////////////////MOVIMIENTO FLECHAS/////////////////
            if (menu.y == 0 && !Eleccion && !AtControls){
                if (key.keyCode === Phaser.KeyCode.W || key.keyCode === 38){
                    if (Flechita.y == PosicionInferior._y){
                        SwitchSound.play();
                        Flechita.y = PosicionSuperior._y;
                        PosicionFlecha = true;
                    }
                }
                if (key.keyCode === Phaser.KeyCode.S || key.keyCode === 40){
                    if (Flechita.y == PosicionSuperior._y){
                        SwitchSound.play();
                        Flechita.y = PosicionInferior._y;
                        PosicionFlecha = false;
                    }
                }
            }

            //////////////////ELECCION//////////////
            if (!AtControls) {
                if (key.keyCode === Phaser.KeyCode.ENTER || key.keyCode === Phaser.KeyCode.SPACEBAR){
                    if (menu.y > 0)
                        menu.y = 0;
                    else {
                        if (!Eleccion)
                            AceptSound.play();  //The acept sound will sound
                        Eleccion = true;
                        timerControl.add(1500,Comienzo,this,this.game);
                        timerControl.start();
                    }
                }
            }
            else {
                if (key.keyCode === Phaser.KeyCode.ESC) {
                    this.game.state.start('menu');
                }
            }
        }
    },
    render: function() {
        
    }
}

module.exports = MenuScene;

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function Comienzo (g) {
    if (PosicionFlecha) {
        AceptSound.destroy();       //NO seria asi pero no consigo eliminar el sonido
        musicaMenu.stop();
        g.state.start('play');
        
    }
    else {       //Los creditos o controles
        AtControls = true;
        Controles(g);
        console.debug("hello");
    }
}

function Controles(g) {
    
    Controls = new Phaser.Sprite(g, 0, 0, 'Controles');
    Controls.anchor.x = 0;
    Controls.anchor.y = 0;
    g.world.addChild(Controls);

    RockSprite = new Phaser.Sprite(g, RockSpritePosX, RockSpritePosY, 'RocaCompletaSpriteSheet');
    RockSprite.frame = 1;
    RockSprite.width = RockSpriteDimensions * RockSprite.width;
    RockSprite.height = RockSpriteDimensions * RockSprite.height;
    RockSprite.anchor.x = 0.5;
    RockSprite.anchor.y = 0.5;
    g.world.addChild(RockSprite);

    PlayerSprite = new Phaser.Sprite(g, PlayerSpritePosX, PlayerSpritePosY, 'DigDugWalking');
    PlayerSprite.frame = 1;
    PlayerSprite.width = PlayerSpriteDimensions * PlayerSprite.width;
    PlayerSprite.height = PlayerSpriteDimensions * PlayerSprite.height;
    PlayerSprite.anchor.x = 0.5;
    PlayerSprite.anchor.y = 0.5;
    g.world.addChild(PlayerSprite);

    VegetableSprite = new Phaser.Sprite(g, VegetableSpritePosX, VegetableSpritePosY, 'Bufos');
    VegetableSprite.frame = 1;
    VegetableSprite.width = VegetableSpriteDimensions * VegetableSprite.width;
    VegetableSprite.height = VegetableSpriteDimensions * VegetableSprite.height;
    VegetableSprite.anchor.x = 0.5;
    VegetableSprite.anchor.y = 0.5;
    g.world.addChild(VegetableSprite);

    EnemySprite = new Phaser.Sprite(g, EnemySpritePosX, EnemySpritePosY, 'P');
    EnemySprite.frame = 1;
    EnemySprite.width = -EnemySpriteDimensions * EnemySprite.width;
    EnemySprite.height = EnemySpriteDimensions * EnemySprite.height;
    EnemySprite.anchor.x = 0.5;
    EnemySprite.anchor.y = 0.5;
    g.world.addChild(EnemySprite);

    FygarSprite = new Phaser.Sprite(g, FygarSpritePosX, FygarSpritePosY, 'F');
    FygarSprite.frame = 1;
    FygarSprite.width = -FygarSpriteDimensions * FygarSprite.width;
    FygarSprite.height= FygarSpriteDimensions * FygarSprite.height;
    FygarSprite.anchor.x = 0.5;
    FygarSprite.anchor.y = 0.5;
    g.world.addChild(FygarSprite);

    RockAnim = RockSprite.animations.add('Shaking', [0, 1], 5, true);
    RockAnim.play();
    PlayerWalking = PlayerSprite.animations.add('Walking', [0, 1], 6, true);
    PlayerWalking.play();
    VegetablePop = VegetableSprite.animations.add('ShowVegetables', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
    VegetablePop.play();
    EnemyWalking = EnemySprite.animations.add('Walking', [0, 1], 6, true);
    EnemyWalking.play();
    FygarWalking = FygarSprite.animations.add('Walking', [0, 1], 6, true);
    FygarWalking.play();

}

function switchFlechita() {
    if (!Eleccion)
        Flechita.visible = !Flechita.visible;
    else
        Flechita.visible = true;
}

function FullScreen() {

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