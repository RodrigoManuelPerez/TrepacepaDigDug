'use strict';

var PlayScene = require('./play_scene.js');
var MenuScene = require('./menu.js');

var BootScene = {
  preload: function () {
    //this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
     
    // this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    // this.loadingBar.anchor.setTo(0, 0.5);
    // this.load.setPreloadSprite(this.loadingBar);
    

    this.game.load.baseURL = 'https://raw.githubusercontent.com/RodrigoManuelPerez/TrepacepaDigDug/master/src/';
    this.game.load.crossOrigin = 'anonymous';


    //AUDIO

        //SAMPLES


        //MUSICA
    this.game.load.audio('running90s', ['music/Initial_D_Running_in_The_90s.mp3', 'music/Initial_D_Running_in_The_90s.ogg']);
    
    
    //IMAGENES Y SPRITESHEETS

    this.game.load.spritesheet('DigDugWalking', 'images/WalkAnim.png', 36, 36, 10);
    this.game.load.spritesheet('P', 'images/PookaSpriteSheet.png', 36, 36, 10);   //EL SPRITESHEET DEL POOKA SOLO TIENE 9 FRAMES EN REALIDAD
    this.game.load.spritesheet('F', 'images/FygarSpriteSheet.png', 36, 36, 10);
    this.game.load.spritesheet('RocaCompletaSpriteSheet', 'images/RocaCompleta.png', 40, 47, 14);
    this.game.load.spritesheet('Bufos', 'images/Bufos.png', 40, 40, 18);  //SpriteSheet de los buffos, se cogeran segun el nivel
    this.game.load.spritesheet('FlorSpriteSheet', 'images/florAnim.png', 42, 46, 2);

    this.game.load.image('1Fire', 'images/1FrameFire.png');
    this.game.load.spritesheet('2', 'images/2FramesFire.png', 80, 40, 2);
    this.game.load.spritesheet('3', 'images/3FramesFire.png', 120, 40, 3);

    //this.game.load.image('Flor', 'images/flor.png');

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

    this.game.load.image('Gancho', 'images/Gancho.png');

    this.game.load.image('Banderita', 'images/Bandera.png');

    //this.game.load.image('col', 'images/RocaColl.png')


    //COSAS DEL MENU
    this.game.load.image('MenuFondo', 'images/Menu.png');
    this.game.load.image('MenuFlecha', 'images/Flecha.png');
  },

  create: function () {
    this.game.state.start('menu');
    //this.game.state.start('play');
  }
};

window.localStorage.setItem( 'highscore', '0' );

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', MenuScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};