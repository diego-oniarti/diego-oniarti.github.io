let muri;
let fuoco;
var slider;

function setup(){
    createCanvas(500,400).parent('canvas');
    createElement("br");
    slider = document.getElementById('speed');
    muri = [];
    fuoco = new Agente(width/2, height/2);
    for (let i = 0; i<6; i++){
        muri.push(new Muro(0,0,0,0,true));
    }
    /*4 muri laterali*/
    muri.push(new Muro(0,0,width,0, false));
    muri.push(new Muro(0,0,0,height, false));
    muri.push(new Muro(0,height,width,height, false));
    muri.push(new Muro(width,0,width,height, false));
}

function draw(){
    background(0);
    for (muro of muri){
        muro.disegna();
        muro.update();
    }
    fuoco.disegna(muri);
    fuoco.sposta(mouseX, mouseY);
}
