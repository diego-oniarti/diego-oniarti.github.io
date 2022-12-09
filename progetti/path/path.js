let griglia;
let altezza, larghezza, lato;

let immissione, preparazione, running, finish;  //i 4 stati in cui può essere il programma
let muri, verde, rosso;             //indicatore di cosa stai piazzando

let bottoneMuri, bottoneVerde,  bottoneRosso, bottoneStart; //bottoni

let previous;   //l'ultimacella analizzata in fase di ricerca
let metti;      //indica se si stanno mettendo muri o cancellando muri

let startPoint, endPoint;   //oggetti che indicano la cella d'inizio e  fine
let open, closed;           //liste usate per l'algoritmo di ricerca

let altezzaBox, larghezzaBox, latoBox, okButton;
let HEXBox, inHEXBox, inHEXButton;

class Cella{
    constructor(x, y){
        /*coordinate*/
        this.x = x;
        this.y = y;
        /*vicini*/
        this.vicini = [null, null, null, null, null, null, null, null];
        
        this.setLibero();
        this.g_cost=0.0;  //distanza da start
        this.h_cost=0.0;  //distanza da destinazione
        this.f_cost=0.0;  //totale
        this.parent = null;
    }
    
    setParent(val){
        this.parent = val;
    }
    getParent(){
        return this.parent;
    }
    
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    
    setColore(colore){
        this.colore = colore;
    }
    
    setG(val){
        this.g_cost = val;
    }
    setH(val){
        this.h_cost = val;
    }
    setF(val){
        this.f_cost = val;
    }
    
    getG(){
        return this.g_cost;
    }
    getH(){
        return this.h_cost;
    }
    getF(){
        return this.f_cost;
    }
    
    setVicino(indice, vicino){
        this.vicini[indice] = vicino;
    }   
    getVicino(index){
        return this.vicini[index];
    }
    getVicini(){
        return this.vicini;
    }
    
    setMuro(){
        this.muro = true;
        this.verde = false;
        this.rosso = false;
        this.libero = false;
        this.colore = [0,0,0];
    }
    setVerde(){
        startPoint.setLibero(); //rende il precedente punto d'inizio una cella libera
        startPoint = this;
        this.muro = false;
        this.verde = true;
        this.rosso = false;
        this.libero = false;
        this.colore = [0,255,0];
    }
    setRosso(){
        endPoint.setLibero();   //rende il precedente punto d'arrivo una cella libera
        endPoint = this;
        this.muro = false;
        this.verde = false;
        this.rosso = true;
        this.libero = false;
        this.colore = [255,0,0];
    }
    setLibero(){
        this.muro = false;
        this.verde = false;
        this.rosso = false;
        this.libero = true;
        this.colore = [245,245,245];
    }
    
    getMuro(){
        return this.muro;
    }
    getVerde(){
        return this.verde;
    }
    getRosso(){
        return this.rosso;
    }
    getLibero(){
        return this.libero;
    }
    
    disegna(){
        fill(this.colore[0], this.colore[1], this.colore[2]);
        //stroke(0);
        noStroke();
        rect(this.x*lato, this.y*lato, lato, lato);
    }
    disegnaCOLORE(colore){
        fill(colore[0], colore[1], colore[2]);
        //stroke(0);
        noStroke();
        rect(this.x*lato, this.y*lato, lato, lato);
    }
}


function setup(){
    immissione = true;
    muri = false;
    verde = false;
    rosso = false;
    
    //createElement("br");
    createP("ALTEZZA").id("altezza");
    altezzaBox = createInput("40");
    altezzaBox.parent("altezza");
    altezzaBox.style("margin-left", 20+"px");
    
    //createElement("br");
    createP("LARGHEZZA").id("larghezza");
    larghezzaBox = createInput("60");
    larghezzaBox.parent("larghezza");
    larghezzaBox.style("margin-left", 20+"px");
    
    //createElement("br");
    createP("LATO").id("lato");
    latoBox = createInput("12");
    latoBox.parent("lato");
    latoBox.style("margin-left", 20+"px");
    
    //createElement("br");
    okButton = createButton("OK");
    okButton.mousePressed(conferma);
    
    createP("HEX SEED").id("inBox");
    inHEXBox = createInput("");
    inHEXBox.parent("inBox");
    inHEXBox.style("margin-left", 20+"px");
    createElement("br").parent("inBox");
    inHEXButton = createButton("IMPORT");
    inHEXButton.parent("inBox");
    inHEXButton.mousePressed(startByHEX);
    
    createCanvas(10,10);
}

function inizializazione(){
    select("#altezza").remove();
    select("#larghezza").remove();
    select("#lato").remove();
    okButton.remove();
    select("#inBox").remove();
    
    createCanvas(larghezza*lato, altezza*lato);
    
    /*situazione iniziale*/
    immissione = false;
    preparazione = true;
    running = false;
    finish = false;
    
    muri = true;
    verde = false;
    rosso = false;
    

    /*creazione griglia*/
    griglia = [];   
    for (i = 0; i<altezza; i++){
        griglia.push([]);
        for (j = 0; j<larghezza; j++){
            griglia[i].push(new Cella(j, i));
            griglia[i][j].disegna();
        }
    }
    /*impostazione vicini*/
    for (i = 0; i<altezza; i++){
        for (j = 0; j<larghezza; j++){
            if (i>0){
                if (j>0){
                    griglia[i][j].setVicino(0, griglia[i-1][j-1]);
                }

                griglia[i][j].setVicino(1, griglia[i-1][j]);
                
                if (j<larghezza-1){
                    griglia[i][j].setVicino(2, griglia[i-1][j+1]);
                }
            }
            if (j<larghezza-1){
                griglia[i][j].setVicino(3, griglia[i][j+1]);
            }
            if (i<altezza-1){            
                if (j<larghezza-1){
                    griglia[i][j].setVicino(4, griglia[i+1][j+1]);
                }

                griglia[i][j].setVicino(5, griglia[i+1][j]);
                
                if (j>0){
                    griglia[i][j].setVicino(6, griglia[i+1][j-1]);
                }
            }
            if (j>0){
                griglia[i][j].setVicino(7, griglia[i][j-1]);
            }
        }
    }
    
    
    /*creazione bottoni*/
    createP();
    bottoneMuri = createButton("MURI");
    bottoneVerde = createButton("PARTENZA");
    bottoneRosso = createButton("DESTINAZIONE");
    createP();
    bottoneStart = createButton("START");
    
    /*impostazione funzionalità bottoni*/
    bottoneMuri.mousePressed(function(){
        muri = true;
        verde = false;
        rosso = false;
    });
    bottoneVerde.mousePressed(function(){
        muri = false;
        verde = true;
        rosso = false;
    });
    bottoneRosso.mousePressed(function(){
        muri = false;
        verde = false;
        rosso = true;
    });
    bottoneStart.mousePressed(inizio);
    
    HEXBox = createInput();
}

function startByHEX(){
    var H = inHEXBox.value();
    altezza = hexToDec2(H.charAt(0), H.charAt(1));
    larghezza = hexToDec2(H.charAt(2), H.charAt(3));
    lato = hexToDec2(H.charAt(4), H.charAt(5));
    
    inizializazione();
    
    var YVerde = hexToDec2(H.charAt(6), H.charAt(7));
    var XVerde = hexToDec2(H.charAt(8), H.charAt(9));
    var YRosso = hexToDec2(H.charAt(10), H.charAt(11));
    var XRosso = hexToDec2(H.charAt(12), H.charAt(13));
    
    for(m = 14; m<H.length; m++){
        var bits = hexToBin(H.charAt(m));
        var riga, colonna;
        for (j=0; j<bits.length; j++){
            riga = Math.floor((((m-14)*4)+j)/larghezza);
            colonna = (((m-14)*4)+j)%larghezza;
            if (riga < altezza){
                if (bits[j] == "0"){
                    griglia[riga][colonna].setLibero()
                }else{
                    griglia[riga][colonna].setMuro()
                }
                griglia[riga][colonna].disegna();
            }
        }
    }
    
    startPoint = griglia[YVerde][XVerde];
    endPoint = griglia[YRosso][XRosso];
    startPoint.setVerde();
    endPoint.setRosso();
    startPoint.disegna();
    endPoint.disegna();
    
    //inizio();
}

function conferma(){
    altezza = parseInt(altezzaBox.value());
    larghezza = parseInt(larghezzaBox.value());
    lato = parseInt(latoBox.value());

    inizializazione();
    
    startPoint = griglia[0][0];
    endPoint = griglia[altezza-1][larghezza-1];
    startPoint.setVerde();
    endPoint.setRosso();
    startPoint.disegna();
    endPoint.disegna();
}

function inizio(){
    preparazione = false;
    bottoneMuri.remove();
    bottoneVerde.remove();
    bottoneRosso.remove();
    bottoneStart.remove();
    muri = false;
    verde = false;
    rosso = false;
    
    open = [];
    closed = [];
    open.push(startPoint);
    
    running = true;
}

function getCella(){
    var x = Math.floor(mouseX/lato);
    var y = Math.floor(mouseY/lato);
    
    x = constrain(x, 0, larghezza-1);
    y = constrain(y, 0, altezza-1);
    
    var cella = griglia[y][x];
    return cella;
}

function mousePressed(){
    if (preparazione && mouseX < larghezza*lato && mouseX > 0 && mouseY < altezza*lato && mouseY > 0){
        var cella = getCella();
        if (muri){
            /*se si inizia a premere su una cella libera, si mettono muri, altrimenti si tolgono*/
            metti = cella.getLibero();
            if (metti && cella.getLibero()){
                cella.setMuro();
            }
            if (!metti && cella.getMuro()){
                cella.setLibero();
            }
        }
        else if (verde){
            var tmp = startPoint;
            cella.setVerde();
            tmp.disegna();
        }
        else if (rosso){
            var tmp = endPoint;
            cella.setRosso();
            tmp.disegna();
        }
        cella.disegna();
    }
}

function mouseDragged(){
    if (muri && mouseX < larghezza*lato && mouseX > 0 && mouseY < altezza*lato && mouseY > 0){
        cella = getCella();
        
        if (metti && cella.getLibero()){
            cella.setMuro();
        }
        if (!metti && cella.getMuro()){
            cella.setLibero();
        }
        
        cella.disegna();
    }
}

function traversabile(cel, vic){
    ret = true
    if (vic == null || vic.getMuro()){
        ret = false;
    }else{
        var ind = cel.getVicini().indexOf(vic);
        if (ind%2 == 0){
            switch(ind){
                case 0:
                    if (cel.getVicino(1).getMuro() || cel.getVicino(7).getMuro()){
                        ret = false;
                    }
                    break;
                case 2:
                    if (cel.getVicino(1).getMuro() || cel.getVicino(3).getMuro()){
                        ret = false;
                    }
                    break;
                case 4:
                    if (cel.getVicino(3).getMuro() || cel.getVicino(5).getMuro()){
                        ret = false;
                    }
                    break;
                case 6:
                    if (cel.getVicino(5).getMuro() || cel.getVicino(7).getMuro()){
                        ret = false;
                    }
                    break;
            }
        }
    }
    return ret;
}

function draw(){
    if (immissione){
        background(255);
    }
    if (preparazione){
        /*for (i = 0; i<altezza; i++){
            for (j = 0; j<larghezza; j++){
                griglia[i][j].disegna();
            }
        }*/
        HEXBox.value(generaStringaHEX());
    }
    if (running){
        var corrente = open[0];
        for (i = 1; i<open.length; i++){
            if (open[i].getF() < corrente.getF()){
                corrente = open[i];
            }
        }
        open.splice(open.indexOf(corrente), 1);
        closed.push(corrente);
        corrente.setColore([255,220,230]);
        corrente.disegnaCOLORE([255,220,230]);
        
        if (corrente == endPoint){
            running = false;
            finish = true;
            console.log("finito");
        }else{
            for(i = 0; i<8; i++){
                var vicino = corrente.getVicino(i);
                if (traversabile(corrente, vicino) && !closed.includes(vicino)){
                    //var newG = corrente.getG()+1;
                    var newG;
                    if (i%2==0){
                        newG = corrente.getG()+(Math.sqrt(2)*10);                        
                    }else{
                        newG = corrente.getG()+(1*10);
                    }                    
                    //var newH = Math.abs(endPoint.getX()-vicino.getX()) +    Math.abs(endPoint.getY()-vicino.getY());
                    var newH = Math.sqrt(Math.pow((endPoint.getX()-vicino.getX())+1, 2) + Math.pow((endPoint.getY()-vicino.getY())+1, 2))*10;
                    var newF = newG+newH;
                    
                    if (newF < vicino.getF() || !open.includes(vicino)){
                        vicino.setF(newF);
                        vicino.setH(newH);
                        vicino.setG(newG);
                        
                        vicino.setParent(corrente);
                        if  (!open.includes(vicino)){
                            open.push(vicino);
                            vicino.setColore([111,255,255]);
                            vicino.disegnaCOLORE([111,255,255]);
                        }
                    }
                }
            }
        }
        
        
        while (previous!=null){
            previous.disegna();
            previous = previous.getParent();
        }
        var cCopia = corrente;
        while (cCopia!=null){
            //cCopia.disegnaCOLORE([255,0,187]);
            cCopia.disegnaCOLORE([255,150,180]);
            cCopia = cCopia.getParent();
        }
        previous = corrente;
        startPoint.disegnaCOLORE([0,255,0]);
        endPoint.disegna([255,0,0]);
        
    }
    if (finish){
        var corrente = endPoint;
        var padre;
        startPoint.disegnaCOLORE([0,255,0]);
        endPoint.disegnaCOLORE([255,0,0]);
        while (corrente.getParent()!=null){
            //corrente.disegnaCOLORE([255,0,187]);
            padre = corrente.getParent();
            stroke(0,0,255);
            strokeWeight(3);
            line(corrente.getX()*lato+(lato/2), corrente.getY()*lato+(lato/2), padre.getX()*lato+(lato/2), padre.getY()*lato+(lato/2));
            corrente = corrente.getParent();
        }
    }
    
}

/*metodi conversione da stringa a array di byte*/
/* "io" --> ["01101001", "01101111"] */
function stringToBit(s) {
    var b = new Array();
    var last = s.length;

    for (var i = 0; i < last; i++) {
        var d = s.charCodeAt(i);
        if (d < 128)
            b[i] = decToBin(d);
        else {
            var c = s.charAt(i);
            alert(c + ' is NOT an ASCII character');
            b[i] = -1;
        }
    }
    return b;
}
function decToBin(d) {
    var b = '';

    for (var i = 0; i < 8; i++) {
        b = (d%2) + b;
        d = Math.floor(d/2);
    }

    return b;
}      /*converte un intero in binario (8 caratteri)*/
function binToDec(b){
    var ret = 0;
    for(i = 0; i<8; i++){
        ret += parseInt(b.charAt(i))*Math.pow(2,8-1-i);
    }
    return  ret;
}       /*converte una stringa rappresentante un binario (di 8 caratteri) in un'intero decimale*/
function binToHex(b){
    var num = 0;
    for(i = 0; i<4; i++){
        num += parseInt(b.charAt(i))*Math.pow(2,4-1-i);
    }
    var numeri = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    return numeri[num];
}       /*converte una stringa rappresentante un binario (di 4 caratteri) in un esdecimale*/
function hexToDec(h){
    return ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"].indexOf(h);
}
function decToBin4(d) {
    var b = '';

    for (var i = 0; i < 4; i++) {
        b = (d%2) + b;
        d = Math.floor(d/2);
    }

    return b;
}
function hexToDec2(d1, d2){
    return binToDec(""+decToBin4(hexToDec(d1))+decToBin4(hexToDec(d2)));
}
function hexToBin(h){
    return  decToBin4(hexToDec(h));
}

/*
1 byte: altezza
1 byte: larghezza
1 byte: lato
1 byte: Y verde
1 byte: X verde
1 byte: Y rosso
1 byte: X rosso
N byte: caselle
verde e rosso sono segnati come celle libere (0)
*/
function generaStringaBit(){
    var ret = "";
    ret += decToBin(altezza);
    ret += decToBin(larghezza);
    ret += decToBin(lato);
    ret += decToBin(startPoint.getY());
    ret += decToBin(startPoint.getX());
    ret += decToBin(endPoint.getY());
    ret += decToBin(endPoint.getX());
    for (i = 0; i<altezza; i++){
        for (j = 0; j<larghezza; j++){
            cella = griglia[i][j];
            if (cella == startPoint || cella == endPoint || cella.getLibero()){
                ret += "0";
            }else{
                ret += "1";
            }
        }
    }
    var dif = (Math.floor(ret.length/8)+1)*8-ret.length;
    for (i = 0; i<dif; i++){
        ret+="0";
    }
    return ret;
}

function generaStringa(){
    var bits = generaStringaBit();
    ret = "";
    for (k = 0; k<(bits.length/8); k++){
        var tmp = "";
        for (j = 0; j<8; j++){
            tmp += bits.charAt((k*8)+j);
        }
        ret += String.fromCharCode(binToDec(tmp));
    }
    return ret;
}
function generaStringaHEX(){
    var bits = generaStringaBit();
    ret = "";
    for (k = 0; k<(bits.length/4); k++){
        var tmp = "";
        for (j = 0; j<4; j++){
            tmp += bits.charAt((k*4)+j);
        }
        ret += binToHex(tmp).toString();
    }
    return ret;
}