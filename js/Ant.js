var idGlobal = 0;
// Colores
const colorReina = '#F01A17'; // rojo
const colorReproductora = '#17E0F0'; // cyan
const colorTrabajadora = '#B900FE' // morado
const colorSoldado = '#42F017'; // verde fuerte
const colorBlanco = '#ffffff';
// Probabilidades
const probabilidadReina = .01;
const probabilidadReproductora = .09;
const probabilidadSoldado = .35;
const probabilidadTrabajadora = .55;
export default class Ant {
    constructor(x, y, dir, colorAnt) {
        this.id = idGlobal;
        this.x = x;
        this.y = y;
        this.colorAnt = colorAnt;
        this.dir = dir;
        this.periodoVida = 80;

        idGlobal = idGlobal + 1;
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

    dibujarHormiga(ctx, cellSize) {
        ctx.beginPath();
        ctx.arc(this.x * cellSize + (cellSize / 2), this.y * cellSize + (cellSize / 2), cellSize / 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.colorAnt;
        ctx.fill();
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
        this.periodoVida = this.periodoVida - 1;
        // Giramos la hormiga y escogemos el colorPath
        if (mundo[this.y][this.x] === 0) {
            // Casilla blanca
            this.girarIzquierda();
        } else {
            // Casilla Negra
            this.girarDerecha();
        }

        // Comprobamos si hay 2 veces (Segun lo pedido)
        let colision = this.comporbarColision(mundo, hormigas);
        if (colision[0]) {
            while (true) {
                let dirAux = this.generarDireccion();
                if (dirAux != this.dir) {
                    this.dir = dirAux;
                    break;
                }
            }
        }
        colision = this.comporbarColision(mundo, hormigas);
        if (!colision[0]) {
            // Avanzamos en el tablero y cambiamos el valor/colorPath de la casilla
            mundo[this.y][this.x] = 1 - mundo[this.y][this.x];
            ctx.fillStyle = colorBlanco;
            ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize)
            this.avanzar(mundo)
            // Dibujamos la hormiga
            this.dibujarHormiga(ctx, cellSize);
        }
    }

    morir(ctx, mundo, cellSize) {
        ctx.fillStyle = colorBlanco;
        ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize)
    }

    comporbarColision(mundo, hormigas) {
        let sigX, sigY; // Siguiente valor de x,y
        let N = mundo.length;
        let colision = false;
        let idHormigaColision;
        // Obtenemos a donde se desplazaria en este turno
        if (this.dir == 'U') {
            // arriba
            sigX = this.x;
            sigY = (this.y - 1 + N) % N;
        } else if (this.dir == 'D') {
            // abajo
            sigX = this.x;
            sigY = (this.y + 1 + N) % N;
        } else if (this.dir == 'R') {
            // derecha
            sigX = (this.x + 1 + N) % N;
            sigY = this.y;
        } else {
            // izquierda
            sigX = (this.x - 1 + N) % N;
            sigY = this.y;
        }
        // Comprobamos la colision
        for (let i = 0; i < hormigas.length; i++) {
            if (hormigas[i].x === sigX && hormigas[i].y === sigY) {
                colision = true;
                idHormigaColision = hormigas[i].id;
            }
        }

        return [colision, idHormigaColision, sigX, sigY];
    }

    generarDireccion() {
        let direcciones = ['U', 'D', 'L', 'R'];
        return direcciones[Math.floor(Math.random() * 3).toFixed(0)];

    }
}

// REINA //

export class Reina extends Ant {
    constructor(x, y, dir, colorPath, colorAnt) {
        super(x, y, dir, colorPath, colorAnt);
        this.tipo = 'reina';
    }

    turno(ctx, mundo, cellSize, hormigas) {
        this.periodoVida = this.periodoVida - 1;
        // Giramos la hormiga y escogemos el colorPath
        if (mundo[this.y][this.x] === 0) {
            this.girarIzquierda();
        } else {
            this.girarDerecha();
        }
        // Comprobamos si hay alguna hormiga en la otra casilla y lo manejamos
        let colision = this.comporbarColision(mundo, hormigas);
        if (colision[0]) {
            let iHormiga = hormigas.findIndex(hormiga => hormiga.id === colision[1]);
            let dirAux;
            if (hormigas[iHormiga].tipo === 'reproductora') {
                this.aparear(hormigas);
            } else if (hormigas[iHormiga].tipo === 'reina') {
                if (this.periodoVida >= 20) {
                    this.periodoVida = Math.random() < 0.50 ? this.periodoVida : -1;
                } else if (this.periodoVida < 20) {
                    this.periodoVida = Math.random() < 0.50 ? this.periodoVida : -1;
                    return;
                }
            }
            while (true) {
                dirAux = this.generarDireccion();
                if (dirAux != this.dir) {
                    this.dir = dirAux;
                    break;
                }
            }
        }
        colision = this.comporbarColision(mundo, hormigas);
        if (!colision[0]) {
            // Avanzamos en el tablero y cambiamos el valor/colorPath de la casilla
            mundo[this.y][this.x] = 1 - mundo[this.y][this.x];
            ctx.fillStyle = colorBlanco;
            ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize)
            this.avanzar(mundo)
            // Dibujamos la hormiga
            this.dibujarHormiga(ctx, cellSize);
        }
    }

    aparear(hormigas) {
        if (Math.random() < probabilidadReina) {
            // Creamos una hormiga reina
            hormigas.push(new Reina(
                this.x,
                this.y,
                this.generarDireccion(),
                colorReina
            ));
        } else if (Math.random() < probabilidadReproductora) {
            // Creamos una hormiga reproductora
            hormigas.push(new Reproductora(
                this.x,
                this.y,
                this.generarDireccion(),
                colorReproductora
            ));
        } else if (Math.random() < probabilidadSoldado) {
            // Creamos una hormiga soldado
            hormigas.push(new Soldado(
                this.x,
                this.y,
                this.generarDireccion(),
                colorSoldado
            ));
        } else if (Math.random() < probabilidadTrabajadora) {
            // Creamos una hormiga trabajadora
            hormigas.push(new Trabajadora(
                this.x,
                this.y,
                this.generarDireccion(),
                '#F0F0F0',
                colorTrabajadora
            ));
        }
    }
}

// REPRODUCTORA //

export class Reproductora extends Ant {
    constructor(x, y, dir, colorAnt) {
        super(x, y, dir, colorAnt);
        this.tipo = 'reproductora';
    }
    turno(ctx, mundo, cellSize, hormigas) {
        this.periodoVida = this.periodoVida - 1;
        // Giramos la hormiga y escogemos el colorPath
        if (mundo[this.y][this.x] === 0) {
            this.girarIzquierda();
        } else {
            this.girarDerecha();
        }

        // Comprobamos si hay alguna hormiga en la otra casilla y lo manejamos
        let colision = this.comporbarColision(mundo, hormigas);

        if (colision[0]) {
            let iHormiga = hormigas.findIndex(hormiga => hormiga.id === colision[1]);
            let dirAux;
            if (hormigas[iHormiga].tipo === 'reina') {
                console.log('Apareamiento');
                this.aparear(hormigas[iHormiga], hormigas);
            }
            while (true) {
                dirAux = this.generarDireccion();
                if (dirAux != this.dir) {
                    this.dir = dirAux;
                    break;
                }
            }
        }
        colision = this.comporbarColision(mundo, hormigas);
        if (!colision[0]) {
            // Avanzamos en el tablero y cambiamos el valor/colorPath de la casilla
            mundo[this.y][this.x] = 1 - mundo[this.y][this.x];
            ctx.fillStyle = colorBlanco;
            ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize)
            this.avanzar(mundo)
            // Dibujamos la hormiga
            this.dibujarHormiga(ctx, cellSize);
        }

    }

    aparear(reina, hormigas) {
        console.log('Aparear desde reina');
        if (Math.random() < probabilidadReina) {
            // Creamos una hormiga reina
            hormigas.push(new Reina(
                reina.x,
                reina.y,
                this.generarDireccion(),
                colorReina
            ));
        } else if (Math.random() < probabilidadReproductora) {
            // Creamos una hormiga reproductora
            hormigas.push(new Reproductora(
                reina.x,
                reina.y,
                this.generarDireccion(),
                colorReproductora
            ));
        } else if (Math.random() < probabilidadSoldado) {
            // Creamos una hormiga soldado
            hormigas.push(new Soldado(
                reina.x,
                reina.y,
                this.generarDireccion(),
                colorSoldado
            ));
        } else if (Math.random() < probabilidadTrabajadora) {
            // Creamos una hormiga trabajadora
            hormigas.push(new Trabajadora(
                reina.x,
                reina.y,
                this.generarDireccion(),
                colorTrabajadora
            ));
        }
    }
}

// SOLDADO //

export class Soldado extends Ant {
    constructor(x, y, dir, colorAnt) {
        super(x, y, dir, colorAnt);
        this.tipo = 'soldado';
    }
}

// TRABAJADORA //

export class Trabajadora extends Ant {
    constructor(x, y, dir, colorAnt) {
        super(x, y, dir, colorAnt);
        this.tipo = 'trabajadora';
    }
}

