import { Trabajadora, Soldado, Reproductora, Reina } from "./Ant.js";

/***************/
/** VARIABLES **/
/***************/

// Elementos HTML //
// Parametros
const gridSizeElem = document.getElementById('grid-size');
const cellSizeElem = document.getElementById('cell-size');
const frameRateElem = document.getElementById('frame-rate');
const distributionPercentElem = document.getElementById('distribution-percent');
// Datos
const generacionElem = document.getElementById('generacion');
const poblacionElem = document.getElementById('poblacion');
// Botones
const newGameBtn = document.getElementById('new-game');
const updateBtn = document.getElementById('update-rules');
const playBtn = document.getElementById('pause-play');
const nextGenBtn = document.getElementById('next-gen');
// ----------------- //


// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Datos
var generacion;
var poblacion;
var FPS;
var porcentajeDistribucion;
// Tablero
var cellSize;
var gridSize;
var tablero;
// Variables de control
var playing;
var gameInterval;
// Hormgias
var hormigas = [];
var cantidadDistribucion;
// Colores de las hormigas
const colorReina = '#F01A17'; // rojo
const colorReproductora = '#17E0F0'; // cyan
const colorTrabajadora = '#B900FE' // morado
const colorSoldado = '#42F017'; // verde fuerte
// Porcentaje de probabilidad de hormigas
const probabilidadReina = .01;
const probabilidadReproductora = .09;
const probabilidadSoldado = .35;
const probabilidadTrabajadora = .55;

/*********************/
/** EVENT LISTENERS **/
/*********************/

document.addEventListener('DOMContentLoaded', loadDefaultSettings);
newGameBtn.addEventListener('click', newGame);
updateBtn.addEventListener('click', updateRules);
playBtn.addEventListener('click', play);
nextGenBtn.addEventListener('click', nextGen);

/***************/
/** FUNCIONES **/
/***************/

function loadDefaultSettings() {
    // Parametros del programa
    gridSizeElem.value = 10;
    cellSizeElem.value = 5;
    generacion = 0;
    distributionPercentElem.value = 0.05;
    frameRateElem.value = 50;

    playing = false;

    updateRules();
}

function updateRules() {
    if (playing === true) {
        play();
    }
    // Obtenemos los valores de los elementos HTML
    gridSize = gridSizeElem.value;
    cellSize = cellSizeElem.value;
    porcentajeDistribucion = distributionPercentElem.value;
    FPS = frameRateElem.value;
    cantidadDistribucion = Math.floor((gridSize * gridSize) * porcentajeDistribucion);
    // Tamaño y limpieza del canvas
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    // Imprimimos las hormigas
    hormigas.forEach(function (hormiga) {
        hormiga.dibujarHormiga(ctx, cellSize);
    });
    imprimirDatos();
}

function play() {
    playing = !playing;
    if (playing) {
        gameInterval = setInterval(nextGen, 1000 / FPS);
    } else {
        clearInterval(gameInterval)
    }
}

function newGame() {
    if (playing === true) {
        play(); // Pausamos el juego si se esta ejecutando
    }
    // Reiniciamos los datos
    generacion = 0;
    poblacion = 0;
    // Creamos el tablero
    tablero = iniciarMundo();
    // Generamos las hormigas en el mundo
    generarHormigas();
    updateRules();
    imprimirDatos();
}

function nextGen() {
    let hormigasMuertas = [];
    for (let i = 0; i < hormigas.length; i++) {
        hormigas[i].turno(ctx, tablero, cellSize, hormigas);
        if (hormigas[i].periodoVida <= 0) {
            hormigas[i].morir(ctx, tablero, cellSize);
            hormigasMuertas.push(hormigas[i].id);
        }
    }

    hormigasMuertas.forEach(function (id) {
        quitarHormiga(id);
    });

    if (generacion === 80) {
        console.log(hormigasMuertas);
        console.log(hormigas);
    }

    generacion = generacion + 1;
    generacionElem.innerText = generacion;
    poblacionElem.innerText = hormigas.length;
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

function generarHormigas() {
    hormigas = []
    for (let i = 0; i < cantidadDistribucion; i++) {
        crearHormiga(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize));
    }
    poblacion = hormigas.length;
}

function crearHormiga(x, y) {
    let nuevaHormiga = null;
    if (Math.random() < probabilidadReina) {
        // Creamos una hormiga reina
        nuevaHormiga = new Reina(
            x,
            y,
            generarDireccion(),
            colorReina
        );
    } else if (Math.random() < probabilidadReproductora) {
        // Creamos una hormiga reproductora
        nuevaHormiga = new Reproductora(
            x,
            y,
            generarDireccion(),
            colorReproductora
        );
    } else if (Math.random() < probabilidadSoldado) {
        // Creamos una hormiga soldado
        nuevaHormiga = new Soldado(
            x,
            y,
            generarDireccion(),
            colorSoldado
        );
    } else if (Math.random() < probabilidadTrabajadora) {
        // Creamos una hormiga trabajadora
        nuevaHormiga = new Trabajadora(
            x,
            y,
            generarDireccion(),
            colorTrabajadora
        );
    }

    if (nuevaHormiga != null) {
        nuevaHormiga.dibujarHormiga(ctx, cellSize);
        hormigas.push(nuevaHormiga);
    }

}

function clickCanvas(e) {
    let coordenadas = getCursorPosition(e);
    poblacion = poblacion + 1;
    crearHormiga(coordenadas[0], coordenadas[1]);
}


function imprimirDatos() {
    poblacionElem.innerText = hormigas.length;
    generacionElem.innerText = generacion;
}

function generarDireccion() {
    let direcciones = ['U', 'D', 'L', 'R'];
    return direcciones[Math.floor(Math.random() * 3).toFixed(0)];
}

function quitarHormiga(id) {
    let pos = hormigas.findIndex(hormiga => hormiga.id === id);
    hormigas.splice(pos, 1);
}

function getCursorPosition(event) {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / cellSize);
    let y = Math.floor((event.clientY - rect.top) / cellSize);

    return [x, y];
}