'use strict';

var PlayScene = require('./play_scene.js');

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
     
    //this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    //this.loadingBar.anchor.setTo(0, 0.5);
    //this.load.setPreloadSprite(this.loadingBar);
    

    this.game.load.baseURL = 'https://rodrigomanuelperez.github.io/TrepacepaDigDug/src/';
    this.game.load.crossOrigin = 'anonymous';

    this.game.load.audio('running90s', ['music/Initial_D_Running_in_The_90s.mp3', 'music/Initial_D_Running_in_The_90s.ogg']);
    // TODO: load here the assets for the game

    this.game.load.spritesheet('DigDugWalking', 'images/WalkAnim.png', 36, 36, 2);
    this.game.load.spritesheet('RocaCompletaSpriteSheet', 'images/RocaCompleta.png', 40, 47, 6);

    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('DigDug', 'images/DigDugC.png');
    this.game.load.image('latDer', 'images/latDerecho.png');
    this.game.load.image('latSup', 'images/latSuperior.png');
    this.game.load.image('tierra', 'images/TierraC.png');
    this.game.load.image('tierraH', 'images/LaminaTierra.png');
    this.game.load.image('tierraV', 'images/LaminaTierraV.png');
    //this.game.load.image('Roca', 'images/RocaC.png');

    this.game.load.image('Slime', 'images/Slime.png');

    this.game.load.image('Gancho', 'images/Gancho.png');
    
    this.game.load.image('RocaCompleta', 'images/PiedraColl.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};