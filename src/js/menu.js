'use strict';

var PlayScene = require('./play_scene.js');

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

    //DECLARACION DE VARIABLES    
    this._musicaMenu;
    this._menu;
    this._Flechita;
    this._parpadeando=false;
    this._cursors;
    this._PosicionSuperior; this._PosicionInferior;
    this._PosicionFlecha = true;

    this._timerControl;
    this._Eleccion = false;
    this._FullScreenButton;
    this._ButtonCreated = false;
    this._SwitchSound;
    this._AceptSound;
    this._Controls;
    this._AtControls=false;

    this._RockSprite;
    this._RockAnim;
    this._PlayerSprite
    this._PlayerWalking;
    this._VegetableSprite;
    this._VegetablePop;
    this._EnemySprite; 
    this._EnemyWalking;
    this._FygarSprite;
    this._FygarWalking;

    this._scoreStringA;
    this._scoreTextA;
    this._highScoreText;

    this._timerControl = this.game.time.create(false);

    this._PosicionSuperior = new Par(300,330);
    this._PosicionInferior = new Par(300,400);

    this._musicaMenu = this.game.add.audio('MenuSong', 1, true); //key, volume, loop
    this._musicaMenu.play();

    //SOUNDS
    this._SwitchSound = this.game.add.audio('Switch');
    this._AceptSound = this.game.add.audio('Acept');

    //Inicializar los cursores.
    this._cursors = this.game.input.keyboard.createCursorKeys();
    
    this._menu = new Phaser.Sprite(this.game, 0, 600, 'MenuFondo');
    this._menu.anchor.x = 0;
    this._menu.anchor.y = 0;
    this._Flechita = new Phaser.Sprite(this.game, this._PosicionSuperior._x, this._PosicionSuperior._y, 'MenuFlecha');
    this._Flechita.anchor.x = 0;
    this._Flechita.anchor.y = 0;
    this._Flechita.visible = false;
    this.game.world.addChild(this._menu);
    this.game.world.addChild(this._Flechita);
    
    //Control de puntuaciones
    this._scoreStringA = 'HI - SCORE: ';
    this._scoreTextA = this.game.add.text(20, 20, this._scoreStringA, { font: '25px Arial', fill: '#fff' });
    this._scoreTextA.visible = false;
    this._highScoreText = this.game.add.text(180, 20, '0', { font: "bold 25px Arial", fill: "#46c0f9", align: "center" });
    this._highScoreText.visible = false;
    this._highScoreText.text = localStorage.getItem("highscore");
    
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
},
    update: function() {

        if(this._menu.y > 0){
            this._menu.y -= 2;
        }
        else if(!this._parpadeando){
            this._parpadeando = true;
            this._scoreTextA.visible = true;
            this._highScoreText.visible = true;
            var timerFlecha = this.game.time.create(false);
            timerFlecha.loop(250, switchFlechita, this);
            timerFlecha.start();
        }
        
        if (this._menu.y <= 0 && !this._ButtonCreated){
            this._ButtonCreated = true;
            this._FullScreenButton = this.game.add.button(20, 60, 'FullScreenButton', FullScreen, this);
        }
        
        if (this._ButtonCreated) {
            if (this.game.scale.isFullScreen)
            {
                this._FullScreenButton.loadTexture('NormalScreenButton');
            }
            else
            {
                this._FullScreenButton.loadTexture('FullScreenButton');
            }
        }

        if (this._Eleccion) {
            if (this._musicaMenu.volume > 0)
            this._musicaMenu.volume -= 0.012;
        }


        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onDownCallback = function(key){

            ////////////////////MOVIMIENTO FLECHAS/////////////////
            if (this._menu.y == 0 && !this._Eleccion && !this._AtControls){
                if (key.keyCode === Phaser.KeyCode.W || key.keyCode === 38){
                    if (this._Flechita.y == this._PosicionInferior._y){
                        this._SwitchSound.play();
                        this._Flechita.y = this._PosicionSuperior._y;
                        this._PosicionFlecha = true;
                    }
                }
                if (key.keyCode === Phaser.KeyCode.S || key.keyCode === 40){
                    if (this._Flechita.y == this._PosicionSuperior._y){
                        this._SwitchSound.play();
                        this._Flechita.y = this._PosicionInferior._y;
                        this._PosicionFlecha = false;
                    }
                }
            }

            //////////////////ELECCION//////////////
            if (!this._AtControls) {
                if (key.keyCode === Phaser.KeyCode.ENTER || key.keyCode === Phaser.KeyCode.SPACEBAR){
                    if (this._menu.y > 0)
                        this._menu.y = 0;
                    else {
                        if (!this._Eleccion)
                            this._AceptSound.play();  //The acept sound will sound
                        this._Eleccion = true;
                        this._timerControl.add(1500,Comienzo,this,this.game);
                        this._timerControl.start();
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
    if (this._PosicionFlecha) {
        this._AceptSound.destroy();       //NO seria asi pero no consigo eliminar el sonido
        this._Menu.stop();
        g.state.start('play');
        
    }
    else {       //Los creditos o controles
        this._AtControls = true;
        Controles(g);
        console.debug("hello");
    }
}

function Controles(g) {
    
    this._Controls = new Phaser.Sprite(g, 0, 0, 'Controles');
    this._Controls.anchor.x = 0;
    this._Controls.anchor.y = 0;
    g.world.addChild(this._Controls);

    this._RockSprite = new Phaser.Sprite(g, RockSpritePosX, RockSpritePosY, 'RocaCompletaSpriteSheet');
    this._RockSprite.frame = 1;
    this._RockSprite.width = RockSpriteDimensions * this._RockSprite.width;
    this._RockSprite.height = RockSpriteDimensions * this._RockSprite.height;
    this._RockSprite.anchor.x = 0.5;
    this._RockSprite.anchor.y = 0.5;
    g.world.addChild(this._RockSprite);

    this._PlayerSprite = new Phaser.Sprite(g, PlayerSpritePosX, PlayerSpritePosY, 'DigDugWalking');
    this._PlayerSprite.frame = 1;
    this._PlayerSprite.width = PlayerSpriteDimensions * this._PlayerSprite.width;
    this._PlayerSprite.height = PlayerSpriteDimensions * this._PlayerSprite.height;
    this._PlayerSprite.anchor.x = 0.5;
    this._PlayerSprite.anchor.y = 0.5;
    g.world.addChild(this._PlayerSprite);

    this._VegetableSprite = new Phaser.Sprite(g, VegetableSpritePosX, VegetableSpritePosY, 'Bufos');
    this._VegetableSprite.frame = 1;
    this._VegetableSprite.width = VegetableSpriteDimensions * this._VegetableSprite.width;
    this._VegetableSprite.height = VegetableSpriteDimensions * this._VegetableSprite.height;
    this._VegetableSprite.anchor.x = 0.5;
    this._VegetableSprite.anchor.y = 0.5;
    g.world.addChild(this._VegetableSprite);

    this._EnemySprite = new Phaser.Sprite(g, EnemySpritePosX, EnemySpritePosY, 'P');
    this._EnemySprite.frame = 1;
    this._EnemySprite.width = -EnemySpriteDimensions * this._EnemySprite.width;
    this._EnemySprite.height = EnemySpriteDimensions * this._EnemySprite.height;
    this._EnemySprite.anchor.x = 0.5;
    this._EnemySprite.anchor.y = 0.5;
    g.world.addChild(this._EnemySprite);

    this._FygarSprite = new Phaser.Sprite(g, FygarSpritePosX, FygarSpritePosY, 'F');
    this._FygarSprite.frame = 1;
    this._FygarSprite.width = -FygarSpriteDimensions * this._FygarSprite.width;
    this._FygarSprite.height= FygarSpriteDimensions * this._FygarSprite.height;
    this._FygarSprite.anchor.x = 0.5;
    this._FygarSprite.anchor.y = 0.5;
    g.world.addChild(this._FygarSprite);

    this._RockAnim = this._RockSprite.animations.add('Shaking', [0, 1], 5, true);
    this._RockAnim.play();
    this._PlayerWalking = this._PlayerSprite.animations.add('Walking', [0, 1], 6, true);
    this._PlayerWalking.play();
    this._VegetablePop = this._VegetableSprite.animations.add('ShowVegetables', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
    this._VegetablePop.play();
    this._EnemyWalking = this._EnemySprite.animations.add('Walking', [0, 1], 6, true);
    this._EnemyWalking.play();
    this._FygarWalking = this._FygarSprite.animations.add('Walking', [0, 1], 6, true);
    this._FygarWalking.play();

}

function switchFlechita() {
    if (!this._Eleccion)
        this._Flechita.visible = !this._Flechita.visible;
    else
        this._Flechita.visible = true;
}

function FullScreen() {

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
        this._FullScreenButton.loadTexture('FullScreenButton');
    }
    else
    {
        this.game.scale.startFullScreen(false);
        this._FullScreenButton.loadTexture('NormalScreenButton');
    }
}