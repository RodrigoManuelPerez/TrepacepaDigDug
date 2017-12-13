
'use strict';

var score = 0;
var scoreString = '';
var scoreText;

//Poner puntuacion

scoreString = 'Score : ';
scoreText = game.add.text(10, 10, scoreString + score, // Anyadir al juego la puntuacion en la posicion x, y
    { font: '34px Arial', fill: '#fff' }); // Fuente y color de la puntuacion

    //Para ponerlo en la parte contraria se pondria:
    //  game.world.width - x, etc
    //Y para ponerlo en el centro seria:
    //  game.world.centerX, game.world.centerY

    function collisionRoca (roca, pooka) {
        score += 10;
        scoreText = scoreString + score;
    }

module.exports = Canvas;