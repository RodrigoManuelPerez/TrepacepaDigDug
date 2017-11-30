'use strict';

var PlayScene = require('./play_scene.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    //this.game.load.baseURL = 'https://rodrigomanuelperez.github.io/TrepacepaDigDug/src/';
    //this.game.load.crossOrigin = 'anonymous';
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


    this.game.load.baseURL = 'https://rodrigomanuelperez.github.io/TrepacepaDigDug/src/';
    this.game.load.crossOrigin = 'anonymous';
    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('DigDug', 'images/DigDugC.png');
    this.game.load.image('latDer', 'images/latDerecho.png');
    this.game.load.image('latSup', 'images/latSuperior.png');
    this.game.load.image('tierra', 'images/TierraC.png');
    this.game.load.image('tierraH', 'images/LaminaTierra.png');
    this.game.load.image('tierraV', 'images/LaminaTierraV.png');
    this.game.load.image('Roca', 'images/RocaC.png');
    this.game.load.image('RocaColl', 'images/RocaColl.png');

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