let canvas;

let states = {setup:0, generate:1, generate_done:2, solve:3, solve_done:4}
let state = states.setup;

let size_slider = document.getElementById("size_slider");
const div = document.getElementById('canvas');

//Variabili Labirinto
let stack = [];
let griglia = [];

// Variabili A*
let open = [];
let closed = [];
let startPoint;
let endPoint;
let corrente;

function setup() {
    let lato = Math.min(500, div.parentElement.parentElement.clientWidth);
    canvas = createCanvas(lato,lato);
    canvas.parent("canvas"); 
    slider = document.getElementById("size_slider");
    resizeCollapsable();
}

function draw() {
    const size = Number(size_slider.value);
    switch (state) {
        case states.setup:
            background(50);
            strokeWeight(1);
            stroke(255,0,0);
            const cell_size = width/size;
            for (let i=1; i<size; i++) {
                line(0,i*cell_size, width, i*cell_size);
                line(i*cell_size, 0, i*cell_size, height);
            }
            break;
        case states.generate:
            if (stack.length==0) {
                bottone.disabled=false;
                state=states.generate_done;
                return;
            }
            current = stack.pop();          
            viciniNonVisitati = current.vicini.filter(v=>v&&!v.visitato);

            if (viciniNonVisitati.length > 0) {      
                stack.push(current);                
                prossimo = viciniNonVisitati[Math.floor(Math.random() * viciniNonVisitati.length)]; 
                current.collega(prossimo);         
                prossimo.visitato = true;         
                stack.push(prossimo);               
            }
            current.disegna();
            for (vicino of current.vicini.filter(v=>v?.visitato)) {
                vicino.disegna(true)
            }            
            break;
        case states.solve:
            corrente = open.reduce((min_f, c)=>c.f_cost<min_f.f_cost?c:min_f, open[0])

            open.splice(open.indexOf(corrente), 1);
            closed.push(corrente);
            corrente.colore = [255, 220, 230];
            corrente.disegnaCOLORE([255, 220, 230]);

            if (corrente == endPoint) {
                state = states.solve_done;
                bottone.disabled=false;
                return;
            }
            for (i = 0; i < 4; i++) {
                var vicino = corrente.vicini[i];
                if (vicino != null && !corrente.muri[i] && !closed.includes(vicino)) {
                    var newG = corrente.g_cost + 1;
                    var newH = Math.abs(endPoint.x - vicino.x) + Math.abs(endPoint.y - vicino.y);
                    var newF = newG + newH;

                    if (newF < vicino.f_cost || !open.includes(vicino)) {
                        vicino.f_cost = newF;
                        vicino.h_cost = newH;
                        vicino.g_cost = newG;

                        vicino.parent = corrente;
                        if (!open.includes(vicino)) {
                            open.push(vicino);
                            vicino.colore = [111, 255, 255];
                            vicino.disegnaCOLORE([111, 255, 255]);
                        }
                    }
                }
            }
            break;
        case states.solve_done:
            let lato = width/size;
            background(0);
            for (i = 0; i < size; i++) {
                for (j = 0; j < size; j++) {
                    griglia[i][j].disegna(false);
                }
            }
            var corrente = endPoint;
            while (corrente != null && corrente.parent != null) {
                stroke(190, 190, 190);
                strokeWeight(lato * 0.40);
                line(corrente.x * lato + (lato / 2), corrente.y * lato + (lato / 2), corrente.parent.x * lato + (lato / 2), corrente.parent.y * lato + (lato / 2));

                corrente = corrente.parent;
            }
            break;
    }
}

const bottone = document.getElementById("advance_button");
bottone.onclick = (e) => {
    switch (state) {
        case states.setup:
            bottone.value = "Risolvi Labirinto";
            bottone.disabled = true;
            size_slider.disabled = true;
            inizializzaLabirinto()
            state = states.generate;
            break;
        case states.generate_done:
            bottone.disabled = true;
            bottone.value = "Ricomincia";
            const size = Number(size_slider.value);
            background(0);
            for (i = 0; i < size; i++) {
                for (j = 0; j < size; j++) {
                    griglia[i][j].disegna(false);
                }
            }
            startPoint = griglia[0][0];
            endPoint = griglia[size - 1][size - 1];
            open = [startPoint];
            closed = [];
            state = states.solve;
            loop();
            break;
        case states.solve_done:
            size_slider.disabled = false;
            bottone.value = "Genera Labirinto";
            state = states.setup;

            stack = [];
            griglia = [];
            open = [];
            closed = [];
            startPoint;
            endPoint;
            corrente;
            break;
    }
}

function windowResized() {
    let lato = Math.min(500, div.parentElement.parentElement.clientWidth);
    resizeCanvas(lato,lato,false);
    for (riga of griglia) {
        for (cel of riga) {
            cel.lato = lato/Number(size_slider.value);
        }
    }
}

function inizializzaLabirinto() {
    const size = Number(size_slider.value);
    /*creazione celle*/
    griglia = [];
    for (i = 0; i < size; i++) {
        griglia.push([]);
        for (j = 0; j < size; j++) {
            griglia[i].push(new cella(j, i, width/Number(document.getElementById('size_slider').value)));
        }
    }
    /*impostazione vicini*/
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            if (i > 0) {
                griglia[i][j].setVicino(0, griglia[i - 1][j]);
            }
            if (j < size - 1) {
                griglia[i][j].setVicino(1, griglia[i][j + 1]);
            }
            if (i < size - 1) {
                griglia[i][j].setVicino(2, griglia[i + 1][j]);
            }
            if (j > 0) {
                griglia[i][j].setVicino(3, griglia[i][j - 1]);
            }
        }
    }

    griglia[parseInt(size / 2)][parseInt(size / 2)].visitato = true;
    stack = [griglia[parseInt(size / 2)][parseInt(size / 2)]];
}


class cella {
    constructor(x, y, lato) {
        this.x = x;
        this.y = y;
        this.lato = lato;

        this.colore = [0, 0, 0];

        this.muri = [true, true, true, true];

        this.vicini = [null, null, null, null];

        this.visitato = false;

        this.parent = null;
        this.g_cost = 0;
        this.h_cost = 0;
        this.f_cost = 0;
    }

    setVicino(indice, vicino) {
        this.vicini[indice] = vicino;
    }

    getVicino(index) {
        return this.vicini[index];
    }

    collega(cel) {
        var check = this.muri[this.vicini.indexOf(cel)];
        this.muri[this.vicini.indexOf(cel)] = false;
        if (check) {
            cel.collega(this);
        }
    }

    disegna(verde) {
        if (verde) {
            fill(255);
            noStroke();
            rect(this.x * this.lato, this.y * this.lato, this.lato, this.lato);

            stroke(0, 255, 0);
            fill(0, 255, 0);
            strokeWeight(4);
        } else {
            fill(0);
            noStroke();
            rect(this.x * this.lato, this.y * this.lato, this.lato, this.lato);
            stroke(255, 0, 0);
            fill(255, 0, 0);
            strokeWeight(2);
        }
        if (this.muri[0]) {
            line(this.x * this.lato, this.y * this.lato, (this.x + 1) * this.lato, this.y * this.lato);
        }
        if (this.muri[1]) {
            line((this.x + 1) * this.lato, this.y * this.lato, (this.x + 1) * this.lato, (this.y + 1) * this.lato);
        }
        if (this.muri[2]) {
            line(this.x * this.lato, (this.y + 1) * this.lato, (this.x + 1) * this.lato, (this.y + 1) * this.lato);
        }
        if (this.muri[3]) {
            line(this.x * this.lato, this.y * this.lato, this.x * this.lato, (this.y + 1) * this.lato);
        }
    }

    disegnaCOLORE(colore) {
        noStroke();
        fill(colore[0], colore[1], colore[2]);
        rect(this.x * this.lato, this.y * this.lato, this.lato, this.lato);
        fill(255, 0, 0);
        stroke(255, 0, 0);
        strokeWeight(2);
        if (this.muri[0]) {
            line(this.x * this.lato, this.y * this.lato, (this.x + 1) * this.lato, this.y * this.lato);
        }
        if (this.muri[1]) {
            line((this.x + 1) * this.lato, this.y * this.lato, (this.x + 1) * this.lato, (this.y + 1) * this.lato);
        }
        if (this.muri[2]) {
            line(this.x * this.lato, (this.y + 1) * this.lato, (this.x + 1) * this.lato, (this.y + 1) * this.lato);
        }
        if (this.muri[3]) {
            line(this.x * this.lato, this.y * this.lato, this.x * this.lato, (this.y + 1) * this.lato);
        }
    }
}