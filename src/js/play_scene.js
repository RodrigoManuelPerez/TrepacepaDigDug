//var Player = require('./Player.js')
/*

COMENTARIO BLABLABLA


*/
var player;
var Arma;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var roca, rocaColl;
var distanceX, distanceY;
var paredDerecha, paredSuperior;

var playerMusic;
var cargada=false;

var PlayScene = {
    create: function() {

        //MUSICA PARA EL PLAYER AL MOVERSE
        playerMusic=this.game.add.audio('running90s');
        playerMusic.play();
        console.debug("creada");
        playerMusic.pause();
        console.debug("pausada");
        cargada=true;

        //Activar las físicas de Phaser.
        this.game.physics.startSystem(Phaser.ARCADE);
        
        

        //Poner variables a los limites.
        limiteDerecho = 513;
        limiteSuperior = 44;

        //Distancias recorridas por DigDag.
        distanceX = 0;
        distanceY = 0;

        //Arma DigDag
        //Arma = 

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Añadir la tierra.
        tierra = this.game.add.physicsGroup();
        //Poner fisicas a la tierra horizontal.
        tierraH = this.game.add.physicsGroup();
        //Poner fisicas a la tierra vertical.
        tierraV = this.game.add.physicsGroup();

        roca = this.game.add.physicsGroup();
        rocaColl = this.game.add.physicsGroup();
        
        /*
        //CREAMOS LA MATRIZ DE 12 * 12.       
        //Los saltos entre cuadrados son de  43 uds.
        */

        for(var i = 0; i < limiteDerecho; i += 43)
        {           
            for(var j = 83; j < 593; j += 43) //84
            {
                //TIERRA
                
                var PosTierra = new Par(i, j);
                var VelTierra = new Par(0, 0);
                var BloqTierra = new Tierra(this.game, PosTierra, 'tierra', VelTierra, 'tierra'); 

                this.game.physics.arcade.enable(BloqTierra);
                BloqTierra.body.immovable = true;
    
                this.game.world.addChild(BloqTierra);
                tierra.add(BloqTierra);

                //ROCAS

                var a = Math.random();
                if (a<0.03){
                    var PosColl = new Par(i, j-1);
                    var VelColl = new Par(0, 0);
                    var Coll = new Collider(this.game, PosColl, 'RocaCompleta',VelColl, 'Collider');
                    this.game.physics.arcade.enable(Coll); 
                    
                    roca.add(Coll);     //AÑADIMOS AL GRUPO 
                    //roca.add(RocaBlock);    //AÑADIMOS AL GRUPO 
                }
            }
        }
        this.game.world.add(roca);

        //CREAMOS LA TIERRA HORIZONTAL

        for(var i = -3; i < limiteDerecho; i+=43)
        {
            for(var j = 80; j < 599; j+=43)
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
        for(var i = 40; i < limiteDerecho; i += 43)
        {
            if (cont<11){
                for(var j = 83; j < 599; j += 43)
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

        //Pared de la derecha y la superior
        paredDerecha = new Phaser.Sprite(this.game, limiteDerecho, 0, 'latDer')
        paredDerecha.anchor.x = 0;
        paredDerecha.anchor.y = 0;
        paredSuperior = new Phaser.Sprite(this.game, 0, 0, 'latSup')
        paredSuperior.anchor.x = 0;
        paredSuperior.anchor.y = 0;
        paredSuperior.visible=false;
        this.game.world.addChild(paredDerecha);
        this.game.world.addChild(paredSuperior);

        //paredDerecha.visible=false;
        //paredSuperior.visible=false;



        //Cualidad de la posicion del player
        var PosPlayer = new Par(475, 42);
        var VelPlayer = new Par(0, 0);
        var DirPlayer = new Par(0, 0);
        player = new Player(this.game,PosPlayer, 'DigDug', VelPlayer, DirPlayer, cursors, limiteDerecho, limiteSuperior, distanceX, distanceY, 'Player');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        //Comprobar a meter esto en el player y comprobar las colisiones del update
        
        this.game.world.addChild(player);        
    },
    update: function(){
        //this.game.physics.arcade.overlap(ball, pared1, collisionHandler, null, this);   
        //COLISION HANDLER ES UNA AUXILIAR PARA LA COLISION DE LA PELOTA CON EL RESTO DE COSAS, HABRIA QUE HACER UN METODO PARA LAS COLISIONES CON LA ROCA POR EJEMPLO
        
        
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);
        this.game.physics.arcade.collide(player, roca, onCollisionRoca);
        this.game.physics.arcade.collide(roca, tierra, onCollisionPara);
        this.game.physics.arcade.collide(roca, tierraH, onCollisionTierra);     

    },
    render: function(){

    }
}

module.exports = PlayScene;

function onCollisionRoca(obj1, obj2)    //Colision del player con la roca que restringe el movimiento
{

    if ((obj1.x-2 == obj2.x && obj1.y<obj2.y+3)||(obj1.x-2 > obj2.x && obj1.y==obj2.y+3)||(obj1.x-2 < obj2.x && obj1.y==obj2.y+3)){ //COLISION CON LA PARTE SUPERIOR DE LA ROCA

        if (obj1._Movingleft) {
            obj1._Enableleft = false;
            obj1._dirX = 1;
        }
        else if (obj1._Movingright) {
            obj1._Enableright = false;
            obj1._dirX = -1;
        }
        else if (obj1._Movingdown) {
            obj1._Enabledown = false;
            obj1._dirY = -1
        }
        else if (obj1._Movingup) {
            obj1._Enableup = false;
            obj1._dirY = 1
        }

    }
    else {
        obj2.EnableFall();
    }
}

/*function CaeTrasTime(obj){
    obj.EnableFall();
}*/

function onCollisionTierra (obj1, obj2)
{
    if (obj1._id=='Player'){
        if(obj2._id == 'tierraH' || obj2._id == 'tierraV')
            obj2.Destroy(); //Llamamos la la destructora de la tierra
        else {
            if ((obj1.x-2)>obj2._posX && (obj1.y-2)==obj2._posY){
                obj2.width = obj2.width-2;
            }
            else if ((obj1.x-2)<obj2._posX && (obj1.y-2)==obj2._posY){
                obj2.x = obj2.x+2;
                obj2.width = obj2.width-2;
            }
            else if ((obj1.x-2)==obj2._posX && (obj1.y-2)<obj2._posY){
                obj2.y = obj2.y + 2;
                obj2.height = obj2.height-2;
            }
            else if ((obj1.x-2)==obj2._posX && (obj1.y-2)>obj2._posY){
                obj2.height = obj2.height-2;
            }
            if (obj2.width<4 || obj2.height<4)
                obj2.Destroy();
        }
    }
    if (obj1._Falling && obj1._id=='Collider' && obj1.y<obj2.y)         
        obj2.Destroy();
}

function onCollisionPara(obj1, obj2)
{
    if(obj1._Falling && obj2.y>obj1.y+3){
        obj1._Falling=false;
        //obj1.destroy(); //ESTA LLAMADA A DESTROYCOLL SE HACE PERO EL this.destroy no lo permite
    }
}

function onColisionAñadeEnemigoHijo(obj1, obj2){

    obj2._Enable = false; //Para parar al enemigo
    obj1.addChild(obj2);
}

function Par (x, y) {
    this._x = x;
    this._y = y;
}


//LA CLASE MOVABLE HEREDA DE SPRITE
function Movable(game, position, sprite, velocity,id)
    {
        Phaser.Sprite.apply(this, [game ,position._x, position._y, sprite]);
        this._velocity = velocity;
        this._id=id;
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
function Player(game, position, sprite, velocity, DirPlayer, cursors, limiteDerecho, limiteSuperior, distanceX, distanceY, id)
    {
    Movable.apply(this, [game, position, sprite, velocity, id]);
    
    this._Enableleft = true;
    this._Enableright = true;
    this._Enableup = true;
    this._Enabledown = true;

    this._Movingleft = false;
    this._Movingright = false;
    this._Movingup = false;
    this._Movingdown = false;

    this._dirX = DirPlayer._x;
    this._dirY = DirPlayer._y;

    this._distanceX = distanceX;
    this._distanceY = distanceY;

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
    if (this._cursors.left.isDown && this.x > 2 && this._Enableleft)
    {
        if (this._Movingright == true)
            this._Movingright = false;
        else if (this._Movingdown == true)
            this._Movingdown = false;
        else if (this._Movingup == true)
            this._Movingup = false;

        if (this._Movingleft == false)
            this._Movingleft = true;

        if (this._Enableright == false)
            this._Enableright = true;
        else if (this._Enabledown==false)
            this._Enabledown = true;
        else if (this._Enableup == false)
            this._Enableup = true;

        this._dirX = -1;

        if (this._distanceY == 0) {
            this.x -= 1;
            this._distanceX -= 1;
        }
        else if (this._dirY == 1) {
            if(this.y < 594 - this.height) {
                this.y += 1;
                this._distanceY += 1;
            }
        }
        else if (this._dirY == -1) {
            if(this.y > this.height + 6) {
                this.y -= 1;
                this._distanceY -= 1;
            }
        }
    }
    else if (this._cursors.right.isDown && this.x < this._LimiteDerecho - this.width- 2 && this._Enableright)
    {
        if (this._Movingleft == true)
            this._Movingleft = false;
        else if (this._Movingdown == true)
            this._Movingdown = false;
        else if (this._Movingup == true)
            this._Movingup = false;

        if(this._Movingright == false)
            this._Movingright = true;

        if (this._Enableleft == false)
            this._Enableleft = true;
        else if (this._Enabledown == false)
            this._Enabledown = true;
        else if (this._Enableup == false)
            this._Enableup = true;

        this._dirX = 1;

        if(this._distanceY == 0){
            this.x += 1;
            this._distanceX += 1;
        }
        else if (this._dirY == 1){
            if(this.y < 594 - this.height){
                this.y += 1;
                this._distanceY += 1;
            }
        }
        else if (this._dirY == -1) {
            if(this.y > this.height + 6) {
                this.y -= 1;
                this._distanceY -= 1;
            }
        }
    }
    else if (this._cursors.down.isDown && this.y < 594 - this.height && this._Enabledown)
    {   

        if (this._Movingright == true)
        this._Movingright = false;
        else if (this._Movingleft == true)
        this._Movingleft = false;
        else if (this._Movingup == true)
        this._Movingup = false;

        if (this._Movingdown == false)
            this._Movingdown = true;

        if (this._Enableright == false)
            this._Enableright = true;
        else if (this._Enableleft == false)
            this._Enableleft=true;
        else if (this._Enableup == false)
            this._Enableup = true;

        this._dirY = 1;

        if (this._distanceX == 0) {
            this.y += 1;
            this._distanceY += 1;
        }
        else if (this._dirX == 1) {
            if (this.x < this._LimiteDerecho - this.width - 2) {
                this.x += 1;
                this._distanceX += 1;
            }
        }
        else if (this._dirX == -1) {
            if(this.x > 2) {
                this.x -= 1;
                this._distanceX -= 1;
            }
        }
    }
    else if (this._cursors.up.isDown && this.y > this.height + 6 && this._Enableup)
    {   

        if (this._Movingright == true)
        this._Movingright = false;
        else if (this._Movingleft == true)
        this._Movingleft = false;
        else if (this._Movingdown == true)
        this._Movingdown = false;

        if(this._Movingup == false)
            this._Movingup = true;

        if (this._Enableright == false)
            this._Enableright = true;
        else if (this._Enableleft == false)
            this._Enableleft=true;
        else if (this._Enabledown == false)
            this._Enabledown = true;

        this._dirY =- 1;

        if (this._distanceX == 0) {
            this.y -= 1;
            this._distanceY -= 1;
        }
        else if (this._dirX == 1) {
            if(this.x < this._LimiteDerecho - this.width - 2){
                this.x += 1;
                this._distanceX += 1;
            }
        }
        else if (this._dirX == -1) {
            if(this.x > 2) {
                this.x -= 1;
                this._distanceX -= 1;
            }
        }
    }
    else{
        this._Movingleft = false;
        this._Movingright = false;
        this._Movingup = false;
        this._Movingdown = false;
    }

    if (this._distanceX > 42 || this._distanceX < -42)
        this._distanceX = 0;
    if (this._distanceY > 42 || this._distanceY < -42)
        this._distanceY = 0;


    if(this._Movingdown || this._Movingup || this._Movingleft || this._Movingright){
        this._Moving=true;
        if(cargada){
        playerMusic.resume();
        }
    }
    else{
        this._Moving=false;
        if(cargada){
            playerMusic.pause();
            }      
        }
    }
    /*if(this._fireButton.isDown)
    {
        this._playerWeapon.fire();
    }*/
    Player.prototype.update = function() {
        this.Input();
    }
    Player.prototype.PlayerRock = function() {
        this._Enable=false;
    }

    /*function onCollisionPlayerRock(obj1,obj2){
        if((game.physics.arcade.collide(obj1, obj2)))
            obj1._Enable=false;
}*/
//CLASE BLOQUE TIERRA----------------------------------------------------
function Tierra(game, position, sprite, velocity,id)
    {
        Movable.apply(this, [game, position, sprite, velocity,id]);
        this._posX=this.x;
        this._posY=this.y;
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

function Collider(game, position, sprite, velocity, id)
    {
        Movable.apply(this, [game, position, sprite, velocity,id]);

        this._Falling = false;
        this._HasFallen = false;
        this._FallEnable = false;
        this._timer = this.game.time.create(false);
    }
    
    Collider.prototype = Object.create(Movable.prototype);
    Collider.prototype.constructor = Collider;

    Collider.prototype.update=function(){
        if(this._Falling){
            for(var i=0; i<6; i++){
                if (this._Falling && this._id=='Collider' && this.y<558){
                    this.y ++;
                }
            }
        }
    }

    Collider.prototype.DestroyColl = function() //Mueve el jugador a la izquierda
    {
        //this.destroy();
    }

    Collider.prototype.Para=function() {
        this._Falling = false;
        //Y SE LLAMARIA AL DESTRUCTOR DE ESTE OBJETO EL CUAL CONTARA CON UNA ANIMACION SI NO SE ACTIVA UN BOOL DE HABER COGIDO ENEMIGO O SIMPLEMENTE IRA COGIENDO HIJOS Y
        // LOS PARARA Y AL DESTRUIRSE ÉL DESTRUIRA A LOS HIJOS
    }

    Collider.prototype.EnableFall=function() {
        this._timer.loop(1500,Fall,this);
        this._timer.start();
    }

    function Fall() {
        this._Falling = true;
        this._timer.stop();
    }