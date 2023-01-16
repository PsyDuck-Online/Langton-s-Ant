import { Trabajadora, Soldado, Reproductora, Reina } from "./Ant.js";

/***************/
/** VARIABLES **/
/***************/

// Elementos HTML
const generacionElem = document.getElementById('generacion');
const poblacionElem = document.getElementById('poblacion');

// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Datos
var generacion;
var poblacion;
// Tablero
var cellSize;
var gridSize;
var tablero;

// Hormgias
var hormigas = [];
var hormigasReinas = [];
var hormigasReproductoras = [];
var hormigasTrabajadoras = [];
var hormigasSoldado = [];
var cantidadDistribucion;
var colorReina;
var colorReproductora;
var colorTrabajadora;
var colorSoldado;
/*********************/
/** EVENT LISTENERS **/
/*********************/

document.addEventListener('DOMContentLoaded', () => {
    cellSize = 1;
    gridSize = 1000;
    generacion = 0;
    cantidadDistribucion = Math.floor(gridSize * 0.5);
    // Colores de las hormigas
    colorReina = '#F01A17';
    colorReproductora = '#17E0F0';
    colorTrabajadora = '#DCF017'
    colorSoldado = '#42F017';
    // Tamaño y limpieza del canvas
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    // Creacion del tablero(Arreglo)
    tablero = iniciarMundo();

    //hormigas = generarHormigas();
    //play();

    generarHormigas2();
    //nextGen2();
    //console.log(hormigas);
    play2();

    console.log(Math.random() < .5);
});

/***************/
/** FUNCIONES **/
/***************/

function play() {
    let gameInterval = setInterval(nextGen, 1000/60);
}
function play2() {
    let gameInterval = setInterval(nextGen2, 1000/60);
}

function nextGen() {
    hormigas.forEach(function (hormiga) {
        hormiga.turno(ctx, tablero, cellSize, hormigas);
    });
    generacion = generacion + 1;
    generacionElem.innerText = generacion;
    poblacionElem.innerText = hormigas.length;
}

function nextGen2() {
    poblacion = 0;
    hormigas.forEach(function (listaHormigas) {
        listaHormigas.forEach(function (hormiga) {
            hormiga.turno(ctx, tablero, cellSize, listaHormigas);
            poblacion = poblacion + 1;
        });
    });
    generacion = generacion + 1;
    generacionElem.innerText = generacion;
    poblacionElem.innerText = poblacion;
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

function generarHormigas2() {
    hormigas.push(hormigasReinas);
    hormigas.push(hormigasReproductoras);
    hormigas.push(hormigasTrabajadoras);
    hormigas.push(hormigasSoldado);

    let probabilidadReina = .01;
    let probabilidadReproductora = .09;
    let probabilidadSoldado = .35
    let probabilidadTrabajadora = .55;

    for (let i = 0; i < cantidadDistribucion; i++) {
        if (Math.random() < probabilidadReina) {
            // Creamos una hormiga reina
            hormigasReinas.push(new Reina(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorReina
            ));
        } else if (Math.random() < probabilidadReproductora) {
            // Creamos una hormiga reproductora
            hormigasReproductoras.push(new Reproductora(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorReproductora
            ));
        } else if (Math.random() < probabilidadSoldado) {
            // Creamos una hormiga soldado
            hormigasSoldado.push(new Soldado(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorSoldado
            ));
        } else if (Math.random() < probabilidadTrabajadora) {
            // Creamos una hormiga trabajadora
            hormigasTrabajadoras.push(new Trabajadora(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorTrabajadora
            ));
        }
        
    }
}

function generarHormigas() {
    
    let hormigas_aux = [];
    let probabilidadReina = .01;
    let probabilidadReproductora = .09;
    let probabilidadSoldado = .35
    let probabilidadTrabajadora = .55;

    for (let i = 0; i < cantidadDistribucion; i++) {
        if (Math.random() < probabilidadReina) {
            // Creamos una hormiga reina
            hormigas_aux.push(new Reina(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorReina
            ));
        } else if (Math.random() < probabilidadReproductora) {
            // Creamos una hormiga reproductora
            hormigas_aux.push(new Reproductora(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorReproductora
            ));
        } else if (Math.random() < probabilidadSoldado) {
            // Creamos una hormiga soldado
            hormigas_aux.push(new Soldado(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorSoldado
            ));
        } else if (Math.random() < probabilidadTrabajadora) {
            // Creamos una hormiga trabajadora
            hormigas_aux.push(new Trabajadora(
                i,
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize),
                generarDireccion(),
                '#F0F0F0',
                colorTrabajadora
            ));
        }
        
    }
    return hormigas_aux;
}

function generarDireccion() {
    let direcciones = ['U', 'D', 'L', 'R'];
    return direcciones[Math.floor(Math.random() * 3).toFixed(0)];
}