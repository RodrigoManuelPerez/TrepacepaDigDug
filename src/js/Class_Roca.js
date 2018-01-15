'use strict';

var GameObject = require('./Class_GameObject.js');
var PlayScene = require('./play_scene.js');

var Roca = function(game, position, id, spritesheet) {
    
    GameObject.apply(this, [game ,position, spritesheet[0], id, spritesheet]);
    
        this.animations.add('Shaking', [0, 1], 5, true);
        this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        
        this._PuntosEnemigos = [1000, 2500, 4000, 6000, 80000, 10000, 12000, 15000];

        this._Broken = false;
        this._PuntosConseguidos = 0;
        this._PuntosActualizados = false;
        this._PuntosContabilizados = false;

        this._EnemigosDestruidos = false;

        this._RefPlayer;
        this._PlayerAplastado = false;
        this._i;
        this._indicePlayer = 0;
        this._PlayerMovido = false;
        this._PlayerMuerto = false;

        this._Falling = false;
        this._HasFallen = false;
        this._FallEnable = true;
        this._timer = this.game.time.create(false);


        this._PointsSound = game.add.audio('Points', 1);
        this._StopSound = game.add.audio('Rock', 1);
        }
    
        Roca.prototype = Object.create(GameObject.prototype);
        Roca.prototype.constructor = Roca;
    
        Roca.prototype.update = function() {
            if (this._Falling && this._FallEnable) {
                for (var i = 0; i < 6; i++) {
                    if (this._Falling && this.y < 558) {
                        this.y ++;
                        if (this._PlayerAplastado)
                            this._RefPlayer.y++;
                    }
                    else if (this._Falling && this.y > 556)
                        this.Para();
                }
            }
        }
    
        Roca.prototype.Para = function() {
            
            this._StopSound.play();
            this.animations.stop('Shaking');
            this._Falling = false;
            this._HasFallen = true;

            this._timer.add(4000, BreakRock, this);

            //Si la roca no ha cogido ningun monstruo se llama a la cinemática normal de romperse
            if (this.children.length == 0 && !this._PlayerAplastado) { 
                this.animations.play('Breaking');
            }
            else
            {
                if (this._PlayerAplastado && !this._PlayerMuerto) {
                    this._PlayerMuerto = true;
                    this._RefPlayer.Muerte();
                    this._timer.add(100, BreakRock, this);
                }
                else
                {
                    this._i = this.children.length + 5;
                    if (this._i < 14) {
                        this._PuntosConseguidos = this._PuntosEnemigos[this.children.length - 1];
                        this._PuntosActualizados = true;
                    }
                    else
                    {
                        this._PuntosConseguidos = this._PuntosEnemigos[7];
                        this._PuntosActualizados = true;               
                    }
                    if (!this._EnemigosDestruidos) {
                        this._timer.add (2000, DestroyEnemies, this, this._i);
                        this._EnemigosDestruidos = true;
                    }
                }
            }
            this._timer.start();
            this.body.enable = false;
        }
    
        Roca.prototype.EnableFall = function() {
            this.animations.play('Shaking');
            this._timer.add(2000, Fall, this);
            this._timer.start();
        }
    
        function Fall() {
            if (!this._HasFallen && this._FallEnable) {
                this._Falling = true;
                this._timer.stop();
            }
        }
        function BreakRock() {
            if (this._PlayerAplastado && !this._PlayerMovido) {
                this._RefPlayer.y -= 25;
                this._RefPlayer.x = this.x + this.width / 2;
                this._PlayerMovido = true;
            }
            this.destroy();
        }

        function DestroyEnemies(I) {
            for (var j = this.children.length - 1; j >= 0; j--) {
                this.children[j].destroy();
            }
            if (I < 14)
                this.frame = I;
            else
                this.frame = 13;

            this._PointsSound.play();
        }
module.exports = Roca;