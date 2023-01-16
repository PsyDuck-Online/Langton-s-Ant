export default class Ant {
    constructor(id, x, y, dir, colorPath, colorAnt) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.colorPath = colorPath;
        this.colorAnt = colorAnt;
        this.dir = dir;
        this.periodoVida = 800;
    }

    girarDerecha() {
        if (this.dir === 'U') {
            this.dir = 'R';
        } else if (this.dir === 'R') {
            this.dir = 'D';
        } else if (this.dir === 'D') {
            this.dir = 'L';
        } else {
            this.dir = 'U'
        }
    }

    girarIzquierda() {
        if (this.dir === 'U') {
            this.dir = 'L';
        } else if (this.dir === 'L') {
            this.dir = 'D';
        } else if (this.dir === 'D') {
            this.dir = 'R';
        } else {
            this.dir = 'U'
        }
    }

    avanzar(mundo) {
        if (this.dir === 'U') {
            // Avanza hacia arriba
            this.y -= 1;
        } else if (this.dir === 'R') {
            // Avanza hacia la derecha
            this.x += 1
        } else if (this.dir === 'D') {
            // Avanza hacia abajo
            this.y += 1
        } else {
            // Avanza hacia la izquierda
            this.x -= 1;
        }

        // Comprobamos que no se pase del mundo
        if (this.x < 0) {
            this.x = mundo.length - 1;
        } else if (this.y < 0) {
            this.y = mundo.length - 1;
        } else if (this.x >= mundo.length) {
            this.x = 0;
        } else if (this.y >= mundo.length) {
            this.y = 0;
        }

    }

    turno(ctx, mundo, cellSize, hormigas) {

        if (this.periodoVida <= 0) {
            //let pos = hormigas.findIndex(hormiga => hormiga.id === this.id);
            let pos = 0;
            hormigas.foreach(function (sublista) {
                sublista.foreach(function (hormiga) {
                    if(hormiga.id === this.id) {
                        sublista.splice(pos, 1);
                        
                    }
                });
            });
            hormigas.splice(pos, 1);
        }
        this.periodoVida = this.periodoVida - 1;
        // Giramos la hormiga y escogemos el colorPath
        if (mundo[this.y][this.x] === 0) {
            // Casilla blanca
            this.girarIzquierda();
            ctx.fillStyle = this.colorPath;
        } else {
            // Casilla Negra
            this.girarDerecha();
            ctx.fillStyle = '#ffffff';
        }

        // Comprobamos si hay alguna casilla en la otra casilla
        this.comprobarColicion(mundo, hormigas);
        // Avanzamos en el tablero y cambiamos el valor/colorPath de la casilla
        mundo[this.y][this.x] = 1 - mundo[this.y][this.x];
        ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize)
        this.avanzar(mundo)
        // Dibujamos la hormiga
        ctx.beginPath();
        ctx.arc(this.x * cellSize + (cellSize / 2), this.y * cellSize + (cellSize / 2), cellSize / 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.colorAnt;
        ctx.fill();
    }

    comprobarColicion(mundo, hormigas) {
        let posx, posy;
        let N = mundo.length;
        let colision = false;
        let dirNueva;
        if (this.dir == 'U') {
            // arriba
            posx = this.x;
            posy = (this.y - 1 + N) % N;
        } else if (this.dir == 'D') {
            // abajo
            posx = this.x;
            posy = (this.y + 1 + N) % N;
        } else if (this.dir == 'R') {
            // derecha
            posx = (this.x + 1 + N) % N;
            posy = this.y;
        } else {
            // izquierda
            posx = (this.x - 1 + N) % N;
            posy = this.y;
        }

        hormigas.foreach(function (sublista) {
            sublista.foreach(function (hormiga) {
                if (hormiga.x === posx && hormiga.y === posy) {
                    colision = true;
                }
            });
        });

        if (colision) {
            // Generamos una direccion aleatoria diferente
            while (this.dir === (dirNueva = generarDireccion())) {
                this.dir = dirNueva;
            }
        }
    }
}

export class Reina extends Ant {
    constructor(id, x, y, dir, colorPath, colorAnt) {
        super(id, x, y, dir, colorPath, colorAnt);
        this.tipo = 'reina';
    }
}

export class Reproductora extends Ant {
    constructor(id, x, y, dir, colorPath, colorAnt) {
        super(id, x, y, dir, colorPath, colorAnt);
        this.tipo = 'reproductora';
    }

    comprobarApareamento(hormigas, tablero) {
        // comprobamos para que lado esta viendo la hormiga
        let posX, posY;
        if (this.dir == 'U') {
            posX = this.x;
            posY = (this.y - 1 + tablero.length) % tablero.length;
        } else if (this.dir == 'R') {
            posX = (this.x - 1 + tablero.length) % tablero.length;
            posY = this.y;
        } else if (this.dir == 'D') {
            posX = this.x;
            posY = (this.y + 1 + tablero.length) % tablero.length;
        } else {
            posX = (this.x + 1 + tablero.length) % tablero.length;
            posY = this.y;
        }

        if (hormigas[1].findIndex(reproductora => (reproductora.x === posX) && (reproductora.y === posY)) != -1) {
            this.aparear(posX, posY, hormigas);
        }
    }

    aparear(posX, posY, hormigas) {
        if (Math.random() < .5) {
            // Posicion 
        } else {

        }
    }
}

export class Soldado extends Ant {
    constructor(id, x, y, dir, colorPath, colorAnt) {
        super(id, x, y, dir, colorPath, colorAnt);
        this.tipo = 'soldado';
    }
}

export class Trabajadora extends Ant {
    constructor(id, x, y, dir, colorPath, colorAnt) {
        super(id, x, y, dir, colorPath, colorAnt);
        this.tipo = 'trabajadora';
    }
}

function generarDireccion() {
    let direcciones = ['U', 'D', 'L', 'R'];
    return direcciones[Math.floor(Math.random() * 3).toFixed(0)];

}