'use strict';

var PlayScene = require('./play_scene.js');
var MenuScene = require('./menu.js');



var BootScene = {
  preload: function () {
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.game.load.baseURL = 'https://raw.githubusercontent.com/RodrigoManuelPerez/TrepacepaDigDug/master/src/';
    this.game.load.crossOrigin = 'anonymous';

    //AUDIO
        //SAMPLES
    this.game.load.audio('Death', ['music/Sounds/Death.ogg']);
    this.game.load.audio('Item', ['music/Sounds/Item.ogg']);
    this.game.load.audio('Win', ['music/Sounds/Win.ogg']);
    this.game.load.audio('Acept', ['music/Sounds/Acept.ogg']);
    this.game.load.audio('Switch', ['music/Sounds/Switch.ogg']);
    this.game.load.audio('Points', ['music/Sounds/Points.ogg']);
    this.game.load.audio('Dragon', ['music/Sounds/Dragon.ogg']);
    this.game.load.audio('Rock', ['music/Sounds/Rock.ogg']);
    this.game.load.audio('Taser', ['music/Sounds/Taser.ogg']);
    this.game.load.audio('Pop', ['music/Sounds/Pop.ogg']);

        //MUSICA
    this.game.load.audio('MusicGame', ['music/Music/GameSong.ogg']);
    this.game.load.audio('MusicGameSpeedUp', ['music/Music/GameSongSpeedUp.ogg']);
    this.game.load.audio('MenuSong', ['music/Music/MenuSong.ogg']);
    
    //IMAGENES Y SPRITESHEETS

    this.game.load.spritesheet('DigDugWalking', 'images/WalkAnim.png', 36, 36, 11);
    this.game.load.spritesheet('P', 'images/PookaSpriteSheet.png', 36, 36, 10);  
    this.game.load.spritesheet('F', 'images/FygarSpriteSheet.png', 36, 36, 11);
    this.game.load.spritesheet('RocaCompletaSpriteSheet', 'images/RocaCompleta.png', 40, 47, 14);
    this.game.load.spritesheet('Bufos', 'images/Bufos.png', 40, 40, 18);  
    this.game.load.spritesheet('FlorSpriteSheet', 'images/florAnim.png', 42, 46, 2);
    this.game.load.spritesheet('FlorBlancaSpriteSheet', 'images/florAnimBlanca.png', 42, 46, 2);

    this.game.load.image('1Fire', 'images/1FrameFire.png');
    this.game.load.spritesheet('2', 'images/2FramesFire.png', 80, 40, 2);
    this.game.load.spritesheet('3', 'images/3FramesFire.png', 120, 40, 3);
    this.game.load.spritesheet('V', 'images/2FramesFireVertical.png', 40, 80, 2);    //HAY QUE INCLUIR LOS CASOS CONCRETOS EN LOS QUE EL FUEGO ESTÁ VERTICAL PORQUE
    this.game.load.spritesheet('B', 'images/3FramesFireVertical.png', 40, 120, 3);   //AUNQUE SE ROTE EL SPRITE NO SE ROTA SU BOUNDING BOX Y GENERA PROBLEMAS AL INTENTAR GENERAR COLISION
  

    //DIFERENTES TIPOS DE TIERRA
    this.game.load.image('tierraSuperficie', 'images/TierraCSuperrficie.png');
    this.game.load.image('tierraHSuperficie', 'images/LaminaTierraSuperficial.png');
    this.game.load.image('tierraVSuperficie', 'images/LaminaTierraVSuperficial.png');

    this.game.load.image('tierraIntermedia', 'images/TierraCIntermedia.png');
    this.game.load.image('tierraHIntermedia', 'images/LaminaTierraIntermedia.png');
    this.game.load.image('tierraVIntermedia', 'images/LaminaTierraVIntermedia.png');

    this.game.load.image('tierraInferior', 'images/TierraCInferior.png');
    this.game.load.image('tierraHInferior', 'images/LaminaTierraInferior.png');
    this.game.load.image('tierraVInferior', 'images/LaminaTierraVInferior.png');

    //BOTONES FULLSCREEN
    this.game.load.image('FullScreenButton', 'images/GoFullScreen.png');
    this.game.load.image('NormalScreenButton', 'images/ExitFullScreen.png');

    //BOTONES MUTE
    this.game.load.image('MuteButton', 'images/MuteButton.png');
    this.game.load.image('DeMuteButton', 'images/DeMuteButton.png');

    this.game.load.image('Gancho', 'images/Gancho.png');

    this.game.load.image('Banderita', 'images/Bandera.png');

    this.game.load.image('Controles', 'images/Controles.png')


    //COSAS DEL MENU
    this.game.load.image('MenuFondo', 'images/Menu.png');
    this.game.load.image('MenuFlecha', 'images/Flecha.png');
  },

  create: function () {
    //this.game.state.start('menu');
    this.game.state.start('play');
  }
};

var wfconfig = {
  // el método que invoca Google font al terminar de cargar la fuente.
  active: function() {
      init(); //llamada al método de creación de Phaser.
  },

  google: {
      families: ['Press Start 2P'] //la fuente o fuentes a cargar
  }

};

window.localStorage.setItem('highscore', '0');

window.onload = function () {
  
  WebFont.load(wfconfig);

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', MenuScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};