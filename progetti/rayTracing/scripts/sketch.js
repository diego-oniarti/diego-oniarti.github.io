let muri;
let fuoco;
var slider, slider2;
var larghezza, altezza, diagonale;

function setup(){
    larghezza = 400;
    altezza = 400;
    diagonale = Math.sqrt(altezza*altezza+larghezza*larghezza);
    createCanvas(larghezza*2,altezza);
    createElement("br");
    slider = createSlider(0, 360, 60);
    slider.input(setFOV);
    createElement("br");
    slider2 = createSlider(0,10, 1, 0.5);
    muri = [];
    fuoco = new Agente(larghezza/2, height/2,0,60);
    for (let i = 0; i<6; i++){
        muri.push(new Muro(0,0,0,0,true, random(360)));
    }
    /*4 muri laterali*/
    muri.push(new Muro(0,0,larghezza,0, false));
    muri.push(new Muro(0,0,0,height, false));
    muri.push(new Muro(0,height,larghezza,height, false));
    muri.push(new Muro(larghezza,0,larghezza,height, false));
}

function setFOV(){
    fuoco.setFOV(slider.value());
}

function draw(){
    background(10);
    for (muro of muri){
        muro.disegna();
        muro.update();
    }
    fuoco.disegna(muri);
    
    if (keyIsDown(UP_ARROW)) {
        fuoco.sposta(1);
    }
    if (keyIsDown(DOWN_ARROW)) {
        fuoco.sposta(-1);
    }
    if (keyIsDown(LEFT_ARROW)) {
        fuoco.ruota(-5);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        fuoco.ruota(5);
    }
    
    stroke(255);
    strokeWeight(5);
    line(larghezza,0,larghezza,altezza);
    
    let frame = fuoco.getFrame(muri);
    rectMode(CENTER);
    push();
    let spessore = larghezza/frame.length;
    translate(larghezza+spessore,0);
    for (let i = 0; i<frame.length; i++){
        let barra = frame[i][0];
        let d = dist(fuoco.pos.x, fuoco.pos.y, barra.x, barra.y);
        let punto = createVector(barra.x-fuoco.pos.x, barra.y-fuoco.pos.y);
        let angolo = punto.heading();
        angolo-=fuoco.direzione.heading();
        let dDiretta = cos(angolo)*d;
        
        let intensita = map(dDiretta, 0, diagonale, 100, 0);
        colorMode(HSB);
        fill(frame[i][1].HUE,frame[i][1].saturation,intensita);
        //fill(random(255), random(255), random(255));
        noStroke();
        
        //let alt = map(dDiretta, 0, diagonale, altezza, 0);
        
        dDiretta/=20;
        
        let alt = (1/dDiretta)*altezza;
        
        rect(i*spessore,altezza/2, spessore+1, alt);
        colorMode(RGB);
    }
    pop();

}
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
});
