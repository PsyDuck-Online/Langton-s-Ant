import Ant from "./Ant.js"
/***************/
/** VARIABLES **/
/***************/

// Elementos HTML
const generacionElem = document.getElementById('generacion');


// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Datos
var generacion;
// Tablero
var cellSize;
var gridSize;
var tablero;

// Hormgias
var hormigas = [];
/*********************/
/** EVENT LISTENERS **/
/*********************/

document.addEventListener('DOMContentLoaded', () => {
    cellSize = 1;
    gridSize = 1000;
    generacion = 0;
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    tablero = iniciarMundo();
    for (let i = 0; i < 100; i++) {
        hormigas.push(new Ant(
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize),
            generarDireccion(),
            generarColor(),
            generarColor()
        ));
    }
    play();
});

/***************/
/** FUNCIONES **/
/***************/

function play() {
    let gameInterval = setInterval(nextGen, 1000 / 60);
}

function nextGen() {
    hormigas.forEach(function (hormiga) {
        hormiga.turno(ctx, tablero, cellSize);
    });
    generacion = generacion + 1;
    generacionElem.innerText = generacion;
}

function iniciarMundo() {
    let nuevoMundo = new Array(gridSize);
    for (let i = 0; i < gridSize; i++) {
        nuevoMundo[i] = new Array(gridSize);
    }

    // Llenamos la matriz de 0's
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            nuevoMundo[y][x] = 0;
        }
    }
    return nuevoMundo;
}

function generarColor() {
    let color = '#';
    let letras = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    for (let i = 0; i < 6; i++) {
        color = color + letras[(Math.random() * 15).toFixed(0)];
    }
    return color
}

function generarDireccion() {
    let direccion;
    let direcciones = ['U', 'D', 'L', 'R'];
    return direcciones[Math.floor(Math.random() * 3).toFixed(0)];
}