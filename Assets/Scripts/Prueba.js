function preload() {

    game.stage.backgroundColor = '#85b5e1';

    game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    game.load.image('player', 'sprites/phaser-dude.png');
    game.load.image('roca', 'sprites/square1.png');
    game.load.image('Pooka', 'sprites/mushroom2.png');
    game.load.image('platform', 'sprites/platform.png');

}

//------------------------------------------------------

var player;
var platforms;
var cursors;
var jumpButton;

function create() {

    player = game.add.sprite(100, 200, 'player');
    roca = game.add.sprite(200, 200, 'roca');
    pooka = game.add.sprite(50, 100, 'Pooka');
    pooka.scale.setTo(0.5,0.5);
    
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(roca);
    game.physics.arcade.enable(pooka);

    player.body.collideWorldBounds = true;
    roca.body.collideWorldBounds = true;
    roca.body.gravity.y = 500;
    pooka.body.collideWorldBounds = true;
    
    platforms = game.add.physicsGroup();

    platforms.create(500, 150, 'platform');
    platforms.create(-200, 300, 'platform');
    platforms.create(400, 450, 'platform');

    platforms.setAll('body.immovable', true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}


//---------------------------------------------------------------------------


function update () {

    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(roca, platforms);
    game.physics.arcade.collide(roca, player);
    game.physics.arcade.collide(roca, pooka);
    
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    //pooka.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -250;
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 250;
    }
    
    if (pooka.body.position.x >= player.body.position.x +10){
        pooka.body.velocity.x = -100;
    }
    else if (pooka.body.position.x  < player.body.position.x-10){
        pooka.body.velocity.x = 100;
    }
    else if (pooka.body.position.y >= player.body.position.y +10){
        pooka.body.velocity.y = -100;
    }
    else if (pooka.body.position.y  < player.body.position.y-10){
        pooka.body.velocity.y = 100;
    }
    
    /*if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
    {
        player.body.velocity.y = -400;
    }*/
}


//--------------------------------------------------------------------------------------------------

