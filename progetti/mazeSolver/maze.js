/*

----0----
---------
-3-----1-
---------
----2----

*/

let volumeSlider, fxSlider;
let started, solvi, finish;
let lato;
let griglia;
let stack;
let open, closed;
let startPoint, endPoint, previous, cCopia, corrente;

class cella {
    constructor(x, y) {
        this.x = x;
        this.y = y;

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

    setColore(colore) {
        this.colore = colore;
    }

    setVisitato(val) {
        this.visitato = val;
    }
    getVisitato() {
        return this.visitato;
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
            rect(this.x * lato, this.y * lato, lato, lato);

            stroke(0, 255, 0);
            fill(0, 255, 0);
            strokeWeight(4);
        } else {
            fill(0);
            noStroke();
            rect(this.x * lato, this.y * lato, lato, lato);
            stroke(255, 0, 0);
            fill(255, 0, 0);
            strokeWeight(2);
        }
        if (this.muri[0]) {
            line(this.x * lato, this.y * lato, (this.x + 1) * lato, this.y * lato);
        }
        if (this.muri[1]) {
            line((this.x + 1) * lato, this.y * lato, (this.x + 1) * lato, (this.y + 1) * lato);
        }
        if (this.muri[2]) {
            line(this.x * lato, (this.y + 1) * lato, (this.x + 1) * lato, (this.y + 1) * lato);
        }
        if (this.muri[3]) {
            line(this.x * lato, this.y * lato, this.x * lato, (this.y + 1) * lato);
        }
    }

    disegnaCOLORE(colore) {
        noStroke();
        fill(colore[0], colore[1], colore[2]);
        rect(this.x * lato, this.y * lato, lato, lato);
        fill(255, 0, 0);
        stroke(255, 0, 0);
        strokeWeight(2);
        if (this.muri[0]) {
            line(this.x * lato, this.y * lato, (this.x + 1) * lato, this.y * lato);
        }
        if (this.muri[1]) {
            line((this.x + 1) * lato, this.y * lato, (this.x + 1) * lato, (this.y + 1) * lato);
        }
        if (this.muri[2]) {
            line(this.x * lato, (this.y + 1) * lato, (this.x + 1) * lato, (this.y + 1) * lato);
        }
        if (this.muri[3]) {
            line(this.x * lato, this.y * lato, this.x * lato, (this.y + 1) * lato);
        }
    }

    setG(val) {
        this.g_cost = val;
    }
    setH(val) {
        this.h_cost = val;
    }
    setF(val) {
        this.f_cost = val;
    }

    getG() {
        return this.g_cost;
    }
    getH() {
        return this.h_cost;
    }
    getF() {
        return this.f_cost;
    }

    getMuri() {
        return this.muri;
    }

    getMuro(index) {
        return this.muri[index];
    }

    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setParent(cel) {
        this.parent = cel;
    }
    getParent() {
        return this.parent;
    }

}

function setup() {
    const urlParams = new URLSearchParams(window.location.search);

    larghezza = urlParams.get('larghezza')||10;
    altezza = urlParams.get('altezza')||10;
    lato = urlParams.get('lato')||50;
    createCanvas(larghezza * lato, altezza * lato).parent('canvas');

    started = false;
    solvi = false;

    generaLabirinto();

    started = true;
    background(0);
}

function generaLabirinto() {
    /*creazione labirinto*/
    /*creazione celle*/
    griglia = [];
    for (i = 0; i < altezza; i++) {
        griglia.push([]);
        for (j = 0; j < larghezza; j++) {
            griglia[i].push(new cella(j, i));
        }
    }
    /*impostazione vicini*/
    for (i = 0; i < altezza; i++) {
        for (j = 0; j < larghezza; j++) {
            if (i > 0) {
                griglia[i][j].setVicino(0, griglia[i - 1][j]);
            }
            if (j < larghezza - 1) {
                griglia[i][j].setVicino(1, griglia[i][j + 1]);
            }
            if (i < altezza - 1) {
                griglia[i][j].setVicino(2, griglia[i + 1][j]);
            }
            if (j > 0) {
                griglia[i][j].setVicino(3, griglia[i][j - 1]);
            }
        }
    }

    griglia[parseInt(altezza / 2)][parseInt(larghezza / 2)].setVisitato(true);
    //stack = [griglia[0][0]];
    stack = [griglia[parseInt(altezza / 2)][parseInt(larghezza / 2)]];
}

function draw() {
    //background(0);

    if (!started) {
        background(255);
    } else {
        if (stack.length > 0) {
            current = stack.pop();          //1
            viciniNonVisitati = [];
            for (i = 0; i < 4; i++) {
                vicino = current.getVicino(i);
                if (vicino != null) {
                    if (!vicino.getVisitato()) {
                        viciniNonVisitati.push(vicino);
                    }
                }
            }


            if (viciniNonVisitati.length > 0) {      //2 
                stack.push(current);                //1
                prossimo = viciniNonVisitati[Math.floor(Math.random() * viciniNonVisitati.length)]; //2
                current.collega(prossimo);          //3
                prossimo.setVisitato(true);         //4
                stack.push(prossimo);               //4
            }
            current.disegna();
            for (k = 0; k < 4; k++) {
                if (current.getVicino(k) != null && current.getVicino(k).getVisitato()) {
                    current.getVicino(k).disegna(true);
                }
            }
        } else if (!solvi && !finish) {
            background(0);
            for (i = 0; i < altezza; i++) {
                for (j = 0; j < larghezza; j++) {
                    griglia[i][j].disegna(false);
                }
            }
            solvi = true;
            startPoint = griglia[0][0];
            endPoint = griglia[altezza - 1][larghezza - 1];
            open = [startPoint];
            closed = [];
        }

        /*disegna muri*/
        /*for (i = 0; i<altezza; i++){
            for (j = 0; j<larghezza; j++){
                griglia[i][j].disegna(false);
            }
        }*/
    }
    if (solvi) {

        corrente = open[0];
        for (i = 1; i < open.length; i++) {
            if (open[i].getF() < corrente.getF()) {
                corrente = open[i];
            }
        }
        open.splice(open.indexOf(corrente), 1);
        closed.push(corrente);
        corrente.setColore([255, 220, 230]);
        corrente.disegnaCOLORE([255, 220, 230]);

        if (corrente == endPoint) {
            solvi = false;
            finish = true;
            console.log("finito");
        } else {
            for (i = 0; i < 4; i++) {
                var vicino = corrente.getVicino(i);
                if (vicino != null && !corrente.getMuro(i) && !closed.includes(vicino)) {
                    var newG = corrente.getG() + 1;
                    var newH = Math.abs(endPoint.getX() - vicino.getX()) + Math.abs(endPoint.getY() - vicino.getY());
                    //newH = Math.sqrt(Math.pow((endPoint.getX()-vicino.getX()), 2) + Math.pow((endPoint.getY()-vicino.getY()), 2));
                    var newF = newG + newH;

                    if (newF < vicino.getF() || !open.includes(vicino)) {
                        vicino.setF(newF);
                        vicino.setH(newH);
                        vicino.setG(newG);

                        vicino.setParent(corrente);
                        if (!open.includes(vicino)) {
                            open.push(vicino);
                            vicino.setColore([111, 255, 255]);
                            vicino.disegnaCOLORE([111, 255, 255]);
                        }
                    }
                }
            }
        }


        /*while (previous!=null){
            previous.disegna();
            previous = previous.getParent();
        }
        var cCopia = corrente;
        while (cCopia!=null){
            cCopia.disegnaCOLORE([255,0,187]);
            cCopia = cCopia.getParent();
        }
        previous = corrente;*/



    }
    if (finish) {
        background(0);
        for (i = 0; i < altezza; i++) {
            for (j = 0; j < larghezza; j++) {
                griglia[i][j].disegna(false);
            }
        }
        var corrente = endPoint;
        while (corrente != null) {
            //corrente.disegnaCOLORE([190,190,190]);
            stroke(190, 190, 190);
            strokeWeight(lato * 0.40);
            line(corrente.x * lato + (lato / 2), corrente.y * lato + (lato / 2), corrente.getParent().x * lato + (lato / 2), corrente.getParent().y * lato + (lato / 2));

            corrente = corrente.getParent();
        }
    }
}
