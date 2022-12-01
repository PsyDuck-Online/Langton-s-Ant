export default class Ant {
    constructor(x, y, dir, colorPath, colorAnt) {
        this.x = x;
        this.y = y;
        this.colorPath = colorPath;
        this.colorAnt = colorAnt;
        this.dir = dir;
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

    turno(ctx, mundo, cellSize) {
        
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

        // Avanzamos en el tablero y cambiamos el valor/colorPath de la casilla
        mundo[this.y][this.x] = 1 - mundo[this.y][this.x];
        ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize)
        this.avanzar(mundo)
        // Dibujamos la hormiga
        ctx.beginPath();
        ctx.arc(this.x * cellSize + 2, this.y * cellSize + 2, cellSize/3, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.colorAnt;
        ctx.fill();

        
    }
}