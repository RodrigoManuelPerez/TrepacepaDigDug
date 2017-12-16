'use strict';

var GameObject = require('./Class_GameObject.js');

var Roca = function(game, position, sprite,id, spritesheet){
    
    GameObject.apply(this, [game ,position, sprite, id, spritesheet]);
    
        this.animations.add('Shaking', [0, 1], 5, true);
        this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        //this._animShake.play(5,true);

        this._game = game;
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
                    if (this._Falling /*&& this._id=='Collider'*/ && this.y<558){
                        this.y ++;
                    }
                }
            }
            if (this.y > 556)
                this.Para();
        }
    
        Roca.prototype.Para=function() {
            
            this.animations.stop('Shaking');
            this.animations.play('Breaking');
            this._Falling = false;
            this._HasFallen = true;
            this._timer.loop(4000,BreakRock,this);
            //DENTRO DE UNA FUNCION PROPIA DE LA ROCA A LO MEJOR SI FUNCIONA PORQUE UNA FUNCION EXTERNA A LO MEJOR NO PUEDE ACCEDER
            game.RocasCaidas++;
            console.debug(game.RocasCaidas);
            this._timer.start();
    
            this.body.enable=false;
            //Y SE LLAMARIA AL DESTRUCTOR DE ESTE OBJETO EL CUAL CONTARA CON UNA ANIMACION SI NO SE ACTIVA UN BOOL DE HABER COGIDO ENEMIGO O SIMPLEMENTE IRA COGIENDO HIJOS Y
            // LOS PARARA Y AL DESTRUIRSE ÉL DESTRUIRA A LOS HIJOS
            
        }
    
        Roca.prototype.EnableFall=function() {
            this.animations.play('Shaking');
            this._timer.loop(2000,Fall,this);
            this._timer.start();
        }
    
        function Fall() {
            if(!this._HasFallen){
                this._Falling = true;
                this._timer.stop();

            }
        }
        function BreakRock(){
            this.Destroy();
        }

module.exports = Roca;