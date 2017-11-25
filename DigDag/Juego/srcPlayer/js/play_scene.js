//var Player = require('./Player.js')

var player;
var Arma;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra;
var roca;
var distanceX,distanceY;
var paredDerecha, paredSuperior;

var PlayScene ={
    create: function(){
        this.game.physics.startSystem(Phaser.ARCADE);
        //Como se pinta lineal por orden, seria primero la tierra, las pared de la derecha (el limite derecho), y después el jugador

        //Pared de la derecha para generar la colision y la superior
        paredDerecha = new Phaser.Sprite(this.game,513,0, 'latDer')
        paredDerecha.anchor.x=0;
        paredDerecha.anchor.y=0;
        paredSuperior = new Phaser.Sprite(this.game,0,0, 'latSup')
        paredSuperior.anchor.x=0;
        paredSuperior.anchor.y=0;
        this.game.world.addChild(paredDerecha);
        this.game.world.addChild(paredSuperior);

        //paredDerecha.visible=false;
        //paredSuperior.visible=false;

        //Limite derecho
        limiteDerecho = 513;
        limiteSuperior = 44;

        //Distancias recorridas
        distanceX=0;
        distanceY=0;

        //Arma DigDag
        //Arma = 

        //Cursores
        cursors= this.game.input.keyboard.createCursorKeys();

        //Tierra


        //Cualidad de la posicion del player
        var PosPlayer = new Par(473,40);
        var VelPlayer = new Par(0,0);
        var DirPlayer = new Par(0,0);
        player = new Player(this.game,PosPlayer,'DigDug',VelPlayer,DirPlayer,cursors,limiteDerecho, limiteSuperior, distanceX, distanceY);
        this.game.world.addChild(player);


        //Motor físico de Phaser
   
        //Colisiones
                //this.game.physics.enable([player,roca], Phaser.Physics.ARCADE);

        //Objetos que no se mueven
        /*paredDerecha.body.immovable = true;
        paredSuperior.body.immovable = true;
*/
    },
    update: function(){
        //this.game.physics.arcade.overlap(ball, pared1, collisionHandler, null, this);   
        //COLISION HANDLER ES UNA AUXILIAR PARA LA COLISION DE LA PELOTA CON EL RESTO DE COSAS, HABRIA QUE HACER UN METODO PARA LAS COLISIONES CON LA ROCA POR EJEMPLO

    },
    render: function(){

    }
}

module.exports = PlayScene;


//Se encarga de las colisiones
var collisionHandler = function(obj1, obj2)
{
     this.game.physics.arcade.collide(obj1, obj2);
     //La pelota rebota en algo
     if(Object.getPrototypeOf(obj1).hasOwnProperty('bounce'))
        obj1.bounce(obj2);
     else if (Object.getPrototypeOf(obj2).hasOwnProperty('bounce'))
        obj2.bounce(obj1);
        
}

function Par(x,y){
    this._x=x;
    this._y=y;
}


//LA CLASE MOVABLE HEREDA DE SPRITE
function Movable(game, position, sprite, velocity, DirPlayer)
{
    Phaser.Sprite.apply(this, [game ,position._x, position._y, sprite]);
    this._velocity = velocity;
}

Movable.prototype = Object.create(Phaser.Sprite.prototype);
Movable.prototype.constructor = Movable;


//Funciones de movable
Movable.prototype.setVelocity = function(velocity) //Cambia la velocidad
{
    this._velocity._x = velocity._x;
    this._velocity._y = velocity._y;
}


Movable.prototype.update = function() //Para la DeadZone
{
    
}


//--------------------------------------------------------------------------------------------------------------------------------------------------


function Player(game, position, sprite, velocity,DirPlayer, cursors, limiteDerecho, limiteSuperior, distanceX, distanceY)
{
    Movable.apply(this, [game, position, sprite, velocity, DirPlayer]);
    
    this._dirX=DirPlayer._x;
    this._dirY=DirPlayer._y;

    this._distanceX=distanceX;
    this._distanceY=distanceY;


    this._cursors = cursors;
    //this._gunbutton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    //se podria hacer track sprite para que nuestro gancho siguiera por detras a digdug
    //this._playerWeapon.trackSprite(this, 0, 0);
    this._LimiteSuperior = limiteSuperior;
    this._LimiteDerecho = limiteDerecho;
}

Player.prototype = Object.create(Movable.prototype);
Player.prototype.constructor = Player;

//Funciones de jugador
    Player.prototype.Input = function() //Mueve el jugador a la izquierda
    {
    //Comprobación de cursores de Phaser
    if (this._cursors.left.isDown && this.x > 0)
    {
        this._dirX=-1;

        if(this._distanceY==0){
            this.x -= 1;
            this._distanceX -=1;
        }
        else if (this._dirY==1){
            if(this.y < 600 - this.height){
                this.y +=1;
                this._distanceY +=1;
            }
        }
        else if (this._dirY==-1){
            if(this.y > this.height){
                this.y -=1;
                this._distanceY -=1;
            }
        }
    }
    else if (this._cursors.right.isDown && this.x < this._LimiteDerecho-this.width)
    {
        
        this._dirX=1;

        if(this._distanceY==0){
            this.x += 1;
            this._distanceX +=1;
        }
        else if (this._dirY==1){
            if(this.y < 600 - this.height){
                this.y +=1;
                this._distanceY +=1;
            }
        }
        else if (this._dirY==-1){
            if(this.y > this.height){
                this.y -=1;
                this._distanceY -=1;
            }
        }
    }
    else if (this._cursors.down.isDown && this.y < 600 - this.height)
    {   

        this._dirY=1;

        if(this._distanceX==0){
            this.y += 1;
            this._distanceY +=1;
        }
        else if (this._dirX==1){
            if(this.x < this._LimiteDerecho-this.width){
                this.x +=1;
                this._distanceX +=1;
            }
        }
        else if (this._dirX==-1){
            if(this.x > 0){
                this.x -=1;
                this._distanceX -=1;
            }
        }
    }
    else if (this._cursors.up.isDown && this.y >this.height)
    {   

        this._dirY=-1;

        if(this._distanceX==0){
            this.y -= 1;
            this._distanceY -=1;
        }
        else if (this._dirX==1){
            if(this.x < this._LimiteDerecho-this.width){
                this.x +=1;
                this._distanceX +=1;
            }
        }
        else if (this._dirX==-1){
            if(this.x > 0){
                this.x -=1;
                this._distanceX -=1;
            }
        }
    }

    if (this._distanceX>42 || this._distanceX<-42)
        this._distanceX=0;
    if (this._distanceY>42 || this._distanceY<-42)
        this._distanceY=0;
    }

    /*if(this._fireButton.isDown)
    {
        this._playerWeapon.fire();
    }*/
    Player.prototype.update=function(){
        this.Input();
        
    }


