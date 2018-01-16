'use strict';

var PlayScene = require('./play_scene.js');

var _SwitchSound;
var _AceptSound;
var _AtControls=false;
var _PosicionSuperior; 
var _PosicionInferior;
var _PosicionFlecha = true;

var _timerControl;
var _Eleccion = false;
var _menu;
var _Flechita;
var _Controls

var _RockSprite;
var _RockAnim;
var _PlayerSprite
var _PlayerWalking;
var _VegetableSprite;
var _VegetablePop;
var _EnemySprite; 
var _EnemyWalking;
var _FygarSprite;
var _FygarWalking;
var _musicaMenu;


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
    this._parpadeando=false;
    this._cursors;
    this._FullScreenButton;
    this._ButtonCreated = false;
    _AtControls=false;
    _PosicionFlecha=true;
    _Eleccion=false;
    

    this._scoreStringA;
    this._scoreTextA;
    this._highScoreText;

    _timerControl = this.game.time.create(false);

    _PosicionSuperior = new Par(300,330);
    _PosicionInferior = new Par(300,400);

    _musicaMenu = this.game.add.audio('MenuSong', 1, true); //key, volume, loop
    _musicaMenu.play();

    //SOUNDS
    _SwitchSound = this.game.add.audio('Switch');
    _AceptSound = this.game.add.audio('Acept');

    //Inicializar los cursores.
    this._cursors = this.game.input.keyboard.createCursorKeys();
    
    _menu = new Phaser.Sprite(this.game, 0, 600, 'MenuFondo');
    _menu.anchor.x = 0;
    _menu.anchor.y = 0;
    _Flechita = new Phaser.Sprite(this.game, _PosicionSuperior._x, _PosicionSuperior._y, 'MenuFlecha');
    _Flechita.anchor.x = 0;
    _Flechita.anchor.y = 0;
    _Flechita.visible = false;
    this.game.world.addChild(_menu);
    this.game.world.addChild(_Flechita);
    
    //Control de puntuaciones
    this._scoreStringA = 'HI - SCORE: ';
    this._scoreTextA = this.game.add.text(20, 20, this._scoreStringA, { font: '25px Arial', fill: '#fff' });
    this._scoreTextA.visible = false;
    this._highScoreText = this.game.add.text(180, 20, '0', { font: "bold 25px Arial", fill: "#46c0f9", align: "center" });
    this._highScoreText.visible = false;
    this._highScoreText.text = localStorage.getItem("highscore");
    
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;


    


},
    update: function() {

        if(_menu.y > 0){
            _menu.y -= 2;
        }
        else if(!this._parpadeando){
            this._parpadeando = true;
            this._scoreTextA.visible = true;
            this._highScoreText.visible = true;
            var timerFlecha = this.game.time.create(false);
            timerFlecha.loop(250, switchFlechita, this);
            timerFlecha.start();
        }

        this.game.input.keyboard.game.input.keyboard.onDownCallback = function(key){

            ////////////////////MOVIMIENTO FLECHAS/////////////////
                if (_menu.y == 0 && !_Eleccion && !_AtControls){
                    if (key.keyCode === Phaser.KeyCode.W || key.keyCode === 38){
                        if (_Flechita.y == _PosicionInferior._y){
                            _SwitchSound.play();
                            _Flechita.y = _PosicionSuperior._y;
                            _PosicionFlecha = true;
                        }
                    }
                    if (key.keyCode === Phaser.KeyCode.S || key.keyCode === 40){
                        if (_Flechita.y == _PosicionSuperior._y){
                            _SwitchSound.play();
                            _Flechita.y = _PosicionInferior._y;
                            _PosicionFlecha = false;
                        }
                    }
                }
        
                //////////////////ELECCION//////////////
                if (!_AtControls) {
                    if (key.keyCode === Phaser.KeyCode.ENTER || key.keyCode === Phaser.KeyCode.SPACEBAR){
                        if (_menu.y > 0)
                            _menu.y = 0;
                        else {
                            if (!_Eleccion)
                                _AceptSound.play();  //The acept sound will sound
                            _Eleccion = true;
                            _timerControl.add(1500,Comienzo,this,this.game);
                            _timerControl.start();
                        }
                    }
                }
                else {
                    if (key.keyCode === Phaser.KeyCode.ESC) {
                        this.game.state.start('menu');
                    }
                }
            }
        
        if (_menu.y <= 0 && !this._ButtonCreated){
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



        if (_Eleccion) {
            if (_musicaMenu.volume > 0)
            _musicaMenu.volume -= 0.012;
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
    if (_PosicionFlecha) {
        _AceptSound.destroy();       //NO seria asi pero no consigo eliminar el sonido
        _musicaMenu.stop();
        g.state.start('play');
        
    }
    else {       //Los creditos o controles
        _AtControls = true;
        Controles(g);
    }
}

function Controles(g) {
    
    _Controls = new Phaser.Sprite(g, 0, 0, 'Controles');
    _Controls.anchor.x = 0;
    _Controls.anchor.y = 0;
    g.world.addChild(_Controls);

    _RockSprite = new Phaser.Sprite(g, RockSpritePosX, RockSpritePosY, 'RocaCompletaSpriteSheet');
    _RockSprite.frame = 1;
    _RockSprite.width = RockSpriteDimensions * _RockSprite.width;
    _RockSprite.height = RockSpriteDimensions * _RockSprite.height;
    _RockSprite.anchor.x = 0.5;
    _RockSprite.anchor.y = 0.5;
    g.world.addChild(_RockSprite);

    _PlayerSprite = new Phaser.Sprite(g, PlayerSpritePosX, PlayerSpritePosY, 'DigDugWalking');
    _PlayerSprite.frame = 1;
    _PlayerSprite.width = PlayerSpriteDimensions * _PlayerSprite.width;
    _PlayerSprite.height = PlayerSpriteDimensions * _PlayerSprite.height;
    _PlayerSprite.anchor.x = 0.5;
    _PlayerSprite.anchor.y = 0.5;
    g.world.addChild(_PlayerSprite);

    _VegetableSprite = new Phaser.Sprite(g, VegetableSpritePosX, VegetableSpritePosY, 'Bufos');
    _VegetableSprite.frame = 1;
    _VegetableSprite.width = VegetableSpriteDimensions * _VegetableSprite.width;
    _VegetableSprite.height = VegetableSpriteDimensions * _VegetableSprite.height;
    _VegetableSprite.anchor.x = 0.5;
    _VegetableSprite.anchor.y = 0.5;
    g.world.addChild(_VegetableSprite);

    _EnemySprite = new Phaser.Sprite(g, EnemySpritePosX, EnemySpritePosY, 'P');
    _EnemySprite.frame = 1;
    _EnemySprite.width = -EnemySpriteDimensions * _EnemySprite.width;
    _EnemySprite.height = EnemySpriteDimensions * _EnemySprite.height;
    _EnemySprite.anchor.x = 0.5;
    _EnemySprite.anchor.y = 0.5;
    g.world.addChild(_EnemySprite);

    _FygarSprite = new Phaser.Sprite(g, FygarSpritePosX, FygarSpritePosY, 'F');
    _FygarSprite.frame = 1;
    _FygarSprite.width = -FygarSpriteDimensions * _FygarSprite.width;
    _FygarSprite.height= FygarSpriteDimensions * _FygarSprite.height;
    _FygarSprite.anchor.x = 0.5;
    _FygarSprite.anchor.y = 0.5;
    g.world.addChild(_FygarSprite);

    _RockAnim = _RockSprite.animations.add('Shaking', [0, 1], 5, true);
    _RockAnim.play();
    _PlayerWalking = _PlayerSprite.animations.add('Walking', [0, 1], 6, true);
    _PlayerWalking.play();
    _VegetablePop = _VegetableSprite.animations.add('ShowVegetables', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
    _VegetablePop.play();
    _EnemyWalking = _EnemySprite.animations.add('Walking', [0, 1], 6, true);
    _EnemyWalking.play();
    _FygarWalking = _FygarSprite.animations.add('Walking', [0, 1], 6, true);
    _FygarWalking.play();

}

function switchFlechita() {
    if (!_Eleccion)
        _Flechita.visible = !_Flechita.visible;
    else
        _Flechita.visible = true;
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