# Trepacepa
Repositorio para el desarrollo de PVLI 

__DIG DUG PVLI__

Marcos Docampo Priego-Puga
Rodrigo Manuel Pérez Ruiz


    Manual del Juego: http://www.gamesdatabase.org/Media/SYSTEM/Arcade/Manual/formated/Dig_Dug_-_1982_-_Namco.pdf

__Descripción del comienzo__

Tras elegir el modo de juego cargará la primera pantalla, DigDug aparece por la esquina superior derecha, avanza al centro de la superficie y cava hacia abajo hasta situarse en el medio de la pantalla. La primera ronda tiene 4 monstruos y tres rocas y la primera verdura que aparecerá es la zanahoria. Aparece una flor blanca en el tope derecho de la superficie que indica el nivel 1.


__Menús y configuración__

El menú consta de dos botones en el medio, uno encima de otro, para modos de uno y dos jugadores. Además aparece el logo del juego arriba (centrado) y el nombre del grupo con el año de creación abajo (centrado también) sobre un fondo negro.


__Interfaz__

La interfaz se compone por la pantalla de juego formada por una matriz de 12 columnas y 13 filas teniendo en cuenta la superficie. En la esquina superior derecha aparece un marcador de “Hi - Score” que indica el récord alcanzado en el juego y debajo se indica la puntuación actual del del jugador. En la esquina inferior derecha se indica el número de la ronda y del mismo modo existe una representación visual de los niveles mediante flores en la superficie, las unidades se representan con flores blancas y las decenas en flores rojas más grandes. El mayor nivel representable por las flores es el 93. Encima del marcador de la ronda


__Jugabilidad__

Mecánicas

*HÉROE: 
Dig Dug se mueve en 4 direcciones, y tiene un gancho inflador que se lanza a una distancia máxima de 4 cuadrados destruye a los enemigos tras engancharlos e inflarlos tres veces. 
Puede matar: Dragones y Monstruos.
Puede ser matado por: Dragón, Monstruo y Piedra.
Dig Dug se mueve más lento cuando cava y se choca cuando se encuentra con una piedra. Además como el mapa son cuadrículas, para cambiar de movimiento en L (ej: de abajo a dcha) tiene que esperar a alcanzar la siguiente casilla de la cuadrícula que pueda usar para cambiar de dirección. Sin embargo, el cambio de dirección dcha-izq y arriba-abajo es inmediato.*

__ENEMIGOS:__

__El dragón:__ Tiene un movimiento en 4 direcciones. Al cabo de cierto tiempo su sprite parpadea y lanza fuego hacia delante hasta tres posiciones o hasta que se encuentra con una casilla de tierra. El jugador muere y pierde una vida si el fuego le toca.

__Pooka__: Tiene movimiento en 4 direcciones, se trata de un enemigo que únicamente persigue al jugador hasta atraparle.

*Ambos enemigos mejoran su habilidad para esquivar rocas con el paso de niveles.*
*Los enemigos pueden convertirse en fantasmas para atravesar las casillas de tierra y moverse en diagonal para acercarse al jugador.*
	

__INTERACTIVOS:__

__Rocas:__ en cada nivel aparecen un numero finito de rocas entre 3 y 5, si DigDug cava por debajo de ellas de manera horizontal la roca caera al cabo de dos segundos esté o no DigDug debajo. En cambio si se cava verticalmente por debajo hasta llegar a la roca podrá mantener la posicion sin que la roca caiga. Las rocas atraviesan las paredes de tierra finas que aparecen entre dos casillas con tierra.

__Verduras:__ tras cavar dos rocas en una ronda aparece una verdura en el centro de la pantalla. El jugador tiene 10 segundos para cogerla o desaparecerá la verdura. Hay una verdura predeterminada para cada ronda hasta la ronda 18, a partir de entonces solo aparecen piñas. Todas las verduras tienen una puntuación predeterminada

__Dinámicas__
	
La dinámica principal del juego es el paso de rondas derrotando a todos los enemigos de la ronda, teniendo en cuenta que el último enemigo en pantalla intentará huir por el borde superior izquierdo de la pantalla. Se consiguen puntos por eliminar enemigos, cavar y recoger verduras. Estos puntos vienen explicados en el manual del juego al que se puede acceder con l URL 
    
    (http://www.gamesdatabase.org/Media/SYSTEM/Arcade/Manual/formated/Dig_Dug_-_1982_-_Namco.pdf)

__Niveles__

La creación de los niveles se produce siguiendo un patrón, hasta el nivel 10 y partiendo del nivel inicial aumenta a cada ronda las rocas en una hasta llegar a 5 y hasta 8 los enemigos. Al llegar a 5 las rocas irán disminuyendo hasta volver a 3 y así cíclicamente.
