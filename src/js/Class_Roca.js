'use strict';

var GameObject = require('./Class_GameObject.js');
var PlayScene = require('./play_scene.js');


var Roca = function(game, position,id, spritesheet){
    
    GameObject.apply(this, [game ,position, spritesheet[0], id, spritesheet]);
    
        this.animations.add('Shaking', [0, 1], 5, true);
        this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        
        this._PuntosEnemigos = [1000, 2500, 4000, 6000, 80000, 10000, 12000, 15000];
        this._Spritesheet = spritesheet;

        this._Broken=false;
        this._PuntosConseguidos=0;
        this._PuntosActualizados=false;
        this._PuntosContabilizados=false;

        this._PlayerAplastado = false;

        this._Falling = false;
        this._HasFallen = false;
        this._FallEnable = false;
        this._timer = this.game.time.create(false);
        }
    
        Roca.prototype = Object.create(GameObject.prototype);
        Roca.prototype.constructor = Roca;
    
        Roca.prototype.update=function(){
            if(this._Falling){
                for(var i=0; i<6; i++){
                    if (this._Falling && this.y<558){
                        this.y ++;
                    }
                }
            }
            if (this.y > 556)
                this.Para();
        }
    
        Roca.prototype.Para=function() {
            
            this.animations.stop('Shaking');
            this._Falling = false;
            this._HasFallen = true;

            this._timer.add(4000,BreakRock,this);
            if(this.children.length==0){ //Si la roca no ha cogido ningun monstruo se llama a la cinemática normal de romperse
                this.animations.play('Breaking');
            }
            else
            {
                for (var i=0; i<this.children.length; i++){
                    if(this.children[i]._id=='Player'){
                        this._PlayerAplastado=true;
                    }
                }
                console.debug(this._PlayerAplastado);
                var i = this.children.length + 5;
                console.debug(i);
                if(i<14){
                    this.Sprite=this._Spritesheet[i];
                    this._PuntosConseguidos=this._PuntosEnemigos[this.children.length-1];
                    this._PuntosActualizados=true;
                }else{
                    this.Sprite=this._Spritesheet[13]; //El maximo
                    this._PuntosConseguidos=this._PuntosEnemigos[7];
                    this._PuntosActualizados=true;               
                }
                
            }
            
            this._timer.start();
            this.body.enable=false;
            
        }
    
        Roca.prototype.EnableFall=function() {
            this.animations.play('Shaking');
            this._timer.add(2000,Fall,this);
            this._timer.start();
        }
    
        function Fall() {
            if(!this._HasFallen){
                this._Falling = true;
                this._timer.stop();
            }
        }
        function BreakRock(){
            console.debug('ahora');

            for (var j=0; j<this.children.length; j++){

                this.children[j].Destroy();

            }
            // var NºEnemigos=0;

            // if(this._PlayerAplastado){
            //     for (var i=0; i<this.children.length; i++){
            //         if(this.children[i]._id=='Player'){
            //             this.children[i]._vidas--;
            //         }
            //     }
            // }
            // else{
            //     for (var i=0; i<this.children.length; i++){
            //         if(this.children[i]._id=='Enemigo'){
            //             NºEnemigos+=1;
            //         }
            //     }
            // }
            // if(NºEnemigos>=1){
            //     game.sumaPuntos(this._PuntosEnemigos[NºEnemigos-1]);
            // }
            this.Destroy();
        }


module.exports = Roca;