//var Player = require('./Player.js')

var player;
var Arma;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var roca, rocaColl;
var distanceX,distanceY;
var paredDerecha, paredSuperior;

var PlayScene ={
    create: function(){
        this.game.physics.startSystem(Phaser.ARCADE);
        //Como se pinta lineal por orden, seria primero la tierra, las pared de la derecha (el limite derecho), y después el jugador

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
        tierra = this.game.add.physicsGroup();
        //Tierra Horizontal
        tierraH = this.game.add.physicsGroup();
        //Tierra Vertical
        tierraV = this.game.add.physicsGroup();

        //CREAMOS LA MATRIZ DE 12 * 12        
                
        for(var i = 0; i < limiteDerecho; i+=43)
        {           
            for(var j = 84; j < 594; j+=43)
            {
                var PosTierra = new Par(i, j);
                var VelTierra = new Par(0, 0);
                var BloqTierra = new Tierra(this.game, PosTierra, 'tierra',VelTierra ,'tierra'); 

                this.game.physics.arcade.enable(BloqTierra);
                BloqTierra.body.immovable = true;
    
                this.game.world.addChild(BloqTierra);
                tierra.add(BloqTierra);

            }
        }

        //CREAMOS LA TIERRA HORIZONTAL

        for(var i = -3; i < limiteDerecho; i+=43)
        {
            for(var j = 124; j < 600; j+=43)
            {
                var PosTierraH = new Par(i, j);
                var VelTierraH = new Par(0, 0);
                var BloqTierraH = new Tierra(this.game, PosTierraH, 'tierraH',VelTierraH,'tierraH'); 
                
                this.game.physics.arcade.enable(BloqTierraH);
                BloqTierraH.body.immovable = true;
    
                this.game.world.addChild(BloqTierraH);
                tierraH.add(BloqTierraH);
            }
        }

        //CREAMOS LA TIERRA VERTICAL

        var cont = 0;
        for(var i = 40; i < limiteDerecho; i+=43)
        {
            if (cont<11){
                for(var j = 84; j < 600; j+=43)
                {   
                    var PosTierraV = new Par(i, j);
                    var VelTierraV = new Par(0, 0);
                    var BloqTierraV = new Tierra(this.game, PosTierraV, 'tierraV',VelTierraV, 'tierraV'); 
                    
                    this.game.physics.arcade.enable(BloqTierraV);
                    BloqTierraV.body.immovable = true;
        
                    this.game.world.addChild(BloqTierraV);
                    tierraV.add(BloqTierraV);
                }
                cont++;
            }
        }

        //Pared de la derecha para generar la colision y la superior
        paredDerecha = new Phaser.Sprite(this.game,limiteDerecho,0, 'latDer')
        paredDerecha.anchor.x=0;
        paredDerecha.anchor.y=0;
        paredSuperior = new Phaser.Sprite(this.game,0,0, 'latSup')
        paredSuperior.anchor.x=0;
        paredSuperior.anchor.y=0;
        this.game.world.addChild(paredDerecha);
        this.game.world.addChild(paredSuperior);

        //paredDerecha.visible=false;
        //paredSuperior.visible=false;

        //CREACION DE LAS PIEDRAS
        //Creamos el grupo de las piedras
        roca = this.game.add.physicsGroup();
        rocaColl = this.game.add.physicsGroup();
                
        for(var i = 2; i < limiteDerecho; i+=43)
        {           
            for(var j = 88; j < 551; j+=43)
            {
                var a = Math.random();
                if (a<0.05){
                    var PosRock = new Par(i, j);
                    var BloqRock = new Roca(this.game, PosRock, 'Roca', 'roca'); 
                    this.game.physics.arcade.enable(BloqRock);
                    this.game.world.addChild(BloqRock);
                    roca.add(BloqRock);

                    var Collider = new Phaser.Sprite(this.game, i,j+36,'RocaColl'); 
                    //Collider.visible=false;
                    this.game.physics.arcade.enable(Collider);
                    BloqRock.addChild(Collider);
                    rocaColl.add(Collider);

                    //this.game.physics.arcade.collide(Collider, tierra, onCollisionTierra);
                }
            }
        }        

        //Cualidad de la posicion del player
        var PosPlayer = new Par(475,42);
        var VelPlayer = new Par(0,0);
        var DirPlayer = new Par(0,0);
        player = new Player(this.game,PosPlayer,'DigDug',VelPlayer,DirPlayer,cursors,limiteDerecho, limiteSuperior, distanceX, distanceY,tierra, tierraH,'player');
        
        //Comprobar a meter esto en el player y comprobar las colisiones del update
        this.game.physics.arcade.enable(player);
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
        
        
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);

        

    },
    render: function(){

    }
}


module.exports = PlayScene;

function onCollisionTierra(obj1, obj2)
{
    obj2.Destroy(); //Llamamos la la destructora de la tierra
}
function Cae(obj1, obj2)
{
    //obj.Parent.Fall(); //Llamamos la la destructora de la tierra
}

function Par(x,y){
    this._x=x;
    this._y=y;
}


//LA CLASE MOVABLE HEREDA DE SPRITE
function Movable(game, position, sprite, velocity)
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
function Player(game, position, sprite, velocity, DirPlayer, cursors, limiteDerecho, limiteSuperior, distanceX, distanceY, id, roca)
    {
    Movable.apply(this, [game, position, sprite, velocity]);
    
    this._Enable=true;

    this._id=id;

    this._dirX=DirPlayer._x;
    this._dirY=DirPlayer._y;

    this._distanceX=distanceX;
    this._distanceY=distanceY;

    this._roca = roca;

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
    if (this._cursors.left.isDown && this.x > 2)
    {
        this._dirX=-1;

        if(this._distanceY==0){
            this.x -= 1;
            this._distanceX -=1;
        }
        else if (this._dirY==1){
            if(this.y < 594 - this.height){
                this.y +=1;
                this._distanceY +=1;
            }
        }
        else if (this._dirY==-1){
            if(this.y > this.height + 6){
                this.y -=1;
                this._distanceY -=1;
            }
        }
    }
    else if (this._cursors.right.isDown && this.x < this._LimiteDerecho-this.width-2)
    {
        
        this._dirX=1;

        if(this._distanceY==0){
            this.x += 1;
            this._distanceX +=1;
        }
        else if (this._dirY==1){
            if(this.y < 594 - this.height){
                this.y +=1;
                this._distanceY +=1;
            }
        }
        else if (this._dirY==-1){
            if(this.y > this.height + 6){
                this.y -=1;
                this._distanceY -=1;
            }
        }
    }
    else if (this._cursors.down.isDown && this.y < 594 - this.height)
    {   

        this._dirY=1;

        if(this._distanceX==0){
            this.y += 1;
            this._distanceY +=1;
        }
        else if (this._dirX==1){
            if(this.x < this._LimiteDerecho-this.width-2){
                this.x +=1;
                this._distanceX +=1;
            }
        }
        else if (this._dirX==-1){
            if(this.x > 2){
                this.x -=1;
                this._distanceX -=1;
            }
        }
    }
    else if (this._cursors.up.isDown && this.y > this.height + 6)
    {   

        this._dirY=-1;

        if(this._distanceX==0){
            this.y -= 1;
            this._distanceY -=1;
        }
        else if (this._dirX==1){
            if(this.x < this._LimiteDerecho-this.width-2){
                this.x +=1;
                this._distanceX +=1;
            }
        }
        else if (this._dirX==-1){
            if(this.x > 2){
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
        //game.physics.arcade.collide(player, this._roca, this.onCollisionPlayerRock);
    }
    /*Player.prototype.onCollisionPlayerRock=function(){
        this._Enable=false;
    }

    function onCollisionPlayerRock(obj1,obj2){
        if((game.physics.arcade.collide(obj1, obj2)))
            obj1._Enable=false;
    }*/


    //CLASE BLOQUE TIERRA NORMAL----------------------------------------------------


function Tierra(game, position, sprite, velocity,id)
    {
        Movable.apply(this, [game, position, sprite, velocity]);
        this._id = id;
    }
    
    Tierra.prototype = Object.create(Movable.prototype);
    Tierra.prototype.constructor = Tierra;
    
    //Ejemplo de metodo
    Tierra.prototype.Destroy = function() //Mueve el jugador a la izquierda
    {
        this.destroy();
    }
    Tierra.prototype.update=function(){
        // if (colision) this.Destroy();
    }

function Roca(game, position, sprite, velocity, id)
    {
        Movable.apply(this, [game, position, sprite, velocity]);

        this._id=id;
        this._Falling = false;

    }
    
    Roca.prototype = Object.create(Movable.prototype);
    Roca.prototype.constructor = Roca;
    
        //Funciones de jugador
    Roca.prototype.Input = function() //Mueve el jugador a la izquierda
    {
    //Comprobación de cursores de Phaser
    }

    /*if(this._fireButton.isDown)
    {
        this._playerWeapon.fire();
    }*/
    Roca.prototype.update=function(){
        for(var i=0; i<6; i++){
            if (this._Falling && this.y<560){
                this.y ++;
            }
        }
    }
    Roca.prototype.Fall=function(){
        this._Falling=true;
    }
