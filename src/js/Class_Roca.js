'use strict';

var GameObject = require('./Class_GameObject.js');

var Roca = function(game, position, sprite,id){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    
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
            
            this._Falling = false;
            this._HasFallen = true;
            this._timer.loop(3500,BreakRock,this);
            this._timer.start();
    
            this.body.enable=false;
            //Y SE LLAMARIA AL DESTRUCTOR DE ESTE OBJETO EL CUAL CONTARA CON UNA ANIMACION SI NO SE ACTIVA UN BOOL DE HABER COGIDO ENEMIGO O SIMPLEMENTE IRA COGIENDO HIJOS Y
            // LOS PARARA Y AL DESTRUIRSE ÉL DESTRUIRA A LOS HIJOS
            
        }
    
        Roca.prototype.EnableFall=function() {
            this._timer.loop(1500,Fall,this);
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