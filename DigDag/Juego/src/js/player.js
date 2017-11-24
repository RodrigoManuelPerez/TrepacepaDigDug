'use strict';

Player = function(game, x, y, state) {
	Phaser.Sprite.call(this, game, x, y, 'Player');
	this.game = game;
	this.state = state;

	this.components = {};
	game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// Method to add components
Player.prototype.addComponent = function(comp) {
	this.components[comp.name] = comp;
	this.components[comp.name].setTarget(this);

    console.log("[Player] :: added component " + comp.name);
	return comp;
}

Player.prototype.preload = function() {
	console.log("[Player] :: preload");
};

Player.prototype.create = function() {
	console.log("[Player] :: create");

	// Add Components
	var Movable = this.addComponent(new Components.Movable());
	var Breakable = this.addComponent(new Components.Breakable());

    // This is the GLUE!
	Movable.onMoving.add(Breakable.break, this);
};

Player.prototype.getComponent = function(componentName) {
	return this.components[componentName];
}

Player.prototype.update = function() {

	Object.keys(this.components).forEach(function(a, b, c) {
		this.components[a].update();
	}, this);
}

Player = {
create: function () {

    player = new PlayerController(game);
    game.world.addChild(player);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    cursors = this.game.input.keyboard.createCursorKeys();
    
},
update: function(){
    
},
render: function(){
}
};


//CLASE PLAYERCONTROLLER ESTANDAR CON SU CREADORA LA ESTRUCTURA PARA DARLE COMPONENTES Y SU UPDATE PARA REALIZAR EL UPDATE DE TODOS LOS METODOS QUE POSEE
function PlayerController(game) {
    Phaser.Sprite.call(this, game, game.world.centerX+110, game.world.centerY-250, 'DigDug');
  }

  PlayerController.prototype.addComponent = function(comp) {
    
    // see, I told you the component name would be used!
	this.components[comp.name] = comp;          
	
	// setting the target 'initializes' the component
	this.components[comp.name].setTarget(this); 
	
	// return the component for other uses
	return comp;    
    }

    //AL CREARLO LE AÑADIMOS LA VARIABLE COMPONENTES QUE TIENE LA ESTRUCTURA BASICA DE CADA COMPONENTE
    PlayerController.prototype.create = function() {
    
        // Add Component(s)
        this.addComponent(new Components.Body());
    
    };

  PlayerController.prototype = Object.create(Phaser.Sprite.prototype);
  PlayerController.constructor = PlayerController;
  
  PlayerController.prototype.update = function () {
    
    Object.keys(this.components).forEach(function(componentName) {
        this.components[componentName].update();
    }, this)
    
    }

module.exports = player;